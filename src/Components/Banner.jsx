// src/Components/Banner.jsx
import { useEffect, useRef, useState } from "react";
import banner1 from "../assets/Banner/banner.jpg";
import banner2 from "../assets/Banner/banner2.jpg";
import flyer1 from "../assets/Flyers/flyre (1).jpg";
import flyer2 from "../assets/Flyers/flyre (2).jpg";
import flyer3 from "../assets/Flyers/flyre (3).jpg";
import flyer4 from "../assets/Flyers/flyre (4).jpg";
import flyer5 from "../assets/Flyers/flyre (5).jpg";
import banner3 from "../assets/Banner/Jerry Ayiya 2025 DEC.jpg";
import flyer6 from "../assets/Flyers/Jerry-Ayiya-2026-JAN.jpg";

const ChevronLeftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRightIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
const PlayIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const CloseIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
  </svg>
);
const ZoomInIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="11" cy="11" r="7" strokeWidth="2" />
    <path strokeWidth="2" d="M11 8v6M8 11h6" />
    <path strokeWidth="2" d="M20 20l-3-3" />
  </svg>
);
const ZoomOutIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="11" cy="11" r="7" strokeWidth="2" />
    <path strokeWidth="2" d="M8 11h6" />
    <path strokeWidth="2" d="M20 20l-3-3" />
  </svg>
);
const DownloadIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 10l5 5 5-5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15V3"
    />
  </svg>
);

const Banner = () => {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const viewerRef = useRef(null);
  const intervalRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const [mouse, setMouse] = useState({ x: "50%", y: "50%" });
  const [isVisible, setIsVisible] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Zoom + Pan
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Data sources
  const bannerSources = [banner1, banner2, banner3];
  const flyerSources = [flyer1, flyer2, flyer3, flyer4, flyer5, flyer6];

  const bannerCovers = bannerSources.map((src, i) => ({
    src,
    title: `Banner Design ${i + 1}`,
    category: "Large Format • Banner"
  }));
  const flyerCovers = flyerSources.map((src, i) => ({
    src,
    title: `Flyer Design ${i + 1}`,
    category: "Print • Flyer"
  }));

  // Unified for overlay
  const allPosts = [...bannerCovers, ...flyerCovers];

  // Spotlight cursor
  const onMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x: `${x}%`, y: `${y}%` });
  };

  // In-view animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Body scroll lock when overlay opens
  useEffect(() => {
    if (!overlayOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [overlayOpen]);

  // Slideshow (overlay)
  useEffect(() => {
    if (!overlayOpen || reducedMotion || !isPlaying || isHovering) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % allPosts.length);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [overlayOpen, isPlaying, isHovering, reducedMotion, allPosts.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeOverlay();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.key === "+") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen]);

  const openOverlay = (index) => {
    setActiveIndex(index);
    setIsLoading(true);
    setOverlayOpen(true);
    setIsPlaying(false);
    resetZoom();
  };
  const closeOverlay = () => {
    setOverlayOpen(false);
    setIsPlaying(false);
  };
  const next = () => {
    setActiveIndex((i) => (i + 1) % allPosts.length);
    setIsLoading(true);
    resetZoom();
  };
  const prev = () => {
    setActiveIndex((i) => (i - 1 + allPosts.length) % allPosts.length);
    setIsLoading(true);
    resetZoom();
  };
  const select = (i) => {
    setActiveIndex(i);
    setIsPlaying(false);
    setIsLoading(true);
    resetZoom();
  };
  const togglePlayPause = () => setIsPlaying((p) => !p);

  // Zoom + pan functions
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)));
  const zoomOut = () => {
    setZoom((z) => {
      const nz = Math.max(1, +(z - 0.5).toFixed(1));
      if (nz === 1) setOffset({ x: 0, y: 0 });
      return nz;
    });
  };
  const resetZoom = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };
  const toggleZoom = () => (zoom === 1 ? setZoom(2) : resetZoom());

  // Pan handlers
  const onViewerMouseDown = (e) => {
    if (zoom === 1) return;
    setDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
  };
  const onViewerMouseMove = (e) => {
    if (!dragging || zoom === 1) return;
    const rect = viewerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxX = (zoom - 1) * rect.width * 0.5;
    const maxY = (zoom - 1) * rect.height * 0.5;
    const nx = Math.max(-maxX, Math.min(maxX, offsetStartRef.current.x + dx));
    const ny = Math.max(-maxY, Math.min(maxY, offsetStartRef.current.y + dy));
    setOffset({ x: nx, y: ny });
  };
  const onViewerMouseUp = () => setDragging(false);

  // Touch swipe (overlay)
  const onTouchStart = (e) => {
    if (zoom > 1) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (zoom > 1) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dy) < 40) {
      dx < 0 ? next() : prev();
      setIsPlaying(false);
    }
  };

  // Simple design card component
  const DesignCard = ({ design, index, aspectRatio = "[1/1]" }) => {
    return (
      <button
        onClick={() => openOverlay(index)}
        className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 text-left"
      >
        <div className="relative rounded-2xl bg-[#141518]/40 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 opacity-60 bg-gradient-to-tr from-[#B08B57]/10 via-transparent to-[#F1D6BF]/10 -z-10" />

          <div className="relative overflow-hidden">
            <div className={`w-full aspect-${aspectRatio}`}>
              <img
                src={design.src}
                alt={design.title}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B08B57] animate-pulse" />
              <span className="text-xs text-[#B08B57] font-medium">
                {design.category}
              </span>
            </div>
            <h3 className="mt-1 text-base md:text-lg font-semibold text-[#E7DFD6]">
              {design.title}
            </h3>
          </div>

          <div className="absolute inset-0 bg-[#0A0B0D]/0 group-hover:bg-[#0A0B0D]/10 transition-colors duration-500" />
        </div>
      </button>
    );
  };

  return (
    <section
      id="banners"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden text-[#E7DFD6]"
      style={{
        background:
          "radial-gradient(ellipse at 70% 10%, #1F232B 0%, #141518 40%, #0A0B0D 100%)"
      }}
    >
      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x} ${mouse.y}, rgba(176,139,87,0.14), transparent 55%)`
        }}
      />

      {/* Morphing blob background */}
      <div className="absolute -inset-20 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B08B57]/20 via-[#F1D6BF]/10 to-[#6B7785]/20 blur-3xl animate-morph" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6B7785]/15 via-[#1F232B]/30 to-[#B08B57]/15 blur-3xl animate-morph-reverse animation-delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-28">
        {/* Header */}
        <div className="mb-10 md:mb-14 transition-all duration-1000">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl ring-1 ring-white/10 rounded-full px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B08B57] shadow-[0_0_0_4px_rgba(176,139,87,0.18)]" />
            <span className="text-xs md:text-sm text-[#E7DFD6]/80 font-medium tracking-wide">
              Large Format • Events • Campaigns • Print
            </span>
          </div>

          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] relative">
            <span className="block overflow-hidden">
              <span className="block animate-slide-up text-transparent bg-clip-text bg-gradient-to-br from-[#E7DFD6] via-[#B08B57] to-[#F1D6BF]">
                Banners & Flyers
              </span>
            </span>
            <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#B08B57] to-transparent animate-expand-width" />
          </h2>

          <p className="mt-6 max-w-2xl text-[#E7DFD6]/60">
            High‑impact, print‑ready banner and flyer designs with proper
            bleeds, safe margins, and CMYK color for crisp output.
          </p>
        </div>

        {/* Banner Designs */}
        {bannerCovers.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 md:mb-6 flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B08B57]" />
              <h3 className="text-xl md:text-2xl font-bold">Banner Designs</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {bannerCovers.map((design, i) => (
                <DesignCard
                  key={`banner-${i}`}
                  design={design}
                  index={i}
                  aspectRatio="[21/9]"
                />
              ))}
            </div>
          </div>
        )}

        {/* Flyer Designs */}
        {flyerCovers.length > 0 && (
          <div>
            <div className="mb-4 md:mb-6 flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B08B57]" />
              <h3 className="text-xl md:text-2xl font-bold">Flyer Designs</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
              {flyerCovers.map((design, i) => (
                <DesignCard
                  key={`flyer-${i}`}
                  design={design}
                  index={bannerCovers.length + i}
                  aspectRatio="[3/4]"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {overlayOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#0A0B0D]/80 backdrop-blur-sm flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Design viewer"
          ref={overlayRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={(e) => {
            if (e.target === overlayRef.current) closeOverlay();
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative w-full max-w-6xl h-[92vh] mx-4 md:mx-6 rounded-3xl p-[2px] bg-gradient-to-br from-white/20 via-white/10 to-transparent ring-1 ring-white/10 shadow-[0_60px_140px_-30px_rgba(0,0,0,0.9)]">
            <div className="relative w-full h-full bg-[#141518]/80 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-3 md:px-5 py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#B08B57] animate-pulse" />
                  <div>
                    <div className="text-sm md:text-base font-semibold text-[#E7DFD6]">
                      {allPosts[activeIndex].title}
                    </div>
                    <div className="text-xs text-[#E7DFD6]/60">
                      {activeIndex + 1} / {allPosts.length} •{" "}
                      {allPosts[activeIndex].category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 text-[#E7DFD6] px-3 py-1.5 ring-1 ring-white/10 transition"
                    aria-label={
                      isPlaying ? "Pause slideshow" : "Play slideshow"
                    }
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-4 h-4" />
                    ) : (
                      <PlayIcon className="w-4 h-4" />
                    )}
                    <span className="ml-2 text-xs hidden sm:inline">
                      {isPlaying ? "Pause" : "Play"}
                    </span>
                  </button>
                  <button
                    onClick={zoomOut}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-[#E7DFD6] ring-1 ring-white/10 transition"
                    aria-label="Zoom out"
                    title="Zoom out (-)"
                  >
                    <ZoomOutIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={zoomIn}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-[#E7DFD6] ring-1 ring-white/10 transition"
                    aria-label="Zoom in"
                    title="Zoom in (+)"
                  >
                    <ZoomInIcon className="w-5 h-5" />
                  </button>
                  <a
                    href={allPosts[activeIndex].src}
                    download
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-[#E7DFD6] ring-1 ring-white/10 transition"
                    aria-label="Download image"
                    title="Download"
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </a>
                  <button
                    onClick={closeOverlay}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-[#E7DFD6] ring-1 ring-white/10 transition"
                    aria-label="Close viewer"
                    title="Close"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Viewer (zoom/pan) */}
              <div
                ref={viewerRef}
                className={`relative flex-1 select-none ${
                  zoom > 1 ? "cursor-grab" : "cursor-zoom-in"
                }`}
                onDoubleClick={toggleZoom}
                onMouseDown={onViewerMouseDown}
                onMouseMove={onViewerMouseMove}
                onMouseUp={onViewerMouseUp}
                onMouseLeave={onViewerMouseUp}
                style={{
                  touchAction: zoom > 1 ? "pan-x pan-y" : "manipulation"
                }}
              >
                {/* Prev/Next */}
                <div className="absolute inset-y-0 left-0 w-1/4 md:w-1/3 flex items-center justify-start pointer-events-none">
                  <button
                    onClick={prev}
                    className="pointer-events-auto m-3 inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0A0B0D]/50 hover:bg-[#0A0B0D]/70 text-[#E7DFD6] ring-1 ring-white/10 transition"
                    aria-label="Previous"
                    title="Previous"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 w-1/4 md:w-1/3 flex items-center justify-end pointer-events-none">
                  <button
                    onClick={next}
                    className="pointer-events-auto m-3 inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0A0B0D]/50 hover:bg-[#0A0B0D]/70 text-[#E7DFD6] ring-1 ring-white/10 transition"
                    aria-label="Next"
                    title="Next"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Loading spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#B08B57] animate-spin" />
                  </div>
                )}

                {/* Image */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <img
                    key={allPosts[activeIndex].src}
                    src={allPosts[activeIndex].src}
                    alt={allPosts[activeIndex].title}
                    onLoad={() => setIsLoading(false)}
                    className="max-w-full max-h-full object-contain will-change-transform transition-opacity duration-300"
                    style={{
                      transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
                      opacity: isLoading ? 0 : 1
                    }}
                    draggable="false"
                  />
                </div>
              </div>

              {/* Thumbnails strip */}
              <div className="border-t border-white/10 px-3 md:px-5 py-3">
                <div className="overflow-x-auto hide-scrollbar">
                  <div className="flex gap-2 md:gap-3">
                    {allPosts.map((p, idx) => (
                      <button
                        key={`thumb-${idx}`}
                        onClick={() => select(idx)}
                        className={`relative overflow-hidden rounded-lg aspect-[1/1] h-20 md:h-24 group transition ${
                          idx === activeIndex
                            ? "ring-2 ring-[#B08B57]"
                            : "ring-1 ring-white/10 hover:ring-white/20"
                        }`}
                        aria-current={idx === activeIndex}
                        aria-label={`View ${p.title}`}
                      >
                        <img
                          src={p.src}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          draggable="false"
                        />
                        <div
                          className={`absolute inset-0 transition ${
                            idx === activeIndex
                              ? "bg-[#B08B57]/20"
                              : "bg-[#0A0B0D]/10 group-hover:bg-[#0A0B0D]/5"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes morph { 0%,100% { transform: rotate(0) scale(1);} 33% { transform: rotate(120deg) scale(1.1);} 66% { transform: rotate(240deg) scale(0.9);} }
        @keyframes morph-reverse { 0%,100% { transform: rotate(0) scale(1);} 33% { transform: rotate(-120deg) scale(0.9);} 66% { transform: rotate(-240deg) scale(1.1);} }
        @keyframes slide-up { from { transform: translateY(100%);} to { transform: translateY(0);} }
        @keyframes expand-width { from { width: 0;} to { width: 200px;} }
        .animate-morph { animation: morph 20s ease-in-out infinite; }
        .animate-morph-reverse { animation: morph-reverse 25s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up .8s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-expand-width { animation: expand-width 1s cubic-bezier(0.16,1,0.3,1) .5s forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Banner;
