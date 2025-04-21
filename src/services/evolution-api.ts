
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
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${await response.text()}`);
      }

      return await response.json();
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
      return {
        instanceName: this.instanceName,
        token: this.token,
        status: result.state === 'open' ? 'connected' : 'disconnected',
        qrcode: result.state === 'pending' ? result.qrcode : undefined
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
      await this.request('instance/create', {
        method: 'POST',
        body: JSON.stringify({
          instanceName: this.instanceName,
          token: this.token,
          webhook: null,
        })
      });
      
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
      const response = await this.request(`instance/connect/${this.instanceName}`, {
        method: 'POST'
      });
      
      if (response.qrcode) {
        return response.qrcode;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Failed to connect instance:", error);
      return null;
    }
  }

  async disconnectInstance(): Promise<boolean> {
    try {
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
      
      const response = await this.request(`chat/fetchMessages/${this.instanceName}?number=${phone}&limit=${limit}`);
      
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
