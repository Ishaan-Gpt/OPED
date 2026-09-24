const fs = require('fs');

let code = fs.readFileSync('src/routes/index.tsx', 'utf8');

code = code.replace(
  'import useLenis from "@/hooks/useLenis";',
  'import useLenis from "@/hooks/useLenis";\nimport gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\ngsap.registerPlugin(ScrollTrigger);'
);

code = code.replace(/initial="hidden"/g, '');
code = code.replace(/whileInView="visible"/g, '');
code = code.replace(/viewport={{[^}]*}}/g, '');
code = code.replace(/variants={[a-zA-Z]+}/g, '');

let startIndex = code.indexOf('<main>');
let endIndex = code.indexOf('</main>');

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find main tags");
  process.exit(1);
}

let mainContent = code.substring(startIndex + 6, endIndex);

const sections = [
  "UNIFIED HERO SECTION WITH CENTERED SEARCH",
  "NCERT SUBJECTS & CHAPTER SELECTION",
  "CLASSROOM PHOTO SHOWCASE",
  "THE OPED LOOP STORY SECTION",
  "EXAM READINESS SECTION",
  "ZERO COST SECTION WITH SCROLL-TRIGGERED STACK SPREAD MOTION",
  "FINAL CTA SECTION"
];

let wrappedContent = "";

for (let i = 0; i < sections.length; i++) {
  let startStr = `{/* ${sections[i]} */}`; 
  let sIndex = mainContent.indexOf(startStr);
  
  if (sIndex === -1) {
    // try without closing comment
    startStr = `{/* ${sections[i]}`;
    sIndex = mainContent.indexOf(startStr);
  }

  let eIndex = i < sections.length - 1 ? mainContent.indexOf(`{/* ${sections[i+1]}`) : mainContent.length;
  
  if (sIndex === -1) {
    console.log("Could not find section:", sections[i]);
    continue;
  }
  
  let sectionCode = mainContent.substring(sIndex, eIndex);
  
  let wrapperClass = `scroll-slide slide-${i+1} absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden bg-[var(--background)]`;
  if (i === 0) wrapperClass += " z-10"; 
  else wrapperClass += " z-0 opacity-0 pointer-events-none";
  
  wrappedContent += `\n<div className="${wrapperClass}">\n${sectionCode}\n</div>\n`;
}

let newMain = `<main className="main-wrapper relative w-full h-[100dvh] overflow-hidden bg-[var(--background)]">${wrappedContent}</main>`;

code = code.substring(0, startIndex) + newMain + code.substring(endIndex + 7);

let useGsapCode = `
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".main-wrapper",
          start: "top top",
          end: "+=700%",
          pin: true,
          scrub: 1,
        }
      });

      tl.to(".slide-1 .hero-copy", { opacity: 0, scale: 0.9, duration: 1 })
        .set(".slide-1", { autoAlpha: 0 });

      tl.set(".slide-2", { autoAlpha: 1 })
        .from(".slide-2", { opacity: 0, duration: 1 })
        .from(".slide-2 .section-heading", { y: 50, opacity: 0, duration: 0.5 }, "-=0.5")
        .from(".slide-2 .subject-list", { opacity: 0, duration: 0.5 })
        .to(".slide-2 .chapters-section", { opacity: 0, duration: 1 }, "+=1")
        .set(".slide-2", { autoAlpha: 0 });

      tl.set(".slide-3", { autoAlpha: 1 })
        .from(".slide-3", { opacity: 0, duration: 1 })
        .from(".slide-3 .section-heading", { opacity: 0, duration: 0.5 }, "-=0.5")
        .from(".slide-3 .classroom-photo", { scale: 0.9, opacity: 0, duration: 0.5 })
        .to(".slide-3 .classroom-section", { opacity: 0, duration: 1 }, "+=1")
        .set(".slide-3", { autoAlpha: 0 });

      tl.set(".slide-4", { autoAlpha: 1 })
        .from(".slide-4", { opacity: 0, duration: 1 })
        .to(".slide-4 .story-section", { opacity: 0, duration: 1 }, "+=1.5")
        .set(".slide-4", { autoAlpha: 0 });

      tl.set(".slide-5", { autoAlpha: 1 })
        .from(".slide-5", { opacity: 0, duration: 1 })
        .from(".slide-5 .readiness-copy", { x: -50, opacity: 0, duration: 0.5 }, "-=0.5")
        .from(".slide-5 .readiness-visual", { x: 50, opacity: 0, duration: 0.5 }, "<")
        .to(".slide-5 .readiness-section", { opacity: 0, duration: 1 }, "+=1")
        .set(".slide-5", { autoAlpha: 0 });

      tl.set(".slide-6", { autoAlpha: 1 })
        .from(".slide-6", { opacity: 0, duration: 1 })
        .to(".slide-6", { opacity: 0, duration: 1 }, "+=1")
        .set(".slide-6", { autoAlpha: 0 });

      tl.set(".slide-7", { autoAlpha: 1 })
        .from(".slide-7", { opacity: 0, duration: 1 })
        .from(".slide-7 .cta-content", { y: 100, opacity: 0, duration: 0.5 }, "-=0.5");
    });
  }, { scope: pageRef });
`;

code = code.replace(/const \[showPreloader, setShowPreloader\] = useState\(true\);/, 'const [showPreloader, setShowPreloader] = useState(true);\n' + useGsapCode);

fs.writeFileSync('src/routes/index.tsx', code, 'utf8');
console.log("Done rewriting index.tsx safely!");
