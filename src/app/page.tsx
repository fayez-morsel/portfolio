"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lenis from "lenis";

// Canvas Components (Client side only, imported dynamically to prevent hydration mismatches)
import dynamic from "next/dynamic";

const UserAvatar = dynamic(() => import("@/components/UserAvatar"), { ssr: false });
const AboutLeftCanvas = dynamic(() => import("@/components/AboutLeftCanvas"), { ssr: false });
const AboutRightCanvas = dynamic(() => import("@/components/AboutRightCanvas"), { ssr: false });
const FooterCanvas = dynamic(() => import("@/components/FooterCanvas"), { ssr: false });

export default function Home() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [avatarTilt, setAvatarTilt] = useState({ x: 0, y: 0 });
  const servicesRef = useRef<HTMLDivElement>(null);
  const [inServices, setInServices] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const checkResize = () => {
      setIsMobile(window.innerWidth < 768);
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

  // Track global mouse for radial background glow AND avatar parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
      // Avatar parallax: map to ±12deg
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      setAvatarTilt({ x: cy * -12, y: cx * 12 });
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

    const servicesEl = servicesRef.current;
    if (servicesEl) {
      observer.observe(servicesEl);
    }

    return () => {
      if (servicesEl) {
        observer.unobserve(servicesEl);
      }
    };
  }, []);

  // Global scroll fade-up IntersectionObserver
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  const services = [
    {
      num: "01",
      title: "UI/UX Design",
      desc: "I design clean, modern, and user-friendly interfaces with wireframes, prototypes, and smooth user flows.",
    },
    {
      num: "02",
      title: "Front-End Development",
      desc: "I build responsive websites using React, TypeScript, and Tailwind CSS with clean and reusable components.",
    },
    {
      num: "03",
      title: "Full-Stack Web Development",
      desc: "I create complete web applications from frontend to backend using React, Node.js, Express, and MongoDB.",
    },
    {
      num: "04",
      title: "REST API & Backend Development",
      desc: "I develop organized backend systems, databases, and REST APIs that make web apps functional and scalable.",
    },
    {
      num: "05",
      title: "Project Management",
      desc: "I help plan, organize, and deliver digital projects by connecting design, development, and user needs.",
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
    {
      num: "04",
      name: "Project Gamma",
      tag: "Architectural Visualization",
      imgs: ["/assets/proj1a.png", "/assets/proj2b.png", "/assets/proj3c.png", "/assets/proj1d.png"],
    },
    {
      num: "05",
      name: "Project Delta",
      tag: "Product Concept",
      imgs: ["/assets/proj2a.png", "/assets/proj3b.png", "/assets/proj1c.png", "/assets/proj2d.png"],
    },
    {
      num: "06",
      name: "Project Epsilon",
      tag: "Character Design",
      imgs: ["/assets/proj3a.png", "/assets/proj1b.png", "/assets/proj2c.png", "/assets/proj3d.png"],
    },
  ];

  const projectsPerPage = 3;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginatedProjects = projects.slice((currentProjectPage - 1) * projectsPerPage, currentProjectPage * projectsPerPage);

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
    <div className="bg-bg-dark text-white w-full overflow-x-hidden">
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
                className={`text-[13px] md:text-[15px] font-extrabold tracking-[0.22em] uppercase transition-colors duration-300 relative py-2 ${
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
        className="w-full min-h-[135vh] relative overflow-hidden bg-[#000000] flex flex-col justify-between pt-32 pb-16 px-8 md:block"
      >
        {/* Subtle blue vertical edge lights */}
        <div className="edge-glow-left" />
        <div className="edge-glow-right" />

        {/* Main Headline (Top-aligned, below nav links, behind the avatar) */}
        <div className="hidden md:block relative z-10 w-full text-center pointer-events-none md:absolute md:top-[90px] md:left-0 md:w-full">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-poppins font-black uppercase text-center select-none leading-[0.82] tracking-[-0.04em] headline-gradient w-full"
            style={{
              fontSize: "clamp(5rem, 13.5vw, 18rem)",
              transform: "scale(1.25, 0.65)",
              transformOrigin: "center top",
              display: "block",
            }}
          >
            Hi, I’m Fayez
          </motion.h1>
        </div>

        {/* Mobile Headline (Top-aligned, below nav links) */}
        <div className="md:hidden relative z-10 w-full text-center pointer-events-none mt-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-poppins font-black uppercase text-center select-none leading-[0.82] tracking-[-0.04em] headline-gradient w-full"
            style={{
              fontSize: "clamp(4.5rem, 18vw, 6.5rem)",
            }}
          >
            Hi, I’m Fayez
          </motion.h1>
        </div>

        {/* Mobile/Tablet Subtext - Below title, above avatar */}
        <div className="md:hidden text-center z-30 mt-4 px-4 pointer-events-none">
          <p className="text-[#a1a1aa] font-body font-semibold uppercase tracking-[0.06em] leading-[1.5] text-xs">
            UI/UX DESIGNER • <br />
            FRONT-END DEVELOPER • <br />
            FULL-STACK CREATOR <br />
            BUILDING MODERN AND <br />
            MEMORABLE DIGITAL <br />
            EXPERIENCES 😄
          </p>
        </div>

        {/* Avatar Container — with mouse-parallax tilt */}
        <div className="relative w-full h-[360px] flex items-center justify-center z-20 pointer-events-none md:absolute md:top-[170px] md:left-1/2 md:-translate-x-1/2 md:max-w-[550px] md:h-[550px]">
          <div
            className="w-full h-full pointer-events-auto"
            style={{
              transform: `perspective(800px) rotateX(${avatarTilt.x}deg) rotateY(${avatarTilt.y}deg)`,
              transition: "transform 0.15s cubic-bezier(0.25,1,0.5,1)",
            }}
          >
            <UserAvatar isMobile={isMobile} />
          </div>
        </div>

        {/* Bottom Flanking Controls (Desktop aligned to H and z edges, in front of avatar) */}
        <div className="hidden md:flex justify-between items-end w-[82vw] absolute md:left-1/2 md:-translate-x-1/2 md:top-[250px] lg:top-[280px] xl:top-[310px] md:z-30 pointer-events-none">
          {/* Left Subtext */}
          <div 
            className="text-[#a1a1aa] font-body font-semibold uppercase tracking-[0.06em] leading-[1.6] text-left max-w-sm lg:max-w-md pointer-events-none"
            style={{
              fontSize: "clamp(1.1rem, 1.45vw, 1.4rem)",
            }}
          >
            UI/UX DESIGNER • FRONT-END <br />
            DEVELOPER • FULL-STACK CREATOR <br />
            BUILDING MODERN AND <br />
            MEMORABLE DIGITAL <br />
            EXPERIENCES 😄
          </div>

          {/* Right CTA Button */}
          <div className="pointer-events-auto">
            <a
              href="#contact"
              className="px-12 py-6 rounded-full text-sm md:text-base font-bold uppercase tracking-[0.14em] neon-btn-gradient text-white text-center flex items-center justify-center font-body"
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

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none opacity-80">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-3 text-white">
            SCROLL DOWN
          </span>
          <div className="w-[26px] h-[40px] rounded-full border-2 border-white/40 flex justify-center p-1">
            <motion.div
              animate={{
                y: [0, 12, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-accent-violet shadow-[0_0_8px_rgba(124,58,237,0.8)]"
            />
          </div>
        </div>
      </section>

      {/* Infinite Logo Showcase Ribbon */}
      <section className="border-y border-white/6 py-6 overflow-hidden bg-[#000000] w-full">
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
      <section className="bg-[#000000] py-4 px-3 md:px-4 w-full fade-up">
        <div className="w-full">
          {/* Top row — 3 equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {[
              { src: "/assets/gallery1.png", alt: "Macro abstract 1" },
              { src: "/assets/gallery2.png", alt: "Macro abstract 2" },
              { src: "/assets/gallery3.png", alt: "Macro abstract 3" },
            ].map((img, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/3] gallery-img">
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
          {/* Bottom row — wide + narrow */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/7] gallery-img">
              <Image src="/assets/gallery4.png" alt="Macro abstract 4" fill className="object-cover" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] gallery-img">
              <Image src="/assets/gallery5.png" alt="Macro abstract 5" fill className="object-cover" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] gallery-img">
              <Image src="/assets/gallery6.png" alt="Macro abstract 6" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="relative bg-[#000000] overflow-hidden py-28 w-full fade-up">
        {/* 3D Left Canvas — Star (top-left) + Heart (bottom-left) */}
        <div className="absolute left-0 top-0 w-52 h-full z-0 pointer-events-none hidden md:block">
          <AboutLeftCanvas />
        </div>
        {/* 3D Right Canvas — Gem (top-right) + Flower (bottom-right) */}
        <div className="absolute right-0 top-0 w-52 h-full z-0 pointer-events-none hidden md:block">
          <AboutRightCanvas />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-8 text-center flex flex-col items-center">
          <h2
            className="font-heading font-extrabold uppercase tracking-tight text-white leading-none mb-10"
            style={{ fontSize: "clamp(4rem, 12vw, 9rem)" }}
          >
            ABOUT ME
          </h2>

          <p
            className="font-body font-normal leading-relaxed mb-10"
            style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)", color: "#A0A0A0" }}
          >
            I&apos;m a creative UI/UX Designer and Full-Stack Front-End Developer.
            <br className="hidden md:block" />
            I design clean interfaces, build modern websites, and create smooth user experiences.
            <br className="hidden md:block" />
            My goal is to make every project look professional, memorable, and easy to use.
            <br />
            Let&apos;s build something amazing together!
          </p>

          <a
            href="#contact"
            className="px-12 py-6 rounded-full text-sm md:text-base font-bold uppercase tracking-[0.14em] neon-btn-gradient text-white flex items-center justify-center font-body"
          >
            CONTACT ME
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        ref={servicesRef}
        className="py-28 border-b border-white/6 relative z-10 bg-[#000000] text-white fade-up"
      >
        <div className="max-w-5xl mx-auto px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2
              className="font-heading font-extrabold uppercase tracking-tight text-outline-white leading-none"
              style={{ fontSize: "clamp(4.5rem, 13vw, 10rem)" }}
            >
              SERVICES
            </h2>
          </div>

          <div className="flex flex-col border-t border-white/10">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="service-row relative py-8 px-2 border-b border-white/10 grid grid-cols-[auto_1fr] gap-8 md:gap-14 items-start cursor-pointer group"
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Large display number */}
                <span
                  className={`font-poppins font-black leading-none select-none ${
                    hoveredService === idx ? "text-accent-pink" : "text-white/30"
                  }`}
                  style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)", transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                >
                  {service.num}
                </span>

                {/* Title + Description stacked */}
                <div className="flex flex-col justify-center pt-2">
                  <h3
                    className="font-poppins font-black uppercase tracking-tight leading-none mb-2"
                    style={{
                      fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)",
                      color: hoveredService === idx ? "#ffffff" : "#A0A0A0",
                      transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="font-body leading-relaxed"
                    style={{
                      fontSize: "clamp(0.8rem, 1.3vw, 0.95rem)",
                      color: hoveredService === idx ? "#d4d4d4" : "#606060",
                      transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section — CSS-only sticky stacking cards */}
      <section id="projects" className="bg-[#000000] py-28 relative fade-up">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Section heading */}
          <div className="mb-16">
            <h2
              className="font-poppins font-black uppercase tracking-tight text-outline-white leading-none text-center"
              style={{ fontSize: "clamp(4.5rem, 13vw, 10rem)" }}
            >
              PROJECTS
            </h2>
          </div>

          {/* Row list */}
          <div className="flex flex-col border-t border-white/10">
            {paginatedProjects.map((project, idx) => {
              const isHovered = hoveredProject === idx;
              const isOtherHovered = hoveredProject !== null && hoveredProject !== idx;

              return (
                <div
                  key={idx}
                  className={`group flex flex-col lg:flex-row items-center justify-between border-b border-white/10 py-8 lg:py-10 px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered ? "bg-[#0f0f11]" : "bg-transparent"
                  } ${isOtherHovered ? "opacity-30 grayscale saturate-0" : "opacity-100"}`}
                  onMouseEnter={() => setHoveredProject(idx)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Left Zone: Metadata */}
                  <div className="flex flex-col mb-6 lg:mb-0 w-full lg:w-1/4">
                    <span
                      className="font-poppins font-black text-white leading-none mb-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
                      style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                    >
                      {project.num}
                    </span>
                    <span className="text-zinc-500 font-poppins font-bold text-[10px] tracking-[0.2em] uppercase mb-1 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      CLIENT
                    </span>
                    <span className="text-zinc-200 font-poppins font-black text-lg md:text-xl uppercase tracking-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      {project.name}
                    </span>
                  </div>

                  {/* Middle Zone: Expanding Thumbnails */}
                  <div className="flex-1 w-full flex justify-center lg:justify-start items-center mb-6 lg:mb-0 relative min-h-[140px] md:min-h-[180px]">
                    <div className="relative w-full max-w-[600px] h-[140px] md:h-[180px] flex items-center justify-center">
                      
                      {/* Image 1 (Left) */}
                      <div
                        className="absolute w-[30%] md:w-[28%] h-full rounded-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl z-10"
                        style={{
                          left: isHovered ? "0%" : "35%",
                          transform: isHovered ? "scale(1) rotate(-2deg)" : "scale(0.85) rotate(0deg)",
                          opacity: isHovered ? 1 : 0.6,
                        }}
                      >
                        <Image
                          src={project.imgs[0]}
                          alt={`${project.name} preview 1`}
                          fill
                          className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                      </div>

                      {/* Image 2 (Center) */}
                      <div
                        className="absolute w-[36%] md:w-[32%] h-full rounded-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl z-30"
                        style={{
                          left: isHovered ? "32%" : "34%",
                          transform: isHovered ? "scale(1.1) translateY(-10px)" : "scale(1)",
                        }}
                      >
                        <Image
                          src={project.imgs[1]}
                          alt={`${project.name} preview 2`}
                          fill
                          className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                      </div>

                      {/* Image 3 (Right) */}
                      <div
                        className="absolute w-[30%] md:w-[28%] h-full rounded-xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl z-20"
                        style={{
                          left: isHovered ? "68%" : "35%",
                          transform: isHovered ? "scale(1) rotate(2deg)" : "scale(0.85) rotate(0deg)",
                          opacity: isHovered ? 1 : 0.6,
                        }}
                      >
                        <Image
                          src={project.imgs[2]}
                          alt={`${project.name} preview 3`}
                          fill
                          className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                      </div>

                    </div>
                  </div>

                  {/* Right Zone: CTA Button — with magnetic scale on hover */}
                  <div className="w-full lg:w-1/4 flex justify-end items-center">
                    <a
                      href="#"
                      className="px-6 py-3 rounded-full text-xs font-poppins font-black uppercase tracking-[0.15em] border border-white text-white bg-transparent whitespace-nowrap relative"
                      style={{
                        transition: "background 0.4s cubic-bezier(0.16,1,0.3,1), color 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
                        background: isHovered ? "rgba(255,255,255,0.1)" : "transparent",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                        boxShadow: isHovered ? "0 0 20px rgba(255,255,255,0.1)" : "none",
                      }}
                    >
                      LIVE PROJECT
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentProjectPage(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    currentProjectPage === i + 1
                      ? "bg-white text-black"
                      : "bg-transparent text-white border border-white/20 hover:border-white/60"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-[#000000] border-b border-white/6 relative fade-up">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2
              className="font-poppins font-black uppercase tracking-tight leading-none text-outline-white"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
            >
              CLIENT REVIEWS
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
                className="bento-card p-6 flex flex-col justify-between min-h-[200px]"
              >
                {/* Quote */}
                <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
                  &quot;{t.text}&quot;
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
                className="bento-card p-6 flex flex-col justify-between min-h-[200px]"
              >
                {/* Quote */}
                <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
                  &quot;{t.text}&quot;
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
        className="relative overflow-hidden bg-[#000000] text-white fade-up"
      >
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — Heading + email */}
            <div>
              <h2
                className="font-poppins font-black text-white uppercase leading-[0.9] tracking-tight mb-8"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
              >
                LET&apos;S<br />
                GET IN<br />
                TOUCH
              </h2>
              <a
                href="mailto:fayezmorsel77@gmail.com"
                className="text-lg md:text-xl font-semibold underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all duration-300"
                style={{ color: "#A0A0A0" }}
              >
                fayezmorsel77@gmail.com
              </a>
              <div className="mt-10 flex gap-4">
                {["Twitter", "LinkedIn", "GitHub", "Dribbble"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full border border-white/15 hover:border-white/40 transition-all duration-300"
                    style={{ color: "#A0A0A0" }}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Right — Minimal underline form */}
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#606060" }}>
                  Full Name*
                </label>
                <input
                  type="text" id="contact-name" required
                  className="bg-transparent border-0 border-b border-white/15 pb-3 text-base text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                  placeholder=""
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#606060" }}>Email*</label>
                  <input type="email" id="contact-email" required className="bg-transparent border-0 border-b border-white/15 pb-3 text-base text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20" placeholder="" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-phone" className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#606060" }}>Phone</label>
                  <input type="tel" id="contact-phone" className="bg-transparent border-0 border-b border-white/15 pb-3 text-base text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20" placeholder="" />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#606060" }}>Message</label>
                <textarea id="contact-message" rows={3} className="bg-transparent border-0 border-b border-white/15 pb-3 text-base text-white focus:outline-none focus:border-white/50 transition-colors resize-none placeholder:text-white/20" placeholder="" />
              </div>

              {/* SEND */}
              <div>
                <button type="submit" className="px-16 py-4 rounded-full border border-white/20 text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-400">
                  SEND MESSAGE
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 py-16 relative bg-[#000000] z-10">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="font-heading font-extrabold text-4xl uppercase tracking-tighter text-white mb-1">
              FAYEZ
            </h2>
            <p className="text-sm" style={{ color: "#606060" }}>
              © 2026 Fayez. All Rights Reserved.
            </p>
          </div>
          <div className="w-48 h-32 relative">
            <FooterCanvas />
          </div>
        </div>
      </footer>
    </div>
  );
}
