
import { useState, useEffect, useCallback } from 'react';
import { evolutionAPIService } from '@/services/evolution-api';
import { Lead, Message } from '@/types';
import { showErrorToast } from '@/components/ui/toast-helper';

export function useWhatsappChat(selectedLead: Lead | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch messages for the selected lead
  const fetchMessages = useCallback(async () => {
    if (!selectedLead) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching messages for:", selectedLead.phone);
      const fetchedMessages = await evolutionAPIService.getMessages(selectedLead);
      console.log("Fetched messages:", fetchedMessages);
      
      if (fetchedMessages && fetchedMessages.length > 0) {
        // Sort messages by timestamp
        const sortedMessages = [...fetchedMessages].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
      } else {
        console.log("No messages found");
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Falha ao carregar mensagens");
      showErrorToast("Não foi possível carregar as mensagens");
    } finally {
      setLoading(false);
    }
  }, [selectedLead]);
  
  // Send a message to the selected lead
  const sendMessage = async (content: string) => {
    if (!selectedLead || !content.trim()) return null;
    
    try {
      console.log("Sending message to:", selectedLead.phone, "Content:", content);
      const newMessage = await evolutionAPIService.sendMessage(selectedLead, content);
      
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      }
      
      return null;
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Falha ao enviar mensagem");
      showErrorToast("Erro ao enviar mensagem");
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
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [selectedLead, fetchMessages]);
  
  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: fetchMessages
  };
}
