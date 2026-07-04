"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const checkResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1025);
    };
    checkResize();
    window.addEventListener("resize", checkResize);
    return () => window.removeEventListener("resize", checkResize);
  }, []);

  // Track scroll direction to show/hide navbar dynamically
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      
      // Hide header when scrolling down past 50px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      imgs: ["/assets/proj1a.png", "/assets/proj1b.png", "/assets/proj1c.png", "/assets/proj1d.png"],
    },
    {
      num: "02",
      name: "Tiny Trails",
      tag: "Stylized Landscape Miniature",
      imgs: ["/assets/proj2a.png", "/assets/proj2b.png", "/assets/proj2c.png", "/assets/proj2d.png"],
    },
    {
      num: "03",
      name: "Spherical Creative",
      tag: "Glass Abstract Design",
      imgs: ["/assets/proj3a.png", "/assets/proj3b.png", "/assets/proj3c.png", "/assets/proj3d.png"],
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
    <div className="bg-[#09090B] text-white w-full overflow-x-hidden">
      {/* Background Mouse Radial Glow */}
      <div className="global-glow" />

      {/* Global Navigation Bar */}
      <nav className={`fixed top-0 left-0 w-full z-50 pt-5 md:pt-6 pb-2 px-8 flex justify-center items-center transition-all duration-300 transform ${
        showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}>
        <ul className="flex justify-between w-full max-w-[90%] md:max-w-[75%] lg:max-w-[880px] xl:max-w-[1080px]">
          {["about", "customers", "projects", "contact"].map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={`text-[10px] md:text-[11px] font-extrabold tracking-[0.22em] uppercase transition-colors duration-300 relative py-2 ${
                  inServices ? "text-[#09090B] hover:text-black" : "text-white hover:text-zinc-200"
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
        {/* Bottom Flanking Controls (Desktop aligned with header bounds) */}
        <div className="hidden md:flex justify-between items-end w-full max-w-[90%] md:max-w-[75%] lg:max-w-[880px] xl:max-w-[1080px] absolute md:left-1/2 md:-translate-x-1/2 md:top-[400px] lg:top-[440px] md:z-30 pointer-events-none">
          {/* Left Subtext */}
          <div 
            className="text-[#a1a1aa] font-body font-semibold uppercase tracking-[0.06em] leading-[1.6] text-left max-w-xs lg:max-w-sm pointer-events-none"
            style={{
              fontSize: "clamp(0.85rem, 1.1vw, 1.05rem)",
            }}
          >
            A 3D DESIGNER PASSIONATE <br />
            ABOUT CRAFTING BOLD AND <br />
            MEMORABLE PROJECTS 🙂
          </div>

          {/* Right CTA Button */}
          <div className="pointer-events-auto">
            <a
              href="#contact"
              className="px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.12em] neon-btn-gradient text-white text-center flex items-center justify-center font-body"
            >
              CONTACT ME
            </a>
          </div>
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
      <section className="border-y border-zinc-800/60 py-6 overflow-hidden bg-[#09090B] w-full">
        <div className="w-full overflow-hidden flex">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
            {Array(4)
              .fill([
                { name: "ProtoSphere", sub: "CONSULTING", icon: "⬡" },
                { name: "Thelma Watson", sub: "Artist & Illustrator", icon: "〰" },
                { name: "Impact Creative", sub: "", icon: "✕" },
                { name: "SCA LER", sub: "Graphic Design Tool", icon: "⬚" },
                { name: "PIXEL FORGE", sub: "", icon: "⊕" },
                { name: "VIOLETA KUB", sub: "DESIGN STUDIO", icon: "◈" },
              ])
              .flat()
              .map((logo, idx) => (
                <div key={idx} className="flex items-center gap-3 select-none shrink-0">
                  <span className="text-white/30 text-xl leading-none">{logo.icon}</span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-heading font-bold text-sm tracking-widest uppercase text-white/50 whitespace-nowrap">
                      {logo.name}
                    </span>
                    {logo.sub && (
                      <span className="text-[10px] tracking-wider text-white/25 uppercase font-medium">
                        {logo.sub}
                      </span>
                    )}
                  </div>
                  <span className="ml-8 w-px h-6 bg-white/10 block" />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Bento Gallery Grid Section */}
      <section className="bg-[#09090B] py-4 px-3 md:px-4 w-full">
        <div className="w-full">
          {/* Top row — 3 equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <Image
                src="/assets/gallery1.png"
                alt="Macro abstract 1"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <Image
                src="/assets/gallery2.png"
                alt="Macro abstract 2"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <Image
                src="/assets/gallery3.png"
                alt="Macro abstract 3"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Bottom row — wide + narrow */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/7] group">
              <Image
                src="/assets/gallery4.png"
                alt="Macro abstract 4"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <Image
                src="/assets/gallery5.png"
                alt="Macro abstract 5"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <Image
                src="/assets/gallery6.png"
                alt="Macro abstract 6"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="relative bg-[#09090B] overflow-hidden py-28 w-full">
        {/* 3D Left Canvas — Star (top-left) + Heart (bottom-left) */}
        <div className="absolute left-0 top-0 w-52 h-full z-0 pointer-events-none hidden md:block">
          <AboutLeftCanvas />
        </div>
        {/* 3D Right Canvas — Gem (top-right) + Flower (bottom-right) */}
        <div className="absolute right-0 top-0 w-52 h-full z-0 pointer-events-none hidden md:block">
          <AboutRightCanvas />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-8 text-center flex flex-col items-center">
          {/* Solid white bold headline — matches screenshot */}
          <h2
            className="font-bebas uppercase tracking-tight text-white leading-none mb-10"
            style={{ fontSize: "clamp(4rem, 12vw, 9rem)" }}
          >
            ABOUT ME
          </h2>

          {/* Body text */}
          <p
            className="text-zinc-400 font-body font-light leading-relaxed mb-10"
            style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.2rem)" }}
          >
            With over five years of experience in design,
            <br className="hidden md:block" />
            I specialize in branding, web design, and user experience.
            <br className="hidden md:block" />
            I love collaborating with businesses that want to stand out
            <br className="hidden md:block" />
            and showcase their best side.
            <br />
            Let's create something amazing together!
          </p>

          {/* Neon gradient CONTACT ME button — matches hero button style */}
          <a
            href="#contact"
            className="px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] neon-btn-gradient text-white inline-flex items-center justify-center font-body"
          >
            CONTACT ME
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        ref={servicesRef}
        className="py-28 border-b border-black/5 relative z-10 bg-[#F4F4F5] text-[#09090B]"
      >
        <div className="max-w-5xl mx-auto px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="font-bebas uppercase tracking-tight text-outline-dark leading-none"
              style={{ fontSize: "clamp(4.5rem, 13vw, 10rem)" }}>
              SERVICES
            </h2>
          </div>

          <div className="flex flex-col border-t border-black/10">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="relative py-8 px-2 border-b border-black/10 grid grid-cols-[auto_1fr] gap-8 md:gap-14 items-start cursor-pointer group"
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Large display number */}
                <span
                  className={`font-bebas leading-none transition-colors duration-300 select-none ${
                    hoveredService === idx ? "text-accent-pink" : "text-[#09090B]"
                  }`}
                  style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)" }}
                >
                  {service.num}
                </span>

                {/* Title + Description stacked */}
                <div className="flex flex-col justify-center pt-2">
                  <h3
                    className={`font-heading font-extrabold uppercase tracking-tight leading-tight mb-2 transition-colors duration-300 ${
                      hoveredService === idx ? "text-[#09090B]" : "text-zinc-700"
                    }`}
                    style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`font-body leading-relaxed transition-colors duration-300 ${
                      hoveredService === idx ? "text-zinc-700" : "text-zinc-400"
                    }`}
                    style={{ fontSize: "clamp(0.8rem, 1.3vw, 0.95rem)" }}
                  >
                    {service.desc}
                  </p>
                </div>

                {/* Expanding bottom border accent */}
                <AnimatePresence>
                  {hoveredService === idx && (
                    <motion.div
                      layoutId="activeBorder"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-violet to-accent-pink"
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

      {/* Projects Section — CSS-only sticky stacking cards */}
      {/*
        Each project has its own 100vh scroll wrapper.
        The card inside is position:sticky with a top offset = sum of all previous card header heights.
        As you scroll through each wrapper, the NEXT card slides up from below and physically
        covers the PREVIOUS card's bento grid. Only the header of the covered card peeks out.
        No JS needed — pure CSS sticky does all the work.

        CARD_HEADER_H = 80px (h-20). Offsets:
          Card 0: top = 8px
          Card 1: top = 8 + 80 + 8 = 96px
          Card 2: top = 8 + 80 + 8 + 80 + 8 = 184px
      */}
      <section id="projects" className="bg-[#09090B]">
        {/* Section heading */}
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-20 pb-10 text-center">
          <h2
            className="font-bebas uppercase tracking-tight text-outline-white leading-none"
            style={{ fontSize: "clamp(4.5rem, 13vw, 10rem)" }}
          >
            PROJECTS
          </h2>
        </div>

        {/* Stacking scroll area */}
        <div className="relative">
          {projects.map((project, idx) => {
            // Each card's sticky top = 8px base + idx * (80px header + 8px gap)
            const stickyTop = 8 + idx * 88;
            return (
              <div
                key={idx}
                style={{ height: "100vh" }}
                className="relative"
              >
                <div
                  className="sticky max-w-6xl mx-auto px-6 md:px-8"
                  style={{ top: `${stickyTop}px`, zIndex: idx + 1 }}
                >
                  {/* Card */}
                  <div className="rounded-2xl border border-white/10 bg-[#111113] overflow-hidden">
                    {/* Header row — fixed height h-20 (80px) so sticky offsets are exact */}
                    <div className="flex items-center justify-between px-6 h-20 border-b border-white/8">
                      <div className="flex items-center gap-5">
                        <span
                          className="font-bebas text-white leading-none"
                          style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
                        >
                          {project.num}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-heading font-extrabold text-white uppercase tracking-tight text-sm md:text-base leading-tight">
                            {project.name}
                          </span>
                          <span className="text-zinc-500 text-[11px] tracking-wider font-medium">
                            {project.tag}
                          </span>
                        </div>
                      </div>
                      <a
                        href="#"
                        className="px-5 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-300 whitespace-nowrap"
                      >
                        LIVE PROJECT
                      </a>
                    </div>

                    {/* Bento Image Grid — always rendered, covered by next card when stacked */}
                    <div className="grid grid-cols-3 gap-2 p-3" style={{ height: "270px" }}>
                      {/* Left — tall */}
                      <div className="relative rounded-xl overflow-hidden group">
                        <Image
                          src={project.imgs[0]}
                          alt={`${project.name} image 1`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      {/* Center — tall */}
                      <div className="relative rounded-xl overflow-hidden group">
                        <Image
                          src={project.imgs[1]}
                          alt={`${project.name} image 2`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      {/* Right — 2 stacked */}
                      <div className="flex flex-col gap-2">
                        <div className="relative rounded-xl overflow-hidden group flex-1">
                          <Image
                            src={project.imgs[2]}
                            alt={`${project.name} image 3`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="relative rounded-xl overflow-hidden group flex-1">
                          <Image
                            src={project.imgs[3]}
                            alt={`${project.name} image 4`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Extra bottom space so the last card's bento is fully visible before normal scroll resumes */}
          <div style={{ height: "50vh" }} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-[#09090B] border-b border-white/8 relative">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2
              className="font-heading font-extrabold leading-[1.1] text-white"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
            >
              What Clients<br />Are Saying{" "}
              <span style={{ fontSize: "0.8em" }}>😍</span>
            </h2>
          </div>

          {/* Bento grid — Row 1: 3 equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {testimonials.slice(0, 3).map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl bg-zinc-900 border border-white/8 p-6 flex flex-col justify-between min-h-[200px]"
              >
                {/* Quote */}
                <p className="text-zinc-300 text-sm leading-relaxed">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs border border-white/10"
                    style={{
                      background: [
                        "linear-gradient(135deg, #7c3aed, #ec4899)",
                        "linear-gradient(135deg, #2563eb, #7c3aed)",
                        "linear-gradient(135deg, #059669, #2563eb)",
                      ][idx % 3],
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs uppercase tracking-wider leading-tight">
                      {t.name}
                    </p>
                    <p className="text-zinc-500 text-[11px] tracking-wide font-medium mt-0.5">
                      {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bento grid — Row 2: 3 equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {testimonials.slice(3, 6).map((t, idx) => (
              <motion.div
                key={idx + 3}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl bg-zinc-900 border border-white/8 p-6 flex flex-col justify-between min-h-[200px]"
              >
                {/* Quote */}
                <p className="text-zinc-300 text-sm leading-relaxed">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs border border-white/10"
                    style={{
                      background: [
                        "linear-gradient(135deg, #d97706, #ec4899)",
                        "linear-gradient(135deg, #0ea5e9, #059669)",
                        "linear-gradient(135deg, #ec4899, #7c3aed)",
                      ][idx % 3],
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs uppercase tracking-wider leading-tight">
                      {t.name}
                    </p>
                    <p className="text-zinc-500 text-[11px] tracking-wide font-medium mt-0.5">
                      {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section
        id="contact"
        className="relative overflow-hidden bg-[#F4F4F5] text-[#09090B]"
      >
        {/* 3D shape — top right decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none z-10 translate-x-6 -translate-y-6">
          <TorusCanvas />
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[420px]">

            {/* Left — Heading + email + 3D shape */}
            <div className="relative">
              {/* 3D purple blob / shape on left */}
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-40 h-40 pointer-events-none hidden lg:block">
                <AboutLeftCanvas />
              </div>

              <div className="lg:pl-10">
                <h2
                  className="font-anton text-[#09090B] uppercase leading-[0.85] tracking-tight mb-8"
                  style={{ fontSize: "clamp(4rem, 11vw, 9rem)", fontWeight: 900 }}
                >
                  LET&apos;S<br />
                  GET IN<br />
                  TOUCH
                </h2>
                <a
                  href="mailto:alex@3dturner.cc"
                  className="text-[#09090B] text-lg md:text-2xl font-semibold underline underline-offset-4 decoration-black/40 hover:decoration-black transition-all duration-200"
                >
                  alex@3dturner.cc
                </a>
              </div>
            </div>

            {/* Right — Minimal underline form */}
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="contact-name"
                  className="text-[11px] font-bold uppercase tracking-widest text-black/50"
                >
                  Full Name*
                </label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  style={{ color: '#09090B', caretColor: '#09090B' }}
                  className="bg-transparent border-0 border-b border-black/20 pb-3 text-base focus:outline-none focus:border-black/60 transition-colors placeholder:text-black/25"
                  placeholder=""
                />
              </div>

              {/* Email + Phone side by side */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-email"
                    className="text-[11px] font-bold uppercase tracking-widest text-black/50"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    style={{ color: '#09090B', caretColor: '#09090B' }}
                    className="bg-transparent border-0 border-b border-black/20 pb-3 text-base focus:outline-none focus:border-black/60 transition-colors placeholder:text-black/25"
                    placeholder=""
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-phone"
                    className="text-[11px] font-bold uppercase tracking-widest text-black/50"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    style={{ color: '#09090B', caretColor: '#09090B' }}
                    className="bg-transparent border-0 border-b border-black/20 pb-3 text-base focus:outline-none focus:border-black/60 transition-colors placeholder:text-black/25"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="contact-message"
                  className="text-[11px] font-bold uppercase tracking-widest text-black/50"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  style={{ color: '#09090B', caretColor: '#09090B' }}
                  className="bg-transparent border-0 border-b border-black/20 pb-3 text-base focus:outline-none focus:border-black/60 transition-colors resize-none placeholder:text-black/25"
                  placeholder=""
                />
              </div>

              {/* SEND button — outlined pill */}
              <div>
                <button
                  type="submit"
                  className="px-16 py-3 rounded-full border border-black/30 text-[#09090B] text-sm font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
                >
                  SEND
                </button>
              </div>
            </form>
          </div>
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
