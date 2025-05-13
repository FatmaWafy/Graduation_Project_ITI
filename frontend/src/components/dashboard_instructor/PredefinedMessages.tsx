"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { Loader2, Plus, MessageSquare } from "lucide-react";
import Cookies from "js-cookie";
const origin = process.env.NEXT_PUBLIC_API_URL;

interface PredefinedMessage {
  id: number;
  message: string;
}

interface PredefinedMessagesProps {
  onSelectMessage: (message: string) => void;
}

export function PredefinedMessages({
  onSelectMessage,
}: PredefinedMessagesProps) {
  const [messages, setMessages] = useState<PredefinedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPredefinedMessages = async () => {
    setIsLoading(true);
    try {
      // Get token from cookies
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${origin}/notifications/predefined/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch predefined messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching predefined messages:", error);
      toast.error("Failed to load predefined messages");
    } finally {
      setIsLoading(false);
    }
  };

  const addPredefinedMessage = async () => {
    if (!newMessage.trim()) {
      toast.warning("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get token from cookies
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }
      // console.log("Sending body:", JSON.stringify({ message: newMessage }));

      const response = await fetch(`${origin}/notifications/predefined/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to add predefined message");
      }

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");
      toast.success("Message added successfully");
    } catch (error) {
      console.error("Error adding predefined message:", error);
      toast.error("Failed to add message");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPredefinedMessages();
  }, []);

  return (
    <Card className="border border-gray-300 rounded-md focus:ring-[#007acc] focus:border-[#007acc] mb-6">
      <CardHeader className="bg-white rounded-md">
        <CardTitle className="text-[#007acc] flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#007acc]" />
          Predefined Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white rounded-md">
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-100 text-[#007acc]">
            <TabsTrigger value="select">Select Message</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 border border-gray-300 rounded-md hover:border-[#007acc] hover:bg-blue-50 cursor-pointer transition-all"
                    onClick={() => onSelectMessage(msg.message)}
                  >
                    <p className="text-gray-700">{msg.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No predefined messages available</p>
                <p className="text-sm mt-1">Add some using the "Add New" tab</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="space-y-4">
              <Textarea
                placeholder="Enter a new predefined message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[120px] text-gray-800 bg-white border-gray-300 focus:border-[#007acc] focus:ring-[#007acc]"
              />
              <Button
                onClick={addPredefinedMessage}
                disabled={isSubmitting || !newMessage.trim()}
                className="w-full bg-[#007acc] hover:bg-[#0062a3] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Message
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
