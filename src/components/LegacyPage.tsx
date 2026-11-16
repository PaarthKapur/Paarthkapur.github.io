import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";

type Handlers = Record<string, (...args: never[]) => unknown>;
type Win = Window & Record<string, unknown> & { particlesJS?: (id: string, cfg: unknown) => void };

const PARTICLES = {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#1668b6" },
    shape: { type: "circle" },
    opacity: { value: 0.6, random: false },
    size: { value: 3.7, random: true },
    line_linked: { enable: true, distance: 150, color: "#cbd5e1", opacity: 0.5, width: 1 },
    move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out", bounce: false },
  },
  interactivity: {
    detect_on: "window",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { grab: { distance: 180, line_linked: { opacity: 0.8 } }, push: { particles_nb: 3 } },
  },
  retina_detect: true,
};

let particlesLoader: Promise<void> | null = null;
function loadParticles(): Promise<void> {
  const w = window as unknown as Win;
  if (w.particlesJS) return Promise.resolve();
  particlesLoader ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return particlesLoader;
}

/** Renders a page of the original static site and wires its inline handlers. */
export function LegacyPage({ html, handlers, revealSelector = ".reveal", revealOffset = 100 }: {
  html: string;
  handlers: Handlers;
  revealSelector?: string;
  revealOffset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const w = window as unknown as Win;
    const reveal = () => {
      document.querySelectorAll(revealSelector).forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - revealOffset) el.classList.add("active");
      });
    };
    Object.assign(w, handlers, { reveal });
    window.addEventListener("scroll", reveal);
    const t = setTimeout(reveal, 100);

    // Particle background
    w["pJSDom"] = [];
    loadParticles().then(() => w.particlesJS?.("particles-js", PARTICLES)).catch(() => {});

    // Hash scroll
    if (location.hash) {
      setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "center" }), 150);
    }

    // Client-side navigation for internal links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target || e.metaKey || e.ctrlKey || e.defaultPrevented) return;
      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("/__")) return;
      e.preventDefault();
      const [path = "/", hash] = href.split("#");
      void router.navigate(hash ? { to: path, hash } : { to: path });
    };
    ref.current?.addEventListener("click", onClick);
    const node = ref.current;
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", reveal);
      node?.removeEventListener("click", onClick);
      for (const k of Object.keys(handlers)) delete w[k];
    };
  }, [html, handlers, revealSelector, revealOffset, router]);

  return (
    <>
      <div id="particles-js" />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

// Shared modal helpers used by every page's handlers.
export const $ = (id: string) => document.getElementById(id) as HTMLElement;
export function showModal(id: string) {
  const m = $(id);
  m.style.display = "flex";
  setTimeout(() => m.classList.add("show"), 10);
}
export function hideModal(id: string) {
  const m = $(id);
  if (!m) return;
  m.classList.remove("show");
  setTimeout(() => (m.style.display = "none"), 300);
}
export function modalHandlers(id: string) {
  return {
    closeModal: (event: Event) => {
      if ((event.target as HTMLElement).id === id) hideModal(id);
    },
    closeModalBtn: () => hideModal(id),
  };
}
