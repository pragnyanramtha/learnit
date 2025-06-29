// Local Storage Utility for Conversations
export interface Message {
  id: string;
  content: string;
  sender: 'user' | string;
  timestamp: Date;
  character?: {
    id: string;
    name: string;
    title: string;
    color: string;
    field: string;
    image: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  type: 'individual' | 'group';
  participants: string[];
  messages: Message[];
  lastActivity: Date;
  createdAt: Date;
  isActive?: boolean;
}

const STORAGE_KEY = 'genius_minds_conversations';

export class ConversationStorage {
  static getAll(): Conversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const conversations = JSON.parse(stored);
      // Convert date strings back to Date objects
      return conversations.map((conv: any) => ({
        ...conv,
        lastActivity: new Date(conv.lastActivity),
        createdAt: new Date(conv.createdAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  static save(conversations: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }

  static create(conversation: Omit<Conversation, 'id' | 'createdAt'>): Conversation {
    const newConversation: Conversation = {
      ...conversation,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const conversations = this.getAll();
    conversations.unshift(newConversation);
    this.save(conversations);
    
    return newConversation;
  }

  static update(id: string, updates: Partial<Conversation>): Conversation | null {
    const conversations = this.getAll();
    const index = conversations.findIndex(conv => conv.id === id);
    
    if (index === -1) return null;
    
    conversations[index] = { ...conversations[index], ...updates };
    this.save(conversations);
    
    return conversations[index];
  }

  static delete(id: string): boolean {
    const conversations = this.getAll();
    const filtered = conversations.filter(conv => conv.id !== id);
    
    if (filtered.length === conversations.length) return false;
    
    this.save(filtered);
    return true;
  }

  static addMessage(conversationId: string, message: Message): Conversation | null {
    const conversations = this.getAll();
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) return null;
    
    conversation.messages.push(message);
    conversation.lastActivity = new Date();
    
    this.save(conversations);
    return conversation;
  }

  static updateTitle(id: string, title: string): Conversation | null {
    return this.update(id, { title });
  }

  static getById(id: string): Conversation | null {
    const conversations = this.getAll();
    return conversations.find(conv => conv.id === id) || null;
  }
} 