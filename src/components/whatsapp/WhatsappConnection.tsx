
import React from 'react';
import { useWhatsappConnection } from '@/hooks/use-whatsapp-connection';
import { Button } from '@/components/ui/button';
import { Loader2, Smartphone, QrCode, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface WhatsappConnectionProps {
  onConnectionStateChange?: (isConnected: boolean) => void;
}

const WhatsappConnection: React.FC<WhatsappConnectionProps> = ({ onConnectionStateChange }) => {
  const { 
    instance, 
    loading, 
    qrCode, 
    isConnected, 
    connect, 
    disconnect 
  } = useWhatsappConnection();
  const [showQrDialog, setShowQrDialog] = React.useState(false);
  
  // Show QR dialog when qrCode is available
  React.useEffect(() => {
    if (qrCode) {
      setShowQrDialog(true);
    } else {
      setShowQrDialog(false);
    }
  }, [qrCode]);
  
  // Notify parent component about connection state changes
  React.useEffect(() => {
    if (onConnectionStateChange) {
      onConnectionStateChange(isConnected);
    }
  }, [isConnected, onConnectionStateChange]);

  const handleConnect = () => {
    connect();
    setShowQrDialog(true);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <span className="text-sm">
          {loading ? 'Verificando conexão...' : 
           isConnected ? 'WhatsApp conectado' : 'WhatsApp desconectado'}
        </span>
        {loading ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : isConnected ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnect} 
            className="ml-2"
          >
            Desconectar
          </Button>
        ) : (
          <Button 
            className="bg-crm-primary ml-2" 
            size="sm" 
            onClick={handleConnect}
          >
            Conectar
          </Button>
        )}
      </div>
      
      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code com seu WhatsApp para conectar
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center">
            {qrCode ? (
              <div className="bg-white p-4 rounded-md">
                <img 
                  src={`data:image/png;base64,${qrCode}`} 
                  alt="WhatsApp QR Code" 
                  className="w-64 h-64"
                />
              </div>
            ) : loading ? (
              <div className="py-12 flex flex-col items-center">
                <Loader2 className="h-16 w-16 animate-spin text-crm-primary mb-4" />
                <p className="text-gray-500">Gerando QR Code...</p>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center">
                <Smartphone className="h-16 w-16 text-crm-primary mb-4" />
                {isConnected ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-green-500 mb-2">
                      <Check className="h-6 w-6 mr-2" />
                      <span className="font-medium">WhatsApp Conectado</span>
                    </div>
                    <p className="text-gray-500">Você já está conectado ao WhatsApp</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-red-500 mb-2">
                      <X className="h-6 w-6 mr-2" />
                      <span className="font-medium">Não Conectado</span>
                    </div>
                    <p className="text-gray-500">Clique em conectar para gerar um QR Code</p>
                    <Button 
                      className="bg-crm-primary mt-4"
                      onClick={handleConnect}
                    >
                      Conectar WhatsApp
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatsappConnection;
