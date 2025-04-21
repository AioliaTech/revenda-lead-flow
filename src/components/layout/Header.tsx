
import React from "react";
import { Bell, Search, User } from "lucide-react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <h1 className="text-xl font-medium text-gray-800">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-crm-primary focus:border-transparent"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
          <div className="w-8 h-8 bg-crm-primary rounded-full flex items-center justify-center text-white">
            <User className="h-5 w-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
