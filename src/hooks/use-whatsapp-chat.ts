
import { useState, useEffect } from 'react';
import { evolutionAPIService } from '@/services/evolution-api';
import { Lead, Message } from '@/types';

export function useWhatsappChat(selectedLead: Lead | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch messages for the selected lead
  const fetchMessages = async () => {
    if (!selectedLead) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const fetchedMessages = await evolutionAPIService.getMessages(selectedLead);
      setMessages(fetchedMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };
  
  // Send a message to the selected lead
  const sendMessage = async (content: string) => {
    if (!selectedLead || !content.trim()) return null;
    
    try {
      const newMessage = await evolutionAPIService.sendMessage(selectedLead, content);
      
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      }
      
      return null;
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
      return null;
    }
  };
  
  // Poll for new messages periodically
  useEffect(() => {
    if (!selectedLead) {
      setMessages([]);
      return;
    }
    
    fetchMessages();
    
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [selectedLead]);
  
  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: fetchMessages
  };
}
