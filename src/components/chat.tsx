import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

type Props = {
  messages: { role: "user" | "assistant"; content: string }[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};

export function Chat({ messages, onSendMessage, isLoading }: Props) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Chat Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="mb-4 h-96">
          <div className="flex flex-col space-y-3 px-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl p-3 max-w-[80%] shadow-sm ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                  <p className="text-sm">{m.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl p-3 bg-gray-100 text-gray-900 max-w-[80%] shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me to modify the data..."
            disabled={isLoading}
            className="flex-1 resize-none"
            rows={2}
          />
          <Button onClick={handleSend} disabled={isLoading || !message.trim()}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
