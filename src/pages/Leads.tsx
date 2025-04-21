import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Edit, Trash2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockLeads, mockTags, mockKanbanColumns } from "../services/mockData";
import { Lead, Tag } from "../types";
import { showSuccessToast, showConfirmationToast } from "@/components/ui/toast-helper";
import { Toaster } from "@/components/ui/toaster";

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for new leads
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    cpf: "",
    birthDate: "",
    source: "",
    vehicleOfInterest: "",
    paymentMethod: "cash" as "cash" | "trade" | "financing",
    tradeInfo: {
      model: "",
      year: "",
      km: "",
      downPayment: "",
    },
    financingInfo: {
      downPayment: "",
    },
    notes: "",
  });
  
  const [showTradeFields, setShowTradeFields] = useState(false);
  const [showFinancingFields, setShowFinancingFields] = useState(false);
  
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.vehicleOfInterest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, string>),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      
      if (name === "paymentMethod") {
        setShowTradeFields(value === "trade");
        setShowFinancingFields(value === "financing");
      }
    }
  };
  
  const getTagBadge = (tag: Tag) => (
    <span 
      key={tag.id} 
      className="tag"
      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
    >
      {tag.name}
    </span>
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedLead) {
      // Update existing lead
      const updatedLeads = leads.map(lead => 
        lead.id === selectedLead.id
          ? {
              ...lead,
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              cpf: formData.cpf,
              birthDate: formData.birthDate,
              source: formData.source,
              vehicleOfInterest: formData.vehicleOfInterest,
              paymentMethod: formData.paymentMethod,
              tradeInfo: formData.tradeInfo,
              financingInfo: formData.financingInfo,
              notes: formData.notes,
              updatedAt: new Date().toISOString()
            }
          : lead
      );
      
      setLeads(updatedLeads);
      showSuccessToast("Lead atualizado com sucesso!");
    } else {
      // Add new lead
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        source: formData.source,
        vehicleOfInterest: formData.vehicleOfInterest,
        paymentMethod: formData.paymentMethod,
        tradeInfo: formData.tradeInfo,
        financingInfo: formData.financingInfo,
        notes: formData.notes,
        tags: [],
        status: "novo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setLeads([...leads, newLead]);
      showSuccessToast("Lead adicionado com sucesso!");
    }
    
    resetForm();
  };
  
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      address: lead.address || "",
      cpf: lead.cpf || "",
      birthDate: lead.birthDate || "",
      source: lead.source || "",
      vehicleOfInterest: lead.vehicleOfInterest,
      paymentMethod: lead.paymentMethod,
      tradeInfo: lead.tradeInfo || {
        model: "",
        year: "",
        km: "",
        downPayment: ""
      },
      financingInfo: lead.financingInfo || {
        downPayment: ""
      },
      notes: lead.notes || ""
    });
    
    setShowTradeFields(lead.paymentMethod === "trade");
    setShowFinancingFields(lead.paymentMethod === "financing");
    setIsEditing(true);
    setShowAddLeadDialog(true);
  };
  
  const handleDeleteLead = (leadId: string) => {
    showConfirmationToast(
      "Tem certeza que deseja excluir este lead?",
      () => {
        setLeads(leads.filter(lead => lead.id !== leadId));
        showSuccessToast("Lead excluído com sucesso!");
      }
    );
  };
  
  const handleOpenChat = (leadId: string) => {
    // In a real app, this would navigate to the chat page with this lead
    showSuccessToast("Abrindo chat com o lead...");
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      cpf: "",
      birthDate: "",
      source: "",
      vehicleOfInterest: "",
      paymentMethod: "cash" as "cash" | "trade" | "financing",
      tradeInfo: {
        model: "",
        year: "",
        km: "",
        downPayment: ""
      },
      financingInfo: {
        downPayment: ""
      },
      notes: ""
    });
    
    setShowTradeFields(false);
    setShowFinancingFields(false);
    setIsEditing(false);
    setSelectedLead(null);
    setShowAddLeadDialog(false);
  };
  
  return (
    <Layout title="Leads">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 w-1/2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar lead por nome, telefone ou veículo..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>
        <Button 
          className="bg-crm-primary gap-2" 
          onClick={() => {
            resetForm();
            setShowAddLeadDialog(true);
          }}
        >
          <Plus className="h-4 w-4" /> Adicionar Lead
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Veículo de Interesse</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.vehicleOfInterest}</TableCell>
                <TableCell>
                  {lead.paymentMethod === "cash" ? "À Vista" : 
                   lead.paymentMethod === "trade" ? "Troca" : "Financiamento"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap">
                    {lead.tags.slice(0, 2).map(getTagBadge)}
                    {lead.tags.length > 2 && (
                      <span className="tag bg-gray-100 text-gray-600">
                        +{lead.tags.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: 
                        lead.status === "fechado_ganho" ? "#E3F5E5" : 
                        lead.status === "fechado_perdido" ? "#FEEAEB" : "#E8F2FE",
                      color:
                        lead.status === "fechado_ganho" ? "#2E7D32" : 
                        lead.status === "fechado_perdido" ? "#D32F2F" : "#1A73E8"
                    }}
                  >
                    {mockKanbanColumns.find(col => col.id === lead.status)?.title || ""}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleOpenChat(lead.id)}
                    >
                      <MessageSquare className="h-4 w-4 text-crm-primary" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditLead(lead)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteLead(lead.id)}
                    >
                      <Trash2 className="h-4 w-4 text-crm-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Add/Edit Lead Dialog */}
      <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Lead" : "Adicionar Novo Lead"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Edite os dados do lead existente."
                : "Preencha os dados para adicionar um novo lead ao sistema."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados Cadastrais</h3>
                <div className="form-input-wrapper">
                  <label className="form-label">Nome</label>
                  <input 
                    className="form-input" 
                    placeholder="Nome completo" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">WhatsApp</label>
                  <input 
                    className="form-input" 
                    placeholder="(00) 00000-0000" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">E-mail</label>
                  <input 
                    className="form-input" 
                    placeholder="email@exemplo.com" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">CPF</label>
                  <input 
                    className="form-input" 
                    placeholder="000.000.000-00" 
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Data de Nascimento</label>
                  <input 
                    className="form-input" 
                    placeholder="00/00/0000" 
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Endereço</label>
                  <input 
                    className="form-input" 
                    placeholder="Rua, número, bairro" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados Comerciais</h3>
                <div className="form-input-wrapper">
                  <label className="form-label">Origem do Lead</label>
                  <select 
                    className="form-input"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione a origem</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google">Google</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Site">Site</option>
                  </select>
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Veículo de Interesse</label>
                  <input 
                    className="form-input" 
                    placeholder="Modelo e ano" 
                    name="vehicleOfInterest"
                    value={formData.vehicleOfInterest}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Forma de Pagamento</label>
                  <select 
                    className="form-input"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="cash">À Vista</option>
                    <option value="trade">Troca</option>
                    <option value="financing">Financiamento</option>
                  </select>
                </div>
                
                {showTradeFields && (
                  <div className="space-y-3 p-3 border border-gray-200 rounded-md">
                    <h4 className="font-medium">Informações da Troca</h4>
                    <div className="form-input-wrapper">
                      <label className="form-label">Modelo</label>
                      <input 
                        className="form-input" 
                        placeholder="Modelo do veículo" 
                        name="tradeInfo.model"
                        value={formData.tradeInfo.model}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-input-wrapper">
                      <label className="form-label">Ano</label>
                      <input 
                        className="form-input" 
                        placeholder="Ano do veículo" 
                        name="tradeInfo.year"
                        value={formData.tradeInfo.year}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-input-wrapper">
                      <label className="form-label">KM</label>
                      <input 
                        className="form-input" 
                        placeholder="Quilometragem" 
                        name="tradeInfo.km"
                        value={formData.tradeInfo.km}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-input-wrapper">
                      <label className="form-label">Entrada</label>
                      <input 
                        className="form-input" 
                        placeholder="R$ 0,00" 
                        name="tradeInfo.downPayment"
                        value={formData.tradeInfo.downPayment}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                
                {showFinancingFields && (
                  <div className="form-input-wrapper">
                    <label className="form-label">Entrada</label>
                    <input 
                      className="form-input" 
                      placeholder="R$ 0,00" 
                      name="financingInfo.downPayment"
                      value={formData.financingInfo.downPayment}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                <div className="form-input-wrapper">
                  <label className="form-label">Observações</label>
                  <textarea 
                    className="form-input h-24" 
                    placeholder="Informações adicionais"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowAddLeadDialog(false)}>Cancelar</Button>
              <Button type="submit" className="bg-crm-primary">
                {isEditing ? "Salvar Alterações" : "Adicionar Lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </Layout>
  );
};

export default LeadsPage;
