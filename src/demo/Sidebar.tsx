import React from 'react';
import {
  SquarePen,
  MessageSquare,
  Sparkles,
  Settings,
  GraduationCap,
  PanelLeft,
  User,
  Search,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onSelectPrompt }) => {
  const recentChats = [
    'Photosynthesis & Light Reactions',
    'Calculus: Derivatives & Integrals',
    'World War II History Overview',
    'Python Async & Promises',
    'Quantum Mechanics Basics',
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 h-full bg-[#171717] text-slate-200 border-r border-[#2f2f2f] flex flex-col z-20 select-none">
      <div className="p-3 flex items-center justify-between">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[#2f2f2f] text-slate-400 hover:text-slate-200 transition-colors"
          title="Close sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectPrompt('Explain photosynthesis')}
          className="p-2 rounded-lg hover:bg-[#2f2f2f] text-slate-400 hover:text-slate-200 transition-colors"
          title="New chat"
        >
          <SquarePen className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span>AI Teacher Assistant</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <p className="px-3 text-[11px] font-semibold text-slate-500 mb-1">Today</p>
        {recentChats.map((chat, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(chat)}
            className="w-full px-3 py-2 rounded-lg hover:bg-[#212121] text-left text-xs text-slate-300 truncate transition-colors block"
          >
            {chat}
          </button>
        ))}
      </div>

      <div className="p-2 border-t border-[#2f2f2f]">
        <button className="w-full p-2.5 rounded-lg hover:bg-[#212121] text-xs text-slate-300 flex items-center gap-3 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-xs">
            U
          </div>
          <div className="text-left truncate flex-1">
            <p className="font-medium text-slate-200 truncate text-xs">Student User</p>
            <p className="text-[10px] text-slate-400">Plus Plan</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
