"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function Home() {
  const staggerContainer = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <main className="w-full overflow-hidden bg-[var(--color-off-white)]">
      {/* Hero Section */}
      <Section className="min-h-[90vh] flex flex-col justify-center relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-start max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
            <span className="h-[2px] w-12 bg-[var(--color-royal-primary)] inline-block"></span>
            <Typography variant="small" className="text-[var(--color-royal-primary)] font-bold uppercase tracking-widest">
              A New Standard
            </Typography>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <Typography variant="h1" className="mb-6">
              Experience the Pinnacle of Digital <span className="text-[var(--color-teal-primary)]">Design</span>
            </Typography>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Typography variant="body" className="mb-10 max-w-2xl text-lg text-gray-600">
              We build photorealistic, deterministic user interfaces that prioritize modularity, 
              performance, and absolute visual perfection. 
            </Typography>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
            <Button variant="primary" className="group">
              Explore Our Work
              <Icon name="arrow-right" className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline">
              Learn the Principles
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative background element for photorealistic depth */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[600px] bg-white rounded-3xl shadow-photo hidden lg:block border border-gray-100"
        >
          <div className="absolute inset-4 rounded-2xl bg-[var(--color-gray-50)] border border-gray-100/50 flex flex-col p-8 justify-between">
            <div className="flex justify-between items-center w-full">
              <div className="w-12 h-12 rounded-full bg-[var(--color-teal-light)] flex items-center justify-center">
                 <Icon name="star" className="text-[var(--color-teal-primary)] w-5 h-5" />
              </div>
              <Icon name="menu" className="text-gray-400 w-6 h-6" />
            </div>
            
            <div className="space-y-4">
              <div className="w-full h-24 bg-white rounded-xl shadow-sm border border-gray-100"></div>
              <div className="w-3/4 h-16 bg-white rounded-xl shadow-sm border border-gray-100"></div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Feature Section */}
      <Section className="bg-white border-t border-gray-100 shadow-sm relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Modular Code",
              desc: "Independent components designed for reuse without repeating code. Built with React and TypeScript standards.",
              color: "var(--color-teal-primary)"
            },
            {
              title: "Smooth Animations",
              desc: "Buttery smooth scroll experiences powered by Lenis and orchestrated by Framer Motion.",
              color: "var(--color-royal-primary)"
            },
            {
              title: "Photorealistic UI",
              desc: "Strictly adhering to a white-major palette with rich shadows, simulating real-world depth and tactility.",
              color: "var(--color-brown-primary)"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col gap-4 p-8 rounded-2xl bg-white shadow-photo border border-gray-50 hover:shadow-photo-hover transition-shadow"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50" style={{ color: feature.color }}>
                 <Icon name="star" size={20} />
              </div>
              <Typography variant="h4">{feature.title}</Typography>
              <Typography variant="body" className="text-sm">{feature.desc}</Typography>
            </motion.div>
          ))}
        </div>
      </Section>
    </main>
  );
}
