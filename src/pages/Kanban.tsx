
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Edit, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockKanbanColumns, mockLeads, mockTags, getLeadsForColumn } from "../services/mockData";
import { KanbanColumn, Lead, Tag } from "../types";
import { showSuccessToast, showConfirmationToast } from "@/components/ui/toast-helper";
import { Toaster } from "@/components/ui/toaster";

const KanbanPage: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(mockKanbanColumns);
  const [editMode, setEditMode] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditingLead, setIsEditingLead] = useState(false);
  
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  
  // New column being created
  const [newColumnTitle, setNewColumnTitle] = useState("");
  
  // Column being edited
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  
  // New lead being created
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    cpf: "",
    birthDate: "",
    address: "",
    source: "",
    vehicleOfInterest: "",
    paymentMethod: "cash" as "cash" | "trade" | "financing", // Updated type
    status: "",
    notes: "",
  });
  
  const handleDragStart = (leadId: string, columnId: string) => {
    setDraggedLead(leadId);
    setDraggedColumn(columnId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (columnId: string) => {
    if (draggedLead && draggedColumn) {
      // If dropped in the same column, do nothing
      if (draggedColumn === columnId) {
        setDraggedLead(null);
        setDraggedColumn(null);
        return;
      }
      
      // Find the lead being moved
      const lead = mockLeads.find(l => l.id === draggedLead);
      
      if (lead) {
        // Update lead's status
        lead.status = columnId;
        
        // Remove from source column
        const updatedColumns = columns.map(col => {
          if (col.id === draggedColumn) {
            return {
              ...col,
              leadIds: col.leadIds.filter(id => id !== draggedLead)
            };
          }
          return col;
        });
        
        // Add to target column
        const finalColumns = updatedColumns.map(col => {
          if (col.id === columnId) {
            return {
              ...col,
              leadIds: [...col.leadIds, draggedLead]
            };
          }
          return col;
        });
        
        setColumns(finalColumns);
        showSuccessToast(`Lead movido para ${columns.find(col => col.id === columnId)?.title}`);
      }
      
      setDraggedLead(null);
      setDraggedColumn(null);
    }
  };
  
  const handleAddColumn = () => {
    if (newColumnTitle.trim() === "") return;
    
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
      leadIds: []
    };
    
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
    showSuccessToast("Coluna adicionada com sucesso!");
  };
  
  const handleRemoveColumn = (columnId: string) => {
    showConfirmationToast(
      "Tem certeza que deseja excluir esta coluna?",
      () => {
        // Check if column has leads
        const column = columns.find(col => col.id === columnId);
        if (column && column.leadIds.length > 0) {
          showSuccessToast("Remova todos os leads desta coluna antes de excluí-la.");
          return;
        }
        
        setColumns(columns.filter(col => col.id !== columnId));
        showSuccessToast("Coluna excluída com sucesso!");
      }
    );
  };
  
  const handleEditColumnStart = (column: KanbanColumn) => {
    setEditingColumnId(column.id);
    setEditingColumnTitle(column.title);
  };
  
  const handleEditColumnSave = (columnId: string) => {
    if (editingColumnTitle.trim() === "") return;
    
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return { ...col, title: editingColumnTitle };
      }
      return col;
    }));
    
    setEditingColumnId(null);
    setEditingColumnTitle("");
    showSuccessToast("Coluna atualizada com sucesso!");
  };
  
  const handleEditColumnCancel = () => {
    setEditingColumnId(null);
    setEditingColumnTitle("");
  };
  
  const getTagBadge = (tag: Tag) => {
    return (
      <span 
        key={tag.id} 
        className="tag"
        style={{ backgroundColor: `${tag.color}20`, color: tag.color, borderColor: tag.color }}
      >
        {tag.name}
      </span>
    );
  };
  
  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };
  
  const handleEditLead = () => {
    if (selectedLead) {
      setIsEditingLead(true);
      setFormData({
        name: selectedLead.name,
        phone: selectedLead.phone,
        email: selectedLead.email || "",
        cpf: selectedLead.cpf || "",
        birthDate: selectedLead.birthDate || "",
        address: selectedLead.address || "",
        source: selectedLead.source || "",
        vehicleOfInterest: selectedLead.vehicleOfInterest,
        paymentMethod: selectedLead.paymentMethod,
        status: selectedLead.status,
        notes: selectedLead.notes || "",
      });
    }
  };
  
  const handleOpenLeadChat = () => {
    // In a real app, this would navigate to the chat with this lead
    showSuccessToast("Abrindo chat com o lead...");
    setSelectedLead(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditingLead && selectedLead) {
      // Update existing lead
      const updatedLead = {
        ...selectedLead,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        address: formData.address,
        source: formData.source,
        vehicleOfInterest: formData.vehicleOfInterest,
        paymentMethod: formData.paymentMethod,
        status: formData.status || selectedLead.status,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, we would update the lead in the database
      showSuccessToast("Lead atualizado com sucesso!");
      
      setSelectedLead(null);
      setIsEditingLead(false);
    } else {
      // Create new lead
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        address: formData.address,
        source: formData.source,
        vehicleOfInterest: formData.vehicleOfInterest,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        notes: formData.notes,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add lead to selected column
      const updatedColumns = columns.map(col => {
        if (col.id === newLead.status) {
          return {
            ...col,
            leadIds: [...col.leadIds, newLead.id]
          };
        }
        return col;
      });
      
      setColumns(updatedColumns);
      
      // In a real app, we would add the lead to the database
      mockLeads.push(newLead);
      
      showSuccessToast("Lead adicionado com sucesso!");
    }
    
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      cpf: "",
      birthDate: "",
      address: "",
      source: "",
      vehicleOfInterest: "",
      paymentMethod: "cash" as "cash" | "trade" | "financing", // Updated type
      status: "",
      notes: "",
    });
    setShowAddLeadForm(false);
    setIsEditingLead(false);
  };
  
  const toggleEditMode = () => {
    if (editMode) {
      // Save changes when exiting edit mode
      showSuccessToast("Alterações salvas com sucesso!");
    }
    setEditMode(!editMode);
  };
  
  return (
    <Layout title="Kanban">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Button 
            className="bg-crm-primary"
            onClick={() => {
              resetForm();
              setShowAddLeadForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>
        <Button 
          variant={editMode ? "destructive" : "outline"} 
          onClick={toggleEditMode}
        >
          {editMode ? "Finalizar Edição" : "Editar Colunas"}
        </Button>
      </div>
      
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {columns.map((column) => {
          const columnLeads = getLeadsForColumn(column);
          
          return (
            <div 
              key={column.id} 
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex justify-between items-center mb-3">
                {editingColumnId === column.id ? (
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={editingColumnTitle} 
                      onChange={(e) => setEditingColumnTitle(e.target.value)}
                      className="w-full h-8"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditColumnSave(column.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleEditColumnCancel}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-800">
                      {column.title} <span className="text-gray-500 text-sm">({columnLeads.length})</span>
                    </h3>
                    {editMode && (
                      <div className="flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditColumnStart(column)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveColumn(column.id)}
                          className="h-6 w-6 p-0 text-crm-danger"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="kanban-card"
                  onClick={() => openLeadDetails(lead)}
                  draggable
                  onDragStart={() => handleDragStart(lead.id, column.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{lead.name}</h4>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 w-7 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Open chat with this lead
                        showSuccessToast("Abrindo chat com o lead...");
                      }}
                    >
                      <MessageSquare className="h-3 w-3 text-crm-primary" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{lead.vehicleOfInterest}</p>
                  <div className="flex flex-wrap">
                    {lead.tags.map(getTagBadge)}
                  </div>
                </div>
              ))}
              
              {editMode && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={newColumnTitle} 
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      placeholder="Nova coluna"
                      className="h-8"
                    />
                    <Button onClick={handleAddColumn} className="h-8 w-8 p-0" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedLead && !isEditingLead && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLead.name}</DialogTitle>
                <DialogDescription>
                  {selectedLead.vehicleOfInterest}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Dados Cadastrais</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">WhatsApp:</span> {selectedLead.phone}</p>
                    <p><span className="font-medium">E-mail:</span> {selectedLead.email}</p>
                    <p><span className="font-medium">CPF:</span> {selectedLead.cpf}</p>
                    <p><span className="font-medium">Data de Nascimento:</span> {selectedLead.birthDate}</p>
                    <p><span className="font-medium">Endereço:</span> {selectedLead.address}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Dados Comerciais</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Origem:</span> {selectedLead.source}</p>
                    <p><span className="font-medium">Forma de Pagamento:</span> {
                      selectedLead.paymentMethod === "cash" ? "À Vista" : 
                      selectedLead.paymentMethod === "trade" ? "Troca" : "Financiamento"
                    }</p>
                    
                    {selectedLead.paymentMethod === "trade" && selectedLead.tradeInfo && (
                      <>
                        <p><span className="font-medium">Modelo de Troca:</span> {selectedLead.tradeInfo.model}</p>
                        <p><span className="font-medium">Ano:</span> {selectedLead.tradeInfo.year}</p>
                        <p><span className="font-medium">KM:</span> {selectedLead.tradeInfo.km}</p>
                        <p><span className="font-medium">Entrada:</span> {selectedLead.tradeInfo.downPayment}</p>
                      </>
                    )}
                    
                    {selectedLead.paymentMethod === "financing" && selectedLead.financingInfo && (
                      <p><span className="font-medium">Entrada:</span> {selectedLead.financingInfo.downPayment}</p>
                    )}
                    
                    <p><span className="font-medium">Tags:</span></p>
                    <div className="flex flex-wrap">
                      {selectedLead.tags.map(getTagBadge)}
                    </div>
                    
                    <p className="mt-2"><span className="font-medium">Observações:</span></p>
                    <p className="text-sm">{selectedLead.notes}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleEditLead}>Editar Lead</Button>
                <Button className="bg-crm-primary" onClick={handleOpenLeadChat}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ir para Chat
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Lead Edit Form */}
          {isEditingLead && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Lead</DialogTitle>
                <DialogDescription>
                  Atualize os dados do lead
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddLeadSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="form-label">Nome</label>
                      <Input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">WhatsApp</label>
                      <Input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">E-mail</label>
                      <Input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="form-label">CPF</label>
                      <Input 
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="form-label">Data de Nascimento</label>
                      <Input 
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="form-label">Endereço</label>
                      <Input 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="form-label">Origem do Lead</label>
                      <select 
                        className="form-input"
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                      >
                        <option value="">Selecione a origem</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Google">Google</option>
                        <option value="Indicação">Indicação</option>
                        <option value="Site">Site</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Veículo de Interesse</label>
                      <Input 
                        name="vehicleOfInterest"
                        value={formData.vehicleOfInterest}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Forma de Pagamento</label>
                      <select 
                        className="form-input"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                      >
                        <option value="cash">À Vista</option>
                        <option value="trade">Troca</option>
                        <option value="financing">Financiamento</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Status</label>
                      <select 
                        className="form-input"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        {columns.map((column) => (
                          <option key={column.id} value={column.id}>
                            {column.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Observações</label>
                      <textarea 
                        className="form-input h-24" 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditingLead(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-crm-primary">
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add New Lead Dialog */}
      <Dialog open={showAddLeadForm} onOpenChange={setShowAddLeadForm}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar um novo lead ao sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLeadSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados Cadastrais</h3>
                <div className="form-input-wrapper">
                  <label className="form-label">Nome</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">WhatsApp</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">E-mail</label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">CPF</label>
                  <Input
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Data de Nascimento</label>
                  <Input
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Endereço</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
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
                  <Input
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
                  >
                    <option value="cash">À Vista</option>
                    <option value="trade">Troca</option>
                    <option value="financing">Financiamento</option>
                  </select>
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione o status</option>
                    {columns.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Observações</label>
                  <textarea 
                    className="form-input h-24"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button type="submit" className="bg-crm-primary">Adicionar Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </Layout>
  );
};

export default KanbanPage;
