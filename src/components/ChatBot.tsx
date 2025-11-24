import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  onNavigate: (section: 'chat' | 'help') => void;
  currentSection: 'chat' | 'help';
}

const STORAGE_KEY = 'chatbot-messages';

export function ChatBot({ onNavigate, currentSection }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } catch {
        return [
          {
            id: 1,
            text: 'Здравствуйте! Я — корпоративный ассистент для профессиональных консультаций. Чем могу помочь?',
            sender: 'bot' as const,
            timestamp: new Date(),
          },
        ];
      }
    }
    return [
      {
        id: 1,
        text: 'Здравствуйте! Я — корпоративный ассистент для профессиональных консультаций. Чем могу помочь?',
        sender: 'bot' as const,
        timestamp: new Date(),
      },
    ];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: 'Спасибо за ваш вопрос. Я проанализирую информацию и предоставлю экспертную консультацию в ближайшее время.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    const textContent = messages
      .map((msg) => {
        const time = formatTime(msg.timestamp);
        const sender = msg.sender === 'user' ? 'Пользователь' : 'Бот';
        return `[${time}] ${sender}: ${msg.text}`;
      })
      .join('\n\n');
    const dataBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (confirm('Вы уверены, что хотите очистить всю историю диалогов?')) {
      const initialMessage = {
        id: 1,
        text: 'Здравствуйте! Я — корпоративный ассистент для профессиональных консультаций. Чем могу помочь?',
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Корпоративный ИИ</h1>
          <p className="text-xs text-slate-500 mt-1">Экспертные консультации</p>
        </div>

        <nav className="flex-1 p-4">
          <Button
            variant={currentSection === 'chat' ? 'default' : 'ghost'}
            className="w-full justify-start mb-2"
            onClick={() => onNavigate('chat')}
          >
            <Icon name="MessageSquare" className="mr-2" size={18} />
            Диалоги
          </Button>
          <Button
            variant={currentSection === 'help' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onNavigate('help')}
          >
            <Icon name="HelpCircle" className="mr-2" size={18} />
            Помощь
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="User" size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Пользователь</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        {currentSection === 'chat' ? (
          <>
            <header className="bg-white border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Консультация</h2>
                  <p className="text-sm text-slate-500">Профессиональный чат-бот</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportText}
                    className="gap-2"
                  >
                    <Icon name="FileText" size={16} />
                    Экспорт TXT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportJSON}
                    className="gap-2"
                  >
                    <Icon name="Download" size={16} />
                    Экспорт JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearHistory}
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <Icon name="Trash2" size={16} />
                    Очистить
                  </Button>
                </div>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3 animate-fade-in',
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="Bot" size={16} className="text-white" />
                      </div>
                    )}
                    <Card
                      className={cn(
                        'max-w-xl p-4',
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-white border-slate-200'
                      )}
                    >
                      <p className={cn(
                        'text-sm leading-relaxed',
                        message.sender === 'user' ? 'text-white' : 'text-slate-800'
                      )}>{message.text}</p>
                      <p className={cn(
                        'text-xs mt-2',
                        message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                      )}>{formatTime(message.timestamp)}</p>
                    </Card>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="bg-white border-t border-slate-200 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите ваш вопрос..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon">
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Ответы генерируются искусственным интеллектом и могут содержать неточности
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <header className="bg-white border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Центр помощи</h2>
              <p className="text-sm text-slate-500">Часто задаваемые вопросы и инструкции</p>
            </header>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Info" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Как работает чат-бот?
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Наш корпоративный ассистент использует современные технологии искусственного интеллекта для предоставления профессиональных консультаций. Просто задайте вопрос в текстовом формате, и система предоставит экспертный ответ на основе базы знаний компании.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Shield" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Безопасность данных
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Все диалоги защищены с использованием современных стандартов шифрования. Ваши данные не передаются третьим лицам и хранятся в соответствии с корпоративной политикой безопасности.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Clock" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Время ответа
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Система обрабатывает запросы в режиме реального времени. Среднее время получения ответа составляет 2-5 секунд. Для сложных запросов может потребоваться дополнительное время на анализ.
                      </p>
                    </div>
                  </div>
                </Card>

                <Separator className="my-8" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Контакты поддержки</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Mail" size={18} className="text-slate-400" />
                      <span className="text-slate-600">support@company.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Phone" size={18} className="text-slate-400" />
                      <span className="text-slate-600">+7 (800) 123-45-67</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Clock" size={18} className="text-slate-400" />
                      <span className="text-slate-600">Пн-Пт, 9:00 — 18:00 МСК</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </main>
    </div>
  );
}