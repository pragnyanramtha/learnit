class CerebrasAPI {
  async generateNotes(conversationText: string, categories?: string[]): Promise<string> {
    try {
      console.log('Calling Cerebras API via Next.js route...');
      
      const response = await fetch('/api/cerebras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationText,
          categories
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error calling Cerebras API:', error);
      throw new Error(`Failed to generate notes with Cerebras API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const cerebrasAPI = new CerebrasAPI(); 