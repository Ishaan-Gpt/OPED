import React, { useState } from 'react';
import {
  ArrowUp,
  Plus,
  Mic,
  AudioLines,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  BookOpen,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { CharacterState, PointTarget } from '../character/types';

export interface Message {
  id: string;
  sender: 'user' | 'teacher';
  text: string;
  timestamp: string;
  hasBoardContent?: boolean;
}

interface MessageAreaProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onTriggerAction: (actionState: CharacterState) => void;
  onPointAtTarget: (target: PointTarget) => void;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  onSendMessage,
  onTriggerAction,
  onPointAtTarget,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const suggestions = [
    { title: 'Explain Photosynthesis', desc: 'Simulate animated teaching & pointing' },
    { title: 'Ask me a question', desc: 'Triggers Question + No Peeking palm gesture' },
    { title: 'Point at Board Diagram', desc: 'Character points arm dynamically at educational board' },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-[#212121] relative select-none">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-40 max-w-3xl mx-auto w-full space-y-6">
        {messages.length <= 1 && (
          <div className="py-12 text-center space-y-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-100 tracking-tight">
              What can I help with today?
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(item.title)}
                  className="p-4 bg-[#212121] border border-[#2f2f2f] hover:border-[#424242] hover:bg-[#2f2f2f]/50 rounded-2xl transition-all text-xs space-y-1 shadow-sm"
                >
                  <p className="font-semibold text-slate-200">{item.title}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            id={msg.id}
            className={`flex gap-3 md:gap-4 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'teacher' && (
              <div className="w-7 h-7 rounded-full bg-[#10a37f] text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#2f2f2f] text-slate-100 px-4 py-3 rounded-3xl rounded-tr-sm shadow-sm'
                  : 'text-slate-200 pt-1'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {msg.hasBoardContent && (
                <div
                  id="board-target-1"
                  className="mt-4 p-4 bg-[#171717] border border-[#2f2f2f] rounded-2xl relative overflow-hidden shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Educational Board / Diagram
                    </span>
                    <button
                      onClick={() => onPointAtTarget({ targetElement: 'board-target-1' })}
                      className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-medium rounded-lg border border-blue-500/40 flex items-center gap-1 transition-colors"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      Point Here
                    </button>
                  </div>
                  <div className="p-3 bg-[#212121] rounded-xl border border-[#2f2f2f] text-xs text-slate-300 space-y-1.5 font-mono">
                    <p className="text-emerald-400 font-semibold">Equation: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂</p>
                    <p className="text-slate-400">Step 1: Chlorophyll absorbs light energy.</p>
                    <p className="text-slate-400">Step 2: Water molecules split into Hydrogen & Oxygen.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-xl w-[92%] bg-[#171717]/90 backdrop-blur-md border border-[#2f2f2f] p-2 rounded-2xl flex flex-wrap items-center justify-center gap-2 shadow-xl z-10">
        <span className="text-[11px] text-slate-400 font-medium px-1">Interactive Triggers:</span>
        <button
          onClick={() => onTriggerAction('question')}
          className="px-2.5 py-1 bg-[#2f2f2f] hover:bg-[#383838] text-amber-300 border border-amber-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ask Question</span>
        </button>
        <button
          onClick={() => onTriggerAction('noPeek')}
          className="px-2.5 py-1 bg-[#2f2f2f] hover:bg-[#383838] text-purple-300 border border-purple-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>No Peek (Camera Palm)</span>
        </button>
        <button
          onClick={() => onTriggerAction('correct')}
          className="px-2.5 py-1 bg-[#2f2f2f] hover:bg-[#383838] text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Correct!</span>
        </button>
        <button
          onClick={() => onTriggerAction('incorrect')}
          className="px-2.5 py-1 bg-[#2f2f2f] hover:bg-[#383838] text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Incorrect</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent z-10">
        <form
          id="chat-input-target"
          onSubmit={handleSend}
          className="max-w-2xl mx-auto flex items-center gap-2 bg-[#2f2f2f] border border-[#383838] focus-within:border-[#555555] rounded-[26px] p-2 pl-4 transition-all shadow-lg"
        >
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-[#383838] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message ChatGPT..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-[#383838] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-full bg-white text-black disabled:bg-[#424242] disabled:text-[#666666] flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
        <p className="text-[11px] text-center text-slate-500 mt-2">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};
