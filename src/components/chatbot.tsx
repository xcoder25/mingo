'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send } from 'lucide-react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'bot'; text: string }>>([]);
  const [inputValue, setInputValue] = useState('');

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setMessages([]); // Reset messages when opening
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const userMessage = { from: 'user' as const, text: inputValue };
      const botMessage = { from: 'bot' as const, text: 'Thanks for your message! We will get back to you shortly.' };
      
      setMessages([userMessage, botMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open Chat</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Support Chat</h3>
          <Button variant="ghost" size="icon" onClick={handleToggle} className="h-6 w-6">
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 h-64 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground p-4">
                    Hi there! How can we help you today?
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    message.from === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="relative w-full">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
              disabled={messages.some(m => m.from === 'bot')}
            />
            <Button
              size="icon"
              className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
              onClick={handleSend}
              disabled={messages.some(m => m.from === 'bot')}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
