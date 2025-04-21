
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Kanban,
  Tag
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Kanban, label: "Kanban", path: "/kanban" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: Users, label: "Leads", path: "/leads" },
    { icon: Tag, label: "Tags", path: "/tags" },
    { icon: Settings, label: "Configurações", path: "/settings" }
  ];

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-crm-primary">RevendaCRM</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-crm-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "" : "text-gray-500"}`} />
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-crm-primary rounded-full flex items-center justify-center text-white font-medium">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">admin@revenda.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
