import re
import os

with open("src/routes/index.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Add GSAP imports
code = code.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { motion, AnimatePresence } from "framer-motion";\nimport gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\ngsap.registerPlugin(ScrollTrigger);'
)

# Strip framer-motion scroll-trigger props globally
code = code.replace('initial="hidden"', '')
code = code.replace('animate="visible"', '')
code = code.replace('whileInView="visible"', '')
code = re.sub(r'viewport={{[^}]+}}', '', code)
code = re.sub(r'variants={[a-zA-Z]+}', '', code)

# Convert all motion.section to section
code = code.replace('<motion.section', '<section')
code = code.replace('</motion.section>', '</section>')

# Add scroll-slide and backgrounds
code = code.replace(
    '<section id="top"    className="hero-section"',
    '<section id="top" className="hero-section scroll-slide bg-[var(--background)] relative z-10"'
)
code = code.replace(
    '<section id="top"\n          className="hero-section"',
    '<section id="top" className="hero-section scroll-slide bg-[var(--background)] relative z-10"'
)
code = code.replace(
    'className="hero-section"',
    'className="hero-section scroll-slide bg-[var(--background)] relative z-10"'
)
code = code.replace(
    'className="chapters-section content-width"',
    'className="chapters-section content-width scroll-slide bg-[var(--background)] relative z-[11]"'
)
code = code.replace(
    'className="classroom-section content-width"',
    'className="classroom-section content-width scroll-slide bg-[var(--background)] relative z-[12]"'
)
code = code.replace(
    'className="story-section content-width"',
    'className="story-section content-width scroll-slide bg-[var(--background)] relative z-[13]"'
)
code = code.replace(
    'className="readiness-section content-width"',
    'className="readiness-section content-width scroll-slide bg-[var(--background)] relative z-[14]"'
)
code = code.replace(
    '{/* ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION */}\n        <StackSpread />',
    '{/* ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION */}\n        <section className="scroll-slide bg-[var(--background)] relative z-[15]">\n          <StackSpread />\n        </section>'
)
code = code.replace(
    'className="final-cta"',
    'className="final-cta scroll-slide bg-[var(--background)] relative z-[16]"'
)

gsap_code = """
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1px)", () => {
      
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1.2,
          pinSpacing: false,
        }
      });
      gsap.from(".hero-section .hero-doodle-1, .hero-section h1, .hero-section p", { x: "-20vw", opacity: 0, duration: 1, delay: 0.2, ease: "power2.out", stagger: 0.1 });
      gsap.from(".hero-section .hero-search-wrap", { x: "20vw", opacity: 0, duration: 1, delay: 0.4, ease: "power2.out" });
      heroTl.to({}, { duration: 0.5 })
            .to(".hero-section .hero-doodle-1, .hero-section h1, .hero-section p", { x: "-30vw", opacity: 0 })
            .to(".hero-section .hero-search-wrap", { x: "30vw", opacity: 0 }, "<");

      const chapTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".chapters-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1.2,
          pinSpacing: false,
        }
      });
      gsap.from(".chapters-section h2", {
        scrollTrigger: { trigger: ".chapters-section", start: "top 80%" },
        opacity: 0, y: 30, duration: 1
      });
      chapTl.from(".chapters-section .chap-doodle", { scale: 0, opacity: 0, duration: 0.5 })
            .from(".chapters-section .subject-row", { x: -50, opacity: 0, stagger: 0.1, duration: 1 })
            .to({}, { duration: 1 })
            .to(".chapters-section", { opacity: 0, duration: 1 });

      const classTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".classroom-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1.2,
          pinSpacing: false,
        }
      });
      classTl.from(".classroom-section .section-heading", { opacity: 0, y: 20, duration: 1 })
             .from(".classroom-section .classroom-photo", { scale: 0.9, opacity: 0, duration: 1 })
             .to({}, { duration: 1 })
             .to(".classroom-section", { opacity: 0, duration: 1 });

      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".story-section",
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.2,
          pinSpacing: false,
        }
      });
      storyTl.from(".story-section .story-left", { opacity: 0, x: -50, duration: 1 })
             .from(".story-section .story-right", { opacity: 0, x: 50, duration: 1 }, "<")
             .to({}, { duration: 1 })
             .to(".story-section", { opacity: 0, duration: 1 });

      const readTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".readiness-section",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1.2,
          pinSpacing: false,
        }
      });
      readTl.from(".readiness-section .readiness-copy", { opacity: 0, x: -50, duration: 1 })
            .from(".readiness-section .readiness-visual", { opacity: 0, x: 50, duration: 1 }, "<0.5")
            .to({}, { duration: 1 })
            .to(".readiness-section", { opacity: 0, duration: 1 });

      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".final-cta",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1.2,
          pinSpacing: true,
        }
      });
      ctaTl.from(".final-cta .cta-content", { y: 100, opacity: 0, duration: 1 });
    });
  }, { scope: pageRef });
"""

insert_pos = code.find('if (activeModule) {')
code = code[:insert_pos] + gsap_code + '\n  ' + code[insert_pos:]

with open("src/routes/index.tsx", "w", encoding="utf-8") as f:
    f.write(code)
