interface PromptConfig {
  type: 'blog' | 'social' | 'caption' | 'tweet';
  tone?: 'professional' | 'casual' | 'funny' | 'inspirational';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
}

export function refinePrompt(userInput: string, config: PromptConfig = { type: 'blog' }): string {
  const basePrompts = {
    blog: `Generate a comprehensive, SEO-optimized blog article about "${userInput}". 
           Structure it with:
           - An engaging title and introduction
           - 3-5 main sections with actionable insights
           - A compelling conclusion with call-to-action
           - Target length: 800-1200 words
           - Include relevant keywords naturally
           - Write in a ${config.tone || 'professional'} tone`,
    
    social: `Create an engaging social media post about "${userInput}".
             Include:
             - A catchy hook in the first line
             - 2-3 key points or benefits
             - Relevant emojis
             - Call-to-action
             - Hashtags (3-5 relevant ones)
             - Keep it ${config.length || 'medium'} length
             - Tone: ${config.tone || 'casual'}`,
    
    caption: `Write an Instagram caption about "${userInput}".
              Include:
              - Attention-grabbing first line
              - Story or insight
              - Question for engagement
              - 5-10 relevant hashtags
              - Tone: ${config.tone || 'inspirational'}`,
    
    tweet: `Create a Twitter/X thread about "${userInput}".
            Format as numbered tweets:
            - Start with a hook tweet
            - Break down into 3-5 key points
            - Each tweet under 280 characters
            - Include relevant hashtags
            - Tone: ${config.tone || 'professional'}`
  };

  let refinedPrompt = basePrompts[config.type];

  if (config.keywords?.length) {
    refinedPrompt += `\n- Focus on these keywords: ${config.keywords.join(', ')}`;
  }

  return refinedPrompt;
}

export function detectContentType(input: string): PromptConfig['type'] {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('tweet') || lowerInput.includes('twitter') || lowerInput.includes('thread')) {
    return 'tweet';
  }
  if (lowerInput.includes('instagram') || lowerInput.includes('caption') || lowerInput.includes('post')) {
    return 'caption';
  }
  if (lowerInput.includes('social') || lowerInput.includes('facebook') || lowerInput.includes('linkedin')) {
    return 'social';
  }
  
  return 'blog'; // Default to blog
}