'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MoreVertical, Atom, Award, Palette, Lightbulb, BookOpen, Users, Globe, Scale } from 'lucide-react';
import SpeechToText from './SpeechToText';
import { ConversationStorage, Message } from '@/lib/storage';
import { useSearchParams } from 'next/navigation';

interface Character {
  id: string;
  name: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  personality: string;
  greeting: string;
  era: string;
}

const characterData: Record<string, Character> = {
  einstein: {
    id: 'einstein',
    name: 'Albert Einstein',
    title: 'Theoretical Physicist',
    color: 'from-blue-600 to-indigo-600',
    icon: <Atom className="w-5 h-5" />,
    personality: 'Curious, thoughtful, and passionate about understanding the universe',
    greeting: "Good day! I'm delighted to discuss the mysteries of the universe with you. What aspect of physics or life would you like to explore together?",
    era: '1879-1955'
  },
  curie: {
    id: 'curie',
    name: 'Marie Curie',
    title: 'Physicist & Chemist',
    color: 'from-emerald-600 to-teal-600',
    icon: <Award className="w-5 h-5" />,
    personality: 'Determined, pioneering, and dedicated to scientific discovery',
    greeting: "Hello! I'm Marie Curie. I'm excited to share my passion for scientific research and discovery. What would you like to learn about?",
    era: '1867-1934'
  },
  davinci: {
    id: 'davinci',
    name: 'Leonardo da Vinci',
    title: 'Renaissance Polymath',
    color: 'from-amber-600 to-orange-600',
    icon: <Palette className="w-5 h-5" />,
    personality: 'Creative, inventive, and endlessly curious about art and science',
    greeting: "Greetings! I am Leonardo. Art, science, invention - they are all connected in the grand tapestry of knowledge. What shall we create or discover today?",
    era: '1452-1519'
  },
  feynman: {
    id: 'feynman',
    name: 'Richard Feynman',
    title: 'Theoretical Physicist',
    color: 'from-purple-600 to-violet-600',
    icon: <Lightbulb className="w-5 h-5" />,
    personality: 'Playful, curious, and excellent at explaining complex concepts simply',
    greeting: "Hey there! I'm Dick Feynman. I love making complex physics simple and fun. What's puzzling you today? Let's figure it out together!",
    era: '1918-1988'
  },
  angelou: {
    id: 'angelou',
    name: 'Maya Angelou',
    title: 'Poet & Civil Rights Activist',
    color: 'from-rose-600 to-pink-600',
    icon: <BookOpen className="w-5 h-5" />,
    personality: 'Wise, compassionate, and inspiring through words and experience',
    greeting: "Hello, dear soul. I'm Maya Angelou. I believe in the power of words to heal, inspire, and transform. What story shall we explore together?",
    era: '1928-2014'
  },
  gandhi: {
    id: 'gandhi',
    name: 'Mahatma Gandhi',
    title: 'Independence Leader',
    color: 'from-green-600 to-emerald-600',
    icon: <Users className="w-5 h-5" />,
    personality: 'Peaceful, principled, and dedicated to truth and non-violence',
    greeting: "Namaste. I am Gandhi. Through truth and non-violence, we can achieve the impossible. How may we walk the path of righteousness together?",
    era: '1869-1948'
  },
  hawking: {
    id: 'hawking',
    name: 'Stephen Hawking',
    title: 'Theoretical Physicist',
    color: 'from-slate-600 to-gray-600',
    icon: <Atom className="w-5 h-5" />,
    personality: 'Brilliant, witty, and endlessly curious about the cosmos',
    greeting: "Hello. Despite my physical limitations, my mind is free to explore the cosmos. Let's journey through space and time together.",
    era: '1942-2018'
  },
  twain: {
    id: 'twain',
    name: 'Mark Twain',
    title: 'Author & Humorist',
    color: 'from-orange-600 to-red-600',
    icon: <BookOpen className="w-5 h-5" />,
    personality: 'Witty, wise, and keen observer of human nature',
    greeting: "Well howdy there! Mark Twain's the name, and I reckon we're in for some fine conversation. What's on your mind, friend?",
    era: '1835-1910'
  },
  socrates: {
    id: 'socrates',
    name: 'Socrates',
    title: 'Classical Philosopher',
    color: 'from-stone-600 to-amber-600',
    icon: <Scale className="w-5 h-5" />,
    personality: 'Questioning, humble, and dedicated to seeking truth through dialogue',
    greeting: "Greetings, my friend. I know nothing except that I know nothing. Shall we examine life together through questions?",
    era: '470-399 BCE'
  },
  mandela: {
    id: 'mandela',
    name: 'Nelson Mandela',
    title: 'Anti-Apartheid Leader',
    color: 'from-yellow-600 to-orange-600',
    icon: <Globe className="w-5 h-5" />,
    personality: 'Dignified, wise, and committed to justice and reconciliation',
    greeting: "Hello, my friend. Ubuntu - I am because we are. Let us speak of justice, forgiveness, and the power of unity.",
    era: '1918-2013'
  }
};

interface ChatInterfaceProps {
  character: string;
  onClose: () => void;
}

export default function ChatInterface({ character, onClose }: ChatInterfaceProps) {
  const searchParams = useSearchParams();
  const threadId = searchParams?.get('threadId');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(threadId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const characterInfo = characterData[character];

  useEffect(() => {
    if (characterInfo) {
      if (conversationId) {
        // Load existing conversation
        const conversation = ConversationStorage.getById(conversationId);
        if (conversation && conversation.participants.includes(character)) {
          setMessages(conversation.messages);
          return;
        }
      }
      
      // Create new conversation
      const greetingMessage: Message = {
        id: '1',
        content: characterInfo.greeting,
        sender: 'character',
        timestamp: new Date()
      };
      
      const newConversation = ConversationStorage.create({
        title: `Chat with ${characterInfo.name}`,
        type: 'individual',
        participants: [character],
        messages: [greetingMessage],
        lastActivity: new Date()
      });
      
      setConversationId(newConversation.id);
      setMessages([greetingMessage]);
    }
  }, [character, characterInfo, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    // Add message to storage and state
    ConversationStorage.addMessage(conversationId, userMessage);
    setMessages(prev => [...prev, userMessage]);
    
    const messageContent = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const { sensayAPI } = await import('@/lib/sensay');
      const response = await sensayAPI.chatWithCharacter(character, messageContent);

      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX

      const aiMessage: Message = {
        id: response.id,
        content: response.content,
        sender: character,
        timestamp: new Date(response.timestamp),
        character: characterInfo ? {
          id: character,
          name: characterInfo.name,
          title: characterInfo.title,
          color: characterInfo.color,
          field: characterInfo.title.includes('Physicist') ? 'Physics' : 
                characterInfo.title.includes('Chemist') ? 'Science' :
                characterInfo.title.includes('Artist') || characterInfo.title.includes('Polymath') ? 'Art & Science' :
                characterInfo.title.includes('Poet') || characterInfo.title.includes('Author') ? 'Literature' :
                characterInfo.title.includes('Philosopher') ? 'Philosophy' :
                characterInfo.title.includes('Leader') ? 'Leadership' : 'General',
          image: '/images/characters/' + character + '.jpg'
        } : undefined
      };

      // Add AI message to storage and state
      ConversationStorage.addMessage(conversationId, aiMessage);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        sender: character,
        timestamp: new Date(),
        character: characterInfo ? {
          id: character,
          name: characterInfo.name,
          title: characterInfo.title,
          color: characterInfo.color,
          field: 'General',
          image: '/images/characters/' + character + '.jpg'
        } : undefined
      };
      
      ConversationStorage.addMessage(conversationId, fallbackMessage);
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSpeechTranscript = (transcript: string) => {
    setInputValue(prev => prev + transcript);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (!characterInfo) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[85vh] bg-black rounded-2xl border border-neutral-800 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-black border-b border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 bg-gradient-to-r ${characterInfo.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                {characterInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{characterInfo.name}</h2>
                <p className="text-neutral-200">{characterInfo.title}</p>
                <p className="text-xs text-neutral-400 mt-1">{characterInfo.era}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-neutral-300" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-300" />
              </button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-neutral-900 rounded-xl">
            <p className="text-sm text-neutral-200 leading-relaxed">{characterInfo.personality}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-900">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'user' ? (
                  <div className="max-w-2xl bg-neutral-800 text-white rounded-2xl px-4 py-3 border border-neutral-700">
                    <p className="leading-relaxed">{message.content}</p>
                    <div className="text-xs text-neutral-400 mt-2">{formatTime(message.timestamp)}</div>
                  </div>
                ) : (
                  <div className="max-w-2xl flex space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${characterInfo.color} flex items-center justify-center text-white font-medium flex-shrink-0 shadow-lg`}>
                      {characterInfo.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{characterInfo.name}</span>
                        <span className="text-xs text-neutral-400">{formatTime(message.timestamp)}</span>
                      </div>
                      <div className="bg-neutral-800 rounded-2xl px-4 py-3 border border-neutral-700 shadow-sm">
                        <p className="text-neutral-100 leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="flex space-x-3 max-w-2xl">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${characterInfo.color} flex items-center justify-center text-white font-medium flex-shrink-0 shadow-lg`}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-neutral-800 rounded-2xl px-4 py-3 border border-neutral-700 shadow-sm">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className={`w-2 h-2 bg-gradient-to-r ${characterInfo.color} rounded-full`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-neutral-800 bg-black">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask ${characterInfo.name.split(' ')[0]} anything...`}
                className="w-full px-4 py-3 pr-12 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:border-transparent outline-none bg-neutral-900 text-white placeholder-neutral-400"
                disabled={isTyping}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <SpeechToText 
                  onTranscript={handleSpeechTranscript}
                  className="flex-shrink-0"
                />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-neutral-400 text-center">
            Having a one-on-one conversation with {characterInfo.name}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}