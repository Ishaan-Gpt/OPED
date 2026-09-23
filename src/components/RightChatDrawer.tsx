import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, User, Bot, HelpCircle, Layers } from "lucide-react";
import { streamTeacherResponse } from "@/lib/bedrock";

export interface ChatMessage {
  id: string;
  sender: "student" | "teacher";
  text: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  chapterTitle: string;
  currentNotes: string[];
  onGenerateSlidesFromPrompt: (prompt: string) => void;
}

export default function RightChatDrawer({
  isOpen,
  onClose,
  studentName,
  chapterTitle,
  currentNotes,
  onGenerateSlidesFromPrompt,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "teacher",
      text: `Hi ${studentName || "there"}! I'm right here. Ask me any doubt, or ask me to explain more elaborately, and I will update the blackboard for you!`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputValue).trim();
    if (!prompt || isStreaming) return;

    setInputValue("");
    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "student", text: prompt },
      { id: botMsgId, sender: "teacher", text: "" },
    ]);

    setIsStreaming(true);

    try {
      const context = `Student Name: ${studentName}. Topic: ${chapterTitle}. Blackboard Notes: ${currentNotes.join(", ")}`;
      let fullResponse = "";

      for await (const chunk of streamTeacherResponse(prompt, context)) {
        fullResponse += chunk;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: fullResponse } : msg))
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: "I had a connection glitch. Let me explain that on the blackboard for you!" }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed top-0 right-0 z-50 h-full w-full sm:w-[380px] lg:w-[420px] bg-[#0c1412]/95 backdrop-blur-xl border-l border-teal-soft/30 shadow-2xl flex flex-col justify-between text-chalk"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-teal/20 border border-teal-soft/40 text-teal-soft grid place-items-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-sm text-white">
                  Chat with Dr. Rao
                </h3>
                <p className="text-[10px] text-teal-soft uppercase tracking-wider">
                  Live Classroom AI Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-chalk/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${m.sender === "student" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "teacher" && (
                  <div className="size-6 rounded-full bg-teal text-white shrink-0 grid place-items-center text-[10px] font-bold mt-1">
                    R
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === "student"
                      ? "bg-teal text-white rounded-br-none shadow-md"
                      : "bg-black/50 border border-white/10 text-chalk/90 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* If teacher responded, offer to generate dynamic slides on the blackboard */}
                  {m.sender === "teacher" && m.text && !isStreaming && m.id !== "init" && (
                    <button
                      type="button"
                      onClick={() => onGenerateSlidesFromPrompt(m.text)}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-soft/20 text-teal-soft border border-teal-soft/30 hover:bg-teal-soft/30 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Put this on the Blackboard</span>
                    </button>
                  )}
                </div>

                {m.sender === "student" && (
                  <div className="size-6 rounded-full bg-white/20 text-white shrink-0 grid place-items-center text-[10px] font-bold mt-1">
                    {studentName ? studentName[0]?.toUpperCase() : "S"}
                  </div>
                )}
              </motion.div>
            ))}

            {isStreaming && (
              <div className="flex items-center gap-2 text-xs text-teal-soft font-mono animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dr. Rao is thinking...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/5 bg-black/20 text-[11px]">
            <button
              type="button"
              onClick={() => handleSend("Explain this with a real life example")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-chalk/70 cursor-pointer"
            >
              💡 Give an analogy
            </button>
            <button
              type="button"
              onClick={() => handleSend("Can you explain more elaborately from the start?")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-chalk/70 cursor-pointer"
            >
              📖 Explain more elaborately
            </button>
          </div>

          {/* Input Bar */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3.5 border-t border-white/10 bg-black/60 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask Dr. Rao a doubt, ${studentName || "student"}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 focus:border-teal-soft text-white text-xs sm:text-sm outline-none placeholder:text-chalk/40"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className="size-9 rounded-full bg-teal hover:bg-teal-soft text-white grid place-items-center disabled:opacity-40 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
