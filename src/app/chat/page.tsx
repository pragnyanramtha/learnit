'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CharacterGrid from '@/components/CharacterGrid';
import ChatInterface from '@/components/ChatInterface';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const characterId = searchParams?.get('characterId');
  
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(characterId);

  useEffect(() => {
    if (characterId) {
      setSelectedCharacter(characterId);
    }
  }, [characterId]);

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character);
    // Update URL to include character
    const newUrl = `/chat?characterId=${character}`;
    router.push(newUrl);
  };

  const handleCloseChat = () => {
    setSelectedCharacter(null);
    router.push('/chat');
  };

  if (selectedCharacter) {
    return (
      <ChatInterface 
        character={selectedCharacter}
        onClose={handleCloseChat}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          
          {/* Neural network nodes and connections */}
          <g className="animate-pulse">
            {Array.from({ length: 20 }, (_, i) => (
              <g key={i}>
                <circle
                  cx={100 + (i % 5) * 200}
                  cy={100 + Math.floor(i / 5) * 200}
                  r="4"
                  fill="url(#node-gradient)"
                />
                {i < 19 && (
                  <line
                    x1={100 + (i % 5) * 200}
                    y1={100 + Math.floor(i / 5) * 200}
                    x2={100 + ((i + 1) % 5) * 200}
                    y2={100 + Math.floor((i + 1) / 5) * 200}
                    stroke="#6366f1"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-neutral-300" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                  Choose Your Mentor
                </h1>
                <p className="text-neutral-400 mt-1">
                  Select a historical figure for a one-on-one conversation
                </p>
              </div>
            </div>
            <Link 
              href="/chat-threads"
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
            >
              View Chat History
            </Link>
          </div>
        </div>
      </div>

      {/* Character Selection */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-900 rounded-2xl shadow-xl p-8">
          <CharacterGrid onCharacterSelect={handleCharacterSelect} />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-slate-600">Loading...</div>
    </div>}>
      <ChatPageContent />
    </Suspense>
  );
}