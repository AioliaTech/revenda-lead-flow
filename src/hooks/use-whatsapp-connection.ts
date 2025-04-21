
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
      console.log("Checking connection, instance data:", instanceData);
      setInstance(instanceData);
      
      if (instanceData.status === 'connecting' && instanceData.qrcode) {
        console.log("QR code available:", instanceData.qrcode);
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
        const createdInstance = await evolutionAPIService.createInstance();
        console.log("Instance created:", createdInstance);
      }
      
      // Connect and get QR code
      console.log("Connecting to WhatsApp...");
      const qrcode = await evolutionAPIService.connectInstance();
      console.log("Got QR code:", qrcode);
      
      if (qrcode) {
        setQrCode(qrcode);
        showSuccessToast("QR Code gerado com sucesso!");
      } else if (instance?.status === 'connected') {
        showSuccessToast("WhatsApp conectado com sucesso!");
      } else {
        showErrorToast("Falha ao gerar QR Code");
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
