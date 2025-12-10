import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils/cn";

type Props = {
  messages: { role: "user" | "assistant"; content: string }[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};

export function Chat({ messages, onSendMessage, isLoading }: Props) {
  const [message, setMessage] = useState("");

  const loadingMessages = [
    "Evaluating changes...",
    "Planning data updates...",
    "Preparing response...",
  ];
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading]);

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
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-3 shadow-sm",
                    m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  )}
                >
                  <p className="text-sm">{m.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={cn("max-w-[80%] rounded-2xl bg-gray-100 p-3 text-gray-900 shadow-sm")}>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <span className="text-sm">{loadingMessages[loadingIndex]}</span>
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
