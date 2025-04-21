
import { useState, useEffect } from 'react';
import { evolutionAPIService } from '@/services/evolution-api';
import { EvolutionAPIInstance } from '@/types/evolution-api';
import { showErrorToast, showSuccessToast } from '@/components/ui/toast-helper';

export function useWhatsappConnection() {
  const [instance, setInstance] = useState<EvolutionAPIInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const instanceData = await evolutionAPIService.getInstance();
      setInstance(instanceData);
      
      if (instanceData.status === 'connecting' && instanceData.qrcode) {
        setQrCode(instanceData.qrcode);
      } else {
        setQrCode(null);
      }
      
      return instanceData;
    } catch (error) {
      console.error("Failed to check connection:", error);
      setInstance(null);
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    try {
      setLoading(true);
      
      // Create instance if it doesn't exist
      if (!instance) {
        await evolutionAPIService.createInstance();
      }
      
      // Connect and get QR code
      const qrcode = await evolutionAPIService.connectInstance();
      setQrCode(qrcode);
      
      if (!qrcode && instance?.status === 'connected') {
        showSuccessToast("WhatsApp conectado com sucesso!");
      }
      
      await checkConnection();
    } catch (error) {
      console.error("Failed to connect:", error);
      showErrorToast("Falha ao conectar com o WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setLoading(true);
      const result = await evolutionAPIService.disconnectInstance();
      
      if (result) {
        showSuccessToast("WhatsApp desconectado com sucesso!");
        setInstance(prev => prev ? { ...prev, status: 'disconnected' } : null);
        setQrCode(null);
      } else {
        showErrorToast("Falha ao desconectar WhatsApp");
      }
      
      await checkConnection();
    } catch (error) {
      console.error("Failed to disconnect:", error);
      showErrorToast("Falha ao desconectar WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check connection on component mount
    checkConnection();
    
    // Setup periodic connection check
    const interval = setInterval(checkConnection, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    instance,
    loading,
    qrCode,
    isConnected: instance?.status === 'connected',
    connect,
    disconnect,
    checkConnection
  };
}
