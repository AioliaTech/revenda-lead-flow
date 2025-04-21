
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, Check, X, Save, Edit, Trash2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockChannels, mockKanbanColumns, mockUsers } from "../services/mockData";
import { Channel, KanbanColumn, User } from "../types";
import { Toggle } from "@/components/ui/toggle";
import { showSuccessToast, showConfirmationToast } from "@/components/ui/toast-helper";
import { Toaster } from "@/components/ui/toaster";

const SettingsPage: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [columns, setColumns] = useState<KanbanColumn[]>(mockKanbanColumns);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Toggle channel status
  const handleToggleChannel = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, isActive: !channel.isActive } 
        : channel
    ));
    
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      showSuccessToast(`Canal ${channel.isActive ? 'desativado' : 'ativado'} com sucesso!`);
    }
  };

  // Disconnect channel
  const handleDisconnectChannel = (channelId: string) => {
    showConfirmationToast(
      "Tem certeza que deseja desconectar este canal?",
      () => {
        setChannels(channels.map(channel => 
          channel.id === channelId 
            ? { ...channel, isActive: false } 
            : channel
        ));
        showSuccessToast("Canal desconectado com sucesso!");
      }
    );
  };

  // Reconnect channel
  const handleReconnectChannel = (channelId: string) => {
    setShowQRCode(channelId);
    // In a real app, this would initiate the QR code generation process
  };

  // Edit column
  const startEditColumn = (column: KanbanColumn) => {
    setEditingColumnId(column.id);
    setEditingColumnTitle(column.title);
  };

  const saveEditColumn = (columnId: string) => {
    if (editingColumnTitle.trim() === "") return;
    
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, title: editingColumnTitle } 
        : col
    ));
    
    setEditingColumnId(null);
    setEditingColumnTitle("");
    showSuccessToast("Coluna atualizada com sucesso!");
  };

  const cancelEditColumn = () => {
    setEditingColumnId(null);
    setEditingColumnTitle("");
  };

  // Delete column
  const handleDeleteColumn = (columnId: string) => {
    showConfirmationToast(
      "Tem certeza que deseja excluir esta coluna?",
      () => {
        setColumns(columns.filter(col => col.id !== columnId));
        showSuccessToast("Coluna excluída com sucesso!");
      }
    );
  };

  // Save all column changes
  const saveColumnChanges = () => {
    // In a real app, this would send the updated columns to the server
    showSuccessToast("Alterações salvas com sucesso!");
  };

  // Restore default columns
  const restoreDefaultColumns = () => {
    showConfirmationToast(
      "Tem certeza que deseja restaurar as colunas padrão?",
      () => {
        setColumns(mockKanbanColumns);
        showSuccessToast("Colunas padrão restauradas com sucesso!");
      }
    );
  };

  // User management
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowAddUserDialog(true);
    // In a real app, this would open a form pre-filled with user data
  };

  const handleRemoveUser = (userId: string) => {
    showConfirmationToast(
      "Tem certeza que deseja remover este usuário?",
      () => {
        setUsers(users.filter(user => user.id !== userId));
        showSuccessToast("Usuário removido com sucesso!");
      }
    );
  };
  
  return (
    <Layout title="Configurações">
      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="whatsapp">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-medium">Canais WhatsApp</h2>
            <Button 
              className="bg-crm-primary gap-2"
              onClick={() => {
                // In a real app, this would open a form to configure a new channel
                showSuccessToast("Iniciando configuração de novo canal...");
              }}
            >
              <Plus className="h-4 w-4" /> Conectar Novo Canal
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map(channel => (
              <Card key={channel.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{channel.name}</CardTitle>
                      <CardDescription>{channel.phoneNumber}</CardDescription>
                    </div>
                    <div>
                      <Toggle
                        pressed={channel.isActive}
                        onPressedChange={() => handleToggleChannel(channel.id)}
                      >
                        {channel.isActive ? "Ativo" : "Inativo"}
                      </Toggle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Smartphone className="h-12 w-12 text-crm-primary" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {channel.isActive 
                          ? "Canal conectado e funcionando normalmente."
                          : "Canal desconectado. Clique em reconectar para ativar."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => handleDisconnectChannel(channel.id)}
                  >
                    Desconectar
                  </Button>
                  <Button 
                    className="bg-crm-primary"
                    onClick={() => handleReconnectChannel(channel.id)}
                  >
                    Reconectar
                  </Button>
                </CardFooter>
                {showQRCode === channel.id && (
                  <div className="px-6 pb-6">
                    <div className="border rounded-md p-4">
                      <div className="mb-4 text-center">
                        <h3 className="text-lg font-medium mb-1">Escaneie o QR Code</h3>
                        <p className="text-sm text-gray-500">Abra o WhatsApp no seu celular e escaneie o código</p>
                      </div>
                      <div className="bg-gray-100 h-64 mb-4 flex items-center justify-center">
                        {/* In a real app, the QR code would be generated dynamically */}
                        <div className="border-2 border-gray-300 w-48 h-48 relative">
                          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                            {Array(16).fill(0).map((_, i) => (
                              <div 
                                key={i} 
                                className={`${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-transparent'}`}
                              ></div>
                            ))}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1/3 h-1/3 border-8 border-white bg-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">O QR Code expira em <span className="font-medium">1:30</span></p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowQRCode(null)}
                        >
                          Fechar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="kanban">
          <div className="mb-6">
            <h2 className="text-2xl font-medium">Configurações do Kanban</h2>
            <p className="text-gray-500">Configure as colunas e visualização do seu funil de vendas</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Colunas do Kanban</CardTitle>
              <CardDescription>Altere a ordem e os nomes das colunas conforme necessário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {columns.map((column, index) => (
                  <div key={column.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <div className="text-gray-500 font-medium">{index + 1}</div>
                    {editingColumnId === column.id ? (
                      <Input 
                        value={editingColumnTitle} 
                        onChange={(e) => setEditingColumnTitle(e.target.value)}
                        className="flex-1" 
                      />
                    ) : (
                      <Input value={column.title} className="flex-1" readOnly />
                    )}
                    {editingColumnId === column.id ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => saveEditColumn(column.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={cancelEditColumn}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => startEditColumn(column)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-crm-danger"
                          onClick={() => handleDeleteColumn(column.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button 
                variant="outline"
                onClick={restoreDefaultColumns}
              >
                Restaurar Padrões
              </Button>
              <Button 
                className="bg-crm-primary"
                onClick={saveColumnChanges}
              >
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-medium">Usuários</h2>
              <p className="text-gray-500">Gerencie os usuários e suas permissões</p>
            </div>
            <Button 
              className="bg-crm-primary gap-2"
              onClick={() => setShowAddUserDialog(true)}
            >
              <Plus className="h-4 w-4" /> Adicionar Usuário
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>Gerencie acesso e permissões dos usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-crm-primary rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {user.role === 'admin' ? 'Administrador' : 
                         user.role === 'manager' ? 'Gerente' : 'Vendedor'}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-crm-danger"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </Layout>
  );
};

export default SettingsPage;
