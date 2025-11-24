import { useState } from 'react';
import { ChatBot } from '@/components/ChatBot';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<'chat' | 'help'>('chat');

  return <ChatBot onNavigate={setCurrentSection} currentSection={currentSection} />;
};

export default Index;