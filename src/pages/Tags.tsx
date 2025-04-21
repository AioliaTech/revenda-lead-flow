
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockTags } from "../services/mockData";
import { Tag } from "../types";

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  
  // Form state
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#1A73E8");
  
  // Predefined colors
  const predefinedColors = [
    "#1A73E8", // Blue
    "#34A853", // Green
    "#FBBC05", // Yellow
    "#EA4335", // Red
    "#9C27B0", // Purple
    "#00BCD4", // Cyan
    "#FF9800", // Orange
  ];
  
  const handleAddTag = () => {
    if (!tagName.trim()) return;
    
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: tagName,
      color: tagColor,
    };
    
    setTags([...tags, newTag]);
    resetForm();
  };
  
  const handleEditTag = () => {
    if (!editingTag || !tagName.trim()) return;
    
    setTags(tags.map(tag => 
      tag.id === editingTag.id ? { ...tag, name: tagName, color: tagColor } : tag
    ));
    
    setEditingTag(null);
    resetForm();
  };
  
  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };
  
  const handleDuplicateTag = (tag: Tag) => {
    const duplicateTag: Tag = {
      id: `tag-${Date.now()}`,
      name: `${tag.name} (cópia)`,
      color: tag.color,
    };
    
    setTags([...tags, duplicateTag]);
  };
  
  const startEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setShowAddTagDialog(true);
  };
  
  const resetForm = () => {
    setTagName("");
    setTagColor("#1A73E8");
    setShowAddTagDialog(false);
  };
  
  return (
    <Layout title="Gerenciar Tags">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-medium">Tags</h2>
        <Button className="bg-crm-primary gap-2" onClick={() => setShowAddTagDialog(true)}>
          <Plus className="h-4 w-4" /> Nova Tag
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tags.map(tag => (
          <div 
            key={tag.id} 
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex justify-between items-center"
          >
            <div className="flex items-center">
              <div 
                className="w-5 h-5 rounded-full mr-3" 
                style={{ backgroundColor: tag.color }}
              ></div>
              <span className="font-medium">{tag.name}</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => handleDuplicateTag(tag)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => startEditTag(tag)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-crm-danger"
                onClick={() => handleDeleteTag(tag.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add/Edit Tag Dialog */}
      <Dialog open={showAddTagDialog} onOpenChange={setShowAddTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? "Editar Tag" : "Nova Tag"}</DialogTitle>
            <DialogDescription>
              {editingTag 
                ? "Edite o nome e a cor da tag." 
                : "Crie uma nova tag para categorizar seus leads."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Tag</label>
              <Input 
                value={tagName} 
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Ex: Quente, Financiamento, SUV..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor</label>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${tagColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTagColor(color)}
                  />
                ))}
                <input
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0 rounded-full"
                />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-5 h-5 rounded-full" 
                  style={{ backgroundColor: tagColor }}
                ></div>
                <span className="font-medium">Pré-visualização</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button 
              className="bg-crm-primary" 
              onClick={editingTag ? handleEditTag : handleAddTag}
            >
              {editingTag ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TagsPage;
