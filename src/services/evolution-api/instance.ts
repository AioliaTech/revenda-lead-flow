
import { EvolutionAPIInstance } from "@/types/evolution-api";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast-helper";
import { makeRequest } from "./request";

// Instance management methods
export const getInstance = async (): Promise<EvolutionAPIInstance> => {
  try {
    const { instanceName, token } = await import("./config").then(m => m.getEvolutionConfig());
    const result = await makeRequest(`instance/fetchInstances/${instanceName}`);
    console.log("getInstance response:", result);
    
    // Check connection state
    let state = result?.data?.state || "disconnected";
    const connectedState = state === 'open' || state === 'connected';
    
    return {
      instanceName,
      token,
      status: connectedState ? 'connected' : 'disconnected',
      qrcode: undefined
    };
  } catch (error) {
    console.error("Failed to get instance status:", error);
    const { instanceName, token } = await import("./config").then(m => m.getEvolutionConfig());
    return {
      instanceName,
      token,
      status: 'disconnected'
    };
  }
};

export const createInstance = async (): Promise<EvolutionAPIInstance> => {
  try {
    const { instanceName, token } = await import("./config").then(m => m.getEvolutionConfig());
    
    const result = await makeRequest('instance/create', {
      method: 'POST',
      body: JSON.stringify({
        instanceName,
        token,
        webhook: null,
      })
    });
    
    console.log("Create instance response:", result);
    return getInstance();
  } catch (error) {
    console.error("Failed to create instance:", error);
    const { instanceName, token } = await import("./config").then(m => m.getEvolutionConfig());
    return {
      instanceName,
      token,
      status: 'disconnected'
    };
  }
};

export const connectInstance = async (): Promise<string | null> => {
  try {
    // First check if instance exists
    const instanceCheck = await getInstance();
    const { instanceName } = await import("./config").then(m => m.getEvolutionConfig());
    
    // If not connected, try to generate QR code
    if (instanceCheck.status !== 'connected') {
      try {
        // Try standard QR code endpoint for Evolution API
        const response = await makeRequest(`instance/qr/${instanceName}?image=true`, {
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
};

export const disconnectInstance = async (): Promise<boolean> => {
  try {
    const { instanceName } = await import("./config").then(m => m.getEvolutionConfig());
    
    // Try different logout endpoints until one works
    try {
      await makeRequest(`instance/logout/${instanceName}`, { method: 'POST' });
      return true;
    } catch (err1) {
      console.log("First logout attempt failed, trying alternative:", err1);
      try {
        // Some Evolution API versions use different endpoints
        await makeRequest(`instance/delete/${instanceName}`, { method: 'DELETE' });
        return true;
      } catch (err2) {
        console.error("All logout attempts failed:", err2);
        return false;
      }
    }
  } catch (error) {
    console.error("Failed to disconnect instance:", error);
    return false;
  }
};
