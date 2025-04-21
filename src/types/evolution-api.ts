
export interface EvolutionAPIInstance {
  instanceName: string;
  token: string;
  status: 'connected' | 'connecting' | 'disconnected';
  qrcode?: string;
}

export interface EvolutionAPIMessage {
  id: string;
  fromMe: boolean;
  to: string;
  from: string;
  body: string;
  type: 'chat' | 'image' | 'video' | 'audio' | 'document';
  timestamp: number;
  status: 'pending' | 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  caption?: string;
}

export interface EvolutionAPIContact {
  id: string;
  name: string;
  pushname: string;
  phone: string;
}

export interface SendMessageRequest {
  number: string;
  body: string;
  options?: {
    delay?: number;
    presence?: 'composing' | 'recording' | 'available';
    linkPreview?: boolean;
  };
}
