import { useState } from 'react';
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

export function ChatBot({ onNavigate, currentSection }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я — корпоративный ассистент для профессиональных консультаций. Чем могу помочь?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

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
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">Активен</span>
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
