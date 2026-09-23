import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Mic, Pause, Play, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import classroomImage from "@/assets/oped-classroom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "OPED — Learn it. Prove it." },
    { name: "description", content: "The first AI teacher that checks if you actually learned it. Free NCERT chapter learning for Classes 4–10." },
    { property: "og:title", content: "OPED — Learn it. Prove it." },
    { property: "og:description", content: "The first AI teacher that checks if you actually learned it. Free NCERT chapter learning for Classes 4–10." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const subjects = [
  { name: "Class 10 Science", topics: "Life Processes · Light · Electricity · Chemical Reactions" },
  { name: "Class 9 Mathematics", topics: "Number Systems · Polynomials · Coordinate Geometry" },
  { name: "Class 8 Science", topics: "Crop Production · Microorganisms · Force & Pressure" },
  { name: "Class 7 Mathematics", topics: "Integers · Fractions · Simple Equations · Geometry" },
  { name: "Classes 4–6", topics: "The World Around Us · Science · Mathematics · Social Studies" },
];

const steps = [
  { id: "01", label: "DELIVER", title: "Watch an idea\ncome to life.", accent: "life.", note: "The blackboard explains with words, visuals and examples. No recall demanded yet." },
  { id: "02", label: "SENSE", title: "Now say it\nback to us.", accent: "us.", note: "Your teacher says the important line twice. Then listens to you explain it out loud." },
  { id: "03", label: "VERIFY", title: "The idea, not\nthe exact words.", accent: "words.", note: "A hesitant half-right answer is different from a wrong one. OPED can tell." },
  { id: "04", label: "BRANCH", title: "Didn't click?\nTry another way.", accent: "way.", note: "A new explanation meets you where you are, instead of repeating the same one louder." },
];

function Doodle({ children, direction = "right" }: { children: React.ReactNode; direction?: "right" | "left" }) {
  return <div className={`doodle doodle-${direction}`} aria-hidden="true"><span>{children}</span><svg viewBox="0 0 95 50" fill="none"><path d="M4 6c19 11 9 29 37 23 16-3 8-23-4-13-11 9 15 25 48 17m-13-8 13 8-11 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
}

function BlackboardCard() {
  return <div className="mock-board"><div className="mock-top"><span>OPED / SCIENCE / CH. 01</span><span>01 : 04</span></div><div className="mock-content"><span className="mock-eyebrow">LET'S UNDERSTAND</span><h3>How do plants<br />make their food?</h3><div className="sun-diagram" aria-label="Diagram of sunlight reaching a leaf"><svg viewBox="0 0 420 220" role="img"><title>Sunlight reaches a leaf, which combines water and carbon dioxide</title><circle cx="65" cy="64" r="27" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M65 7v20M65 101v20M8 64h20M102 64h20M25 24l14 14M91 91l14 14M105 24 91 38M39 91l-14 14M108 68c74 9 100 39 145 57" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5"/><path d="M245 147c43-82 91-79 126-58-13 59-70 81-126 58Zm0 0c-7 19-13 34-22 47m22-47 87-46" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M299 129c-2-12-8-18-17-24m35 16c2-10 7-18 17-24" fill="none" stroke="currentColor" strokeWidth="1"/></svg><span className="diagram-label label-sun">SUNLIGHT</span><span className="diagram-label label-leaf">LEAF</span></div><p>Plants use sunlight, water and carbon dioxide to make food. This is called photosynthesis.</p></div><div className="mock-bottom"><span>EXPLANATION IN PROGRESS</span><div className="progress-track"><span /></div><span>0:24 / 1:10</span></div></div>;
}
function VoiceCard() {
  return <div className="mock-voice"><div className="mock-top"><span>OPED / ACTIVE RECALL</span><span>02 : 04</span></div><div className="voice-main"><span className="mock-eyebrow">YOUR TURN NOW</span><h3>Say it in<br /><em>your words.</em></h3><p>How do plants make their own food?</p><div className="waveform" aria-label="Illustrative voice waveform">{Array.from({ length: 51 }, (_, i) => <span key={i} style={{ height: `${12 + Math.abs(Math.sin(i * 1.68) * Math.cos(i * .27)) * 74}%` }} />)}</div><div className="voice-rec"><div className="mic-circle"><Mic size={25} strokeWidth={1.5} /></div><span>LISTENING TO YOUR EXPLANATION</span></div></div><div className="mock-bottom"><span>NO SCRIPT. JUST UNDERSTANDING.</span><span>00:08</span></div></div>;
}
function VerifyCard() {
  return <div className="mock-verify"><div className="mock-top"><span>OPED / CONCEPT CHECK</span><span>03 : 04</span></div><div className="verify-main"><span className="mock-eyebrow">WHAT YOU SAID</span><blockquote>“The plant gets energy from the sun and uses water to make food.”</blockquote><div className="verify-rule"/><div className="verify-result"><span className="verify-icon"><Check size={29} strokeWidth={1.4}/></span><div><span>CONCEPT UNDERSTOOD</span><p>You got the central idea. Let's make the role of carbon dioxide clearer before moving on.</p></div></div><div className="verify-measures"><div><span>CORE IDEA</span><strong>Clear</strong></div><div><span>DETAIL TO REVISIT</span><strong>CO₂</strong></div></div></div><div className="mock-bottom"><span>LENIENT ON WORDS. STRICT ON IDEAS.</span><span>✓</span></div></div>;
}
function BranchCard() {
  return <div className="mock-branch"><div className="mock-top"><span>OPED / A DIFFERENT ANGLE</span><span>04 : 04</span></div><div className="branch-main"><span className="mock-eyebrow">LET'S TRY THIS WAY</span><h3>Think of a leaf<br />as a tiny <em>kitchen.</em></h3><div className="branch-diagram"><span>SUNLIGHT<small>the energy</small></span><span>+</span><span>WATER<small>from the roots</small></span><span>+</span><span>CO₂<small>from the air</small></span><span>→</span><span>FOOD<small>for the plant</small></span></div><p>A different explanation for the part that needs another pass. Then, you try again.</p></div><div className="mock-bottom"><span>ADAPTED TO YOU</span><span>↗</span></div></div>;
}
const visuals = [BlackboardCard, VoiceCard, VerifyCard, BranchCard];

function Index() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [lesson, setLesson] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);

  useEffect(() => {
    let lenis: import("lenis").default | undefined;
    let frame = 0;
    let context: { revert: () => void } | undefined;
    let live = true;
    const setup = async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]);
      if (!live || !pageRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        const instance = new Lenis({ duration: 1.15, smoothWheel: true });
        lenis = instance;
        instance.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(tick); };
        frame = requestAnimationFrame(tick);
      }
      context = gsap.context(() => {
        if (reduce) return;
        gsap.fromTo(".hero-copy > *", { opacity: 0, y: 45 }, { opacity: 1, y: 0, stagger: .15, duration: 1.2, ease: "power3.out" });
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => gsap.fromTo(element, { opacity: 0, y: 55 }, { opacity: 1, y: 0, duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%" } }));
        gsap.to(".classroom-photo img", { scale: 1.13, ease: "none", scrollTrigger: { trigger: ".classroom-photo", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.utils.toArray<HTMLElement>(".story-visual").forEach((element) => {
          gsap.fromTo(element, { y: 95, opacity: .45, rotate: 2 }, { y: 0, opacity: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: element, start: "top 95%", end: "top 30%", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>(".float-card").forEach((element, index) => {
          gsap.fromTo(element, { y: 130 + index * 18, rotate: index % 2 ? 7 : -7, opacity: .3 }, { y: -90 - index * 12, rotate: index % 2 ? -3 : 3, opacity: 1, ease: "none", scrollTrigger: { trigger: ".free-section", start: "top bottom", end: "bottom top", scrub: true } });
        });
      }, pageRef);
      ScrollTrigger.refresh();
    };
    void setup();
    return () => { live = false; cancelAnimationFrame(frame); context?.revert(); lenis?.destroy(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = lesson || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lesson, menuOpen]);

  function openLesson(value: string) {
    setLesson(value);
    setStage(0);
    setAnswer("");
    setFeedback(false);
    setMenuOpen(false);
  }
  function startLesson(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) openLesson(query.trim());
  }
  function playDemo() {
    if (demoPlaying) { setDemoPlaying(false); return; }
    setDemoPlaying(true);
    openLesson("Photosynthesis");
    setDemoPlaying(false);
  }
  const isPlant = /plant|photo|food|leaf|science/i.test(lesson ?? "");
  const concept = isPlant ? "Plants use sunlight, water and carbon dioxide to make their own food. This process is called photosynthesis." : "A concept becomes clear when you can explain it in your own words.";

  return <div className="site-shell" ref={pageRef}>
    <header className="site-header"><a href="#top" className="brand" aria-label="OPED home">OPED<span>.</span></a><span className="header-note">THE FIRST AI TEACHER THAT CHECKS.</span><a href="#chapters" className="header-action">EXPLORE CHAPTERS <ArrowUpRight size={15}/></a></header>
    <main>
      <section id="top" className="hero-section">
        <div className="hero-copy"><span className="hero-eyebrow">AN EDUCATION WITH AN ANSWER</span><h1>Learn it.<br /><span className="script-word">Prove it.</span></h1><p>The first AI teacher that checks if you actually learned it.</p><div className="hero-search-wrap"><Doodle direction="left">start anywhere</Doodle><form onSubmit={startLesson} className="hero-search" role="search"><Search size={21} strokeWidth={1.5}/><input aria-label="Search an NCERT chapter" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search an NCERT chapter"/><Button type="submit" size="icon" aria-label="Open classroom"><ArrowRight size={20}/></Button></form></div><a href="#chapters" className="hero-scroll">SCROLL TO EXPLORE <ChevronDown size={15}/></a></div>
      </section>

      <section id="chapters" className="chapters-section content-width"><div className="section-heading reveal"><Doodle direction="left">100% NCERT</Doodle><h2>One chapter at a time.<br /><span className="script-word">Actually understood.</span></h2><p>Classes 4 to 10. The chapters students really study, taught until they stick.</p></div><div className="subject-list">{subjects.map((item, i) => <div className="subject-row" key={item.name}><span className="subject-index">0{i + 1}</span><h3>{item.name}</h3><p>{item.topics}</p><ArrowUpRight size={18} strokeWidth={1.3}/></div>)}</div><p className="section-caption">BUILT FOR THE NCERT SYLLABUS. NOT EVERYTHING FOR EVERYONE.</p></section>

      <section className="classroom-section content-width"><div className="section-heading reveal"><Doodle>no passive watch-time</Doodle><h2>Turn any screen into<br />a living <span className="script-word">Classroom.</span></h2></div><div className="classroom-photo"><img src={classroomImage} width={1536} height={1024} loading="lazy" alt="An original monochrome classroom with a large blackboard"/><div className="photo-label"><span>THE BLACKBOARD IS THE CANVAS.</span><span>TEXT / VISUALS / IDEAS</span></div></div></section>

      <section id="the-loop" className="story-section content-width"><div className="story-intro"><span>THE OPED LOOP / 01—04</span><p>Information out.<br />Understanding back.</p></div><div className="story-layout"><div className="story-left"><div className="story-sticky"><Doodle direction="left">closes the loop</Doodle><h2>A teacher<br />that <span className="script-word">listens.</span></h2><p>Not a video that ends. Not a chatbot that waits. A lesson that responds to you.</p><div className="story-step-counter">DELIVER <span>→</span> SENSE <span>→</span> BRANCH <span>→</span> REWARD</div></div></div><div className="story-right">{steps.map((step, i) => { const Visual = visuals[i]; return <article className="story-step" key={step.id}><div className="story-visual">{Visual && <Visual/>}</div><div className="story-step-copy"><span>0{Number(step.id)} / {step.label}</span><h3>{step.title.split("\n")[0]}<br/><em>{step.title.split("\n")[1]}</em></h3><p>{step.note}</p></div></article>; })}</div></div></section>

      <section className="readiness-section content-width"><div className="readiness-copy reveal"><Doodle>badges are dead</Doodle><h2>Not finished.<br /><span className="script-word">Ready.</span></h2><p>Every recitation helps build one honest picture: what you understand, what needs another pass, and whether you are ready for the exam.</p><span>ONE NUMBER THAT ACTUALLY MEANS SOMETHING.</span></div><div className="readiness-visual reveal"><div className="readiness-header"><span>CHAPTER READINESS</span><span>CLASS 10 / SCIENCE</span></div><div className="readiness-score">82<span>%</span></div><div className="readiness-meter"><span/></div><div className="readiness-item"><Check size={17}/><span>Photosynthesis</span><strong>UNDERSTOOD</strong></div><div className="readiness-item"><Check size={17}/><span>Nutrition in humans</span><strong>UNDERSTOOD</strong></div><div className="readiness-item"><span className="readiness-ring"/><span>Respiration</span><strong>ANOTHER PASS</strong></div><div className="readiness-footer">NO STREAKS. NO WATCH-TIME. JUST READINESS.</div></div></section>

      <section className="free-section"><div className="free-card-field" aria-hidden="true"><div className="float-card fc-1"><div className="float-bar">OPED / BLACKBOARD <span>01</span></div><div className="float-visual">☀ <span>→</span> ♧</div><small>LIGHT + WATER + CO₂ → FOOD</small></div><div className="float-card fc-2"><div className="float-bar">ACTIVE RECALL <span>02</span></div><div className="mini-wave">▂▅▇▄▂▆█▅▃▇▄▂▅▇▃</div><small>YOUR VOICE. YOUR WORDS.</small></div><div className="float-card fc-3"><div className="float-bar">CONCEPT CHECK <span>03</span></div><div className="float-check">✓</div><small>THE IDEA CAME THROUGH.</small></div><div className="float-card fc-4"><div className="float-bar">CHAPTER READINESS <span>04</span></div><div className="float-number">82%</div><small>PROGRESS THAT MEANS SOMETHING.</small></div><div className="float-card fc-5"><div className="float-bar">NCERT / CLASS 10 <span>05</span></div><div className="float-lines"><i/><i/><i/></div><small>CHAPTER 01 / LIFE PROCESSES</small></div><div className="float-card fc-6"><div className="float-bar">ADAPTIVE TEACHING <span>06</span></div><div className="float-branch">↗ &nbsp; ↘ &nbsp; ↗</div><small>ANOTHER WAY TO UNDERSTAND.</small></div></div><div className="free-center"><p>and for students it costs...</p><h2>zero<span>.</span></h2><div className="free-doodle">we charge schools <svg viewBox="0 0 80 42" fill="none"><path d="M4 4c5 33 48 5 66 27m-11-1 11 1-5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div></section>

      <section id="start" className="final-cta"><div className="paper-curl" aria-hidden="true"/><div className="cta-content"><span className="cta-kicker">YOUR NEXT CHAPTER IS WAITING.</span><h2>Start your<br /><span className="script-word">Chapter.</span></h2><div className="cta-search-wrap"><Doodle direction="left">know that you know</Doodle><form onSubmit={startLesson} className="cta-search" role="search"><input aria-label="Search a chapter to start" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a chapter"/><Button type="submit" aria-label="Start learning">Start learning <ArrowUpRight size={17}/></Button></form></div><span className="cta-small">FREE FOR STUDENTS. CLASSES 4—10. NCERT ONLY.</span></div><footer className="cta-footer"><a href="#top" className="brand">OPED<span>.</span></a><span>LEARN IT. PROVE IT.</span><a href="#top">BACK TO TOP ↑</a></footer></section>
    </main>
    <div className="floating-dock" aria-label="Quick actions"><Button type="button" className="dock-play" onClick={playDemo} aria-label={demoPlaying ? "Pause demo" : "Play demo"}>{demoPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}</Button><Button type="button" className="dock-main" onClick={() => document.getElementById("start")?.scrollIntoView({ behavior: "smooth" })}>Start learning / Search chapter</Button><Button type="button" className="dock-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={24}/></Button></div>
    {menuOpen && <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu"><div className="menu-top"><span className="brand">OPED<span>.</span></span><Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></Button></div><nav>{[["The chapters", "chapters"], ["The classroom", "the-loop"], ["Start learning", "start"]].map(([label, id], i) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight/></a>)}</nav><p>LEARN IT. PROVE IT. / NCERT CLASSES 4—10</p></div>}
    {lesson && <div className="lesson-overlay" role="dialog" aria-modal="true" aria-label="Classroom preview"><div className="lesson-header"><div className="brand">OPED<span>.</span></div><span>CLASSROOM PREVIEW / {lesson.toUpperCase()}</span><Button variant="ghost" size="icon" onClick={() => setLesson(null)} aria-label="Close classroom"><X size={23}/></Button></div><div className="lesson-room"><div className="lesson-board"><div className="board-top"><span>NCERT / CLASSROOM</span><span>0{stage + 1} — 03</span></div>{stage === 0 && <div className="board-center"><span className="board-label">01 / UNDERSTAND</span><h2>{lesson}</h2><p>{concept}</p><span className="board-footnote">Read the idea. Then see if you can say it back.</span></div>}{stage === 1 && <div className="board-center"><span className="board-label">02 / RECALL</span><h2>YOUR TURN.</h2><p>In your own words, what was the main idea?</p><label className="sr-only" htmlFor="recall-answer">Your explanation</label><textarea id="recall-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Say it in your own words…" rows={3}/><span className="board-footnote"><Mic size={14}/> This preview uses typed responses. Voice assessment is not active here.</span></div>}{stage === 2 && <div className="board-center"><span className="board-label">03 / REFLECT</span><h2>KEEP<br/>GOING.</h2><p>You wrote: “{answer}”</p><span className="board-footnote">This is a preview, not an assessment. OPED’s full classroom would check the idea and adapt the next explanation.</span></div>}</div><div className="lesson-controls"><Button variant="outline" onClick={() => { if (stage === 0) setLesson(null); else { setStage(stage - 1); setFeedback(false); } }}><ArrowLeft size={16}/> {stage === 0 ? "Back to site" : "Previous"}</Button><span>THE OPED LOOP · {stage === 0 ? "DELIVER" : stage === 1 ? "SENSE" : "BRANCH"}</span>{stage < 2 ? <Button onClick={() => { if (stage === 1 && answer.trim().length < 5) { setFeedback(true); return; } setFeedback(false); setStage(stage + 1); }}>{stage === 0 ? "Try recall" : "Continue"} <ArrowRight size={16}/></Button> : <Button onClick={() => { setStage(0); setAnswer(""); }}>Start again <ArrowRight size={16}/></Button>}</div>{feedback && <p className="lesson-warning">Write a little more before continuing.</p>}</div></div>}
  </div>;
}
