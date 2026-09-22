import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  Mic,
  Pause,
  Play,
  Search,
  X,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import classroomImage from "@/assets/oped-classroom.jpg";
import { AlertIcon, BrandMark, TeacherIcon } from "@/components/icons";
import { resolveQuery, RULES, suggestions, type NcertModule } from "@/config/rules";
import { generateLessonModule } from "@/lib/teacher/generateModuleClient";
import BlackboardCanvas from "@/components/BlackboardCanvas";
import AwardLoader from "@/components/AwardLoader";
import SitePreloader from "@/components/SitePreloader";
import StackSpread from "@/components/ui/stack-spread";
import useLenis from "@/hooks/useLenis";
import { AnimatedTeacher } from "@/character/AnimatedTeacher";
import type {
  CharacterState,
  ExpressionType,
  GestureType,
  GazeTarget,
  PointTarget,
  PositionPreset,
} from "@/character/types";
import { DemoControls } from "@/demo/DemoControls";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OPED — Learn it. Prove it." },
      {
        name: "description",
        content:
          "The first AI teacher that checks if you actually learned it. Free NCERT chapter learning for Classes 4–10.",
      },
      { property: "og:title", content: "OPED — Learn it. Prove it." },
      {
        property: "og:description",
        content:
          "The first AI teacher that checks if you actually learned it. Free NCERT chapter learning for Classes 4–10.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const subjects = [
  { name: "Class 10 Science", topics: "Life Processes · Light · Electricity · Chemical Reactions", query: "Life Processes" },
  { name: "Class 9 Mathematics", topics: "Number Systems · Polynomials · Coordinate Geometry", query: "Polynomials" },
  { name: "Class 8 Science", topics: "Crop Production · Microorganisms · Force & Pressure", query: "Force and Pressure" },
  { name: "Class 7 Mathematics", topics: "Integers · Fractions · Simple Equations · Geometry", query: "Nutrition in Plants" },
  { name: "Classes 4–6", topics: "The World Around Us · Science · Mathematics · Social Studies", query: "Photosynthesis" },
];

const steps = [
  { id: "01", label: "DELIVER", title: "Watch an idea\ncome to life.", accent: "life.", note: "The blackboard explains with words, visuals and examples. No recall demanded yet." },
  { id: "02", label: "SENSE", title: "Now say it\nback to us.", accent: "us.", note: "Your teacher says the important line twice. Then listens to you explain it out loud." },
  { id: "03", label: "VERIFY", title: "The idea, not\nthe exact words.", accent: "words.", note: "A hesitant half-right answer is different from a wrong one. OPED can tell." },
  { id: "04", label: "BRANCH", title: "Didn't click?\nTry another way.", accent: "way.", note: "A new explanation meets you where you are, instead of repeating the same one louder." },
];

function Doodle({ children, direction = "right" }: { children: React.ReactNode; direction?: "right" | "left" }) {
  return (
    <div className={`doodle doodle-${direction}`} aria-hidden="true">
      <span>{children}</span>
      <svg viewBox="0 0 95 50" fill="none">
        <path d="M4 6c19 11 9 29 37 23 16-3 8-23-4-13-11 9 15 25 48 17m-13-8 13 8-11 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function BlackboardCard() {
  return (
    <div className="mock-board">
      <div className="mock-top"><span>OPED / SCIENCE / CH. 01</span><span>01 : 04</span></div>
      <div className="mock-content">
        <span className="mock-eyebrow">LET'S UNDERSTAND</span>
        <h3>How do plants<br />make their food?</h3>
        <div className="sun-diagram" aria-label="Diagram of sunlight reaching a leaf">
          <svg viewBox="0 0 420 220" role="img">
            <title>Sunlight reaches a leaf, which combines water and carbon dioxide</title>
            <circle cx="65" cy="64" r="27" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M65 7v20M65 101v20M8 64h20M102 64h20M25 24l14 14M91 91l14 14M105 24 91 38M39 91l-14 14M108 68c74 9 100 39 145 57" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5"/>
            <path d="M245 147c43-82 91-79 126-58-13 59-70 81-126 58Zm0 0c-7 19-13 34-22 47m22-47 87-46" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M299 129c-2-12-8-18-17-24m35 16c2-10 7-18 17-24" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
          <span className="diagram-label label-sun">SUNLIGHT</span>
          <span className="diagram-label label-leaf">LEAF</span>
        </div>
        <p>Plants use sunlight, water and carbon dioxide to make food. This is called photosynthesis.</p>
      </div>
      <div className="mock-bottom"><span>EXPLANATION IN PROGRESS</span><div className="progress-track"><span /></div><span>0:24 / 1:10</span></div>
    </div>
  );
}

function VoiceCard() {
  return (
    <div className="mock-voice">
      <div className="mock-top"><span>OPED / ACTIVE RECALL</span><span>02 : 04</span></div>
      <div className="voice-main">
        <span className="mock-eyebrow">YOUR TURN NOW</span>
        <h3>Say it in<br /><em>your words.</em></h3>
        <p>How do plants make their own food?</p>
        <div className="waveform" aria-label="Illustrative voice waveform">
          {Array.from({ length: 51 }, (_, i) => (
            <span key={i} style={{ height: `${12 + Math.abs(Math.sin(i * 1.68) * Math.cos(i * .27)) * 74}%` }} />
          ))}
        </div>
        <div className="voice-rec">
          <div className="mic-circle"><Mic size={25} strokeWidth={1.5} /></div>
          <span>LISTENING TO YOUR EXPLANATION</span>
        </div>
      </div>
      <div className="mock-bottom"><span>NO SCRIPT. JUST UNDERSTANDING.</span><span>00:08</span></div>
    </div>
  );
}

function VerifyCard() {
  return (
    <div className="mock-verify">
      <div className="mock-top"><span>OPED / CONCEPT CHECK</span><span>03 : 04</span></div>
      <div className="verify-main">
        <span className="mock-eyebrow">WHAT YOU SAID</span>
        <blockquote>“The plant gets energy from the sun and uses water to make food.”</blockquote>
        <div className="verify-rule"/>
        <div className="verify-result">
          <span className="verify-icon"><Check size={29} strokeWidth={1.4}/></span>
          <div>
            <span>CONCEPT UNDERSTOOD</span>
            <p>You got the central idea. Let's make the role of carbon dioxide clearer before moving on.</p>
          </div>
        </div>
        <div className="verify-measures">
          <div><span>CORE IDEA</span><strong>Clear</strong></div>
          <div><span>DETAIL TO REVISIT</span><strong>CO₂</strong></div>
        </div>
      </div>
      <div className="mock-bottom"><span>LENIENT ON WORDS. STRICT ON IDEAS.</span><span>✓</span></div>
    </div>
  );
}

function BranchCard() {
  return (
    <div className="mock-branch">
      <div className="mock-top"><span>OPED / A DIFFERENT ANGLE</span><span>04 : 04</span></div>
      <div className="branch-main">
        <span className="mock-eyebrow">LET'S TRY THIS WAY</span>
        <h3>Think of a leaf<br />as a tiny <em>kitchen.</em></h3>
        <div className="branch-diagram">
          <span>SUNLIGHT<small>the energy</small></span>
          <span>+</span>
          <span>WATER<small>from the roots</small></span>
          <span>+</span>
          <span>CO₂<small>from the air</small></span>
          <span>→</span>
          <span>FOOD<small>for the plant</small></span>
        </div>
        <p>A different explanation for the part that needs another pass. Then, you try again.</p>
      </div>
      <div className="mock-bottom"><span>ADAPTED TO YOU</span><span>↗</span></div>
    </div>
  );
}

const visuals = [BlackboardCard, VoiceCard, VerifyCard, BranchCard];

function Index() {
  useLenis();
  const pageRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<NcertModule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);

  // 3D Pixar AI Teacher Controls
  const [isTeacherActive, setIsTeacherActive] = useState(true);
  const [showStudioControls, setShowStudioControls] = useState(false);
  const [customState, setCustomState] = useState<CharacterState | null>(null);
  const [customExpression, setCustomExpression] = useState<ExpressionType | null>(null);
  const [customGesture, setCustomGesture] = useState<GestureType | null>(null);
  const [customGaze, setCustomGaze] = useState<GazeTarget | null>(null);
  const [customPoint, setCustomPoint] = useState<PointTarget | null>(null);
  const [customPosition, setCustomPosition] = useState<PositionPreset>('bottom-right');
  const [greetingText, setGreetingText] = useState<string | null>(
    "Welcome to OPED! Search any NCERT chapter above or click a suggestion to start class!"
  );

  const [pendingModule, setPendingModule] = useState<NcertModule | null>(null);
  const [activeTopic, setActiveTopic] = useState<string>("Photosynthesis");

  const launchChapter = async (searchQuery: string) => {
    const clean = searchQuery.trim();
    if (!clean) return;
    setError(null);
    setActiveTopic(clean);
    const resolved = resolveQuery(clean);
    if (resolved.ok && resolved.module) {
      setPendingModule(resolved.module);
      setIsGenerating(true);
      return;
    }
    if (resolved.generatable) {
      setIsGenerating(true);
      const generated = await generateLessonModule({ ...resolved.generatable, topic: clean });
      if (generated) {
        setPendingModule(generated);
        return;
      }
      setIsGenerating(false);
      setError("Couldn't prepare that chapter right now — try again in a moment.");
      return;
    }
    setError(resolved.message ?? RULES.guidance);
  };

  const startLesson = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) void launchChapter(query.trim());
  };

  const playDemo = () => {
    if (demoPlaying) { setDemoPlaying(false); return; }
    setDemoPlaying(true);
    void launchChapter("photosynthesis");
  };

  const currentTeacherState: CharacterState = customState || (query ? 'pointing' : error ? 'thinking' : 'wave');
  const currentTeacherExpression: ExpressionType = customExpression || (query ? 'explaining' : error ? 'confused' : 'happy');
  const currentTeacherGesture: GestureType = customGesture || (query ? 'pointLeft' : error ? 'thinking' : 'wave');
  const currentPointTarget: PointTarget = customPoint || { target: 'input' };

  const [showPreloader, setShowPreloader] = useState(true);

  if (activeModule) {
    return (
      <BlackboardCanvas
        module={activeModule}
        onExit={() => {
          setActiveModule(null);
          setDemoPlaying(false);
        }}
      />
    );
  }

  return (
    <div className="site-shell" ref={pageRef}>
      {/* 3D SLANTED ZOOM SITE ENTRANCE PRELOADER */}
      {showPreloader && (
        <SitePreloader onComplete={() => setShowPreloader(false)} />
      )}

      <header className="site-header">
        <a href="#top" className="brand" aria-label="OPED home">
          <BrandMark size={32} variant="black" />
          <span>OPED<span>.</span></span>
        </a>
        <button
          onClick={() => {
            document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
            const el = document.querySelector('form[role="search"] input') as HTMLInputElement;
            el?.focus();
          }}
          className="header-action cursor-pointer bg-transparent border-0 flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-[var(--cyan)] transition-colors"
        >
          EXPLORE CHAPTERS <ArrowUpRight size={15}/>
        </button>
      </header>

      <main>
        {/* UNIFIED HERO SECTION WITH CENTERED SEARCH */}
        <section id="top" className="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-copy"
          >
            <h1 className="font-serif">Learn it.<br /><span className="script-word">Prove it.</span></h1>
            <p className="font-serif">Interactive NCERT chapter learning for Classes 4–10.</p>
            
            <div className="hero-search-wrap">
              <Doodle direction="left">start anywhere</Doodle>
              <form onSubmit={startLesson} className="hero-search" role="search">
                <Search size={21} strokeWidth={1.5}/>
                <input
                  aria-label="Search an NCERT chapter"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={isGenerating ? "Preparing lesson module..." : RULES.placeholder}
                  disabled={isGenerating}
                />
                <Button type="submit" size="icon" aria-label="Open classroom" disabled={isGenerating}>
                  {isGenerating ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <ArrowRight size={20}/>}
                </Button>
              </form>
            </div>

            {/* Error Guidance Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-4 flex max-w-xl mx-auto items-start gap-2.5 rounded-2xl border border-zinc-300 bg-white/95 px-4 py-3 text-sm text-zinc-900 shadow-sm backdrop-blur-md"
                >
                  <AlertIcon size={18} />
                  <span>
                    {error}
                    <span className="mt-0.5 block text-zinc-600">{RULES.guidanceExample}</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Suggestion Chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
              {suggestions.map((s, idx) => (
                <motion.button
                  key={s}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  onClick={() => {
                    setQuery(s);
                    setError(null);
                    void launchChapter(s);
                  }}
                  className="rounded-full border border-zinc-200/90 bg-white/80 hover:bg-white hover:border-[var(--cyan)] hover:text-[var(--cyan)] px-3.5 py-1.5 text-xs font-medium text-zinc-900 transition-all shadow-sm backdrop-blur-md cursor-pointer"
                >
                  {s}
                </motion.button>
              ))}
            </div>

            <a href="#chapters" className="hero-scroll">SCROLL TO EXPLORE <ChevronDown size={15}/></a>
          </motion.div>
        </section>

        {/* NCERT SUBJECTS & CHAPTER SELECTION */}
        <motion.section
          id="chapters"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="chapters-section content-width"
        >
          <div className="section-heading reveal">
            <Doodle direction="left">100% NCERT</Doodle>
            <h2>One chapter at a time.<br /><span className="script-word">Actually understood.</span></h2>
            <p>Classes 4 to 10. The chapters students really study, taught until they stick.</p>
          </div>
          <div className="subject-list">
            {subjects.map((item, i) => (
              <div
                className="subject-row group"
                key={item.name}
                onClick={() => void launchChapter(item.query)}
              >
                <span className="subject-index">0{i + 1}</span>
                <h3>{item.name}</h3>
                <p>{item.topics}</p>
                <ArrowUpRight size={18} strokeWidth={1.3} className="transition-transform group-hover:translate-x-1 group-hover:text-[var(--cyan)]" />
              </div>
            ))}
          </div>
          <p className="section-caption">BUILT FOR THE NCERT SYLLABUS. CLICK ANY SUBJECT TO START CLASSROOM LESSON.</p>
        </motion.section>

        {/* CLASSROOM PHOTO SHOWCASE */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="classroom-section content-width"
        >
          <div className="section-heading reveal">
            <Doodle>no passive watch-time</Doodle>
            <h2>Turn any screen into<br />a living <span className="script-word">Classroom.</span></h2>
          </div>
          <div className="classroom-photo">
            <img src={classroomImage} width={1536} height={1024} loading="lazy" alt="An original monochrome classroom with a large blackboard"/>
            <div className="photo-label">
              <span>THE BLACKBOARD IS THE CANVAS.</span>
              <span>TEXT / VISUALS / IDEAS</span>
            </div>
          </div>
        </motion.section>

        {/* THE OPED LOOP STORY SECTION */}
        <motion.section
          id="the-loop"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="story-section content-width"
        >
          <div className="story-intro">
            <span>THE OPED LOOP / 01—04</span>
            <p>Information out.<br />Understanding back.</p>
          </div>
          <div className="story-layout">
            <div className="story-left">
              <div className="story-sticky">
                <Doodle direction="left">closes the loop</Doodle>
                <h2>A lesson<br />that <span className="script-word">listens.</span></h2>
                <p>Not a video that ends. Not a chatbot that waits. A lesson that responds to you.</p>
                <div className="story-step-counter">DELIVER <span>→</span> SENSE <span>→</span> BRANCH <span>→</span> REWARD</div>
              </div>
            </div>
            <div className="story-right">
              {steps.map((step, i) => {
                const Visual = visuals[i];
                return (
                  <article className="story-step" key={step.id}>
                    <div className="story-visual">{Visual && <Visual/>}</div>
                    <div className="story-step-copy">
                      <span>0{Number(step.id)} / {step.label}</span>
                      <h3>{step.title.split("\n")[0]}<br/><em>{step.title.split("\n")[1]}</em></h3>
                      <p>{step.note}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* EXAM READINESS SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="readiness-section content-width"
        >
          <div className="readiness-copy reveal">
            <Doodle>badges are dead</Doodle>
            <h2>Not finished.<br /><span className="script-word">Ready.</span></h2>
            <p>Every recitation helps build one honest picture: what you understand, what needs another pass, and whether you are ready for the exam.</p>
            <span>ONE NUMBER THAT ACTUALLY MEANS SOMETHING.</span>
          </div>
          <div className="readiness-visual reveal">
            <div className="readiness-header">
              <span>CHAPTER READINESS</span>
              <span>CLASS 10 / SCIENCE</span>
            </div>
            <div className="readiness-score">82<span>%</span></div>
            <div className="readiness-meter"><span/></div>
            <div className="readiness-item"><Check size={17}/><span>Photosynthesis</span><strong>UNDERSTOOD</strong></div>
            <div className="readiness-item"><Check size={17}/><span>Nutrition in humans</span><strong>UNDERSTOOD</strong></div>
            <div className="readiness-item"><span className="readiness-ring"/><span>Respiration</span><strong>ANOTHER PASS</strong></div>
            <div className="readiness-footer">NO STREAKS. NO WATCH-TIME. JUST READINESS.</div>
          </div>
        </motion.section>

        {/* ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION */}
        <StackSpread />

        {/* FINAL CTA SECTION */}
        <section id="start" className="final-cta">
          <div className="paper-curl" aria-hidden="true"/>
          <div className="cta-content">
            <span className="cta-kicker">YOUR NEXT CHAPTER IS WAITING.</span>
            <h2>Start your<br /><span className="script-word">Chapter.</span></h2>
            <div className="cta-search-wrap">
              <Doodle direction="left">know that you know</Doodle>
              <form onSubmit={startLesson} className="cta-search" role="search">
                <input
                  aria-label="Search a chapter to start"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a chapter (e.g. Photosynthesis)..."
                />
                <Button type="submit" aria-label="Start learning">
                  Start learning <ArrowUpRight size={17}/>
                </Button>
              </form>
            </div>
            <span className="cta-small">FREE FOR STUDENTS. CLASSES 4—10. NCERT ONLY.</span>
          </div>
          <footer className="cta-footer">
            <a href="#top" className="brand">
              <BrandMark size={28} variant="white" />
              <span>OPED<span>.</span></span>
            </a>
            <span>LEARN IT. PROVE IT.</span>
            <a href="#top">BACK TO TOP ↑</a>
          </footer>
        </section>
      </main>

      {/* FLOATING QUICK DOCK & MENU OVERLAY */}
      <div className="floating-dock" aria-label="Quick actions">
        <Button type="button" className="dock-play" onClick={playDemo} aria-label={demoPlaying ? "Pause demo" : "Play demo"}>
          {demoPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}
        </Button>
        <Button
          type="button"
          className="dock-main"
          onClick={() => {
            document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
            const el = document.querySelector('form[role="search"] input') as HTMLInputElement;
            el?.focus();
          }}
        >
          Start learning / Search chapter
        </Button>
        <Button type="button" className="dock-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={24}/>
        </Button>
      </div>

      {menuOpen && (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="menu-top">
            <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
              <BrandMark size={28} />
              <span>OPED<span>.</span></span>
            </a>
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X/>
            </Button>
          </div>
          <nav>
            {[["The chapters", "chapters"], ["The classroom", "the-loop"], ["Start learning", "start"]].map(([label, id], i) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                <span>0{i + 1}</span>{label}<ArrowUpRight/>
              </a>
            ))}
          </nav>
          <p>LEARN IT. PROVE IT. / NCERT CLASSES 4—10</p>
        </div>
      )}

      {/* AWARDS LEVEL FULLSCREEN AI CHAPTER LOADER */}
      <AnimatePresence>
        {isGenerating && (
          <AwardLoader
            topic={activeTopic}
            onComplete={() => {
              setIsGenerating(false);
              if (pendingModule) {
                setActiveModule(pendingModule);
                setPendingModule(null);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Index;
