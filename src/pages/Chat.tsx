
import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  PaperclipIcon,
  Mic,
  Send,
  Smile,
  Search,
  Phone,
  Video,
  MoreVertical,
  Check,
  Image as ImageIcon,
  File,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockLeads } from "../services/mockData";
import { Message as MessageType, Lead } from "../types";
import { format } from "date-fns";
import WhatsappConnection from "@/components/whatsapp/WhatsappConnection";
import { useWhatsappChat } from "@/hooks/use-whatsapp-chat";
import { Toaster } from "@/components/ui/toaster";

const ChatPage: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isWhatsappConnected, setIsWhatsappConnected] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook to manage chat messages
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
    refreshMessages
  } = useWhatsappChat(selectedLead);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const filteredLeads = mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );
  
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), "HH:mm");
  };
  
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedLead || !isWhatsappConnected) return;
    
    // Use our service to send the message
    await sendMessage(messageInput);
    setMessageInput("");
  };

  const handleConnectionStateChange = (isConnected: boolean) => {
    setIsWhatsappConnected(isConnected);
    
    // Refresh messages when connection state changes
    if (isConnected && selectedLead) {
      refreshMessages();
    }
  };
  
  return (
    <Layout title="Chat">
      <div className="flex h-full overflow-hidden bg-white rounded-md shadow-sm">
        {/* Left side - Contacts */}
        <div className="w-1/4 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar conversa..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-3 border-b border-gray-200">
            <WhatsappConnection onConnectionStateChange={handleConnectionStateChange} />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                className={`p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  selectedLead?.id === lead.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{lead.name}</h3>
                      <span className="text-xs text-gray-500">
                        {format(new Date(lead.updatedAt), "HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {lead.vehicleOfInterest}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Chat */}
        {selectedLead ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium mr-3">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{selectedLead.name}</h3>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">{selectedLead.phone}</span>
                    <span className={`ml-2 w-2 h-2 rounded-full ${isWhatsappConnected ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-crm-primary" />
                </div>
              ) : messagesError ? (
                <div className="flex justify-center items-center h-full text-red-500">
                  Erro ao carregar mensagens
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400">
                  Nenhuma mensagem encontrada
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isIncoming ? "" : "justify-end"}`}
                    >
                      <div
                        className={message.isIncoming ? "chat-bubble-incoming" : "chat-bubble-outgoing"}
                      >
                        {message.content}
                        <div className={`text-xs ${message.isIncoming ? "text-gray-500" : "text-gray-600"} mt-1 flex justify-end items-center`}>
                          {formatTime(message.timestamp)}
                          {!message.isIncoming && (
                            <Check className="h-3 w-3 ml-1 text-crm-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                  <Smile className="h-5 w-5 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                  <PaperclipIcon className="h-5 w-5 text-gray-500" />
                </Button>
                <Input
                  placeholder={isWhatsappConnected ? "Digite uma mensagem..." : "Conecte-se ao WhatsApp para enviar mensagens"}
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={!isWhatsappConnected}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                {messageInput.trim() && isWhatsappConnected ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-9 w-9 p-0 bg-crm-primary text-white"
                    onClick={handleSendMessage}
                    disabled={!isWhatsappConnected}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-9 w-9 p-0"
                    disabled={!isWhatsappConnected}
                  >
                    <Mic className="h-5 w-5 text-gray-500" />
                  </Button>
                )}
              </div>
              {!isWhatsappConnected && (
                <div className="mt-2 text-center text-sm text-red-500">
                  Conecte-se ao WhatsApp para enviar mensagens
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Selecione um contato</h3>
              <p className="text-gray-500">Escolha um lead para iniciar a conversa</p>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </Layout>
  );
};

export default ChatPage;
