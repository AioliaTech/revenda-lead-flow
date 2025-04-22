
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Lead } from "@/types";

interface KanbanCardProps {
  lead: Lead;
  onClick: () => void;
  onChatClick: (e: React.MouseEvent) => void;
  getTagBadge: (tag: any) => React.ReactNode;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ lead, onClick, onChatClick, getTagBadge }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 mb-3 cursor-pointer transform transition-all duration-200 hover:shadow-md hover:-translate-y-1 animate-scale-in"
      onClick={onClick}
      draggable
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-800 mb-1">{lead.name}</h4>
          <p className="text-sm text-crm-whatsapp flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {lead.phone}
          </p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0 rounded-full border-crm-whatsapp text-crm-whatsapp hover:bg-crm-whatsapp/10"
          onClick={onChatClick}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-600 mb-2">{lead.vehicleOfInterest}</p>
      <div className="flex flex-wrap gap-1">
        {lead.tags.map(getTagBadge)}
      </div>
    </div>
  );
};

export default KanbanCard;
