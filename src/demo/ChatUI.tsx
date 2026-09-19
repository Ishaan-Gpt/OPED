import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MessageArea, Message } from './MessageArea';
import { DemoControls } from './DemoControls';
import { AnimatedTeacher } from '../character/AnimatedTeacher';
import { useCharacterController } from '../character/CharacterController';
import { CharacterState, PointTarget } from '../character/types';

export const ChatUI: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  // Initialize Character Controller
  const character = useCharacterController('idle', 'bottom-right');

  // Chat message stream
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'teacher',
      text: "Hello! I am your AI Teacher. Ask me any question, ask me to explain a concept, or click any interactive trigger to see me in action!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Handle User Input Submission
  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate AI Teacher Response Flow based on user input
    if (text.toLowerCase().includes('photosynthesis')) {
      character.play('thinking');
      setTimeout(() => {
        character.play('speaking');
        const teacherMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: 'teacher',
          text: "Photosynthesis is the fundamental biological process where plants convert light energy from the sun into chemical energy (glucose). Let's review the equation on the board!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasBoardContent: true,
        };
        setMessages((prev) => [...prev, teacherMsg]);

        // After speaking, switch to explaining & point at board target
        setTimeout(() => {
          character.pointAt({ targetElement: 'board-target-1' });
        }, 1200);
      }, 1800);
    } else if (text.toLowerCase().includes('question') || text.toLowerCase().includes('ask')) {
      character.play('question');
      const teacherMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'teacher',
        text: "Here is your quiz question: What pigment inside plant chloroplasts absorbs red and blue light waves?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, teacherMsg]);

      // Play signature "No Peek" camera palm animation after question!
      setTimeout(() => {
        character.play('noPeek');
      }, 1500);
    } else {
      character.play('thinking');
      setTimeout(() => {
        character.play('speaking');
        const teacherMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: 'teacher',
          text: `Great topic! Let's explore "${text}" together step by step. Feel free to use the Dev Controls on the top right to test all my gestures and animations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, teacherMsg]);
        setTimeout(() => character.play('explaining'), 1000);
      }, 1500);
    }
  };

  const handleTriggerAction = (actionState: CharacterState) => {
    character.play(actionState);
  };

  const handlePointAtTarget = (target: PointTarget) => {
    character.pointAt(target);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden select-none font-sans">
      {/* LEFT SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectPrompt={handleSendMessage}
      />

      {/* MAIN CHAT & TEACHER CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* NAVBAR */}
        <Navbar
          currentPosition={character.position}
          onPositionChange={(pos) => character.moveTo(pos)}
          onToggleControls={() => setIsControlsOpen(!isControlsOpen)}
          isControlsOpen={isControlsOpen}
        />

        {/* MESSAGE AREA */}
        <MessageArea
          messages={messages}
          onSendMessage={handleSendMessage}
          onTriggerAction={handleTriggerAction}
          onPointAtTarget={handlePointAtTarget}
        />

        {/* DEVELOPER CONTROLS DRAWER */}
        <DemoControls
          isOpen={isControlsOpen}
          onClose={() => setIsControlsOpen(false)}
          currentState={character.state}
          currentExpression={character.expression}
          currentGesture={character.gesture}
          currentPosition={character.position}
          onPlayState={(st) => character.play(st)}
          onSetExpression={(exp) => character.setExpression(exp)}
          onSetGesture={(g) => character.setGesture(g)}
          onMoveTo={(pos) => character.moveTo(pos)}
          onLookAt={(gz) => character.lookAt(gz)}
          onPointAt={(pt) => character.pointAt(pt)}
        />

        {/* REUSABLE ANIMATED TEACHER CHARACTER ENGINE */}
        <AnimatedTeacher
          state={character.state}
          expression={character.expression}
          gesture={character.gesture}
          position={character.position}
          gazeTarget={character.gazeTarget}
          pointTarget={character.pointTarget}
          showThoughtBubble={character.state === 'thinking'}
        />
      </div>
    </div>
  );
};
