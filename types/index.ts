export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedContent {
  id: string;
  userId: string;
  originalPrompt: string;
  refinedPrompt: string;
  generatedText: string;
  contentType: 'blog' | 'social' | 'caption' | 'tweet';
  tone: string;
  createdAt: Date;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    keywords?: string[];
  };
}

export interface ContentGenerationRequest {
  prompt: string;
  type: 'blog' | 'social' | 'caption' | 'tweet';
  tone?: 'professional' | 'casual' | 'funny' | 'inspirational';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
}