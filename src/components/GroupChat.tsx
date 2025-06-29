'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, Plus, Minus, MessageCircle, Trash2, Edit3, Settings } from 'lucide-react';
import { sensayAPI } from '@/lib/sensay';

interface Message {
  id: string;
  content: string;
  sender: 'user' | string;
  timestamp: Date;
  character?: Character;
}

interface Character {
  id: string;
  name: string;
  title: string;
  color: string;
  field: string;
  avatar: string;
}

interface Thread {
  id: string;
  title: string;
  participants: string[];
  messages: Message[];
  lastActivity: Date;
  isActive?: boolean;
}

const availableCharacters: Character[] = [
  {
    id: 'einstein',
    name: 'Albert Einstein',
    title: 'Theoretical Physicist',
    color: 'from-blue-600 to-indigo-600',
    field: 'Physics',
    avatar: 'AE'
  },
  {
    id: 'curie',
    name: 'Marie Curie',
    title: 'Physicist & Chemist',
    color: 'from-emerald-600 to-teal-600',
    field: 'Science',
    avatar: 'MC'
  },
  {
    id: 'feynman',
    name: 'Richard Feynman',
    title: 'Theoretical Physicist',
    color: 'from-purple-600 to-violet-600',
    field: 'Physics',
    avatar: 'RF'
  },
  {
    id: 'davinci',
    name: 'Leonardo da Vinci',
    title: 'Renaissance Polymath',
    color: 'from-amber-600 to-orange-600',
    field: 'Art & Science',
    avatar: 'LV'
  },
  {
    id: 'hawking',
    name: 'Stephen Hawking',
    title: 'Theoretical Physicist',
    color: 'from-slate-600 to-gray-600',
    field: 'Cosmology',
    avatar: 'SH'
  },
  {
    id: 'gandhi',
    name: 'Mahatma Gandhi',
    title: 'Independence Leader',
    color: 'from-green-600 to-emerald-600',
    field: 'Philosophy',
    avatar: 'MG'
  },
  {
    id: 'angelou',
    name: 'Maya Angelou',
    title: 'Poet & Activist',
    color: 'from-rose-600 to-pink-600',
    field: 'Literature',
    avatar: 'MA'
  },
  {
    id: 'twain',
    name: 'Mark Twain',
    title: 'Author & Humorist',
    color: 'from-orange-600 to-red-600',
    field: 'Literature',
    avatar: 'MT'
  },
  {
    id: 'socrates',
    name: 'Socrates',
    title: 'Classical Philosopher',
    color: 'from-stone-600 to-amber-600',
    field: 'Philosophy',
    avatar: 'SO'
  },
  {
    id: 'mandela',
    name: 'Nelson Mandela',
    title: 'Anti-Apartheid Leader',
    color: 'from-yellow-600 to-orange-600',
    field: 'Leadership',
    avatar: 'NM'
  }
];

interface GroupChatProps {
  onClose: () => void;
}

export default function GroupChat({ onClose }: GroupChatProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isDiscussing, setIsDiscussing] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showThreadSettings, setShowThreadSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    // Create initial thread
    if (threads.length === 0) {
      createNewThread(['einstein', 'curie', 'feynman']);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const createNewThread = (participantIds: string[] = ['einstein', 'curie']) => {
    const participants = participantIds.slice(0, 5); // Max 5 participants
    const newThread: Thread = {
      id: Date.now().toString(),
      title: `Discussion with ${participants.map(id => availableCharacters.find(c => c.id === id)?.name.split(' ')[0]).join(', ')}`,
      participants,
      messages: [{
        id: '1',
        content: `Welcome! You're now in discussion with ${participants.map(id => availableCharacters.find(c => c.id === id)?.name).join(', ')}. Ask any question to start the conversation.`,
        sender: 'system',
        timestamp: new Date()
      }],
      lastActivity: new Date(),
      isActive: true
    };

    setThreads(prev => {
      const updated = prev.map(t => ({ ...t, isActive: false }));
      return [newThread, ...updated];
    });
    setActiveThreadId(newThread.id);
  };

  const addCharacterToThread = (characterId: string) => {
    if (!activeThread || activeThread.participants.includes(characterId) || activeThread.participants.length >= 5) return;

    const character = availableCharacters.find(c => c.id === characterId);
    if (!character) return;

    setThreads(prev => prev.map(thread => 
      thread.id === activeThreadId 
        ? {
            ...thread,
            participants: [...thread.participants, characterId],
            title: `Discussion with ${[...thread.participants, characterId].map(id => availableCharacters.find(c => c.id === id)?.name.split(' ')[0]).join(', ')}`,
            messages: [...thread.messages, {
              id: Date.now().toString(),
              content: `${character.name} has joined the discussion.`,
              sender: 'system',
              timestamp: new Date()
            }]
          }
        : thread
    ));
    setShowCharacterSelector(false);
  };

  const removeCharacterFromThread = (characterId: string) => {
    if (!activeThread || activeThread.participants.length <= 1) return;

    const character = availableCharacters.find(c => c.id === characterId);
    if (!character) return;

    setThreads(prev => prev.map(thread => 
      thread.id === activeThreadId 
        ? {
            ...thread,
            participants: thread.participants.filter(id => id !== characterId),
            title: `Discussion with ${thread.participants.filter(id => id !== characterId).map(id => availableCharacters.find(c => c.id === id)?.name.split(' ')[0]).join(', ')}`,
            messages: [...thread.messages, {
              id: Date.now().toString(),
              content: `${character.name} has left the discussion.`,
              sender: 'system',
              timestamp: new Date()
            }]
          }
        : thread
    ));
  };

  const deleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThreadId === threadId) {
      const remainingThreads = threads.filter(t => t.id !== threadId);
      setActiveThreadId(remainingThreads.length > 0 ? remainingThreads[0].id : null);
    }
  };

  const simulateDiscussion = async (userQuestion: string) => {
    if (!activeThread) return;

    setIsDiscussing(true);
    const responses: Message[] = [];
    
    // Get responses from each character
    for (const characterId of activeThread.participants) {
      try {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        
        const response = await sensayAPI.chatWithCharacter(characterId, userQuestion);
        const character = availableCharacters.find(c => c.id === characterId);
        
        const characterMessage: Message = {
          id: `${Date.now()}-${characterId}`,
          content: response.content,
          sender: characterId,
          timestamp: new Date(),
          character
        };
        
        responses.push(characterMessage);
        
        // Add message immediately for real-time feel
        setThreads(prev => prev.map(thread => 
          thread.id === activeThreadId 
            ? { ...thread, messages: [...thread.messages, characterMessage], lastActivity: new Date() }
            : thread
        ));
      } catch (error) {
        console.error(`Error getting response from ${characterId}:`, error);
      }
    }
    
    setIsDiscussing(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeThread) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setThreads(prev => prev.map(thread => 
      thread.id === activeThreadId 
        ? { ...thread, messages: [...thread.messages, userMessage], lastActivity: new Date() }
        : thread
    ));

    const question = inputValue;
    setInputValue('');

    await simulateDiscussion(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCharacterInfo = (characterId: string) => {
    return availableCharacters.find(c => c.id === characterId);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-7xl h-[90vh] bg-white rounded-2xl border border-slate-200 flex overflow-hidden shadow-2xl"
      >
        {/* Sidebar - Thread List */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Group Discussions</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <button
              onClick={() => createNewThread()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Discussion</span>
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`group relative p-4 rounded-xl border cursor-pointer transition-all ${
                  thread.id === activeThreadId
                    ? 'bg-white border-indigo-200 shadow-sm'
                    : 'bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">{formatTime(thread.lastActivity)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(thread.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
                
                <h3 className="font-medium text-slate-900 mb-2 leading-tight">{thread.title}</h3>
                
                <div className="flex items-center space-x-1">
                  {thread.participants.slice(0, 3).map(characterId => {
                    const character = getCharacterInfo(characterId);
                    return character ? (
                      <div
                        key={characterId}
                        className={`w-6 h-6 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-white text-xs font-medium`}
                      >
                        {character.avatar}
                      </div>
                    ) : null;
                  })}
                  {thread.participants.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-xs font-medium">
                      +{thread.participants.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{activeThread.title}</h3>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {activeThread.participants.map(characterId => {
                          const character = getCharacterInfo(characterId);
                          return character ? (
                            <div key={characterId} className="flex items-center space-x-2 bg-slate-100 rounded-full px-3 py-1">
                              <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-white text-xs font-medium`}>
                                {character.avatar}
                              </div>
                              <span className="text-sm text-slate-700">{character.name.split(' ')[0]}</span>
                              {activeThread.participants.length > 1 && (
                                <button
                                  onClick={() => removeCharacterFromThread(characterId)}
                                  className="ml-1 p-0.5 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                  <Minus className="w-3 h-3 text-slate-500" />
                                </button>
                              )}
                            </div>
                          ) : null;
                        })}
                      </div>
                      {activeThread.participants.length < 5 && (
                        <button
                          onClick={() => setShowCharacterSelector(true)}
                          className="flex items-center space-x-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowThreadSettings(true)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeThread.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'user' ? (
                      <div className="max-w-2xl bg-slate-900 text-white rounded-2xl px-4 py-3">
                        <p className="leading-relaxed">{message.content}</p>
                        <div className="text-xs text-slate-300 mt-1">{formatTime(message.timestamp)}</div>
                      </div>
                    ) : message.sender === 'system' ? (
                      <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-block bg-slate-100 text-slate-600 rounded-full px-4 py-2 text-sm">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-2xl flex space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${message.character?.color} flex items-center justify-center text-white font-medium flex-shrink-0`}>
                          {message.character?.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-slate-900">{message.character?.name}</span>
                            <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                          </div>
                          <div className="bg-slate-50 rounded-2xl px-4 py-3">
                            <p className="text-slate-800 leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isDiscussing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex space-x-3 max-w-2xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-300 to-slate-400 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl px-4 py-3">
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 bg-slate-400 rounded-full"
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

              {/* Input Area */}
              <div className="p-6 border-t border-slate-200 bg-white">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a question to start the discussion..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      disabled={isDiscussing}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isDiscussing}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-slate-500 text-center">
                  All participants will respond to your question
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">No Discussion Selected</p>
                <p>Create a new discussion to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Character Selector Modal */}
        <AnimatePresence>
          {showCharacterSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowCharacterSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl w-full max-h-[70vh] overflow-y-auto"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Add Character to Discussion</h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableCharacters
                    .filter(char => !activeThread?.participants.includes(char.id))
                    .map((character) => (
                      <button
                        key={character.id}
                        onClick={() => addCharacterToThread(character.id)}
                        className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-white font-medium`}>
                          {character.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{character.name}</div>
                          <div className="text-sm text-slate-600">{character.title}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 