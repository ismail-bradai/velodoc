
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Mic, Send, MicOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

// get user name from localStorage
const user = JSON.parse(localStorage.getItem('velodoc_user') || '{}').name || '';
const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello, ${user}. Let's get to work.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedPrompts = [
    'Provide a 1-Paragraph summary of this Patient',
    'How to get started with my session?',
    'Review Symptoms',
    'Start taking voice notes'
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: 'Thinking...',
      timestamp: new Date(),
      isThinking: true
    };

    setMessages(prev => [...prev, userMessage, thinkingMessage]);
    setInputValue('');

    // Mock AI response
    setTimeout(() => {
      const responses = [
        'Based on the patient data, I can see that Aisha Al Qasimi is a 30-year-old female with a comprehensive medical history. Her contact information is current and she has MetLife Standard Individual Plan coverage.',
        'I\'ve reviewed the symptoms you mentioned. Would you like me to generate a preliminary assessment based on the patient\'s history and current presentation?',
        'Voice notes have been enabled for this session. You can now use the microphone button to record your observations directly into the patient record.',
        'Let me help you get started. You can use the suggested prompts below or ask me specific questions about patient care, documentation, or clinical workflows.'
      ];
      
      const botResponse: Message = {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => prev.filter(msg => !msg.isThinking).concat(botResponse));
    }, 2000);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Voice Recording Started",
        description: "Speak clearly into your microphone"
      });
    } else {
      toast({
        title: "Voice Recording Stopped",
        description: "Processing your voice note..."
      });
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File Uploaded",
        description: `${file.name} has been attached to the session`
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.isThinking ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">Suggested interactions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs h-8 bg-blue-50 border-blue-200 hover:bg-blue-100"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Start Typing"
              className="pr-12"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>
          
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleFileUpload}
              className="text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleVoiceRecord}
              className={`${isRecording ? 'text-red-500 bg-red-50' : 'text-gray-500'} hover:text-gray-700`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-teal-500 hover:bg-teal-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
