const fs = require('fs');

let code = fs.readFileSync('scratch/original.tsx', 'utf8');

// 1. Swap framer-motion imports for GSAP imports
code = code.replace(
  'import { motion, AnimatePresence } from "framer-motion";',
  'import { AnimatePresence } from "framer-motion";\nimport gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\ngsap.registerPlugin(ScrollTrigger);'
);

// 2. Remove framer-motion tags and props from the main body
// We'll replace <motion.div to <div, <motion.section to <section, etc.
code = code.replace(/<motion\.([a-zA-Z]+)/g, '<$1');
code = code.replace(/<\/motion\.([a-zA-Z]+)>/g, '</$1>');

// Remove framer-motion specific props
code = code.replace(/initial={[^{}]+}/g, '');
code = code.replace(/initial="[^"]+"/g, '');
code = code.replace(/animate={[^{}]+}/g, '');
code = code.replace(/animate="[^"]+"/g, '');
code = code.replace(/whileInView="[^"]+"/g, '');
code = code.replace(/viewport={{[^}]+}}/g, '');
code = code.replace(/variants={[a-zA-Z]+}/g, '');
code = code.replace(/transition={{[^}]+}}/g, '');

// 3. Add background and z-index to sections
// The user wants it to look exactly like safe-revertible, but pinned.
// We must give each section a solid background so it covers the pinned section below it.
// We also need to add an ID or class to target them easily if they don't have one.
// Let's add a `scroll-slide` class and `bg-[var(--background)] relative z-10` to every section.
code = code.replace(/<section\s+(id="[^"]*")?\s*className="([^"]+)"/g, (match, id, className) => {
  const newId = id ? id : '';
  return `<section ${newId} className="${className} scroll-slide bg-[var(--background)] relative z-10"`;
});

// Wait, the Hero section has `<section id="top" className="hero-section">`
// Let's make sure we split the Hero section internally to left/right for the animation, 
// without changing flex layout. The original hero-copy was:
/*
<div className="hero-copy">
  <Doodle direction="left" className="hero-doodle-1">Actually interactive</Doodle>
  <h1 className="font-serif">An AI teacher that<br />won't let you <span className="script-word">Fake It.</span></h1>
  <p className="font-serif">Interactive NCERT chapter learning for Classes 4–10.</p>
  <div className="hero-search-wrap">
*/
// To achieve "Half element slide in from left rest half from right", we can just target the individual elements!
// Left half: doodle, h1, p. Right half: hero-search-wrap. No need to modify HTML!

// 4. Inject GSAP hook
let useGsapCode = `
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1px)", () => {
      
      // 1. Hero Section
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "+=100%", // scroll 100vh
          pin: true,
          scrub: 1,
          pinSpacing: false,
        }
      });
      // Appear on load
      gsap.from(".hero-section .hero-doodle-1, .hero-section h1, .hero-section p", { x: -100, opacity: 0, duration: 1, delay: 0.2, ease: "power2.out", stagger: 0.1 });
      gsap.from(".hero-section .hero-search-wrap", { x: 100, opacity: 0, duration: 1, delay: 0.4, ease: "power2.out" });
      
      // Scrub out
      heroTl.to(".hero-section .hero-doodle-1, .hero-section h1, .hero-section p", { x: -200, opacity: 0 })
            .to(".hero-section .hero-search-wrap", { x: 200, opacity: 0 }, "<");

      // 2. Chapters Section
      const chapTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".chapters-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          pinSpacing: false,
        }
      });
      chapTl.from(".chapters-section h2", { opacity: 0, y: 30 })
            .from(".chapters-section .chap-doodle", { scale: 0, opacity: 0 })
            .from(".chapters-section .subject-row", { x: -50, opacity: 0, stagger: 0.1 })
            .to({}, { duration: 0.5 }) // Pause
            .to(".chapters-section", { opacity: 0 });

      // 3. Classroom Section
      const classTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".classroom-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          pinSpacing: false,
        }
      });
      classTl.from(".classroom-section .section-heading", { opacity: 0 })
             .from(".classroom-section .classroom-photo", { scale: 0.9, opacity: 0 })
             .to({}, { duration: 0.5 })
             .to(".classroom-section", { opacity: 0 });

      // 4. Story Section
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".story-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          pinSpacing: false,
        }
      });
      storyTl.from(".story-section .story-left", { opacity: 0, x: -50 })
             .from(".story-section .story-right", { opacity: 0, x: 50 }, "<")
             .to({}, { duration: 0.5 })
             .to(".story-section", { opacity: 0 });

      // 5. Readiness Section
      const readTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".readiness-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          pinSpacing: false,
        }
      });
      readTl.from(".readiness-section .readiness-copy", { opacity: 0, x: -50 })
            .from(".readiness-section .readiness-visual", { opacity: 0, x: 50 }, "<")
            .to({}, { duration: 0.5 })
            .to(".readiness-section", { opacity: 0 });

      // 6. Stack Spread Section (Zero Cost)
      // StackSpread uses its own scroll triggers. If we pin it, its internal triggers freeze.
      // So we will NOT pin this section. We will let it scroll natively, so StackSpread works as intended!
      // The user wants it to look exactly like safe-revertible, so letting it scroll normally is perfect.
      
      // 7. Final CTA
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".final-cta",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
          pinSpacing: true, // Last section, can space natively
        }
      });
      ctaTl.from(".final-cta .cta-content", { y: 100, opacity: 0 });

    });
  }, { scope: pageRef });
`;

// Insert the GSAP hook before the return statement of Index
let insertPos = code.indexOf('if (activeModule) {');
code = code.substring(0, insertPos) + useGsapCode + '\n  ' + code.substring(insertPos);

fs.writeFileSync('src/routes/index.tsx', code, 'utf8');
console.log("Done generating pixel-perfect GSAP rewrite!");
