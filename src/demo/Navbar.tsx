import React from 'react';
import {
  PanelLeft,
  ChevronDown,
  Sliders,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { PositionPreset } from '../character/types';

interface NavbarProps {
  currentPosition: PositionPreset | { x: number; y: number };
  onPositionChange: (pos: PositionPreset) => void;
  onToggleControls: () => void;
  isControlsOpen: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPosition,
  onPositionChange,
  onToggleControls,
  isControlsOpen,
  onToggleSidebar,
}) => {
  const positions: { label: string; value: PositionPreset }[] = [
    { label: 'Bottom Right', value: 'bottom-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Center Right', value: 'center-right' },
    { label: 'Top Left', value: 'top-left' },
  ];

  return (
    <header className="h-14 bg-[#212121] border-b border-[#2f2f2f] px-3 md:px-4 flex items-center justify-between z-10 select-none">
      {/* Sidebar Toggle & ChatGPT Model Selector */}
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#2f2f2f] text-slate-300 transition-colors"
            title="Toggle sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}

        {/* ChatGPT Model Selector Dropdown Pill */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#2f2f2f] rounded-lg text-sm font-semibold text-slate-200 transition-colors">
          <span>ChatGPT 4o</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Position Quick Selector & Dev Controls */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 bg-[#171717] p-1 rounded-xl border border-[#2f2f2f]">
          <Navigation className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Position:</span>
          {positions.map((p) => (
            <button
              key={p.value}
              onClick={() => onPositionChange(p.value)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentPosition === p.value
                  ? 'bg-[#2f2f2f] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#2f2f2f]/60'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleControls}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
            isControlsOpen
              ? 'bg-blue-600 border-blue-500 text-white shadow-md'
              : 'bg-[#2f2f2f] hover:bg-[#383838] border-[#383838] text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Dev Controls</span>
        </button>
      </div>
    </header>
  );
};
