
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      {isBot && (
        <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600">
          <AvatarFallback className="bg-transparent">
            <Bot className="w-4 h-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-3 rounded-lg ${
            isBot
              ? 'bg-slate-100 text-slate-800'
              : 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1 px-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {!isBot && (
        <Avatar className="w-8 h-8 bg-slate-600">
          <AvatarFallback className="bg-transparent">
            <User className="w-4 h-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
