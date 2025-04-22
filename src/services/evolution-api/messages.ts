
import { Lead, Message } from "@/types";
import { EvolutionAPIMessage, SendMessageRequest } from "@/types/evolution-api";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast-helper";
import { makeRequest } from "./request";

export async function sendMessage(lead: Lead, content: string): Promise<Message | null> {
  try {
    const { instanceName } = await import("./config").then(m => m.getEvolutionConfig());
    const phone = lead.phone.replace(/\D/g, '');
    
    const payload: SendMessageRequest = {
      number: phone,
      body: content,
      options: {
        delay: 1200,
        presence: 'composing'
      }
    };
    
    const response = await makeRequest(`message/text/${instanceName}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    if (response.key) {
      const newMessage: Message = {
        id: response.key.id,
        leadId: lead.id,
        content: content,
        type: "text",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        status: "sent"
      };
      
      showSuccessToast("Mensagem enviada com sucesso");
      return newMessage;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to send message:", error);
    showErrorToast("Falha ao enviar mensagem");
    return null;
  }
}

export async function getMessages(lead: Lead, limit: number = 50): Promise<Message[]> {
  try {
    const { instanceName } = await import("./config").then(m => m.getEvolutionConfig());
    const phone = lead.phone.replace(/\D/g, '');
    
    // Updated endpoints list with the new endpoint first - prioritizing it
    const endpoints = [
      `chat/findChats/${instanceName}?number=${phone}&limit=${limit}`,
      `instance/fetchMessages/${instanceName}?number=${phone}&limit=${limit}`,
      `message/fetch/${instanceName}/${phone}?limit=${limit}`,
      `fetch/messages/${instanceName}/${phone}?limit=${limit}`,
      `messages/conversation/${instanceName}/${phone}?count=${limit}`
    ];
    
    let response = null;
    let error = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying to fetch messages using endpoint: ${endpoint}`);
        response = await makeRequest(endpoint);
        console.log("Messages response from endpoint:", endpoint, response);
        if (response && (response.messages || response.data || response.conversation || response.chats)) {
          console.log("Found valid messages response format");
          break; // We got a valid response, exit the loop
        }
      } catch (err) {
        console.log(`Endpoint ${endpoint} failed:`, err);
        error = err;
      }
    }
    
    if (!response) {
      console.error("All message endpoints failed:", error);
      return [];
    }
    
    // Handle different response formats
    const messageArray = response.messages || response.data || response.conversation || response.chats || [];
    console.log("Extracted messages array:", messageArray);
    
    if (messageArray.length === 0) {
      console.log("No messages found in the response");
      return [];
    }
    
    // Convert Evolution API messages to our app's Message format
    const formattedMessages = messageArray.map((msg: any) => {
      console.log("Processing message:", msg);
      
      // Extract message content from various possible structures
      const content = msg.body || 
                     msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     msg.content ||
                     "";
      
      // Extract message type
      const type = msg.type === 'chat' ? 'text' : (msg.type || 'text');
      
      // Extract if message is incoming
      const isIncoming = typeof msg.fromMe === 'boolean' ? !msg.fromMe : (msg.direction === 'incoming');
      
      // Extract timestamp
      const timestamp = msg.timestamp ? new Date(msg.timestamp * 1000).toISOString() : new Date().toISOString();
      
      // Create message object
      return {
        id: msg.id || msg.key?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        leadId: lead.id,
        content: content,
        type: type,
        fileUrl: msg.mediaUrl,
        isIncoming: isIncoming,
        timestamp: timestamp,
        status: msg.status || "delivered"
      };
    });
    
    console.log("Formatted messages:", formattedMessages);
    return formattedMessages;
    
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    showErrorToast("Falha ao obter mensagens");
    return [];
  }
}
