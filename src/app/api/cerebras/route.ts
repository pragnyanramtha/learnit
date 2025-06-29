import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { conversationText, categories } = await request.json();

    if (!conversationText) {
      return NextResponse.json(
        { error: 'Conversation text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      console.error('CEREBRAS_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Cerebras API key is not configured' },
        { status: 500 }
      );
    }

    // Use custom categories if provided, otherwise use default template
    const defaultCategories = [
      'Core Insights (Bullet Points)',
      'Key Questions Raised', 
      'Proposed Solutions or Ideas',
      'Actionable Recommendations',
      'Important Disagreements',
      'Referenced People/Concepts/Tools',
      'Noteworthy Quotes (Optional)',
      'Open Threads / Follow-ups'
    ];

    const categoriesToUse = categories && categories.length > 0 ? categories : defaultCategories;
    
    const categoryTemplate = categoriesToUse.map((category: string, index: number) => {
      const num = index + 1;
      
      // Add specific instructions for common category types
      let instructions = '';
      if (category.toLowerCase().includes('insight') || category.toLowerCase().includes('core')) {
        instructions = '• Summarize key arguments, takeaways, or novel ideas\n\t• Prioritize deep, original, or contrarian thoughts\n\t• Strip away filler, focus on what\'s intellectually valuable';
      } else if (category.toLowerCase().includes('question')) {
        instructions = '• List the high-quality questions asked (especially open-ended or challenging ones)\n\t• Include who asked, if applicable';
      } else if (category.toLowerCase().includes('solution') || category.toLowerCase().includes('idea')) {
        instructions = '• Extract solutions proposed to problems\n\t• Include approaches, frameworks, tools, or mental models discussed';
      } else if (category.toLowerCase().includes('recommendation') || category.toLowerCase().includes('action')) {
        instructions = '• Convert abstract ideas into steps or strategic directions\n\t• Identify what someone could do based on this conversation';
      } else if (category.toLowerCase().includes('disagreement') || category.toLowerCase().includes('debate')) {
        instructions = '• Identify areas of debate or dissent\n\t• Clearly state both/all sides with reasoning';
      } else if (category.toLowerCase().includes('reference') || category.toLowerCase().includes('people') || category.toLowerCase().includes('concept') || category.toLowerCase().includes('tool')) {
        instructions = '• Extract any referenced:\n\t• Thinkers (e.g., Taleb, Turing)\n\t• Frameworks (e.g., OODA loop, first principles)\n\t• Technologies/tools (e.g., LangChain, DALL·E, CUDA)\n\t• Papers or books';
      } else if (category.toLowerCase().includes('quote')) {
        instructions = '• Pick up 2–3 sentences that are extremely insightful, tweetable, or intellectually potent';
      } else if (category.toLowerCase().includes('thread') || category.toLowerCase().includes('follow')) {
        instructions = '• What wasn\'t resolved?\n\t• Which points require further research or decisions?';
      } else {
        instructions = '• Extract relevant information for this category based on the conversation';
      }
      
      return `${num}. ${category}\n\t${instructions}`;
    }).join('\n\n');

    const prompt = `Extract from this chat the key ideas, deep insights, debates, and questions raised. Summarize with minimal fluff, structured by insight category. Identify original thoughts, strong disagreements, useful frameworks/tools mentioned, and actionable takeaways. Return results in bullet format, using the provided template.

CONVERSATION:
${conversationText}

Please format your response using this template:

${categoryTemplate}`;

    console.log('Making request to Cerebras API...');
    console.log('API Key length:', apiKey.length);
    console.log('Using model: llama3.1-8b');

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'GeniusMinds/1.0',
      },
      body: JSON.stringify({
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API error response:', errorText);
      return NextResponse.json(
        { error: `Cerebras API error: ${response.status} ${response.statusText} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Success! Received response from Cerebras');
    
    return NextResponse.json({ 
      content: data.choices[0].message.content 
    });

  } catch (error) {
    console.error('Error in Cerebras API route:', error);
    return NextResponse.json(
      { error: `Failed to generate notes: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 