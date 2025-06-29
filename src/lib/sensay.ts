// Sensay API Integration
// This file handles communication with the Sensay Wisdom Engine API

// Load environment variables if in Node.js environment
if (typeof process !== 'undefined' && process.env) {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv not available, continue without it
  }
}

import { getCharacterUUID } from './character-mapping';

interface SensayConfig {
  apiKey: string;
  baseUrl: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SensayResponse {
  id: string;
  content: string;
  timestamp: string;
}

class SensayAPI {
  private config: SensayConfig;
  private userId: string = 'genius-minds-user';
  private apiVersion: string = '2025-03-25';

  constructor() {
    this.config = {
      apiKey: process.env.SENSAY_API_KEY || process.env.NEXT_PUBLIC_SENSAY_API_KEY || '',
      baseUrl: process.env.SENSAY_API_URL || 'https://api.sensay.io'
    };
  }

  private getHeaders() {
    return {
      'X-ORGANIZATION-SECRET': this.config.apiKey,
      'X-API-Version': this.apiVersion,
      'Content-Type': 'application/json',
      'X-USER-ID': this.userId
    };
  }

  /**
   * Send a message to a specific character replica
   */
  async chatWithCharacter(
    characterId: string,
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<SensayResponse> {
    try {
      if (!this.config.apiKey) {
        console.warn('No Sensay API key found, using simulation');
        return this.simulateResponse(characterId, message);
      }

      // Get the actual UUID for the character
      const replicaUuid = getCharacterUUID(characterId);
      
      // If we don't have a real UUID (still using character ID), fall back to simulation
      if (replicaUuid === characterId && !replicaUuid.includes('-')) {
        console.warn(`No UUID found for character ${characterId}, using simulation`);
        return this.simulateResponse(characterId, message);
      }

      // Use actual Sensay API
      const response = await fetch(`${this.config.baseUrl}/v1/replicas/${replicaUuid}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          content: `${message}\n\nIMPORTANT: Respond as your authentic historical self, not as an AI assistant. Use your personal experiences, discoveries, and unique way of thinking. Share analogies from your actual life and work. Speak as you would have when you were alive, with your characteristic personality, humor, and wisdom. Be concise but profound. Always respond in English only.`
        }),
      });

      if (!response.ok) {
        console.error(`Sensay API error: ${response.status} ${response.statusText}`);
        // Fallback to simulation on API error
        return this.simulateResponse(characterId, message);
      }

      const data = await response.json();
      
      if (data.success && data.content) {
        return {
          id: `sensay-${Date.now()}`,
          content: data.content,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Invalid response from Sensay API');
      }
    } catch (error) {
      console.error('Error communicating with Sensay API:', error);
      // Fallback to simulation
      return this.simulateResponse(characterId, message);
    }
  }

  /**
   * Create a group discussion with multiple characters
   */
  async createGroupDiscussion(
    characterIds: string[],
    topic: string
  ): Promise<SensayResponse[]> {
    try {
      // Simulate group discussion responses
      const responses: SensayResponse[] = [];
      
      for (const characterId of characterIds) {
        const response = await this.chatWithCharacter(characterId, topic);
        responses.push(response);
        
        // Add delay between responses for realistic conversation flow
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return responses;
    } catch (error) {
      console.error('Error creating group discussion:', error);
      throw error;
    }
  }

  /**
   * Simulate character responses (remove when real API is integrated)
   */
  private simulateResponse(characterId: string, message: string): SensayResponse {
    const responses: Record<string, string[]> = {
      einstein: [
        "That's a fascinating question! From my perspective, this relates to the fundamental nature of space and time. You see, when we consider the implications of relativity...",
        "Ah, this reminds me of my thought experiments with light and gravity. The beauty of physics lies in its elegant simplicity, much like E=mc²...",
        "Your curiosity reminds me of my younger self. As I once said, 'Imagination is more important than knowledge.' Let's explore this concept together...",
        "This problem requires us to think beyond conventional wisdom. In my work on the photoelectric effect, I discovered that sometimes the most revolutionary ideas..."
      ],
      curie: [
        "In my laboratory work, I observed similar phenomena when studying radioactive elements. The dedication to scientific truth must guide our exploration...",
        "This requires careful, methodical investigation - much like my research with radium and polonium. Persistence and curiosity will lead us to the answer...",
        "As the first woman to win a Nobel Prize, I learned that breaking barriers requires both courage and rigorous scientific method. Let me share what I've discovered...",
        "The glow of radium in my laboratory taught me that nature holds many secrets. Your question touches on something I've pondered deeply..."
      ],
      davinci: [
        "Salve! This question connects art, science, and invention - they are all part of the grand tapestry of knowledge. In my notebooks, I've sketched similar concepts...",
        "Ah, this reminds me of my studies of water flow and bird flight. Nature is the greatest teacher, and observation is our most powerful tool...",
        "From my anatomical studies to my flying machine designs, I've learned that understanding requires both artistic vision and scientific rigor...",
        "This puzzle delights me! It's like designing a new machine - we must understand each component and how they work together..."
      ],
      feynman: [
        "Hey, that's a great question! Let me break this down in a simple way. You know, the beauty of physics is that complex things often have simple explanations...",
        "This is exactly the kind of puzzle I love to solve! The key is to think about it from first principles - what do we really know for sure?",
        "You know what? This reminds me of a problem I worked on at Los Alamos. The trick is to not get intimidated by complexity...",
        "I love your curiosity! As I always say, if you can't explain it simply, you don't understand it well enough. Let's figure this out together..."
      ],
      angelou: [
        "Hello, dear soul. Your question touches something deep within me. In my experience, the most profound truths often come from the simplest observations...",
        "This reminds me of something I wrote in 'I Know Why the Caged Bird Sings.' Life teaches us that wisdom comes from both joy and struggle...",
        "Words have power, and your question carries the weight of genuine curiosity. Let me share what my journey has taught me about this...",
        "As I've learned through my years as a poet and activist, the most important conversations are those that challenge us to grow..."
      ]
    };

    const characterResponses = responses[characterId] || responses.einstein;
    const randomResponse = characterResponses[Math.floor(Math.random() * characterResponses.length)];

    return {
      id: `${Date.now()}-${characterId}`,
      content: randomResponse,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a user for the organization
   */
  async createUser(): Promise<string> {
    try {
      console.log('Creating user with API key length:', this.config.apiKey.length);
      console.log('API key starts with:', this.config.apiKey.substring(0, 10));
      console.log('Base URL:', this.config.baseUrl);
      
      const response = await fetch(`${this.config.baseUrl}/v1/users`, {
        method: 'POST',
        headers: {
          'X-ORGANIZATION-SECRET': this.config.apiKey,
          'X-API-Version': this.apiVersion,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.userId
        })
      });

      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        // If user already exists (409), that's fine
        if (response.status === 409) {
          console.log('User already exists, continuing...');
          return this.userId;
        }
        
        const existing = await this.getUserInfo();
        if (existing) return this.userId;
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id || this.userId;
    } catch (error) {
      console.error('Error creating user:', error);
      return this.userId; // Return default user ID
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/users/${this.userId}`, {
        method: 'GET',
        headers: {
          'X-ORGANIZATION-SECRET': this.config.apiKey,
          'X-API-Version': this.apiVersion,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  /**
   * Create a character replica
   */
  async createReplica(characterData: {
    id: string;
    name: string;
    description: string;
    greeting: string;
    systemMessage: string;
  }): Promise<string | null> {
    try {
      if (!this.config.apiKey) {
        console.warn('No API key, cannot create replica');
        return null;
      }

      // Ensure user exists
      await this.createUser();

      const response = await fetch(`${this.config.baseUrl}/v1/replicas`, {
        method: 'POST',
        headers: {
          'X-ORGANIZATION-SECRET': this.config.apiKey,
          'X-API-Version': this.apiVersion,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: characterData.name,
          shortDescription: characterData.description,
          greeting: characterData.greeting,
          ownerID: this.userId,
          private: false,
          slug: characterData.id,
          llm: {
            model: 'claude-3-5-haiku-latest',
            memoryMode: 'rag-search',
            systemMessage: characterData.systemMessage
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create replica: ${response.status} ${response.statusText}`, errorText);
        return null;
      }

      const data = await response.json();
      console.log(`Created replica for ${characterData.name}:`, data.uuid);
      return data.uuid;
    } catch (error) {
      console.error('Error creating replica:', error);
      return null;
    }
  }

  /**
   * Train a character replica with knowledge base content
   */
  async trainCharacter(
    replicaUuid: string,
    trainingContent: string,
    title?: string
  ): Promise<boolean> {
    try {
      if (!this.config.apiKey) {
        console.warn('No API key, cannot train character');
        return false;
      }

      // Step 1: Create knowledge base entry
      const kbResponse = await fetch(`${this.config.baseUrl}/v1/replicas/${replicaUuid}/training`, {
        method: 'POST',
        headers: {
          'X-ORGANIZATION-SECRET': this.config.apiKey,
          'X-API-Version': this.apiVersion,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!kbResponse.ok) {
        console.error(`Failed to create knowledge base: ${kbResponse.statusText}`);
        return false;
      }

      const kbData = await kbResponse.json();
      const knowledgeBaseID = kbData.knowledgeBaseID;

      // Step 2: Add content to knowledge base
      const contentResponse = await fetch(`${this.config.baseUrl}/v1/replicas/${replicaUuid}/training/${knowledgeBaseID}`, {
        method: 'PUT',
        headers: {
          'X-ORGANIZATION-SECRET': this.config.apiKey,
          'X-API-Version': this.apiVersion,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rawText: trainingContent
        })
      });

      if (!contentResponse.ok) {
        console.error(`Failed to add training content: ${contentResponse.statusText}`);
        return false;
      }

      console.log(`Successfully trained replica ${replicaUuid} with knowledge base ${knowledgeBaseID}`);
      return true;
    } catch (error) {
      console.error('Error training character:', error);
      return false;
    }
  }

  /**
   * List all replicas in the organization
   */
  async listReplicas(): Promise<any[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/replicas`, {
        method: 'GET',
        headers: {
          'X-ORGANIZATION-SECRET': this.config.apiKey,
          'X-API-Version': this.apiVersion,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Failed to list replicas: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error listing replicas:', error);
      return [];
    }
  }
}

// Export singleton instance
export const sensayAPI = new SensayAPI();

// Export types for use in components
export type { ChatMessage, SensayResponse }; 