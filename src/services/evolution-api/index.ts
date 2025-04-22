
import { Lead, Message } from "@/types";
import { EvolutionAPIInstance } from "@/types/evolution-api";
import { getContacts } from "./contacts";
import { createInstance, getInstance, connectInstance, disconnectInstance } from "./instance";
import { getMessages, sendMessage } from "./messages";

// Export the combined API
export const evolutionAPIService = {
  getInstance,
  createInstance,
  connectInstance,
  disconnectInstance,
  getContacts,
  getMessages,
  sendMessage,
  
  // Webhook setup for real-time messages
  async setupWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const { instanceName } = await import("./config").then(m => m.getEvolutionConfig());
      const { makeRequest } = await import("./request");
      
      await makeRequest(`webhook/set/${instanceName}`, {
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
};
