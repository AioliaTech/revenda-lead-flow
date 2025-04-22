
import { toast } from "@/hooks/use-toast";
import { 
  EvolutionAPIInstance, 
  EvolutionAPIMessage, 
  EvolutionAPIContact,
  SendMessageRequest
} from "@/types/evolution-api";
import { EVOLUTION_API_CONFIG } from "@/config/evolution-api";
import { Lead, Message } from "@/types";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast-helper";

class EvolutionAPIService {
  private baseURL: string;
  private token: string;
  private instanceName: string;

  constructor() {
    this.baseURL = EVOLUTION_API_CONFIG.baseURL;
    this.token = EVOLUTION_API_CONFIG.defaultToken;
    this.instanceName = EVOLUTION_API_CONFIG.defaultInstance;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}/${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'apikey': this.token,
      ...options.headers
    };

    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error("Evolution API request failed:", error);
      showErrorToast("Falha na comunicação com a API do WhatsApp");
      throw error;
    }
  }

  // Instance management
  async getInstance(): Promise<EvolutionAPIInstance> {
    try {
      const result = await this.request(`instance/connectionState/${this.instanceName}`);
      console.log("getInstance response:", result);
      
      // Check if there's a QR code available
      let qrcode = undefined;
      
      // The state 'open' typically means the instance is connected
      const connectedState = result.instance?.state === 'open';
      
      return {
        instanceName: this.instanceName,
        token: this.token,
        status: connectedState ? 'connected' : 'disconnected',
        qrcode: qrcode
      };
    } catch (error) {
      console.error("Failed to get instance status:", error);
      return {
        instanceName: this.instanceName,
        token: this.token,
        status: 'disconnected'
      };
    }
  }

  async createInstance(): Promise<EvolutionAPIInstance> {
    try {
      const result = await this.request('instance/create', {
        method: 'POST',
        body: JSON.stringify({
          instanceName: this.instanceName,
          token: this.token,
          webhook: null,
        })
      });
      
      console.log("Create instance response:", result);
      return this.getInstance();
    } catch (error) {
      console.error("Failed to create instance:", error);
      return {
        instanceName: this.instanceName,
        token: this.token,
        status: 'disconnected'
      };
    }
  }

  async connectInstance(): Promise<string | null> {
    try {
      // First check if instance exists
      const instanceCheck = await this.getInstance();
      
      // For Evolution API, we need to use the correct endpoint to generate a QR code
      // Based on the API logs, let's try a different endpoint
      if (instanceCheck.status !== 'connected') {
        try {
          // Try the qrcode endpoint directly if connect doesn't work
          const response = await this.request(`instance/qrcode/${this.instanceName}`, {
            method: 'GET'
          });
          
          console.log("QR code response:", response);
          
          // Return the QR code if available
          if (response && response.qrcode) {
            return response.qrcode;
          }
        } catch (qrError) {
          console.error("Failed to get QR code:", qrError);
        }
      }
      
      // If we get here either we're already connected or no QR was generated
      return null;
    } catch (error) {
      console.error("Failed to connect instance:", error);
      return null;
    }
  }

  async disconnectInstance(): Promise<boolean> {
    try {
      // Try the logout endpoint for Evolution API
      await this.request(`instance/logout/${this.instanceName}`, {
        method: 'POST'
      });
      return true;
    } catch (error) {
      console.error("Failed to disconnect instance:", error);
      return false;
    }
  }

  // Messages
  async sendMessage(lead: Lead, content: string): Promise<Message | null> {
    try {
      const phone = lead.phone.replace(/\D/g, '');
      
      const payload: SendMessageRequest = {
        number: phone,
        body: content,
        options: {
          delay: 1200,
          presence: 'composing'
        }
      };
      
      const response = await this.request(`message/text/${this.instanceName}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (response.key) {
        // Create a message object that matches our app's Message type
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

  async getMessages(lead: Lead, limit: number = 50): Promise<Message[]> {
    try {
      const phone = lead.phone.replace(/\D/g, '');
      
      // Try one of these endpoints based on Evolution API version
      // Some versions use v1/messages/conversation, others might use chat/history
      let response;
      try {
        response = await this.request(`v1/messages/conversation/${this.instanceName}/${phone}?limit=${limit}`);
      } catch (err) {
        console.log("First endpoint failed, trying fallback...");
        response = await this.request(`chat/history/${this.instanceName}?number=${phone}&limit=${limit}`);
      }
      
      console.log("Messages response:", response);
      
      if (Array.isArray(response.messages)) {
        // Convert Evolution API messages to our app's Message format
        return response.messages.map((msg: EvolutionAPIMessage) => ({
          id: msg.id,
          leadId: lead.id,
          content: msg.body,
          type: msg.type === 'chat' ? 'text' : msg.type,
          fileUrl: msg.mediaUrl,
          isIncoming: !msg.fromMe,
          timestamp: new Date(msg.timestamp * 1000).toISOString(),
          status: msg.status
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      showErrorToast("Falha ao obter mensagens");
      return [];
    }
  }

  // Webhook setup for real-time messages
  async setupWebhook(webhookUrl: string): Promise<boolean> {
    try {
      await this.request(`webhook/set/${this.instanceName}`, {
        method: 'POST',
        body: JSON.stringify({
          url: webhookUrl,
          events: ["messages.upsert", "status.instance"]
        })
      });
      return true;
    } catch (error) {
      console.error("Failed to set webhook:", error);
      return false;
    }
  }
}

export const evolutionAPIService = new EvolutionAPIService();
