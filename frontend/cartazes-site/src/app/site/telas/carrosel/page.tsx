"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import styles from "./TelaModificacao.module.css";
import WidgetCard, { CardState, WIDGET_LIBRARY } from "./WidgetCards";
import BotaoCores from "@/app/Botao/botao-cores";

type Props = {
  corFundo?: string;
  corFundoB?: string;
  onSave?: (layout: SavedLayout) => void;
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, Flip);
}

export interface SavedLayout {
  corFundo?: string;
  // Cor de fundo da tela de VISUALIZAÇÃO a ser usada quando cada folder estiver ativo
  // (chave = "1".."6"). Não pinta o card/imagem do folder, só o fundo da tela.
  folderBackgrounds?: Record<string, string>;
  elSize: { width: number; height: number };
  carrossel: { x: number; y: number; width: number; height: number };
  widgets: {
    id: string;
    type: CardState["type"];
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}

function measureRelativeBox(
  node: Element | null,
  reference: Element | null
): { x: number; y: number; width: number; height: number } | null {
  if (!node || !reference) return null;
  const nodeRect = node.getBoundingClientRect();
  const refRect = reference.getBoundingClientRect();
  return {
    x: nodeRect.left - refRect.left,
    y: nodeRect.top - refRect.top,
    width: nodeRect.width,
    height: nodeRect.height,
  };
}

export const STORAGE_KEY = "tela-modificacao-layout";
export const LAYOUT_UPDATED_EVENT = "tela-modificacao-layout-updated";

const LISTA_CORES = [
  "white", "blue", "red", "purple", "yellow", "orange", "black",
  "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
  "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #12100e 0%, #2b1055 50%, #7597de 100%)",
  "linear-gradient(135deg, #051937 0%, #004d7a 33%, #008793 66%, #00bf72 100%)",
  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  "linear-gradient(45deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
  "linear-gradient(135deg, #2b0000 0%, #800000 50%, #b30000 100%)",
  "linear-gradient(135deg, #ed213a 0%, #931d25 100%)",
  "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
  "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
  "linear-gradient(135deg, #4a00e0 0%, #8e2de2 0%, #800020 50%, #e60039 100%)",
];

// Ids dos folders existentes na tela de visualização (CoverflowCarousel -> FoldersLista)
const FOLDER_IDS = ["1", "2", "3", "4", "5", "6"];

// Mesmas imagens usadas no carrossel real, para exibir o preview aqui dentro do carrosselRef
const FOLDER_IMAGES: Record<string, string> = {
    "1": "/imagens/images.jpg",
    "2": "/imagens/senai.jpg",
    "3": "/imagens/images.jpg",
    "4": "/imagens/senai.jpg",
    "5": "/imagens/images.jpg",
    "6": "/imagens/senai.jpg",
};

function folderSrc(img: any): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img.src) return img.src;
  return "";
}

const initialCards: CardState[] = WIDGET_LIBRARY.map((w) => ({
  id: `widget-${w.type}`,
  type: w.type,
  placed: false,
  x: 0,
  y: 0,
}));

const getBackgroundStyle = (cor?: string): React.CSSProperties => {
  if (!cor) return { backgroundColor: "white" };
  const isGradient = cor.includes("gradient");
  return {
    backgroundColor: isGradient ? "transparent" : cor,
    backgroundImage: isGradient ? cor : "none",
  };
};

type ResizeBox = { x: number; y: number; width: number; height: number };

function cursorForHandle(handle: string): string {
  if (handle === "n" || handle === "s") return "ns-resize";
  if (handle === "e" || handle === "w") return "ew-resize";
  if (handle === "ne" || handle === "sw") return "nesw-resize";
  return "nwse-resize";
}

function handleOffsetStyle(handle: string): React.CSSProperties {
  const HALF = 6;
  const style: React.CSSProperties = {};
  if (handle.includes("n")) style.top = -HALF;
  if (handle.includes("s")) style.bottom = -HALF;
  if (handle.includes("w")) style.left = -HALF;
  if (handle.includes("e")) style.right = -HALF;
  if (!handle.includes("n") && !handle.includes("s")) {
    style.top = "50%";
    style.marginTop = -HALF;
  }
  if (!handle.includes("w") && !handle.includes("e")) {
    style.left = "50%";
    style.marginLeft = -HALF;
  }
  return style;
}

function ResizeHandles({
  targetRef,
  handles,
  minWidth = 40,
  minHeight = 30,
  onResizeEnd,
}: {
  targetRef: React.RefObject<HTMLElement>;
  handles: string[];
  minWidth?: number;
  minHeight?: number;
  onResizeEnd: (box: ResizeBox) => void;
}) {
  const dragRef = useRef<{
    handle: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const startDrag = (handle: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = targetRef.current;
    if (!target) return;

    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {}

    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: target.offsetWidth,
      startHeight: target.offsetHeight,
      startLeft: target.offsetLeft,
      startTop: target.offsetTop,
    };

    const onMove = (ev: PointerEvent) => {
      const state = dragRef.current;
      const node = targetRef.current;
      if (!state || !node) return;

      const dx = ev.clientX - state.startX;
      const dy = ev.clientY - state.startY;

      let width = state.startWidth;
      let height = state.startHeight;
      let left = state.startLeft;
      let top = state.startTop;

      if (state.handle.includes("e")) width = Math.max(minWidth, state.startWidth + dx);
      if (state.handle.includes("w")) {
        width = Math.max(minWidth, state.startWidth - dx);
        left = state.startLeft + (state.startWidth - width);
      }
      if (state.handle.includes("s")) height = Math.max(minHeight, state.startHeight + dy);
      if (state.handle.includes("n")) {
        height = Math.max(minHeight, state.startHeight - dy);
        top = state.startTop + (state.startHeight - height);
      }

      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      dragRef.current = null;
      const node = targetRef.current;
      if (!node) return;
      onResizeEnd({
        x: node.offsetLeft,
        y: node.offsetTop,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "2px solid #5b8dff",
        borderRadius: 6,
        pointerEvents: "none",
        zIndex: 950,
      }}
    >
      {handles.map((h) => (
        <div
          key={h}
          onPointerDown={startDrag(h)}
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            background: "#5b8dff",
            border: "2px solid white",
            borderRadius: 3,
            pointerEvents: "auto",
            cursor: cursorForHandle(h),
            ...handleOffsetStyle(h),
          }}
        />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Preview: mostra UM folder por vez, do tamanho do carrosselRef (como no carrossel real)
// -----------------------------------------------------------------------------
function FolderSinglePreview({
  folderId,
  onPrev,
  onNext,
}: {
  folderId: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = FOLDER_IMAGES[folderId];

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <img
        src={folderSrc(img)}
        alt={`Folder ${folderId}`}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      <span
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          fontSize: 12,
          fontWeight: 600,
          color: "white",
          background: "rgba(0,0,0,0.45)",
          padding: "3px 9px",
          borderRadius: 999,
          pointerEvents: "none",
        }}
      >
        {folderId} / {FOLDER_IDS.length}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.9)",
          color: "black",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        ‹
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.9)",
          color: "black",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        ›
      </button>
    </div>
  );
}

export default function TelaModificacao({ corFundo, corFundoB, onSave }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cards, setCards] = useState<CardState[]>(initialCards);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Cor de fundo padrão da tela (usada quando o alvo é "Fundo da Tela" ou quando
  // um folder não tem cor própria definida)
  const [corClicada, setCorClicada] = useState<string>(corFundo || "white");

  // Alvo da paleta de cores: "fundo" | "todos" | "1".."6"
  const [folderTarget, setFolderTarget] = useState<string>("fundo");
  // Cor de fundo da VISUALIZAÇÃO associada a cada folder (não pinta o card)
  const [folderBackgrounds, setFolderBackgrounds] = useState<Record<string, string>>({});

  // Qual folder está sendo mostrado no preview dentro do carrosselRef (tamanho real)
  const [previewFolderId, setPreviewFolderId] = useState<string>("1");

  const elSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const carrosselBoxRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const widgetBoxesRef = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});

  const containerRef = useRef<HTMLDivElement | null>(null);
  const telaAnimacaoRef = useRef<HTMLDivElement | null>(null);
  const carrosselRef = useRef<HTMLElement | null>(null);
  const sideAnimacaoRef = useRef<HTMLDivElement | null>(null);
  const baixoRef = useRef<HTMLDivElement | null>(null);
  const botao = useRef<HTMLDivElement | null>(null);
  const listaCoresRef = useRef<HTMLDivElement | null>(null);

  const originalRectRef = useRef<{ top: number; left: number; width: number; height: number } | null>(null);
  const draggableInstanceRef = useRef<globalThis.Draggable[] | null>(null);
  const isAnimatingRef = useRef(false);

  const [carrosselTransform, setCarrosselTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  });

  const cardNodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const wrapperNodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ---------------------------------------------------------------------------
  // ANIMAÇÃO DE ENTRADA INICIAL (Ao carregar a tela pela primeira vez)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elementosParaAnimar = [
        telaAnimacaoRef.current,
        botao.current
      ].filter(Boolean);

      gsap.fromTo(
        elementosParaAnimar,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ---------------------------------------------------------------------------
  // Animação de entrada dos cards e botões no Side Panel & Bottom Panel
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isExpanded) {
      const elements = Array.from(cardNodeRefs.current.values());
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }
        );
      }

      if (listaCoresRef.current) {
        gsap.fromTo(
          listaCoresRef.current.children,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.3, stagger: 0.03, ease: "back.out(1.7)", delay: 0.2 }
        );
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      setSelectedId(null);
    }
  }, [isExpanded]);

  // Sempre que o alvo selecionado (select) for um folder específico, o preview
  // dentro do carrosselRef passa a mostrar aquele folder
  useEffect(() => {
    if (FOLDER_IDS.includes(folderTarget)) {
      setPreviewFolderId(folderTarget);
    }
  }, [folderTarget]);

  // Aplica a cor clicada de acordo com o alvo atual. IMPORTANTE: a cor nunca pinta
  // a imagem do folder (card) — ela define o FUNDO da tela de visualização.
  // "fundo" -> fundo padrão da tela
  // "todos" -> mesmo fundo para todos os folders de uma vez (depois dá pra ajustar um por um)
  // "1".."6" -> fundo específico daquele folder quando ele estiver ativo na visualização
  const mudarCor = (novaCor: string) => {
    if (folderTarget === "fundo") {
      setCorClicada(novaCor);
    } else if (folderTarget === "todos") {
      setFolderBackgrounds(() => {
        const next: Record<string, string> = {};
        FOLDER_IDS.forEach((id) => {
          next[id] = novaCor;
        });
        return next;
      });
    } else {
      setFolderBackgrounds((prev) => ({ ...prev, [folderTarget]: novaCor }));
    }

    if (telaAnimacaoRef.current) {
      gsap.fromTo(
        telaAnimacaoRef.current,
        { scale: 0.995 },
        { scale: 1, duration: 0.3, ease: "power1.out" }
      );
    }
  };

  const cyclePreviewFolder = (dir: 1 | -1) => {
    const idx = FOLDER_IDS.indexOf(previewFolderId);
    const nextIdx = ((idx + dir) % FOLDER_IDS.length + FOLDER_IDS.length) % FOLDER_IDS.length;
    const nextId = FOLDER_IDS[nextIdx];
    setPreviewFolderId(nextId);
    // Também passa a ser o alvo da paleta, pra facilitar: já navega e já seleciona pra colorir
    setFolderTarget(nextId);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: SavedLayout = JSON.parse(raw);
        if (saved.corFundo) setCorClicada(saved.corFundo);
        if (saved.folderBackgrounds) setFolderBackgrounds(saved.folderBackgrounds);
        setCards((prev) =>
          prev.map((c) => {
            const found = saved.widgets.find((w) => w.id === c.id);
            return found ? { ...c, placed: true, x: found.x, y: found.y } : c;
          })
        );

        const boxes: Record<string, { x: number; y: number; width: number; height: number }> = {};
        saved.widgets.forEach((w) => {
          boxes[w.id] = { x: w.x, y: w.y, width: w.width, height: w.height };
        });
        widgetBoxesRef.current = boxes;

        if (saved.elSize) elSizeRef.current = saved.elSize;

        if (saved.carrossel) {
          carrosselBoxRef.current = saved.carrossel;
          setCarrosselTransform({
            x: 0,
            y: 0,
            scale: 1,
            width: saved.carrossel.width,
            height: saved.carrossel.height,
          });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const carrossel = carrosselRef.current;
    if (!carrossel || isAnimatingRef.current) return;

    gsap.set(carrossel, {
      x: carrosselTransform.x,
      y: carrosselTransform.y,
      scale: carrosselTransform.scale,
    });
  }, [carrosselTransform]);

  const killAllTweens = () => {
    const targets = [
      telaAnimacaoRef.current,
      carrosselRef.current,
      sideAnimacaoRef.current,
      baixoRef.current,
      botao.current,
    ].filter(Boolean) as Element[];

    if (targets.length) gsap.killTweensOf(targets);
  };

  const cardsSignature = useMemo(
    () => cards.map((c) => `${c.id}:${c.placed}`).join("|"),
    [cards]
  );

  function handleCardDragEnd(
    cardId: string,
    cardType: CardState["type"],
    node: HTMLDivElement,
    wasPlaced: boolean,
    dragInstance: globalThis.Draggable
  ) {
    const el = telaAnimacaoRef.current;
    if (!el) return;

    if (cardType === "arrows" && wasPlaced) {
      if (dragInstance.x > 80) {
        requestAnimationFrame(() => {
          const flipEls = Array.from(document.querySelectorAll<HTMLElement>("[data-flip-id]"));
          const flipState = Flip.getState(flipEls);

          flushSync(() => {
            setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, placed: false } : c)));
          });

          gsap.set(node, { x: 0, y: 0 });
          Flip.from(flipState, { duration: 0.45, ease: "power2.out", absolute: true });
        });
        return;
      }

      const cardRect = node.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relY = cardRect.top - elRect.top;

      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, y: relY } : c)));
      gsap.set(node, { x: 0, y: 0 });
      return;
    }

    const overEl = Draggable.hitTest(node, el, "50%");

    if (!overEl && !wasPlaced) {
      gsap.to(node, { x: 0, y: 0, duration: 0.35, ease: "power2.out" });
      return;
    }

    requestAnimationFrame(() => {
      const flipEls = Array.from(document.querySelectorAll<HTMLElement>("[data-flip-id]"));
      const flipState = Flip.getState(flipEls);

      if (overEl) {
        const cardRect = node.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        const relX = cardType === "arrows" ? 0 : cardRect.left - elRect.left;
        const relY = cardRect.top - elRect.top;

        flushSync(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === cardId ? { ...c, placed: true, x: relX, y: relY } : c))
          );
        });
        setSelectedId(cardId);

        const widgetRect = node.getBoundingClientRect();
        widgetBoxesRef.current[cardId] = {
          x: relX,
          y: relY,
          width: cardType === "arrows" ? elRect.width : widgetRect.width,
          height: widgetRect.height,
        };
      } else {
        flushSync(() => {
          setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, placed: false } : c)));
        });
        delete widgetBoxesRef.current[cardId];
      }

      gsap.set(node, { x: 0, y: 0 });
      Flip.from(flipState, { duration: 0.45, ease: "power2.out", absolute: true });
    });
  }

  useEffect(() => {
    if (!isExpanded) return;

    const instances: globalThis.Draggable[] = [];

    cards.forEach((card) => {
      const node = cardNodeRefs.current.get(card.id);
      if (!node) return;

      const oldInstance = Draggable.get(node);
      if (oldInstance) oldInstance.kill();

      gsap.set(node, { x: 0, y: 0 });

      const isArrows = card.type === "arrows";
      const handleSelector = isArrows ? `.${styles.cardLabel}, [class*="cardLabel"]` : undefined;

      let dragInstance: globalThis.Draggable | null = null;

      const createdInstances = Draggable.create(node, {
        type: "x,y",
        handle: handleSelector,
        zIndexBoost: false,
        bounds: card.placed ? undefined : containerRef.current ?? undefined,

        onPress: () => {
          if (isExpanded && card.placed) {
            setSelectedId(card.id);
          }
          gsap.to(node, { scale: 1.03, duration: 0.15, ease: "power1.out" });
        },

        onRelease: () => {
          gsap.to(node, { scale: 1, duration: 0.2, ease: "power1.inOut" });
        },

        onDrag: function () {
          if (isArrows && card.placed && this.x < 0) {
            gsap.set(node, { x: 0 });
          }
        },

        onDragEnd: () => {
          if (!dragInstance) return;
          handleCardDragEnd(card.id, card.type, node, card.placed, dragInstance);
        },
      });

      if (createdInstances.length > 0) {
        dragInstance = createdInstances[0];
        instances.push(dragInstance);
      }
    });

    return () => {
      instances.forEach((inst) => inst.kill());
    };
  }, [isExpanded, cardsSignature]);

  const animarSaida = (onCompleteCallback?: () => void) => {
    if (isAnimatingRef.current) return;

    const el = telaAnimacaoRef.current;
    const carrossel = carrosselRef.current;
    const side = sideAnimacaoRef.current;
    const b = botao.current;
    const baixo = baixoRef.current;
    const targetRect = originalRectRef.current;

    isAnimatingRef.current = true;

    if (draggableInstanceRef.current) {
      draggableInstanceRef.current[0].kill();
      draggableInstanceRef.current = null;
    }

    killAllTweens();

    const tl = gsap.timeline({
      onComplete: () => {
        if (el) gsap.set(el, { clearProps: "position,top,left,width,height,zIndex" });
        if (carrossel) gsap.set(carrossel, { clearProps: "width,height" });
        if (side) gsap.set(side, { clearProps: "all" });
        if (baixo) gsap.set(baixo, { top: "100%", opacity: 0 });

        isAnimatingRef.current = false;
        setIsExpanded(false);
        setSelectedId(null);
        if (onCompleteCallback) onCompleteCallback();
      },
    });

    if (carrossel) {
      tl.to(carrossel, {
        x: carrosselTransform.x,
        y: carrosselTransform.y,
        scale: carrosselTransform.scale,
        duration: 0.5,
        ease: "power3.inOut",
      });
    }

    if (side) {
      tl.to(side, { marginRight: "-500px", opacity: 0, scaleX: 1.4, scaleY: 0.9, duration: 0.4, ease: "back.in(1.2)" }, "-=0.3");
    }

    if (baixo) {
      tl.to(baixo, { top: "100%", opacity: 0, duration: 0.5, ease: "power2.in" }, "-=0.3");
    }

    if (el && targetRect) {
      tl.to(el, { top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height, duration: 0.7, ease: "expo.inOut" }, "-=0.5");
    }

    if (b) {
      tl.to(b, { top: 570, duration: 0.9, ease: "expo.inOut" }, "<");
    }
  };

  const handleEditLayout = () => {
    if (isAnimatingRef.current) return;
    if (!telaAnimacaoRef.current || !carrosselRef.current) return;

    if (isExpanded) {
      animarSaida();
      return;
    }

    isAnimatingRef.current = true;

    const el = telaAnimacaoRef.current;
    const carrossel = carrosselRef.current;
    const side = sideAnimacaoRef.current;
    const b = botao.current;
    const baixo = baixoRef.current;

    if (draggableInstanceRef.current) {
      draggableInstanceRef.current[0].kill();
      draggableInstanceRef.current = null;
    }

    killAllTweens();

    const rect = el.getBoundingClientRect();
    originalRectRef.current = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    if (baixo) gsap.set(baixo, { top: "100%", opacity: 0 });
    if (side) {
      gsap.set(side, {
        marginTop: "0px",
        marginRight: "-500px",
        opacity: 0,
        scaleX: 1.55,
        scaleY: 0.85,
        transformOrigin: "right center",
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        const finalRect = el.getBoundingClientRect();
        elSizeRef.current = { width: finalRect.width, height: finalRect.height };
        const box = measureRelativeBox(carrossel, el);
        if (box) carrosselBoxRef.current = box;
      },
    });

    tl.fromTo(b, { top: 570 }, { top: 860, duration: 0.7, ease: "expo.out" })
      .fromTo(el, { position: "fixed", top: rect.top, left: rect.left, width: rect.width, height: rect.height, zIndex: 1000 }, { top: 100, left: 20, width: "70vw", height: "80vh", duration: 0.9, ease: "expo.out" }, "<")
      .fromTo(baixo, { top: "100%", opacity: 0 }, { top: 875, opacity: 1, duration: 0.7, ease: "expo.out" }, "-=0.7")
      .fromTo(carrossel, { width: "30%", height: "80%", borderRadius: "10px", scale: 0.85, opacity: 0.5 }, { width: "30%", height: "80%", borderRadius: "10px", scale: carrosselTransform.scale, opacity: 1, duration: 0.6, ease: "back.out(2.2)" }, "-=0.5");

    if (side) {
      tl.fromTo(side, { marginTop: "0px", marginRight: "-500px", opacity: 0, scaleX: 1.55, scaleY: 0.85, transformOrigin: "right center" }, {
        marginTop: "0px",
        marginRight: "20px",
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        onComplete: () => {
          draggableInstanceRef.current = Draggable.create(carrossel, {
            bounds: el,
            edgeResistance: 0.65,
            type: "x,y",
            cursor: "grab",
            activeCursor: "grabbing",
            onPress() {
              if (isExpanded) setSelectedId("carrossel");
            },
            onDragEnd() {
              setCarrosselTransform((prev) => ({
                ...prev,
                x: this.x,
                y: this.y,
                scale: (gsap.getProperty(carrossel, "scale") as number) ?? 1,
              }));
              const box = measureRelativeBox(carrosselRef.current, telaAnimacaoRef.current);
              if (box) carrosselBoxRef.current = box;
            },
          });
        },
      }, "-=0.5");
    }

    setIsExpanded(true);
  };

  function persistLayout(layout: SavedLayout) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
      window.dispatchEvent(new CustomEvent(LAYOUT_UPDATED_EVENT, { detail: layout }));
    } catch {}
    onSave?.(layout);
  }

  function handleSalvar() {
    if (salvando) return;
    setSalvando(true);

    if (botao.current) {
      gsap.to(botao.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    }

    if (isExpanded && telaAnimacaoRef.current) {
      const rect = telaAnimacaoRef.current.getBoundingClientRect();
      elSizeRef.current = { width: rect.width, height: rect.height };

      const carrosselBox = measureRelativeBox(carrosselRef.current, telaAnimacaoRef.current);
      if (carrosselBox) carrosselBoxRef.current = carrosselBox;

      cards
        .filter((c) => c.placed)
        .forEach((c) => {
          const node = wrapperNodeRefs.current.get(c.id) || cardNodeRefs.current.get(c.id);
          const box = measureRelativeBox(node ?? null, telaAnimacaoRef.current);
          if (box) widgetBoxesRef.current[c.id] = box;
        });
    }

    const layout: SavedLayout = {
      corFundo: corClicada,
      folderBackgrounds,
      elSize: elSizeRef.current,
      carrossel: carrosselBoxRef.current,
      widgets: cards
        .filter((c) => c.placed)
        .map(({ id, type }) => {
          const box = widgetBoxesRef.current[id] ?? { x: 0, y: 0, width: 0, height: 0 };
          return { id, type, ...box };
        }),
    };

    setTimeout(() => {
      persistLayout(layout);
      if (isExpanded) {
        animarSaida(() => setSalvando(false));
      } else {
        setSalvando(false);
      }
    }, 900);
  }

  const registerCardNode = (id: string, stretchToFill: boolean) => (node: HTMLDivElement | null) => {
    if (node) {
      cardNodeRefs.current.set(id, node);
      if (stretchToFill) {
        node.style.width = "100%";
        node.style.height = "100%";
        node.style.boxSizing = "border-box";
      } else {
        node.style.width = "";
        node.style.height = "";
      }
    } else {
      cardNodeRefs.current.delete(id);
    }
  };

  const widgetLabel = (type: CardState["type"]) =>
    WIDGET_LIBRARY.find((w) => w.type === type)?.label ?? type;

  const botoesNode = (
    <div ref={botao} className={styles.botoesWrapper} style={{ top: 590 }}>
      <button onClick={handleEditLayout} className={styles.botaoEditLay}>
        {isExpanded ? "Sair da Edição" : "Editar Layout"}
      </button>
      <button
        onClick={handleSalvar}
        disabled={salvando}
        className={styles.botaoSalvar}
        style={{
          backgroundColor: salvando ? "rgb(151, 104, 104)" : "hsl(0, 50%, 36%)",
          cursor: salvando ? "default" : "pointer",
        }}
      >
        {salvando ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );

  // Rótulo dinâmico do alvo atualmente selecionado, mostrado acima da paleta de cores
  const targetLabel =
    folderTarget === "fundo"
      ? "Fundo da Tela"
      : folderTarget === "todos"
        ? "Todos os Folders"
        : `Folder ${folderTarget}`;

  // Cor mostrada AGORA como fundo do preview (visualizacaoCard), refletindo o alvo selecionado
  const previewBackground =
    folderTarget === "fundo" || folderTarget === "todos"
      ? corClicada
      : folderBackgrounds[folderTarget] ?? corClicada;

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        ref={telaAnimacaoRef}
        className={`TelaAnimacao ${styles.telaAnimacao}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedId(null);
          }
        }}
      >
        <select
  value={folderTarget}
  onChange={(e) => setFolderTarget(e.target.value)}
  style={{
    opacity: 1,
    width: "20%",
  }}
>
  <option value="fundo">Fundo da Tela</option>
  <option value="todos">Todos os Folders</option>
  {FOLDER_IDS.map((id) => (
    <option key={id} value={id}>
      Folder {id}
    </option>
  ))}
</select>



        <section
          style={{ ...getBackgroundStyle(previewBackground), transition: "background-color 0.3s ease" }}
          className={`VizualizacaoCard ${styles.visualizacaoCard}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isExpanded) setSelectedId(null);
          }}
        >
          <section
            ref={carrosselRef}
            className={`CarrosselRep ${styles.carrossel}`}
            style={{
              position: "relative",
              boxSizing: "border-box",
              cursor: isExpanded ? "grab" : "default",
              background: "linear-gradient(180deg, rgb(51, 52, 60) 0%, rgb(38, 39, 45) 100%)",
              overflow: "hidden",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isExpanded) setSelectedId("carrossel");
            }}
          >
            {/* Apenas UM folder por vez, do tamanho do carrosselRef — igual ao card ativo real */}
            <FolderSinglePreview
              folderId={previewFolderId}
              onPrev={() => cyclePreviewFolder(-1)}
              onNext={() => cyclePreviewFolder(1)}
            />

            {isExpanded && selectedId === "carrossel" && (
              <ResizeHandles
                targetRef={carrosselRef as React.RefObject<HTMLElement>}
                handles={["e", "se", "s"]}
                minWidth={120}
                minHeight={120}
                onResizeEnd={() => {
                  const box = measureRelativeBox(carrosselRef.current, telaAnimacaoRef.current);
                  if (box) {
                    carrosselBoxRef.current = box;
                    setCarrosselTransform((prev) => ({ ...prev, width: box.width, height: box.height }));
                  }
                }}
              />
            )}
          </section>
        </section>

        {cards
          .filter((c) => c.placed)
          .map((card) => {
            const isArrows = card.type === "arrows";
            const savedBox = widgetBoxesRef.current[card.id];
            const isSelected = isExpanded && selectedId === card.id;

            return (
              <div
                key={card.id}
                ref={(el) => {
                  if (el) wrapperNodeRefs.current.set(card.id, el);
                  else wrapperNodeRefs.current.delete(card.id);
                }}
                style={{
                  position: "absolute",
                  left: isArrows ? 0 : card.x,
                  top: card.y,
                  width: isArrows ? "100%" : savedBox?.width ? `${savedBox.width}px` : "auto",
                  height: savedBox?.height ? `${savedBox.height}px` : "auto",
                  display: isArrows ? "flex" : "inline-block",
                  justifyContent: isArrows ? "space-between" : "initial",
                  alignItems: isArrows ? "center" : "initial",
                  pointerEvents: "auto",
                  boxSizing: "border-box",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isExpanded) setSelectedId(card.id);
                }}
              >
                <WidgetCard
                  card={card}
                  label={widgetLabel(card.type)}
                  ref={registerCardNode(card.id, true)}
                />

                {isSelected && !isArrows && (
                  <ResizeHandles
                    targetRef={{
                      current: wrapperNodeRefs.current.get(card.id) || null,
                    } as React.RefObject<HTMLElement>}
                    handles={["nw", "n", "ne", "e", "se", "s", "sw", "w"]}
                    minWidth={60}
                    minHeight={40}
                    onResizeEnd={(box) => {
                      setCards((prev) =>
                        prev.map((c) => (c.id === card.id ? { ...c, x: box.x, y: box.y } : c))
                      );
                      widgetBoxesRef.current[card.id] = box;
                    }}
                  />
                )}
              </div>
            );
          })}
      </div>

      {mounted && createPortal(botoesNode, document.body)}

      <div ref={sideAnimacaoRef} className={styles.sideAnimacao}>
        <section className={styles.sideCard}>
          <div
            className={styles.cardListWrapper}
            style={{ padding: 30 }}
          >
            {cards
              .filter((c) => !c.placed)
              .map((card) => (
                <WidgetCard
                  key={card.id}
                  card={card}
                  label={widgetLabel(card.type)}
                  ref={registerCardNode(card.id, false)}
                />
              ))}
          </div>
        </section>
      </div>

      <div
        ref={baixoRef}
        className={styles.baixoWrapper}
        style={{
          position: "fixed",
          top: "100%",
          opacity: 0,
          pointerEvents: isExpanded ? "auto" : "none",
        }}
      >
        <section className={styles.baixoCard}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              height: "100%",
            }}
          >
            <span style={{ color: "white", fontSize: 12, opacity: 0.75 }}>
              Fundo da visualização quando ativo: <strong>{targetLabel}</strong>
            </span>

            <div
              ref={listaCoresRef}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {LISTA_CORES.map((cor, index) => (
                <BotaoCores
                  key={index}
                  corFundoB={cor}
                  onClick={() => mudarCor(cor)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}