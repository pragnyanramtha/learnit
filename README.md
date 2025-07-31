# 🧠 learnit - AI Conversations with Historical Figures

> **Revolutionary AI-Powered Educational Platform**  
> Chat with authentic AI replicas of history's greatest minds and watch them engage in interactive discussions.


## 🌟 Project Overview

**learnit** transforms education by bringing history's greatest thinkers to life through AI replicas. Students can engage in authentic conversations with Nobel Prize winners, renowned scientists, artists, and philosophers, or watch multiple geniuses discuss complex topics together in real-time.

### 🎯 Educational Impact

- **Personalized Learning**: Each AI replica adapts to the student's level and learning style
- **Interactive Discussions**: Watch Einstein, Curie, and Feynman debate scientific concepts
- **24/7 Availability**: Learn from the greatest minds anytime, anywhere
- **Diverse Perspectives**: Access knowledge from multiple fields and time periods
- **Engaging Experience**: Modern chat interface that students actually want to use

## ✨ Key Features

### 🎭 10 Historical AI Replicas
1. **Albert Einstein** - Theoretical Physicist (1879-1955)
2. **Marie Curie** - Physicist & Chemist (1867-1934)
3. **Leonardo da Vinci** - Renaissance Polymath (1452-1519)
4. **Richard Feynman** - Theoretical Physicist (1918-1988)
5. **Maya Angelou** - Poet & Civil Rights Activist (1928-2014)
6. **Mahatma Gandhi** - Independence Leader (1869-1948)
7. **Stephen Hawking** - Theoretical Physicist (1942-2018)
8. **Mark Twain** - Author & Humorist (1835-1910)
9. **Socrates** - Classical Philosopher (470-399 BCE)
10. **Nelson Mandela** - Anti-Apartheid Leader (1918-2013)

### 💬 Advanced Interaction Modes
- **Individual Chats**: One-on-one conversations with historical figures
- **Group Discussions**: Multi-character conversations and debates
- **Unified Interface**: Discord/ChatGPT-style chat system with conversation history
- **Real-time Responses**: Simultaneous API calls for natural group conversations

### 🎨 Modern UI/UX Features
- **Real Historical Photos**: Authentic public domain images from Wikimedia Commons
- **WhatsApp-style Timestamps**: Actual times (7:23 PM) with date separators
- **Smooth Animations**: Framer Motion for engaging interactions
- **Speech-to-Text**: Voice input for natural conversations
- **Character Info Modals**: Detailed biographical information
- **Responsive Design**: Works seamlessly on all devices

### 🤖 AI-Enhanced Features
- **Intelligent Note Generation**: Export conversations as refined notes
- **Custom Category Extraction**: User-defined analysis categories
- **Multiple Export Formats**: Markdown, PDF, Word with professional styling
- **Cerebras Integration**: Advanced AI for note analysis
- **Conversation Persistence**: Local storage for chat history

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript for type safety and reliability
- **Styling**: Tailwind CSS for modern, responsive design
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **AI APIs**: 
  - Sensay API for character conversations
  - Cerebras API (llama3.1-8b) for intelligent note generation
- **Export**: html2pdf.js for PDF generation
- **Storage**: Local storage for conversation persistence

## 📋 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- API keys for Sensay and Cerebras

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pragnyanramtha/learnit.git
   cd learnit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file with:
   ```
   SENSAY_API_KEY=your_sensay_api_key_here
   CEREBRAS_API_KEY=your_cerebras_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 🧬 How the AI Replicas Work

### Training Data Sources
Each AI replica leverages comprehensive datasets including:
- **Published Works**: Scientific papers, books, and articles
- **Historical Records**: Documented conversations and interviews
- **Biographical Content**: Life experiences and philosophies
- **Speaking Patterns**: Unique vocabulary and communication styles

### Personality Modeling
- **Authentic Responses**: Character-specific knowledge and perspectives
- **Historical Context**: Time-period appropriate understanding
- **Expertise Areas**: Deep knowledge in their specific fields
- **Natural Conversations**: Flowing dialogue that feels authentic

### API Integration
- **Sensay Wisdom Engine**: Character personality and conversation handling
- **Cerebras AI**: Advanced note generation and analysis
- **Real-time Processing**: Fast, simultaneous responses for group chats
- **Context Management**: Conversation history and memory

## 🎓 Educational Use Cases

### For Students
- **Homework Help**: Get explanations from subject matter experts
- **Research Projects**: Interview historical figures for unique perspectives
- **Concept Clarification**: Complex topics explained in accessible ways
- **Study Notes**: AI-generated summaries and insights from conversations

### For Educators
- **Classroom Discussions**: Facilitate debates between historical figures
- **Interactive Lessons**: Bring textbook characters to life
- **Assessment Tools**: Students demonstrate understanding through conversations
- **Curriculum Integration**: Align with educational standards and objectives

### For Institutions
- **Virtual Museums**: Interactive exhibits with historical personalities
- **Online Courses**: Enhanced learning experiences with AI tutors
- **Research Tools**: Access to vast knowledge repositories
- **Accessibility**: Make expert knowledge available to underserved communities

## 🎯 Demo Highlights

### Live Features
1. **Character Selection** - Browse 10 historical figures with real photos
2. **Individual Conversations** - Chat one-on-one with Einstein about physics
3. **Group Discussions** - Watch multiple characters debate topics
4. **Real-time Timing** - See actual timestamps like "7:23 PM"
5. **Export Notes** - Generate intelligent summaries in multiple formats
6. **Speech Input** - Use voice to ask questions naturally
7. **Character Info** - Learn about each historical figure's background

### Technical Achievements
- **Performance**: Simultaneous API calls for faster group conversations
- **UX**: WhatsApp-style interface with date separators
- **AI Integration**: Dual API system (Sensay + Cerebras)
- **Export Quality**: Professional documents with logos and formatting
- **Scalability**: Modular architecture for easy expansion

## 🚀 Future Enhancements

- **Voice Conversations**: Audio chat with AI replicas
- **Visual Avatars**: 3D character representations
- **Learning Analytics**: Track student progress and engagement
- **Curriculum Integration**: Align with educational standards
- **Mobile App**: Native iOS and Android applications
- **VR/AR Support**: Immersive learning experiences
- **More Characters**: Expand to 50+ historical figures
- **Collaborative Features**: Multi-student group discussions

## 🏅 Impact

**learnit** represents a paradigm shift in educational technology:

- **Accessibility**: Makes world-class mentorship available to every student
- **Engagement**: Transforms passive learning into active conversations
- **Personalization**: Adapts to individual learning styles and interests
- **Innovation**: Combines cutting-edge AI with proven educational principles
- **Scalability**: Can serve millions of students simultaneously
