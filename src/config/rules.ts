/**
 * Platform rules + the pre-connected NCERT module index (Classes 4–10).
 * All validation, parsing and exam-readiness scoring rules live here.
 */

export type ArtifactKind = "ray-slider" | "prism-spectrum" | "cell-labels" | "number-line";
export type ThreeDKind = "lens" | "atom" | "leaf-cell" | "solid";

export interface NarrationLine {
  text: string;
  /** seconds this caption stays on the board */
  hold: number;
}

export interface NcertModule {
  id: string;
  grade: number;
  subject: string;
  chapter: number;
  title: string;
  /** search aliases / keywords */
  aliases: string[];
  boardHeading: string;
  notes: string[];
  narration: NarrationLine[];
  artifact: ArtifactKind;
  artifactTitle: string;
  threeD: ThreeDKind;
  threeDTitle: string;
  /** recited twice by the teacher, then recalled by the student */
  examConcept: string;
  examKeywords: string[];
  hint: string;
}

export const NCERT_INDEX: NcertModule[] = [
  {
    id: "c10-sci-10",
    grade: 10,
    subject: "Science",
    chapter: 10,
    title: "Light — Reflection & Refraction",
    aliases: ["light", "reflection", "refraction", "mirror", "lens", "snell"],
    boardHeading: "Light — Reflection & Refraction",
    notes: [
      "Laws of reflection: ∠i = ∠r, and incident ray, normal & reflected ray are coplanar.",
      "Concave mirror → converging; Convex mirror → diverging (always virtual, diminished).",
      "Mirror formula: 1/v + 1/u = 1/f      Magnification: m = −v/u",
      "Refraction: light bends because speed changes across media (n = c/v).",
    ],
    narration: [
      { text: "Open your notebook. Today we master Light — Reflection and Refraction.", hold: 3.4 },
      {
        text: "Reflection: the angle of incidence is always equal to the angle of reflection.",
        hold: 3.8,
      },
      {
        text: "A concave mirror converges rays to a real focus; a convex mirror diverges them.",
        hold: 4,
      },
      {
        text: "Refraction happens because light changes speed when it enters a denser medium.",
        hold: 3.8,
      },
      { text: "Watch the ray diagram — move the object and see the image shift.", hold: 3.2 },
    ],
    artifact: "ray-slider",
    artifactTitle: "Ray diagram — concave mirror",
    threeD: "lens",
    threeDTitle: "Convex lens & refracted beam",
    examConcept:
      "For a concave mirror, 1 upon v plus 1 upon u equals 1 upon f, and magnification m equals minus v upon u.",
    examKeywords: ["1/v", "1/u", "1/f", "magnification", "-v/u", "concave"],
    hint: "Mention the mirror formula (1/v + 1/u = 1/f) and magnification m = −v/u.",
  },
  {
    id: "c9-sci-4",
    grade: 9,
    subject: "Science",
    chapter: 4,
    title: "Structure of the Atom",
    aliases: ["atom", "structure of the atom", "rutherford", "bohr", "electron", "valency"],
    boardHeading: "Structure of the Atom",
    notes: [
      "Rutherford: tiny dense positively charged nucleus, electrons revolve around it.",
      "Bohr: electrons occupy fixed discrete orbits (shells) — no energy radiated in an orbit.",
      "Shell capacity: 2n² → K=2, L=8, M=18. Outermost shell ≤ 8 electrons.",
      "Mass number A = protons + neutrons;  Atomic number Z = protons.",
    ],
    narration: [
      { text: "Class, today we build the atom — shell by shell.", hold: 3 },
      {
        text: "Rutherford's model: nearly all mass sits in a tiny, positively charged nucleus.",
        hold: 4,
      },
      {
        text: "Bohr fixed the flaw: electrons revolve only in discrete, stable orbits.",
        hold: 3.8,
      },
      {
        text: "Each shell holds a maximum of 2n squared electrons — K two, L eight, M eighteen.",
        hold: 4.2,
      },
    ],
    artifact: "cell-labels",
    artifactTitle: "Label the shells",
    threeD: "atom",
    threeDTitle: "Bohr model — nucleus & shells",
    examConcept:
      "Maximum electrons in a shell equals 2n squared, and mass number A equals protons plus neutrons.",
    examKeywords: ["2n2", "shell", "mass number", "protons", "neutrons"],
    hint: "Include the 2n² shell rule and A = protons + neutrons.",
  },
  {
    id: "c7-sci-1",
    grade: 7,
    subject: "Science",
    chapter: 1,
    title: "Photosynthesis & Nutrition in Plants",
    aliases: ["photosynthesis", "nutrition", "chlorophyll", "stomata", "plants"],
    boardHeading: "Nutrition in Plants — Photosynthesis",
    notes: [
      "6CO₂ + 6H₂O --sunlight/chlorophyll--> C₆H₁₂O₆ + 6O₂",
      "Raw materials: carbon dioxide (stomata), water (roots), sunlight, chlorophyll.",
      "Autotrophs make their own food; parasites, saprotrophs & insectivores are heterotrophs.",
      "Starch test with iodine turns blue-black → food stored as starch.",
    ],
    narration: [
      { text: "Plants cook their own food. Let's learn the recipe.", hold: 3 },
      { text: "Carbon dioxide enters through stomata, water rises from the roots.", hold: 3.8 },
      { text: "Chlorophyll traps sunlight and converts it into chemical energy.", hold: 3.6 },
      { text: "The product is glucose, and oxygen is released back into the air.", hold: 3.6 },
    ],
    artifact: "cell-labels",
    artifactTitle: "Label the leaf cross-section",
    threeD: "leaf-cell",
    threeDTitle: "Chloroplast inside a leaf cell",
    examConcept:
      "Carbon dioxide plus water, in the presence of sunlight and chlorophyll, gives glucose and oxygen.",
    examKeywords: ["carbon dioxide", "water", "sunlight", "chlorophyll", "glucose", "oxygen"],
    hint: "Name all four raw materials and both products — glucose and oxygen.",
  },
  {
    id: "c8-sci-11",
    grade: 8,
    subject: "Science",
    chapter: 11,
    title: "Light — Dispersion & the Spectrum",
    aliases: ["dispersion", "spectrum", "prism", "rainbow", "vibgyor"],
    boardHeading: "Dispersion of White Light",
    notes: [
      "White light splits into seven colours — VIBGYOR — on passing through a prism.",
      "Violet bends the most, red the least (violet has the shortest wavelength).",
      "A rainbow is dispersion + internal reflection inside water droplets.",
    ],
    narration: [
      { text: "One beam of white light hides seven colours. Let's release them.", hold: 3.4 },
      {
        text: "A glass prism bends each colour by a different amount — that is dispersion.",
        hold: 4,
      },
      { text: "Violet bends most because its wavelength is shortest; red bends least.", hold: 4 },
    ],
    artifact: "prism-spectrum",
    artifactTitle: "Prism — tilt the incident beam",
    threeD: "solid",
    threeDTitle: "Glass prism in 3D",
    examConcept:
      "Dispersion splits white light into VIBGYOR because violet bends the most and red bends the least.",
    examKeywords: ["dispersion", "vibgyor", "violet", "red", "prism"],
    hint: "Use the word dispersion, name VIBGYOR, and compare violet vs red bending.",
  },
  {
    id: "c6-math-11",
    grade: 6,
    subject: "Mathematics",
    chapter: 11,
    title: "Algebra — Introduction to Variables",
    aliases: ["algebra", "variable", "expression", "equation", "maths", "mathematics"],
    boardHeading: "Algebra — Variables & Expressions",
    notes: [
      "A variable is a letter that can take different numerical values: x, y, n, l.",
      "Perimeter of a square of side l  →  P = 4l.",
      "An equation has an equality sign and is true only for a particular value.",
    ],
    narration: [
      { text: "A letter can stand for any number — that is the power of algebra.", hold: 3.4 },
      { text: "If a square has side l, its perimeter is four times l.", hold: 3.4 },
      { text: "An equation is a statement of equality, true for one special value.", hold: 3.6 },
    ],
    artifact: "number-line",
    artifactTitle: "Number line — evaluate 2x + 3",
    threeD: "solid",
    threeDTitle: "Unit cubes for 4l",
    examConcept:
      "A variable is a letter taking different values, so the perimeter of a square equals 4 l.",
    examKeywords: ["variable", "letter", "values", "perimeter", "4l"],
    hint: "Define a variable and give the formula P = 4l.",
  },
  {
    id: "c4-sst-3",
    grade: 4,
    subject: "Social Studies",
    chapter: 3,
    title: "Maps, Directions & Our Neighbourhood",
    aliases: ["maps", "directions", "neighbourhood", "compass", "social studies", "sst"],
    boardHeading: "Maps & Directions",
    notes: [
      "Four cardinal directions: North, East, South, West (clockwise from the top).",
      "A map uses symbols, a scale and a compass rose to shrink the real world.",
      "The Sun rises in the east and sets in the west.",
    ],
    narration: [
      { text: "Let's learn to read the world on a sheet of paper — a map.", hold: 3.2 },
      { text: "North, East, South and West are the four cardinal directions.", hold: 3.4 },
      { text: "Every map carries three keys: symbols, a scale and a compass rose.", hold: 3.8 },
    ],
    artifact: "number-line",
    artifactTitle: "Spin the compass rose",
    threeD: "solid",
    threeDTitle: "3D landform block",
    examConcept:
      "A map needs symbols, a scale and a compass rose, and the four cardinal directions are north, east, south and west.",
    examKeywords: ["symbols", "scale", "compass", "north", "east", "south", "west"],
    hint: "List the three keys of a map and all four cardinal directions.",
  },
];

export const RULES = {
  grades: { min: 4, max: 10 },
  subjects: ["Science", "Mathematics", "Social Studies"],
  guidance: "We are expanding! Try typing: NCERT [class] [subject] [chapter no]",
  guidanceExample: 'e.g. "NCERT Class 10 Science Chapter 10"',
  placeholder: "Ask for a chapter — NCERT Class 10 Science Chapter 10",
  /** fraction of exam keywords required for a 100% readiness milestone */
  passThreshold: 0.6,
  teacherRepeats: 2,
} as const;

export interface SearchResult {
  ok: boolean;
  module?: NcertModule;
  message?: string;
  /** present when no pre-scripted module matched but there's enough structure (class + subject)
   * to generate one live instead of just showing the guidance message */
  generatable?: { grade: number; subject: string; chapter: number | undefined };
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Validates a query against the NCERT index and returns the matching module. */
export function resolveQuery(raw: string): SearchResult {
  const q = normalize(raw);
  if (!q) return { ok: false, message: RULES.guidance };

  const gradeMatch = q.match(/(?:class|std|grade)\s*(\d{1,2})/) ?? q.match(/\b(\d{1,2})\b/);
  const grade = gradeMatch ? Number(gradeMatch[1]) : undefined;
  const chapterMatch = q.match(/(?:chapter|ch|lesson)\s*(\d{1,2})/);
  const chapter = chapterMatch ? Number(chapterMatch[1]) : undefined;

  const subject = RULES.subjects.find((s) => {
    const n = normalize(s);
    if (q.includes(n)) return true;
    if (s === "Mathematics" && /\b(math|maths)\b/.test(q)) return true;
    if (s === "Social Studies" && /\b(sst|social)\b/.test(q)) return true;
    return false;
  });

  // 1. Exact structured lookup: class + subject + chapter
  if (grade && subject && chapter) {
    const hit = NCERT_INDEX.find(
      (m) => m.grade === grade && m.subject === subject && m.chapter === chapter,
    );
    if (hit) return { ok: true, module: hit };
  }

  // 2. Class + subject, no specific chapter given — only a fallback when the student didn't
  // name a chapter at all; if they did (e.g. "chapter 12") and it's not indexed, fall through
  // to generation instead of silently substituting a different chapter's content.
  if (grade && subject && chapter === undefined) {
    const hit = NCERT_INDEX.find((m) => m.grade === grade && m.subject === subject);
    if (hit) return { ok: true, module: hit };
  }

  // 3. Topic / alias match, optionally scoped by class
  const scored = NCERT_INDEX.map((m) => {
    let score = 0;
    if (grade === m.grade) score += 2;
    if (
      normalize(m.title)
        .split(" ")
        .some((w) => w.length > 3 && q.includes(w))
    )
      score += 2;
    for (const a of m.aliases) if (q.includes(normalize(a))) score += 3;
    return { m, score };
  })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (best) return { ok: true, module: best.m };

  // No pre-scripted chapter matches, but the query has enough structure to generate one live.
  if (grade && grade >= RULES.grades.min && grade <= RULES.grades.max && subject) {
    return { ok: false, generatable: { grade, subject, chapter } };
  }

  return { ok: false, message: RULES.guidance };
}

export interface RecitationVerdict {
  matched: string[];
  missing: string[];
  ratio: number;
  passed: boolean;
  readiness: number;
}

/** Computes Levenshtein distance between two strings */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i]![0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost
      );
    }
  }
  return matrix[a.length]![b.length]!;
}

/** Scores a student recitation against the chapter's exam keywords using fuzzy semantic matching. */
export function gradeRecitation(input: string, module: NcertModule): RecitationVerdict {
  const saidText = normalize(input);
  const saidWords = saidText.split(/\s+/).filter(Boolean);
  const saidNoSpaces = saidText.replace(/\s/g, "");
  
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of module.examKeywords) {
    const kNormalized = normalize(kw);
    const kNoSpaces = kNormalized.replace(/\s/g, "");
    
    // 1. Check exact substring match (no spaces)
    if (kNoSpaces && saidNoSpaces.includes(kNoSpaces)) {
      matched.push(kw);
      continue;
    }
    
    // 2. Fuzzy match against words in the transcript
    let isFuzzyMatched = false;
    const kwWords = kNormalized.split(/\s+/).filter(Boolean);
    
    if (kwWords.length === 1) {
      const threshold = kwWords[0]!.length > 5 ? 2 : 1;
      for (const saidWord of saidWords) {
        if (levenshteinDistance(kwWords[0]!, saidWord) <= threshold) {
          isFuzzyMatched = true;
          break;
        }
      }
    } else {
      let allWordsMatched = true;
      for (const kwWord of kwWords) {
        const threshold = kwWord.length > 5 ? 2 : 1;
        let wordMatched = false;
        for (const saidWord of saidWords) {
          if (levenshteinDistance(kwWord, saidWord) <= threshold) {
            wordMatched = true;
            break;
          }
        }
        if (!wordMatched) {
          allWordsMatched = false;
          break;
        }
      }
      isFuzzyMatched = allWordsMatched;
    }

    if (isFuzzyMatched) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const ratio = module.examKeywords.length ? matched.length / module.examKeywords.length : 0;
  const passed = ratio >= RULES.passThreshold;
  return {
    matched,
    missing,
    ratio,
    passed,
    readiness: passed ? 100 : Math.round(ratio * 100),
  };
}

export const suggestions = [
  "NCERT Class 10 Science Chapter 10",
  "NCERT Class 9 Science Chapter 4",
  "NCERT Class 7 Science Photosynthesis",
  "NCERT Class 6 Mathematics Chapter 11",
];
