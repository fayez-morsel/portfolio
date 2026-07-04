"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight, Globe } from "lucide-react";

// Canvas Components (Client side only, imported dynamically to prevent hydration mismatches)
import dynamic from "next/dynamic";

const UserAvatar = dynamic(() => import("@/components/UserAvatar"), { ssr: false });
const AboutLeftCanvas = dynamic(() => import("@/components/AboutLeftCanvas"), { ssr: false });
const AboutRightCanvas = dynamic(() => import("@/components/AboutRightCanvas"), { ssr: false });
const TorusCanvas = dynamic(() => import("@/components/TorusCanvas"), { ssr: false });
const FooterCanvas = dynamic(() => import("@/components/FooterCanvas"), { ssr: false });

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [inServices, setInServices] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1025);
    };
    checkResize();
    window.addEventListener("resize", checkResize);
    return () => window.removeEventListener("resize", checkResize);
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Track global mouse coordinates for radial background glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Background color transition trigger for Services section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInServices(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "-20% 0px -20% 0px" }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  // Simple section highlighting on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  const services = [
    {
      num: "01",
      title: "3D Modeling",
      desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
    },
    {
      num: "02",
      title: "Photorealistic Renders",
      desc: "High-quality, photorealistic renders that showcase designs with realistic lighting, textures, and shadows.",
    },
    {
      num: "03",
      title: "3D Animation",
      desc: "Dynamic animations to bring characters, products, or environments to life for marketing, gaming, or storytelling.",
    },
    {
      num: "04",
      title: "Product Design",
      desc: "Precise 3D modeling and rendering for showcasing or prototyping consumer products.",
    },
    {
      num: "05",
      title: "Custom 3D Designs",
      desc: "Custom 3D designs prepared and optimized for 3D printing technology.",
    },
  ];

  const projects = [
    {
      num: "01",
      name: "Reef & Rushes",
      tag: "Underwater Reef Render",
      img: "/assets/project1.png",
    },
    {
      num: "02",
      name: "Tiny Trails",
      tag: "Stylized Landscape Miniature",
      img: "/assets/project2.png",
    },
    {
      num: "03",
      name: "Spherical Creative",
      tag: "Glass Abstract Design",
      img: "/assets/project3.png",
    },
  ];

  const testimonials = [
    {
      initials: "HN",
      name: "Dr. Harold Nelson",
      company: "Nelson Diagnostics",
      text: "The 3D design team delivered our medical animations on time and the quality was outstanding. They really helped us capture the complex details.",
    },
    {
      initials: "SJ",
      name: "Sarah Jenkins",
      company: "Impact Creative",
      text: "Their attention to detail and ability to bring our brand to life with stunning 3D renders exceeded our expectations. Highly recommended!",
    },
    {
      initials: "DL",
      name: "David Lee",
      company: "Pixel Forge",
      text: "The 3D character design they created for our brand was exceptional. It brought a dynamic edge to our marketing campaign.",
    },
    {
      initials: "EW",
      name: "Emily Watson",
      company: "Scaler",
      text: "High-quality renders that helped us pitch our product successfully to investors. Great communication throughout.",
    },
    {
      initials: "MA",
      name: "Marcus Aurelius",
      company: "Violeta Red",
      text: "Outstanding 3D modeling work that was optimized perfectly for our workflow. Will definitely collaborate again.",
    },
    {
      initials: "SM",
      name: "Sophia Martinez",
      company: "Proudshare",
      text: "The 3D animations they produced for our product launch were breathtaking. Truly raised the bar for our brand.",
    },
  ];

  return (
    <div
      className={`transition-colors duration-1000 ease-in-out ${
        inServices ? "bg-[#F4F4F5] text-[#09090B]" : "bg-[#09090B] text-white"
      }`}
    >
      {/* Background Mouse Radial Glow */}
      <div className="global-glow" />

      {/* Global Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 py-8 flex justify-center items-center">
        <ul className="flex gap-12">
          {["about", "customers", "projects", "contact"].map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 relative py-2 ${
                  activeSection === section
                    ? inServices
                      ? "text-[#09090B]"
                      : "text-white"
                    : "text-[#71717A] hover:text-white"
                }`}
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                {section}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="w-full h-screen min-h-screen relative overflow-hidden bg-[#09090B] flex flex-col justify-between pt-32 pb-16 px-8 md:block"
      >
        {/* Subtle blue vertical edge lights */}
        <div className="edge-glow-left" />
        <div className="edge-glow-right" />

        {/* Main Headline (Top-aligned, below nav links) */}
        <div className="relative z-10 w-full text-center pointer-events-none md:absolute md:top-[90px] md:left-0 md:w-full">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-bebas uppercase text-center select-none leading-[0.82] tracking-[-0.04em] headline-gradient w-full"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 13rem)",
            }}
          >
            Hi, I’m Fayez
          </motion.h1>
        </div>

        {/* Mobile/Tablet Subtext - Below title, above avatar */}
        <div className="md:hidden text-center z-30 mt-4 px-4 pointer-events-none">
          <p className="text-[#a1a1aa] font-body font-semibold uppercase tracking-[0.06em] leading-[1.5] text-xs">
            A 3D DESIGNER PASSIONATE <br />
            ABOUT CRAFTING BOLD AND <br />
            MEMORABLE PROJECTS 🙂
          </p>
        </div>

        {/* Avatar Container (Foreground over Title, centered at top-[170px]) */}
        <div className="relative w-full h-[360px] flex items-center justify-center z-20 pointer-events-none md:absolute md:top-[170px] md:left-1/2 md:-translate-x-1/2 md:max-w-[550px] md:h-[550px]">
          <div className="w-full h-full pointer-events-auto">
            <UserAvatar isMobile={isMobile} />
          </div>
        </div>

        {/* Left Subtext (Desktop) */}
        <div 
          className="hidden md:block md:absolute md:left-12 lg:left-24 md:top-[400px] lg:top-[440px] md:z-30 text-[#a1a1aa] font-body font-semibold uppercase tracking-[0.06em] leading-[1.6] text-left max-w-xs lg:max-w-sm pointer-events-none"
          style={{
            fontSize: "clamp(0.85rem, 1.1vw, 1.05rem)",
          }}
        >
          A 3D DESIGNER PASSIONATE <br />
          ABOUT CRAFTING BOLD AND <br />
          MEMORABLE PROJECTS 🙂
        </div>

        {/* Right CTA Button (Desktop) */}
        <div className="hidden md:block md:absolute md:right-12 lg:right-24 md:top-[400px] lg:top-[440px] md:z-30">
          <a
            href="#contact"
            className="px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.12em] neon-btn-gradient text-white text-center flex items-center justify-center font-body"
          >
            CONTACT ME
          </a>
        </div>

        {/* Mobile Bottom Wrapper */}
        <div className="md:hidden w-full flex justify-center items-center z-30 px-8 pb-4">
          <a
            href="#contact"
            className="px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.12em] neon-btn-gradient text-white text-center w-full font-body"
          >
            CONTACT ME
          </a>
        </div>
      </section>

      {/* Infinite Logo Showcase Ribbon */}
      <section className="border-y border-white/8 py-12 overflow-hidden bg-white/[0.005]">
        <div className="w-full overflow-hidden flex">
          <div className="animate-marquee whitespace-nowrap flex gap-20">
            {Array(3)
              .fill([
                "ProjectSphere",
                "Thomas Nelson",
                "Impact Creative",
                "SCALER",
                "PIXEL FORGE",
                "VIOLET RD",
              ])
              .flat()
              .map((logo, idx) => (
                <span
                  key={idx}
                  className="font-heading font-extrabold text-2xl tracking-widest uppercase text-white/20 select-none"
                >
                  {logo}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="relative py-32 border-b border-white/8 overflow-visible">
        {/* Floating 3D Elements Canvases */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-[450px] z-0 hidden lg:block">
          <AboutLeftCanvas />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-[450px] z-0 hidden lg:block">
          <AboutRightCanvas />
        </div>

        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
          <h2 className="font-heading font-extrabold text-6xl md:text-8xl uppercase tracking-tighter mb-12 text-outline-white">
            ABOUT ME
          </h2>
          <p className="text-zinc-400 text-lg md:text-2xl font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            With over five years of experience in design, I specialize in branding, web design, and
            user experience. I love collaborating with businesses that want to stand out and
            showcase their best side. Let's create something amazing together!
          </p>

          <div className="flex justify-center gap-12 md:gap-20 mb-16">
            <div className="text-center">
              <h3 className="font-heading font-extrabold text-5xl md:text-6xl bg-gradient-to-r from-accent-pink to-accent-violet bg-clip-text text-transparent">
                5+
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-2">
                Years Experience
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-heading font-extrabold text-5xl md:text-6xl bg-gradient-to-r from-accent-pink to-accent-violet bg-clip-text text-transparent">
                50+
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-2">
                Completed Projects
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-heading font-extrabold text-5xl md:text-6xl bg-gradient-to-r from-accent-pink to-accent-violet bg-clip-text text-transparent">
                30+
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-2">
                Happy Clients
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-accent-violet to-accent-pink hover:shadow-[0_8px_25px_rgba(236,72,153,0.35)] transition-all duration-300 transform hover:-translate-y-1 inline-block"
          >
            CONTACT ME →
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        ref={servicesRef}
        className="py-32 border-b border-black/5 transition-colors duration-1000 ease-in-out relative z-10"
      >
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading font-extrabold text-6xl md:text-8xl uppercase tracking-tighter mb-4 text-outline-dark">
              SERVICES
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              High-end digital solutions designed to elevate your brand presence.
            </p>
          </div>

          <div className="flex flex-col border-t border-black/10">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="relative py-10 px-4 border-b border-black/10 grid grid-cols-1 md:grid-cols-[0.1fr_0.8fr_1.8fr] gap-6 items-center cursor-pointer transition-all duration-300 ease-out"
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Number */}
                <span className={`font-heading font-bold text-2xl transition-colors duration-300 ${
                  hoveredService === idx ? "text-accent-pink" : "text-zinc-400"
                }`}>
                  {service.num}
                </span>

                {/* Title */}
                <h3 className={`font-heading font-bold text-2xl uppercase transition-colors duration-300 ${
                  hoveredService === idx ? "text-[#09090B]" : "text-zinc-600"
                }`}>
                  {service.title}
                </h3>

                {/* Description */}
                <p className={`text-sm transition-colors duration-300 ${
                  hoveredService === idx ? "text-zinc-800" : "text-zinc-500"
                }`}>
                  {service.desc}
                </p>

                {/* Expanding bottom border line */}
                <AnimatePresence>
                  {hoveredService === idx && (
                    <motion.div
                      layoutId="activeBorder"
                      className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-accent-violet to-accent-pink"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 border-b border-white/8 relative">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="font-heading font-extrabold text-6xl md:text-8xl uppercase tracking-tighter mb-4 text-outline-white">
              PROJECTS
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              A selection of recent works crafted with pixel-perfect precision.
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col lg:flex-row items-center gap-12 border-b border-white/5 pb-12"
              >
                {/* Visual Thumbnail (Aspect 16:9, Rounded) */}
                <div className="w-full lg:w-[60%] aspect-video relative rounded-[24px] overflow-hidden group bg-zinc-950 border border-white/10">
                  <Image
                    src={project.img}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                {/* Information */}
                <div className="w-full lg:w-[40%] flex flex-col items-start">
                  <span className="text-xs font-bold tracking-widest text-accent-pink uppercase mb-4">
                    {project.num} / {project.tag}
                  </span>
                  <h3 className="font-heading font-extrabold text-4xl uppercase tracking-tight mb-6">
                    {project.name}
                  </h3>
                  <a
                    href="#projects"
                    className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white transition-all duration-300"
                  >
                    LIVE PROJECT
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 border-b border-white/8 relative">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading font-extrabold text-5xl md:text-7xl uppercase tracking-tighter mb-4 text-outline-white">
              What Clients Are Saying 😍
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Hear directly from companies and creators I have collaborated with.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-8 flex flex-col justify-between">
                <p className="text-zinc-300 text-sm md:text-base italic leading-relaxed mb-8">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4">
                  {/* Circle Initials Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-violet to-accent-pink flex items-center justify-center font-bold text-white text-sm border border-white/10 shadow-lg">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm uppercase tracking-wide">
                      {t.name}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative overflow-visible max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <h2 className="font-heading font-extrabold text-6xl md:text-8xl uppercase tracking-tighter mb-8 leading-none">
              LET'S GET <br />
              IN TOUCH
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-md">
              Ready to take your product presentation or brand identity to the next level? Feel free
              to reach out.
            </p>

            {/* Torus Knot Canvas */}
            <div className="w-64 h-64 relative">
              <TorusCanvas />
            </div>
          </div>

          <form className="glass-card p-10 flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base focus:outline-none focus:border-accent-pink transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base focus:outline-none focus:border-accent-pink transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base focus:outline-none focus:border-accent-pink transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 rounded-xl font-bold uppercase tracking-widest bg-gradient-to-r from-accent-violet to-accent-pink hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all duration-300 transform hover:-translate-y-1 mt-4"
            >
              SEND
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-20 relative bg-[#09090B] z-10">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <h2 className="font-heading font-extrabold text-5xl uppercase tracking-tighter text-white mb-2">
              ALEX TURNER
            </h2>
            <p className="text-zinc-500 text-sm">
              © 2026 Alex Turner. All Rights Reserved. Monogram Brand Identity.
            </p>
          </div>

          {/* Collage primitive Canvas */}
          <div className="w-64 h-40 relative">
            <FooterCanvas />
          </div>
        </div>
      </footer>
    </div>
  );
}
