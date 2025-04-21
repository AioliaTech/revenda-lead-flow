
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, Check, X } from "lucide-react";
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

const SettingsPage: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [columns, setColumns] = useState<KanbanColumn[]>(mockKanbanColumns);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const [showQRCode, setShowQRCode] = useState(false);
  
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
            <Button className="bg-crm-primary gap-2">
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
                        onPressedChange={() => {
                          // Toggle status in real app
                        }}
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
                  <Button variant="outline">Desconectar</Button>
                  <Button 
                    className="bg-crm-primary"
                    onClick={() => setShowQRCode(!showQRCode)}
                  >
                    Reconectar
                  </Button>
                </CardFooter>
                {showQRCode && (
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
                    <Input value={column.title} className="flex-1" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Restaurar Padrões</Button>
              <Button className="bg-crm-primary">Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-medium">Usuários</h2>
              <p className="text-gray-500">Gerencie os usuários e suas permissões</p>
            </div>
            <Button className="bg-crm-primary gap-2">
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
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="ghost" size="sm" className="text-crm-danger">
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
    </Layout>
  );
};

export default SettingsPage;
