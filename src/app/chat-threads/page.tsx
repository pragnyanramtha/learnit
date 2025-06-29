'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageCircle, Edit3, Trash2, Search, User, Users, Send, FileText, Download, Plus, Minus, Settings } from 'lucide-react';
import { ConversationStorage, Conversation, Message } from '@/lib/storage';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SpeechToText from '@/components/SpeechToText';
import CharacterInfoModal from '@/components/CharacterInfoModal';
import { sensayAPI } from '@/lib/sensay';
import { cerebrasAPI } from '@/lib/cerebras';

const availableCharacters = [
  { id: 'einstein', name: 'Albert Einstein', color: 'from-blue-600 to-indigo-600', image: '/images/characters/einstein.jpg', title: 'Theoretical Physicist' },
  { id: 'curie', name: 'Marie Curie', color: 'from-emerald-600 to-teal-600', image: '/images/characters/curie.jpg', title: 'Physicist & Chemist' },
  { id: 'feynman', name: 'Richard Feynman', color: 'from-purple-600 to-violet-600', image: '/images/characters/feynman.jpg', title: 'Theoretical Physicist' },
  { id: 'davinci', name: 'Leonardo da Vinci', color: 'from-amber-600 to-orange-600', image: '/images/characters/davinci.jpg', title: 'Renaissance Polymath' },
  { id: 'hawking', name: 'Stephen Hawking', color: 'from-slate-600 to-gray-600', image: '/images/characters/hawking.jpg', title: 'Theoretical Physicist' },
  { id: 'gandhi', name: 'Mahatma Gandhi', color: 'from-green-600 to-emerald-600', image: '/images/characters/gandhi.jpg', title: 'Independence Leader' },
  { id: 'angelou', name: 'Maya Angelou', color: 'from-rose-600 to-pink-600', image: '/images/characters/angelou.jpg', title: 'Poet & Activist' },
  { id: 'twain', name: 'Mark Twain', color: 'from-orange-600 to-red-600', image: '/images/characters/twain.jpg', title: 'Author & Humorist' },
  { id: 'socrates', name: 'Socrates', color: 'from-stone-600 to-amber-600', image: '/images/characters/socrates.jpg', title: 'Classical Philosopher' },
  { id: 'mandela', name: 'Nelson Mandela', color: 'from-yellow-600 to-orange-600', image: '/images/characters/mandela.jpg', title: 'Anti-Apartheid Leader' }
];

function UnifiedChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeConversationId = searchParams?.get('id');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'group'>('all');
  const [selectedCharacterForInfo, setSelectedCharacterForInfo] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExportingNotes, setIsExportingNotes] = useState(false);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'pdf' | 'word'>('markdown');
  const [extractionCategories, setExtractionCategories] = useState([
    'Core Insights (Bullet Points)',
    'Key Questions Raised', 
    'Proposed Solutions or Ideas',
    'Actionable Recommendations',
    'Important Disagreements',
    'Referenced People/Concepts/Tools',
    'Noteworthy Quotes (Optional)',
    'Open Threads / Follow-ups'
  ]);

  // Active conversation state
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Character selection states
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showIndividualCharacterSelector, setShowIndividualCharacterSelector] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  useEffect(() => {
    const loadedConversations = ConversationStorage.getAll();
    setConversations(loadedConversations);
    
    if (activeConversationId) {
      const conversation = loadedConversations.find(c => c.id === activeConversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    }
  }, [activeConversationId]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || conv.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      ConversationStorage.updateTitle(editingId, editTitle.trim());
      setConversations(ConversationStorage.getAll());
      if (activeConversation && activeConversation.id === editingId) {
        setActiveConversation({ ...activeConversation, title: editTitle.trim() });
      }
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      ConversationStorage.delete(id);
      setConversations(ConversationStorage.getAll());
      if (activeConversation?.id === id) {
        setActiveConversation(null);
        router.push('/chat-threads');
      }
    }
  };

  const getCharacterInfo = (characterId: string) => {
    return availableCharacters.find(c => c.id === characterId);
  };

  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    router.push(`/chat-threads?id=${conversation.id}`);
  };

  const createNewIndividualChat = (characterId: string) => {
    const character = getCharacterInfo(characterId);
    if (!character) return;

    const greeting = `Hello! I'm ${character.name}. I'm excited to discuss ideas with you. What would you like to explore today?`;
    
    const newConversation = ConversationStorage.create({
      title: `Chat with ${character.name}`,
      type: 'individual',
      participants: [characterId],
      messages: [{
        id: '1',
        content: greeting,
        sender: characterId,
        timestamp: new Date(),
        character: {
          id: characterId,
          name: character.name,
          title: character.title,
          color: character.color,
          field: character.title.includes('Physicist') ? 'Physics' : 'General',
          image: character.image
        }
      }],
      lastActivity: new Date()
    });

    setConversations(ConversationStorage.getAll());
    setShowIndividualCharacterSelector(false);
    selectConversation(newConversation);
  };

  const createNewChat = (type: 'individual' | 'group') => {
    if (type === 'individual') {
      setShowIndividualCharacterSelector(true);
    } else {
      // Create new group chat
      const newConversation = ConversationStorage.create({
        title: 'New Group Discussion',
        type: 'group',
        participants: ['einstein', 'curie'],
        messages: [{
          id: '1',
          content: `Welcome! You're now in discussion with ${['einstein', 'curie'].map(id => availableCharacters.find(c => c.id === id)?.name).join(', ')}. Ask any question to start the conversation.`,
          sender: 'system',
          timestamp: new Date()
        }],
        lastActivity: new Date()
      });

      setConversations(ConversationStorage.getAll());
      selectConversation(newConversation);
    }
  };

  const addCharacterToGroup = (characterId: string) => {
    if (!activeConversation || activeConversation.type !== 'group' || 
        activeConversation.participants.includes(characterId) || 
        activeConversation.participants.length >= 5) return;

    const character = getCharacterInfo(characterId);
    if (!character) return;

    const updatedParticipants = [...activeConversation.participants, characterId];
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: `${character.name} has joined the discussion.`,
      sender: 'system',
      timestamp: new Date()
    };

    ConversationStorage.addMessage(activeConversation.id, systemMessage);
    
    // Update conversation participants
    const updatedConversation = {
      ...activeConversation,
      participants: updatedParticipants,
      title: `Discussion with ${updatedParticipants.map(id => availableCharacters.find(c => c.id === id)?.name.split(' ')[0]).join(', ')}`,
      messages: [...activeConversation.messages, systemMessage],
      lastActivity: new Date()
    };

    // Update in storage (we need to manually update since there's no direct update method)
    ConversationStorage.delete(activeConversation.id);
    const newConversation = ConversationStorage.create({
      title: updatedConversation.title,
      type: 'group',
      participants: updatedParticipants,
      messages: updatedConversation.messages,
      lastActivity: new Date()
    });

    setActiveConversation(newConversation);
    setConversations(ConversationStorage.getAll());
    setShowCharacterSelector(false);
  };

  const removeCharacterFromGroup = (characterId: string) => {
    if (!activeConversation || activeConversation.type !== 'group' || 
        activeConversation.participants.length <= 1) return;

    const character = getCharacterInfo(characterId);
    if (!character) return;

    const updatedParticipants = activeConversation.participants.filter(id => id !== characterId);
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: `${character.name} has left the discussion.`,
      sender: 'system',
      timestamp: new Date()
    };

    ConversationStorage.addMessage(activeConversation.id, systemMessage);
    
    // Update conversation participants
    const updatedConversation = {
      ...activeConversation,
      participants: updatedParticipants,
      title: `Discussion with ${updatedParticipants.map(id => availableCharacters.find(c => c.id === id)?.name.split(' ')[0]).join(', ')}`,
      messages: [...activeConversation.messages, systemMessage],
      lastActivity: new Date()
    };

    // Update in storage
    ConversationStorage.delete(activeConversation.id);
    const newConversation = ConversationStorage.create({
      title: updatedConversation.title,
      type: 'group',
      participants: updatedParticipants,
      messages: updatedConversation.messages,
      lastActivity: new Date()
    });

    setActiveConversation(newConversation);
    setConversations(ConversationStorage.getAll());
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    // Add message to storage and update state
    ConversationStorage.addMessage(activeConversation.id, userMessage);
    const updatedConversation = { ...activeConversation, messages: [...activeConversation.messages, userMessage], lastActivity: new Date() };
    setActiveConversation(updatedConversation);
    setConversations(ConversationStorage.getAll());

    const messageContent = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      if (activeConversation.type === 'individual') {
        // Individual chat
        const characterId = activeConversation.participants[0];
        const response = await sensayAPI.chatWithCharacter(characterId, messageContent);
        const character = getCharacterInfo(characterId);
        
        const aiMessage: Message = {
          id: response.id,
          content: response.content,
          sender: characterId,
          timestamp: new Date(response.timestamp),
          character: character ? {
            id: characterId,
            name: character.name,
            title: character.title,
            color: character.color,
            field: character.title.includes('Physicist') ? 'Physics' : 'General',
            image: character.image
          } : undefined
        };

        ConversationStorage.addMessage(activeConversation.id, aiMessage);
        setActiveConversation(prev => prev ? { ...prev, messages: [...prev.messages, aiMessage] } : null);
      } else {
        // Group chat - send all API calls simultaneously
        const characterPromises = activeConversation.participants.map(async (characterId) => {
          // Add random delay to simulate natural response timing
          await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
          
          const response = await sensayAPI.chatWithCharacter(characterId, messageContent);
          const character = getCharacterInfo(characterId);
          
          return {
            id: `${Date.now()}-${characterId}`,
            content: response.content,
            sender: characterId,
            timestamp: new Date(),
            character: character ? {
              id: characterId,
              name: character.name,
              title: character.title,
              color: character.color,
              field: character.title.includes('Physicist') ? 'Physics' : 'General',
              image: character.image
            } : undefined
          };
        });

        // Wait for all characters to respond
        const characterResponses = await Promise.all(characterPromises);
        
        // Add all responses to storage and state
        characterResponses.forEach(characterMessage => {
          ConversationStorage.addMessage(activeConversation.id, characterMessage);
        });
        
        setActiveConversation(prev => prev ? { 
          ...prev, 
          messages: [...prev.messages, ...characterResponses] 
        } : null);
      }
      
      setConversations(ConversationStorage.getAll());
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeechTranscript = (transcript: string) => {
    setInputValue(prev => prev + transcript);
  };

  // Helper function to convert markdown to plain text for PDF/Word
  const markdownToPlainText = (markdown: string): string => {
    return markdown
      // Remove headers (# ## ###)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic (**text** or __text__ or *text* or _text_)
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove bullet points and convert to numbered lists
      .replace(/^\s*[\*\-\+]\s+/gm, '• ')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const startExportFlow = (format: 'markdown' | 'pdf' | 'word' = 'markdown') => {
    if (!activeConversation) return;

    const conversationMessages = activeConversation.messages.filter(m => m.sender !== 'system');
    
    if (conversationMessages.length === 0) {
      alert('No conversation to export yet. Start a discussion first!');
      return;
    }

    setExportFormat(format);
    setShowCategoryEditor(true);
    setShowExportMenu(false);
  };

  const exportAsNotes = async () => {
    if (!activeConversation) return;

    const conversationMessages = activeConversation.messages.filter(m => m.sender !== 'system');
    
    let conversationText = '';
    conversationMessages.forEach((message) => {
      if (message.sender === 'user') {
        conversationText += `USER: ${message.content}\n\n`;
      } else {
        const characterName = message.character?.name || 'Character';
        conversationText += `${characterName.toUpperCase()}: ${message.content}\n\n`;
      }
    });

    try {
      setIsExportingNotes(true);
      setShowCategoryEditor(false);
      
      // Use Cerebras API for note generation with custom categories
      const analysisResults = await cerebrasAPI.generateNotes(conversationText, extractionCategories);
      
      // Create markdown version
      const markdownNotes = `# Conversation Analysis: ${activeConversation.title}
*Intelligent Analysis powered by Cerebras AI*

${analysisResults}

---
*Generated from conversation on ${new Date().toLocaleDateString()}*
*Participants: ${activeConversation.participants.map(id => availableCharacters.find(c => c.id === id)?.name).join(', ')}*
*Analyzed using Cerebras llama-4-scout-17b-16e-instruct*`;

      // Create plain text version for PDF/Word
      const plainTextNotes = `CONVERSATION ANALYSIS: ${activeConversation.title.toUpperCase()}
Intelligent Analysis powered by Cerebras AI

${markdownToPlainText(analysisResults)}

---
Generated from conversation on ${new Date().toLocaleDateString()}
Participants: ${activeConversation.participants.map(id => availableCharacters.find(c => c.id === id)?.name).join(', ')}
Analyzed using Cerebras llama-4-scout-17b-16e-instruct`;

      const fileName = `${activeConversation.title.replace(/[^a-zA-Z0-9]/g, '_')}_refined_notes`;

      if (exportFormat === 'markdown') {
        const blob = new Blob([markdownNotes], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'pdf') {
        const { default: html2pdf } = await import('html2pdf.js');
        
        // Convert plain text to properly formatted HTML
        const formattedText = plainTextNotes
          .split('\n')
          .map(line => {
            if (line.trim() === '---') {
              return '<hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">';
            } else if (line.trim() === '') {
              return '<br>';
            } else if (line.startsWith('CONVERSATION ANALYSIS:')) {
              return `<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 10px; text-align: center;">${line}</h1>`;
            } else if (line.match(/^\d+\.\s/)) {
              return `<h2 style="color: #2d3748; font-size: 18px; margin-top: 25px; margin-bottom: 10px;">${line}</h2>`;
            } else if (line.startsWith('•')) {
              return `<p style="margin-left: 20px; margin-bottom: 8px; line-height: 1.6;">${line}</p>`;
            } else {
              return `<p style="margin-bottom: 12px; line-height: 1.6; color: #2d3748;">${line}</p>`;
            }
          })
          .join('');
        
        const htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px 40px 40px 40px; background: white; color: #2d3748;">
            <div style="text-align: center; margin-bottom: 40px; padding-top: 20px;">
              <img src="/images/genius-minds-logo.png" alt="Genius Minds" style="max-width: 250px; height: auto; display: block; margin: 0 auto;" />
            </div>
            ${formattedText}
          </div>
        `;
        
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        document.body.appendChild(element);
        
        const opt = {
          margin: 0.75,
          filename: `${fileName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
        document.body.removeChild(element);
      } else if (exportFormat === 'word') {
        const wordContent = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='utf-8'>
            <title>Conversation Analysis</title>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                margin: 40px; 
                color: #2d3748;
                background: white;
              }
              .logo-container {
                text-align: center;
                margin-bottom: 40px;
                padding-top: 20px;
              }
              .logo {
                max-width: 250px;
                height: auto;
                display: block;
                margin: 0 auto;
              }
              h1 { 
                color: #1a365d; 
                border-bottom: 2px solid #4299e1; 
                padding-bottom: 10px; 
                text-align: center;
                font-size: 24px;
              }
              h2 { 
                color: #2d3748; 
                margin-top: 30px; 
                margin-bottom: 15px;
                font-size: 18px;
              }
              p { 
                margin-bottom: 12px; 
                line-height: 1.6;
              }
              hr {
                border: none;
                border-top: 1px solid #e2e8f0;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="logo-container">
              <img src="/images/genius-minds-logo.png" alt="Genius Minds" class="logo" />
            </div>
            ${plainTextNotes.replace(/\n/g, '<br>').replace(/---/g, '<hr>').replace(/CONVERSATION ANALYSIS: ([^\n]+)/g, '<h1>$1</h1>')}
          </body>
          </html>
        `;
        
        const blob = new Blob([wordContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error creating refined notes:', error);
      alert('Failed to create refined notes. Please try again.');
    } finally {
      setIsExportingNotes(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
      return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).format(date);
  };

  const shouldShowDateSeparator = (currentMessage: any, previousMessage: any) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp);
    const previousDate = new Date(previousMessage.timestamp);
    
    return currentDate.toDateString() !== previousDate.toDateString();
  };

  return (
    <div className="h-screen bg-black flex">
      {/* Sidebar - Conversation List */}
      <div className="w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-neutral-300" />
            </Link>
            <h1 className="text-xl font-bold text-white">Conversations</h1>
            <div></div>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => createNewChat('individual')}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <User className="w-4 h-4" />
              <span>Individual</span>
            </button>
            <button
              onClick={() => createNewChat('group')}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              <span>Group</span>
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-neutral-800 text-white placeholder:text-neutral-400"
            />
          </div>

          <div className="flex bg-neutral-800 rounded-lg p-1">
            {[
              { key: 'all', label: 'All', icon: MessageCircle },
              { key: 'individual', label: '1:1', icon: User },
              { key: 'group', label: 'Group', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilterType(key as 'all' | 'individual' | 'group')}
                className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1 rounded-md transition-colors text-xs font-medium ${
                  filterType === key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <MessageCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-600">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                    activeConversation?.id === conversation.id
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      conversation.type === 'group' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }`}>
                      {conversation.type === 'group' ? (
                        <Users className="w-5 h-5 text-white" />
                      ) : (
                        <div className="text-white font-bold text-sm">
                          {getCharacterInfo(conversation.participants[0])?.image ? (
                            <img src={getCharacterInfo(conversation.participants[0])?.image} alt={getCharacterInfo(conversation.participants[0])?.name} className="w-6 h-6 rounded-full" />
                          ) : 'C'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === conversation.id ? (
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          className="text-sm font-medium text-slate-900 bg-transparent border-b border-indigo-500 focus:outline-none w-full"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-sm font-medium text-slate-900 truncate">
                          {conversation.title}
                        </h3>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {formatTime(conversation.lastActivity)}
                        </span>
                      </div>

                      {conversation.messages.length > 0 && (
                        <p className="text-xs text-slate-600 mt-1 truncate">
                          {conversation.messages[conversation.messages.length - 1].content.substring(0, 40)}...
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(conversation);
                        }}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-slate-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conversation.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-neutral-900 border-b border-neutral-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeConversation.type === 'group' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}>
                    {activeConversation.type === 'group' ? (
                      <Users className="w-5 h-5 text-white" />
                    ) : (
                      <div className="text-white font-bold text-sm">
                        {getCharacterInfo(activeConversation.participants[0])?.image ? (
                          <img src={getCharacterInfo(activeConversation.participants[0])?.image} alt={getCharacterInfo(activeConversation.participants[0])?.name} className="w-6 h-6 rounded-full" />
                        ) : 'C'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">{activeConversation.title}</h2>
                    {activeConversation.type === 'group' ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {activeConversation.participants.map(participantId => {
                            const character = getCharacterInfo(participantId);
                            return character ? (
                              <div key={participantId} className="flex items-center space-x-1 bg-slate-800 rounded-full px-2 py-1">
                                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-white text-xs font-medium`}>
                                                                     {character.image ? (
                                     <img src={character.image} alt={character.name} className="w-4 h-4 rounded-full" />
                                   ) : character.name.charAt(0)}
                                </div>
                                <span className="text-xs text-slate-300">{character.name.split(' ')[0]}</span>
                                {activeConversation.participants.length > 1 && (
                                  <button
                                    onClick={() => removeCharacterFromGroup(participantId)}
                                    className="ml-1 p-0.5 hover:bg-slate-700 rounded-full transition-colors"
                                  >
                                    <Minus className="w-3 h-3 text-slate-500" />
                                  </button>
                                )}
                              </div>
                            ) : null;
                          })}
                        </div>
                        {activeConversation.participants.length < 5 && (
                          <button
                            onClick={() => setShowCharacterSelector(true)}
                            className="flex items-center space-x-1 px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors text-xs font-medium"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">
                        {activeConversation.participants.map(id => getCharacterInfo(id)?.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {activeConversation.type === 'group' && (
                    <button
                      onClick={() => setShowGroupSettings(!showGroupSettings)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5 text-slate-300" />
                    </button>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      disabled={isExportingNotes}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      {isExportingNotes ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Creating Notes...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>Export Notes</span>
                          <Download className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    
                    {showExportMenu && !isExportingNotes && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 rounded-lg shadow-lg border border-neutral-800 py-2 z-50">
                        <button
                          onClick={() => startExportFlow('markdown')}
                          className="w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors text-slate-300"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Markdown (.md)</span>
                          </div>
                        </button>
                        <button
                          onClick={() => startExportFlow('pdf')}
                          className="w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors text-slate-300"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>PDF (.pdf)</span>
                          </div>
                        </button>
                        <button
                          onClick={() => startExportFlow('word')}
                          className="w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors text-slate-300"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Word (.doc)</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-950">
              <div className="space-y-4">
                {activeConversation.messages.map((message, index) => {
                  const previousMessage = index > 0 ? activeConversation.messages[index - 1] : null;
                  const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
                  
                  return (
                    <div key={message.id}>
                      {/* Date Separator */}
                      {showDateSeparator && (
                        <div className="flex justify-center my-4">
                          <div className="bg-neutral-800 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      )}
                      
                      {/* Message */}
                      <motion.div
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
                            <div className="inline-block bg-slate-800 text-slate-300 rounded-full px-4 py-2 text-sm">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          <div className="max-w-2xl flex space-x-3">
                            <button
                              onClick={() => setSelectedCharacterForInfo(message.character?.id || '')}
                              className={`w-10 h-10 rounded-full bg-gradient-to-r ${message.character?.color} flex items-center justify-center text-white font-medium flex-shrink-0 hover:scale-105 transition-transform cursor-pointer`}
                            >
                              {message.character?.image ? (
                                <img src={message.character?.image} alt={message.character?.name} className="w-8 h-8 rounded-full" />
                              ) : message.character?.name.substring(0, 2)}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <button 
                                  onClick={() => setSelectedCharacterForInfo(message.character?.id || '')}
                                  className="font-medium text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                                >
                                  {message.character?.name}
                                </button>
                                <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                              </div>
                              <div className="bg-neutral-800 rounded-2xl px-4 py-3 border border-neutral-700 shadow-sm">
                                <p className="text-slate-300 leading-relaxed">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
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
                        <div className="bg-neutral-800 rounded-2xl px-4 py-3 border border-neutral-700 shadow-sm">
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
              </div>
            </div>

            {/* Input */}
            <div className="bg-neutral-900 border-t border-neutral-800 p-4">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-12 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-neutral-800"
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
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500 text-center">
                {activeConversation.type === 'group' 
                  ? 'All participants will respond to your message'
                  : `Having a conversation with ${getCharacterInfo(activeConversation.participants[0])?.name}`
                }
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-neutral-950">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto text-neutral-700 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Welcome to learn it</h2>
              <p className="text-neutral-400 mb-6">Select a conversation from the sidebar or start a new one</p>
              <div className="flex space-x-3 justify-center">
                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <User className="w-4 h-4" />
                  <span>New Individual Chat</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Users className="w-4 h-4" />
                  <span>New Group Discussion</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Individual Character Selector Modal */}
      <AnimatePresence>
        {showIndividualCharacterSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowIndividualCharacterSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Choose Your Conversation Partner</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableCharacters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => createNewIndividualChat(character.id)}
                    className="flex flex-col items-center p-4 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-center"
                  >
                                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-white font-bold mb-2`}>
                       {character.image ? (
                         <img src={character.image} alt={character.name} className="w-10 h-10 rounded-full" />
                       ) : character.name.substring(0, 2)}
                      </div>
                    <div className="font-medium text-white text-sm">{character.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{character.title}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Character Selector Modal */}
      <AnimatePresence>
        {showCharacterSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCharacterSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 max-w-2xl w-full max-h-[70vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add Character to Discussion</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableCharacters
                  .filter(char => !activeConversation?.participants.includes(char.id))
                  .map((character) => (
                    <button
                      key={character.id}
                      onClick={() => addCharacterToGroup(character.id)}
                      className="flex items-center space-x-3 p-3 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                    >
                                              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${character.color} flex items-center justify-center text-white font-medium`}>
                         {character.image ? (
                           <img src={character.image} alt={character.name} className="w-8 h-8 rounded-full" />
                         ) : character.name.substring(0, 2)}
                        </div>
                      <div>
                        <div className="font-medium text-white">{character.name}</div>
                        <div className="text-sm text-slate-400">{character.title}</div>
                      </div>
                    </button>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Info Modal */}
      {selectedCharacterForInfo && (
        <CharacterInfoModal
          characterId={selectedCharacterForInfo}
          isOpen={!!selectedCharacterForInfo}
          onClose={() => setSelectedCharacterForInfo(null)}
        />
      )}

      {/* Category Editor Modal */}
      <AnimatePresence>
        {showCategoryEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCategoryEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Customize Analysis Categories</h3>
              <p className="text-sm text-slate-400 mb-6">
                Choose which insights you'd like to extract from your conversation. You can edit, remove, or add new categories.
              </p>
              
              <div className="space-y-3 mb-6">
                {extractionCategories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        const newCategories = [...extractionCategories];
                        newCategories[index] = e.target.value;
                        setExtractionCategories(newCategories);
                      }}
                      className="flex-1 px-3 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-900 bg-neutral-800"
                    />
                    <button
                      onClick={() => {
                        const newCategories = extractionCategories.filter((_, i) => i !== index);
                        setExtractionCategories(newCategories);
                      }}
                      className="p-2 text-red-500 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => {
                    setExtractionCategories([...extractionCategories, 'New Category']);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
                <button
                  onClick={() => {
                    setExtractionCategories([
                      'Core Insights (Bullet Points)',
                      'Key Questions Raised', 
                      'Proposed Solutions or Ideas',
                      'Actionable Recommendations',
                      'Important Disagreements',
                      'Referenced People/Concepts/Tools',
                      'Noteworthy Quotes (Optional)',
                      'Open Threads / Follow-ups'
                    ]);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm"
                >
                  <span>Reset to Default</span>
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCategoryEditor(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={exportAsNotes}
                  disabled={isExportingNotes || extractionCategories.length === 0}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {isExportingNotes ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Generate {exportFormat.toUpperCase()} Notes</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UnifiedChatPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-600">Loading...</div>
    </div>}>
      <UnifiedChatPageContent />
    </Suspense>
  );
}