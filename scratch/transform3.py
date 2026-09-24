import re

with open("src/routes/index.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Add GSAP imports
code = code.replace(
    'import { AnimatePresence, motion } from "framer-motion";',
    'import { AnimatePresence, motion } from "framer-motion";\nimport gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\ngsap.registerPlugin(ScrollTrigger);'
)
code = code.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { motion, AnimatePresence } from "framer-motion";\nimport gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\ngsap.registerPlugin(ScrollTrigger);'
)

# Strip framer-motion scroll-trigger props globally for sections
# We only want to remove these from <motion.section> to leave motion.div intact!
code = re.sub(
    r'<motion\.section([^>]*)>',
    lambda m: '<section' + re.sub(r'\s*(initial="[^"]*"|animate="[^"]*"|whileInView="[^"]*"|viewport={{[^}]+}}|variants={[a-zA-Z]+})', '', m.group(1)) + '>',
    code
)
code = code.replace('</motion.section>', '</section>')

# Now inject bg-[var(--background)] relative z-[N] into the section classes
code = re.sub(r'(<section[^>]*?className="[^"]*?hero-section[^"]*")([^>]*>)', r'\1 scroll-slide bg-[var(--background)] relative z-[10]"\2', code)
code = re.sub(r'(<section[^>]*?className="[^"]*?chapters-section[^"]*")([^>]*>)', r'\1 scroll-slide bg-[var(--background)] relative z-[11]"\2', code)
code = re.sub(r'(<section[^>]*?className="[^"]*?classroom-section[^"]*")([^>]*>)', r'\1 scroll-slide bg-[var(--background)] relative z-[12]"\2', code)
code = re.sub(r'(<section[^>]*?className="[^"]*?story-section[^"]*")([^>]*>)', r'\1 scroll-slide bg-[var(--background)] relative z-[13]"\2', code)
code = re.sub(r'(<section[^>]*?className="[^"]*?readiness-section[^"]*")([^>]*>)', r'\1 scroll-slide bg-[var(--background)] relative z-[14]"\2', code)
code = re.sub(r'(<section[^>]*?className="[^"]*?final-cta[^"]*")([^>]*>)', r'\1 scroll-slide bg-[var(--background)] relative z-[16]"\2', code)

# Wrap StackSpread in a section
code = code.replace(
    '<StackSpread />',
    '<section className="scroll-slide bg-[var(--background)] relative z-[15]">\n          <StackSpread />\n        </section>'
)

# Replace the Doodle direction in hero-search-wrap for the animation
code = code.replace('<Doodle direction="left" className="hero-doodle-2">100% Free</Doodle>', '<Doodle direction="right" className="hero-doodle-2">100% Free</Doodle>')
code = code.replace('<Doodle direction="left">100% Free</Doodle>', '<Doodle direction="right" className="hero-doodle-2">100% Free</Doodle>')

# Make sure hero-copy has hero-doodle-1
code = code.replace('<Doodle direction="left">Actually interactive</Doodle>', '<Doodle direction="left" className="hero-doodle-1">Actually interactive</Doodle>')

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
