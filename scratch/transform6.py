import re

with open("src/routes/index.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Add GSAP imports
code = code.replace(
    'import { AnimatePresence, motion } from "framer-motion";',
    'import { AnimatePresence, motion } from "framer-motion";\nimport gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\ngsap.registerPlugin(ScrollTrigger);'
)

# Strip framer-motion scroll-trigger props globally for sections
code = re.sub(
    r'<motion\.section([^>]*)>',
    lambda m: '<section' + re.sub(r'\s*(initial="[^"]*"|animate="[^"]*"|whileInView="[^"]*"|viewport={{[^}]+}}|variants={[a-zA-Z]+})', '', m.group(1)) + '>',
    code
)
code = code.replace('</motion.section>', '</section>')

# Safely inject classes inside the quotes!
def inject_class(match, extra_class):
    return match.group(1) + f' {extra_class}"'

code = re.sub(r'(className="[^"]*?\bhero-section\b[^"]*)(")', lambda m: inject_class(m, "scroll-slide relative z-[10]"), code)
code = re.sub(r'(className="[^"]*?\bchapters-section\b[^"]*)(")', lambda m: inject_class(m, "scroll-slide bg-[var(--background)] relative z-[11]"), code)
code = re.sub(r'(className="[^"]*?\bclassroom-section\b[^"]*)(")', lambda m: inject_class(m, "scroll-slide bg-[var(--background)] relative z-[12] h-[100dvh] flex flex-col justify-center"), code) 
code = re.sub(r'(className="[^"]*?\bstory-section\b[^"]*)(")', lambda m: inject_class(m, "scroll-slide bg-[var(--background)] relative z-[13]"), code)
code = re.sub(r'(className="[^"]*?\breadiness-section\b[^"]*)(")', lambda m: inject_class(m, "scroll-slide bg-[var(--background)] relative z-[14]"), code)
code = re.sub(r'(className="[^"]*?\bfinal-cta\b[^"]*)(")', lambda m: inject_class(m, "scroll-slide bg-[var(--background)] relative z-[16]"), code)

# Clean up previous bad injects if any
code = re.sub(r'"\s*scroll-slide relative z-\[\d+\]"', '"', code)

# Wrap StackSpread in a section
code = code.replace(
    '<StackSpread />',
    '<section className="scroll-slide bg-[var(--background)] relative z-[15]">\n          <StackSpread />\n        </section>'
)

# Replace the Doodle direction in hero-search-wrap for the animation
code = code.replace('<Doodle direction="left" className="hero-doodle-2">100% Free</Doodle>', '<Doodle direction="right" className="hero-doodle-2">100% Free</Doodle>')
code = code.replace('<Doodle direction="left">100% Free</Doodle>', '<Doodle direction="right" className="hero-doodle-2">100% Free</Doodle>')
code = code.replace('<Doodle direction="left">Actually interactive</Doodle>', '<Doodle direction="left" className="hero-doodle-1">Actually interactive</Doodle>')

# IMPORTANT: Remove framer-motion from hero-copy because we will animate it with GSAP!
# We replace `<motion.div ... className="hero-copy">` with `<div className="hero-copy">`
code = re.sub(
    r'<motion\.div\s+initial={{[^}]+}}\s+animate={{[^}]+}}\s+transition={{[^}]+}}\s+className="hero-copy"\s*>',
    '<div className="hero-copy">',
    code
)
# And replace the exact closing tag for hero-copy
code = code.replace(
    '''            {/* Quick Suggestion Chips */}
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

            
          </motion.div>''',
    '''            {/* Quick Suggestion Chips */}
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

            
          </div>'''
)

gsap_code = """
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1px)", () => {
      
      // 1) Hero section - Appear-> Half element slide in from left rest half from right (ON LOAD!)
      gsap.from(".hero-section .hero-copy > :not(.hero-search-wrap)", { x: "-50vw", opacity: 0, duration: 1, ease: "power2.out", delay: 0.2 });
      gsap.from(".hero-section .hero-search-wrap", { x: "50vw", opacity: 0, duration: 1, ease: "power2.out", delay: 0.2 });
      
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
      // Out-> Opposide direction slide out
      heroTl.to(".hero-section .hero-copy > :not(.hero-search-wrap)", { x: "-50vw", opacity: 0, duration: 1 })
            .to(".hero-section .hero-search-wrap", { x: "50vw", opacity: 0, duration: 1 }, "<")
            .to(".hero-section", { opacity: 0, duration: 0.5 }); // Fade out background/remaining

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
      // 2) Section 2 Title earn in appear-> Scroll-> Scribble pop up-> and subject slide in one by one-> Slow fade out
      chapTl.from(".chapters-section .section-heading", { y: 50, opacity: 0, duration: 1 })
            .from(".chapters-section .chap-doodle", { scale: 0, opacity: 0, duration: 0.5 })
            .from(".chapters-section .subject-row", { x: -50, opacity: 0, stagger: 0.2, duration: 1 })
            .to({}, { duration: 1 })
            .to(".chapters-section", { opacity: 0, duration: 2 }); // Slow fade out

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
      // 3) (Learn any chapter-Make this section 100vh)Slow fade in title appear -> img appear-> fade out
      classTl.from(".classroom-section .section-heading", { opacity: 0, duration: 2 })
             .from(".classroom-section .classroom-photo", { scale: 0.9, opacity: 0, duration: 1.5 })
             .to({}, { duration: 1 })
             .to(".classroom-section", { opacity: 0, duration: 1.5 });

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
      // 4) Typewriter appear in-> Section already scroll triggered-> fade out
      storyTl.from(".story-section .story-left", { opacity: 0, duration: 1 })
             .fromTo(".story-section h2 .script-word", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 2, ease: "none" }, "<")
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
      // 5) Fade in for left part.. slide left for right part-> All fade out
      readTl.from(".readiness-section .readiness-copy", { opacity: 0, duration: 1.5 })
            .from(".readiness-section .readiness-visual", { opacity: 0, x: 100, duration: 1.5 }, "<")
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
      // 6) Fade in section-> Scection already scroll triggered-> Joinbeta then slide up smoothly..->
      ctaTl.from(".final-cta", { opacity: 0, duration: 1 })
           .from(".final-cta .cta-content", { y: 100, opacity: 0, duration: 1.5 }, "+=0.5");
    });
  }, { scope: pageRef });
"""

insert_pos = code.find('if (activeModule) {')
code = code[:insert_pos] + gsap_code + '\n  ' + code[insert_pos:]

with open("src/routes/index.tsx", "w", encoding="utf-8") as f:
    f.write(code)
