import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import openai, { GROK_MODEL } from '@/lib/openai';
import clientPromise from '@/lib/mongodb';
import { refinePrompt, detectContentType } from '@/lib/prompt-engineering';
import { ContentGenerationRequest, GeneratedContent } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Ensure we validate session using the same auth options
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ContentGenerationRequest = await request.json();
    const { prompt, type, tone, length, keywords } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Detect content type if not provided
    const contentType = type || detectContentType(prompt);
    
    // Refine the prompt using our engineering logic
    const refinedPrompt = refinePrompt(prompt, { 
      type: contentType, 
      tone, 
      length, 
      keywords 
    });

    // Generate content using Grok (xAI) via OpenAI-compatible client
    const completion = await openai.chat.completions.create({
      model: GROK_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer and social media expert. Generate high-quality, engaging content based on the user\'s requirements.'
        },
        {
          role: 'user',
          content: refinedPrompt
        }
      ],
      max_tokens: contentType === 'tweet' ? 500 : 2000,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content || '';

    if (!generatedText) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }

    // Calculate metadata
    const wordCount = generatedText.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200);

    // Save to database
    const client = await clientPromise;
    const db = client.db('contentgen');
    
    const contentData: Omit<GeneratedContent, 'id'> = {
      userId: session.user.email,
      originalPrompt: prompt,
      refinedPrompt,
      generatedText,
      contentType,
      tone: tone || 'professional',
      createdAt: new Date(),
      metadata: {
        wordCount,
        readingTime,
        keywords
      }
    };

    const result = await db.collection('generated_content').insertOne(contentData);

    return NextResponse.json({
      id: result.insertedId.toString(),
      generatedText,
      contentType,
      metadata: {
        wordCount,
        readingTime,
        keywords
      }
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}