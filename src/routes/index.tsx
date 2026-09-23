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
import InitialPreloader from "@/components/InitialPreloader";
import StackSpread from "@/components/ui/stack-spread";
import useLenis from "@/hooks/useLenis";


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

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const fadeUp: any = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};
const fadeLeft: any = {
  hidden: { opacity: 0, x: -30, filter: "blur(10px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};
const fadeRight: any = {
  hidden: { opacity: 0, x: 30, filter: "blur(10px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};
const popIn: any = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.17, 0.55, 0.55, 1] } }
};

const subjects = [
  { name: "Mathematics", topics: "Algebra · Geometry · Mensuration · Number Systems", query: "Algebra" },
  { name: "Science", topics: "Physics · Chemistry · Biology", query: "Physics" },
  { name: "Social Science", topics: "History · Geography · Civics", query: "History" },
  { name: "English", topics: "Grammar · Comprehension · Writing", query: "Grammar" },
];

const steps = [
  { id: "01", label: "ACTIVE RECALL", title: "Proof it's not\njust watching.", accent: "watching.", note: "A hesitant half-right answer is different from a wrong one. OPED can tell." },
  { id: "02", label: "TARGETED FIXES", title: "Get matched with\nyour own gaps.", accent: "gaps.", note: "Weak concepts are flagged automatically, and a re-teach is queued. Less re-reading, more targeted fixing." },
  { id: "03", label: "REVISION", title: "Schedule your next\nrevision pass.", accent: "pass.", note: "Before the exam catches you off guard. Add to revision plan with one click." },
];

function Doodle({ children, direction = "right", className = "" }: { children: React.ReactNode; direction?: "right" | "left", className?: string }) {
  return (
    <div className={`doodle doodle-${direction} ${className}`} aria-hidden="true">
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

const visuals = [VoiceCard, VerifyCard, BranchCard];

function Index() {
  useLenis();
  const pageRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<NcertModule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);

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
        <InitialPreloader onComplete={() => setShowPreloader(false)} />
      )}

      <header className="site-header">
        <a href="#top" className="brand" aria-label="OPED home">
          <BrandMark size={42} variant="black" />
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
            <Doodle direction="left" className="hero-doodle-1">Actually interactive</Doodle>
            <h1 className="font-serif">An AI teacher that<br />won't let you <span className="script-word">Fake It.</span></h1>
            <p className="font-serif">Interactive NCERT chapter learning for Classes 4–10.</p>
            
            <div className="hero-search-wrap">
              
              <Doodle direction="right" className="hero-doodle-2">100% Free</Doodle>
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

            
          </motion.div>
        </section>

        {/* NCERT SUBJECTS & CHAPTER SELECTION */}
        <motion.section
          id="chapters"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
          className="chapters-section content-width"
        >
          <motion.div className="section-heading reveal" variants={fadeUp}>
            <Doodle direction="left">Class 4 to 10</Doodle>
            <motion.h2 variants={fadeUp}>Get exam-ready for<br /><span className="script-word">every Ncert chapter.</span></motion.h2>
          </motion.div>
          <motion.div className="subject-list" variants={staggerContainer}>
            {subjects.map((item, i) => (
              <motion.div
                variants={fadeLeft}
                className="subject-row group"
                key={item.name}
                onClick={() => void launchChapter(item.query)}
              >
                <span className="subject-index">0{i + 1}</span>
                <motion.h3 variants={fadeLeft}>{item.name}</motion.h3>
                <motion.p variants={fadeLeft}>{item.topics}</motion.p>
                <ArrowUpRight size={18} strokeWidth={1.3} className="transition-transform group-hover:translate-x-1 group-hover:text-[var(--cyan)]" />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CLASSROOM PHOTO SHOWCASE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
          className="classroom-section content-width"
        >
          <motion.div className="section-heading reveal" variants={fadeUp}>
            <Doodle>no PDFs, no passive video</Doodle>
            <motion.h2 variants={fadeUp}>Learn any chapter on an<br />immersive, all-in-one <span className="script-word">blackboard.</span></motion.h2>
          </motion.div>
          <motion.div className="classroom-photo" variants={popIn}>
            <img src={classroomImage} width={1536} height={1024} loading="lazy" alt="An original monochrome classroom with a large blackboard"/>
            <div className="photo-label">
              <span>THE BLACKBOARD IS THE CANVAS.</span>
              <span>TEXT / VISUALS / IDEAS</span>
            </div>
          </motion.div>
        </motion.section>

        {/* THE OPED LOOP STORY SECTION */}
        <motion.section
          id="the-loop"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
          className="story-section content-width"
        >
          <div className="story-layout">
            <div className="story-left">
              <motion.div className="story-sticky" variants={fadeLeft}>
                <Doodle direction="left">closes the loop</Doodle>
                <div className="relative h-[250px] md:h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStoryStep}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0 pt-6"
                    >
                      {(() => {
                        const cur = steps[activeStoryStep] ?? steps[0];
                        const lines = cur ? cur.title.split("\n") : ["", ""];
                        return (
                          <>
                            <h2>{lines[0]}<br />
                              <span className="script-word">
                                {lines[1]}
                              </span>
                            </h2>
                            <p className="mt-4">{cur?.note}</p>
                          </>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
            <div className="story-right">
              {steps.map((step, i) => {
                const Visual = visuals[i];
                return (
                  <motion.article 
                    className={`story-step ${activeStoryStep === i ? "active" : ""}`} 
                    key={step.id} 
                    variants={fadeRight}
                    onViewportEnter={() => setActiveStoryStep(i)}
                    viewport={{ margin: "-50% 0px -50% 0px" }}
                  >
                    <div className="story-visual">{Visual && <Visual/>}</div>
                    <div className="story-step-copy">
                      <span>0{Number(step.id)} / {step.label}</span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* EXAM READINESS SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
          className="readiness-section content-width"
        >
          <motion.div className="readiness-copy reveal" variants={fadeLeft}>
            <Doodle>marks alone don't show what's solid</Doodle>
            <motion.h2 variants={fadeUp}>Build a readiness score that<br /><span className="script-word text-[0.8em]">actually means something.</span></motion.h2>
          </motion.div>
          <motion.div className="readiness-visual reveal" variants={fadeRight}>
            <div className="readiness-header">
              <span>CHAPTER READINESS</span>
              <span>CLASS 10 / SCIENCE</span>
            </div>
            <div className="readiness-score">82<span>%</span></div>
            <div className="readiness-meter"><span/></div>
            <div className="readiness-item"><Check size={17}/><span>Photosynthesis</span><strong>UNDERSTOOD</strong></div>
            <div className="readiness-item"><Check size={17}/><span>Nutrition in humans</span><strong>UNDERSTOOD</strong></div>
            <div className="readiness-item"><span className="readiness-ring"/><span>Respiration</span><strong>ANOTHER PASS</strong></div>
          </motion.div>
        </motion.section>

        {/* ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION */}
        <StackSpread />

        {/* FINAL CTA SECTION */}
        <motion.section 
          id="start" 
          className="final-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
        >
          <div className="paper-curl" aria-hidden="true"/>
          <motion.div className="cta-content" variants={fadeUp}>
            <span className="cta-kicker">WE WANT YOU TO GET EXAM-READY. YOU LEARN, WE GROW.</span>
            <motion.h2 variants={fadeUp}>Join our<br /><span className="script-word">Beta.</span></motion.h2>
            <div className="cta-search-wrap">
              <Doodle direction="left">Beta Phase 2, opening soon.</Doodle>
              <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for joining the beta!"); }} className="cta-search">
                <input
                  type="email"
                  aria-label="Enter your email to join the beta"
                  placeholder="Enter your email address..."
                  required
                />
                <Button type="submit" aria-label="Join Beta">
                  Join Beta <ArrowUpRight size={17}/>
                </Button>
              </form>
            </div>
          </motion.div>
          <motion.footer className="cta-footer" variants={fadeUp}>
            <a href="#top" className="brand">
              <BrandMark size={28} variant="white" />
              <span>OPED<span>.</span></span>
            </a>
            <span>LEARN IT. PROVE IT.</span>
            <a href="#top">BACK TO TOP ↑</a>
          </motion.footer>
        </motion.section>
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
