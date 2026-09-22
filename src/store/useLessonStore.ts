import { create } from "zustand";
import { boardBridge } from "../lib/boardBridge";

export interface LessonBoard {
  title: string;
  lines: string[];
}

export interface LessonStoreState {
  config: any;
  lesson: any;
  error: string | null;
  phase: string;
  segmentIndex: number;
  progress: number;
  caption: string;
  captionSpeaker: string;
  speaking: boolean;
  board: LessonBoard;
  boardPages: LessonBoard[];
  raisedHandStudent: number;
  boardFocus: boolean;
  boardOpen: boolean;
  userHandRaised: boolean;

  setSpeaking: (speaking: boolean) => void;
  setCaption: (caption: string, speaker?: string) => void;
  setBoard: (board: LessonBoard) => void;
  addBoardLine: (line: string) => void;
  setRaisedHandStudent: (idx: number) => void;
  setBoardFocus: (focus: boolean) => void;
  setBoardOpen: (open: boolean) => void;
  reset: () => void;
}

export const useLessonStore = create<LessonStoreState>((set, get) => ({
  config: {
    studentNames: ["Aarav", "Priya", "Ananya", "Vikram", "Rohan"],
    teacher: { modelUrl: "/models/emilian-avatar.glb" },
  },
  lesson: null,
  error: null,
  phase: "teaching",
  segmentIndex: 0,
  progress: 0,
  caption: "",
  captionSpeaker: "",
  speaking: false,
  board: { title: "3D Classroom Blackboard", lines: [] },
  boardPages: [],
  raisedHandStudent: -1,
  boardFocus: false,
  boardOpen: false,
  userHandRaised: false,

  setSpeaking: (speaking: boolean) => set({ speaking }),
  setCaption: (caption: string, captionSpeaker = "") => set({ caption, captionSpeaker }),
  setBoard: (board: LessonBoard) =>
    set((s) => {
      const prev = s.board;
      let boardPages = s.boardPages;
      if (prev.lines.length > 0) {
        boardPages = [...boardPages.filter((p) => p.title !== prev.title), { ...prev }];
      }
      return { board, boardPages };
    }),
  addBoardLine: (line: string) =>
    set((s) => ({ board: { ...s.board, lines: [...s.board.lines, line] } })),
  setRaisedHandStudent: (raisedHandStudent: number) => set({ raisedHandStudent }),
  setBoardFocus: (boardFocus: boolean) => set({ boardFocus }),
  setBoardOpen: (boardOpen: boolean) => set({ boardOpen }),

  reset: () => {
    boardBridge.clear();
    set({
      config: {
        studentNames: ["Aarav", "Priya", "Ananya", "Vikram", "Rohan"],
        teacher: { modelUrl: "/models/emilian-avatar.glb" },
      },
      lesson: null,
      error: null,
      phase: "teaching",
      segmentIndex: 0,
      progress: 0,
      caption: "",
      captionSpeaker: "",
      speaking: false,
      board: { title: "", lines: [] },
      boardPages: [],
      raisedHandStudent: -1,
      boardFocus: false,
      boardOpen: false,
      userHandRaised: false,
    });
  },
}));
