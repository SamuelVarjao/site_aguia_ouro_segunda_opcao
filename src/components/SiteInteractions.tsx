"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect } from "react";
import { withBase } from "@/lib/paths";

const FAB_MESSAGES = ["Faça já seu orçamento", "Tire suas dúvidas"] as const;
const FAB_INTERVAL_MS = 5000;

/**
 * Único componente de cliente da página.
 *
 * Tudo o que precisa de JavaScript vive aqui — revelação no scroll, estado da
 * barra fixa, rotação da bolha do WhatsApp, montagem do vídeo do hero e os
 * eventos do GA4. A alternativa óbvia (um componente cliente por elemento
 * animado) custava caro: com vinte "use client" espalhados, o TBT no mobile
 * passou de 200 ms para 500 ms. Concentrando em um só, a árvore inteira
 * continua sendo renderizada no servidor.
 */
export default function SiteInteractions() {
  useEffect(() => {
    (window as unknown as { __hydrated?: boolean }).__hydrated = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups: Array<() => void> = [];

    // ---- eventos do GA4, por delegação -----------------------------------
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest?.("[data-ga-event]");
      if (!link) return;

      sendGAEvent("event", link.getAttribute("data-ga-event") as string, {
        origem: link.getAttribute("data-ga-origem") ?? "desconhecida",
      });
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    // ---- barra fixa ganha profundidade ao sair do topo --------------------
    const header = document.querySelector<HTMLElement>("[data-nav]");
    let navFrame = 0;
    const onNavScroll = () => {
      if (navFrame) return;
      navFrame = requestAnimationFrame(() => {
        navFrame = 0;
        header?.setAttribute("data-scrolled", String(window.scrollY > 40));
      });
    };
    if (header) {
      onNavScroll();
      window.addEventListener("scroll", onNavScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onNavScroll);
        if (navFrame) cancelAnimationFrame(navFrame);
      });
    }

    // ---- revelação no scroll ---------------------------------------------
    const pending = new Set(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reduced.matches) {
      for (const el of pending) el.setAttribute("data-revealed", "true");
      pending.clear();
    } else {
      let revealFrame = 0;

      const stop = () => {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      };

      const sweep = () => {
        revealFrame = 0;
        const limit = window.innerHeight * 0.92;
        for (const el of pending) {
          if (el.getBoundingClientRect().top < limit) {
            el.setAttribute("data-revealed", "true");
            pending.delete(el);
          }
        }
        if (pending.size === 0) stop();
      };

      function schedule() {
        if (!revealFrame) revealFrame = requestAnimationFrame(sweep);
      }

      // Varredura por posição em vez de IntersectionObserver: com IO, um salto
      // instantâneo até o rodapé faz os blocos do meio nunca cruzarem o
      // limiar, e eles ficariam invisíveis até a pessoa rolar de volta.
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      schedule();
      cleanups.push(stop);
    }

    // ---- bolha do WhatsApp, alternando a cada 5s -------------------------
    const bubble = document.querySelector<HTMLElement>("[data-fab-message]");
    if (bubble && !reduced.matches) {
      let index = 0;
      const timer = window.setInterval(() => {
        index = (index + 1) % FAB_MESSAGES.length;
        bubble.textContent = FAB_MESSAGES[index];
        bubble.classList.remove("fab-bubble-text");
        void bubble.offsetWidth; // força o reinício da animação
        bubble.classList.add("fab-bubble-text");
      }, FAB_INTERVAL_MS);
      cleanups.push(() => window.clearInterval(timer));
    }

    // ---- vídeo do hero ---------------------------------------------------
    // Só em telas grandes e só depois que o navegador ficar ocioso: o poster já
    // está pintado e é ele quem responde pelo LCP.
    const slot = document.getElementById("hero-video");
    const wantsVideo =
      slot &&
      window.matchMedia("(min-width: 768px)").matches &&
      !reduced.matches;

    if (wantsVideo) {
      const mount = () => {
        if (slot.childElementCount) return;

        const video = document.createElement("video");
        video.className = "absolute inset-0 h-full w-full object-cover";
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.preload = "metadata";
        video.poster = withBase("/video/hero-poster.jpg");
        video.tabIndex = -1;
        video.setAttribute("playsinline", "");
        video.setAttribute("aria-hidden", "true");

        for (const [src, type] of [
          ["/video/hero.webm", "video/webm"],
          ["/video/hero.mp4", "video/mp4"],
        ]) {
          const source = document.createElement("source");
          source.src = withBase(src);
          source.type = type;
          video.appendChild(source);
        }

        slot.appendChild(video);
      };

      const timeout = window.setTimeout(mount, 900);
      cleanups.push(() => window.clearTimeout(timeout));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
