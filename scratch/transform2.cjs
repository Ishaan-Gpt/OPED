const fs = require('fs');

let code = fs.readFileSync('scratch/original.tsx', 'utf8');

// Add GSAP imports
code = code.replace(
  'import { motion, AnimatePresence } from "framer-motion";',
  'import { motion, AnimatePresence } from "framer-motion";\nimport gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\ngsap.registerPlugin(ScrollTrigger);'
);

// We want to KEEP framer-motion for the interactive things (error alert, story typewriter, suggestion chips),
// but we want to DISABLE framer-motion's scroll animations (whileInView) so GSAP can take over.
// We also need to add bg-[var(--background)] to the sections so they cover each other.

// 1. Hero Section
// Original: <motion.section id="top" initial="hidden" animate="visible" variants={staggerContainer} className="hero-section">
code = code.replace(
  /<motion\.section\s+id="top"\s+initial="hidden"\s+animate="visible"\s+variants={staggerContainer}\s+className="hero-section">/g,
  '<section id="top" className="hero-section scroll-slide bg-[var(--background)] relative z-10">'
);
code = code.replace(
  /<\/motion\.section>/g,
  '</section>' // Since we will replace all <motion.section> with <section>
);

// We need to change the inner motion.divs of the hero to just regular divs so they don't hide on load
// But doing it via regex is tricky. 
// Instead, let's just strip `initial="hidden"`, `whileInView="visible"`, `animate="visible"` globally!
// Wait, the error alert uses `initial={{ opacity: 0, y: -6 }}`, not `"hidden"`. So it's safe!
code = code.replace(/initial="hidden"/g, '');
code = code.replace(/animate="visible"/g, '');
code = code.replace(/whileInView="visible"/g, '');
code = code.replace(/viewport={{[^}]+}}/g, '');
code = code.replace(/variants={[a-zA-Z]+}/g, '');

// Now replace all <motion.section with <section
code = code.replace(/<motion\.section/g, '<section');

// Add classes to the other sections
code = code.replace(/className="chapters-section content-width"/g, 'className="chapters-section content-width scroll-slide bg-[var(--background)] relative z-[11]"');
code = code.replace(/className="classroom-section content-width"/g, 'className="classroom-section content-width scroll-slide bg-[var(--background)] relative z-[12]"');
code = code.replace(/className="story-section content-width"/g, 'className="story-section content-width scroll-slide bg-[var(--background)] relative z-[13]"');
code = code.replace(/className="readiness-section content-width"/g, 'className="readiness-section content-width scroll-slide bg-[var(--background)] relative z-[14]"');

// Zero cost section isn't a motion.section, it's just <StackSpread /> inside <main>.
// Actually, it's not wrapped in a section in original.tsx! It's just:
// {/* ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION */}
// <StackSpread />
// We need to wrap it in a section with background so it stacks correctly!
code = code.replace(
  /{\/\*\s*ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION\s*\*\/}\s*<StackSpread \/>/,
  '{/* ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION */}\n        <section className="scroll-slide bg-[var(--background)] relative z-[15]">\n          <StackSpread />\n        </section>'
);

// Final CTA
code = code.replace(/className="final-cta"/g, 'className="final-cta scroll-slide bg-[var(--background)] relative z-[16]"');
// Oh wait, in original.tsx, the CTA is a motion.section too?
// Let's check original.tsx for final-cta. It is <motion.section id="start" ... className="final-cta">

let useGsapCode = `
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1px)", () => {
      
      // We will pin each section one by one
      // 1. Hero Section
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          pinSpacing: false,
        }
      });
      // Appear on load (Left/Right split as requested)
      gsap.from("#top .hero-doodle-1, #top h1, #top p", { x: -100, opacity: 0, duration: 1, delay: 0.2, ease: "power2.out", stagger: 0.1 });
      gsap.from("#top .hero-search-wrap", { x: 100, opacity: 0, duration: 1, delay: 0.4, ease: "power2.out" });
      
      // Scrub out
      heroTl.to({}, { duration: 0.5 })
            .to("#top .hero-doodle-1, #top h1, #top p", { x: -200, opacity: 0 })
            .to("#top .hero-search-wrap", { x: 200, opacity: 0 }, "<");

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
      // Title earn in as it scrolls up natively
      gsap.from(".chapters-section h2", {
        scrollTrigger: { trigger: ".chapters-section", start: "top 80%" },
        opacity: 0, y: 30, duration: 1
      });

      chapTl.from(".chapters-section .chap-doodle", { scale: 0, opacity: 0, duration: 0.5 })
            .from(".chapters-section .subject-row", { x: -50, opacity: 0, stagger: 0.1, duration: 1 })
            .to({}, { duration: 1 }) // Pause
            .to(".chapters-section", { opacity: 0, duration: 1 });

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
      classTl.from(".classroom-section .section-heading", { opacity: 0, y: 20, duration: 1 })
             .from(".classroom-section .classroom-photo", { scale: 0.9, opacity: 0, duration: 1 })
             .to({}, { duration: 1 })
             .to(".classroom-section", { opacity: 0, duration: 1 });

      // 4. Story Section
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".story-section",
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          pinSpacing: false,
        }
      });
      storyTl.from(".story-section .story-left", { opacity: 0, x: -50, duration: 1 })
             .from(".story-section .story-right", { opacity: 0, x: 50, duration: 1 }, "<")
             .to({}, { duration: 1 })
             .to(".story-section", { opacity: 0, duration: 1 });

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
      readTl.from(".readiness-section .readiness-copy", { opacity: 0, x: -50, duration: 1 })
            .from(".readiness-section .readiness-visual", { opacity: 0, x: 50, duration: 1 }, "<0.5")
            .to({}, { duration: 1 })
            .to(".readiness-section", { opacity: 0, duration: 1 });

      // 6. StackSpread Section
      // We do NOT pin this one. We just let it scroll natively so StackSpread works perfectly!

      // 7. Final CTA
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".final-cta",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
          pinSpacing: true, // End of page
        }
      });
      ctaTl.from(".final-cta .cta-content", { y: 100, opacity: 0, duration: 1 });
    });
  }, { scope: pageRef });
`;

let insertPos = code.indexOf('if (activeModule) {');
code = code.substring(0, insertPos) + useGsapCode + '\n  ' + code.substring(insertPos);

fs.writeFileSync('src/routes/index.tsx', code, 'utf8');
console.log("Done rewriting strictly to original layout!");
