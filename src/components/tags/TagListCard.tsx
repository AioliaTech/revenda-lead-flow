
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy } from "lucide-react";
import { Tag } from "@/types";

interface TagListCardProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  onDuplicate: (tag: Tag) => void;
}

const TagListCard: React.FC<TagListCardProps> = ({ tag, onEdit, onDelete, onDuplicate }) => (
  <div
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
        onClick={() => onDuplicate(tag)}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onEdit(tag)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-crm-danger"
        onClick={() => onDelete(tag.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default TagListCard;
