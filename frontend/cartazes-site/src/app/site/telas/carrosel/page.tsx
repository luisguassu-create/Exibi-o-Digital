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
  carrossel: { x: number; y: number; scale: number };
  widgets: { id: string; type: CardState["type"]; x: number; y: number }[];
}

const STORAGE_KEY = "tela-modificacao-layout";

const LISTA_CORES = [
  "white",
  "blue",
  "red",
  "purple",
  "yellow",
  "orange",
  "black",
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

const initialCards: CardState[] = WIDGET_LIBRARY.map((w) => ({
  id: `widget-${w.type}`,
  type: w.type,
  placed: false,
  x: 0,
  y: 0,
}));

// Tratamento seguro caso a cor seja undefined
const getBackgroundStyle = (cor?: string): React.CSSProperties => {
  if (!cor) return { backgroundColor: "white" };

  const isGradient = cor.includes("gradient");
  return {
    backgroundColor: isGradient ? "transparent" : cor,
    backgroundImage: isGradient ? cor : "none",
  };
};

export default function TelaModificacao({
  corFundo,
  corFundoB,
  onSave,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cards, setCards] = useState<CardState[]>(initialCards);

  // Fallback para evitar estado undefined
  const [corClicada, setCorClicada] = useState<string>(corFundo || "white");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const telaAnimacaoRef = useRef<HTMLDivElement | null>(null);
  const carrosselRef = useRef<HTMLElement | null>(null);
  const sideAnimacaoRef = useRef<HTMLDivElement | null>(null);
  const baixoRef = useRef<HTMLDivElement | null>(null);
  const botao = useRef<HTMLDivElement | null>(null);

  const originalRectRef = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const draggableInstanceRef = useRef<globalThis.Draggable[] | null>(null);
  const isAnimatingRef = useRef(false);

  const [carrosselTransform, setCarrosselTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  const cardNodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const mudarCor = (novaCor: string) => {
    setCorClicada(novaCor);
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
        
        if (saved.corFundo) {
          setCorClicada(saved.corFundo);
        }

        setCards((prev) =>
          prev.map((c) => {
            const found = saved.widgets.find((w) => w.id === c.id);
            return found ? { ...c, placed: true, x: found.x, y: found.y } : c;
          })
        );
        setCarrosselTransform(saved.carrossel);
      }
    } catch {
      // Nenhum layout salvo ainda
    }
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
    node: HTMLDivElement,
    wasPlaced: boolean
  ) {
    const el = telaAnimacaoRef.current;
    if (!el) return;

    const overEl = Draggable.hitTest(node, el, "50%");

    if (!overEl && !wasPlaced) {
      gsap.to(node, { x: 0, y: 0, duration: 0.35, ease: "power2.out" });
      return;
    }

    const flipEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-flip-id]")
    );
    const flipState = Flip.getState(flipEls);

    if (overEl) {
      const cardRect = node.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relX = cardRect.left - elRect.left;
      const relY = cardRect.top - elRect.top;

      flushSync(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === cardId ? { ...c, placed: true, x: relX, y: relY } : c
          )
        );
      });
    } else {
      flushSync(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, placed: false } : c))
        );
      });
    }

    gsap.set(node, { x: 0, y: 0 });

    Flip.from(flipState, {
      duration: 0.45,
      ease: "power2.out",
      absolute: true,
    });
  }

  useEffect(() => {
    if (!isExpanded) return;

    const instances: globalThis.Draggable[] = [];

    cards.forEach((card) => {
      const node = cardNodeRefs.current.get(card.id);
      if (!node) return;

      const [inst] = Draggable.create(node, {
        type: "x,y",
        bounds: containerRef.current ?? undefined,
        onDragEnd() {
          handleCardDragEnd(
            card.id,
            this.target as HTMLDivElement,
            card.placed
          );
        },
      });
      instances.push(inst);
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
        if (el)
          gsap.set(el, { clearProps: "position,top,left,width,height,zIndex" });
        if (carrossel) gsap.set(carrossel, { clearProps: "width,height" });

        isAnimatingRef.current = false;
        setIsExpanded(false);
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
      tl.to(
        side,
        {
          marginRight: "-500px",
          opacity: 0,
          scaleX: 1.4,
          scaleY: 0.9,
          duration: 0.4,
          ease: "back.in(1.2)",
        },
        "-=0.3"
      );
    }

    if (baixo) {
      tl.to(baixo, { top: 1000, duration: 0.6, ease: "expo.inOut" }, "-=0.3");
    }

    if (el && targetRect) {
      tl.to(
        el,
        {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          duration: 0.7,
          ease: "expo.inOut",
        },
        "-=0.5"
      );
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

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    tl.fromTo(b, { top: 570 }, { top: 860, duration: 0.7, ease: "expo.out" })
      .fromTo(
        el,
        {
          position: "fixed",
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          zIndex: 9999,
        },
        {
          top: 100,
          left: 20,
          width: "70vw",
          height: "80vh",
          duration: 0.9,
          ease: "expo.out",
        },
        "<"
      )
      .fromTo(
        baixo,
        { top: 1000 },
        { top: 875, duration: 0.7, ease: "expo.out" },
        "-=0.7"
      )
      .fromTo(
        carrossel,
        {
          width: "30%",
          height: "80%",
          borderRadius: "10px",
          scale: 0.85,
          opacity: 0.5,
        },
        {
          width: "30%",
          height: "80%",
          borderRadius: "10px",
          scale: carrosselTransform.scale,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(2.2)",
        },
        "-=0.5"
      );

    if (side) {
      tl.fromTo(
        side,
        {
          marginTop: "0px",
          marginRight: "-500px",
          opacity: 0,
          scaleX: 1.55,
          scaleY: 0.85,
          transformOrigin: "right center",
        },
        {
          marginTop: "0px",
          marginRight: "20px",
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            draggableInstanceRef.current = Draggable.create(carrossel, {
              bounds: el,
              edgeResistance: 0.65,
              type: "x,y",
              cursor: "grab",
              activeCursor: "grabbing",
              onDragEnd() {
                setCarrosselTransform({
                  x: this.x,
                  y: this.y,
                  scale: (gsap.getProperty(carrossel, "scale") as number) ?? 1,
                });
              },
            });
          },
        },
        ">"
      );
    }

    setIsExpanded(true);
  };

  function persistLayout(layout: SavedLayout) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // sem localStorage disponível
    }
    onSave?.(layout);
  }

  function handleSalvar() {
    if (salvando) return;
    setSalvando(true);

    const layout: SavedLayout = {
      corFundo: corClicada,
      carrossel: carrosselTransform,
      widgets: cards
        .filter((c) => c.placed)
        .map(({ id, type, x, y }) => ({ id, type, x, y })),
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

  const registerCardNode = (id: string) => (node: HTMLDivElement | null) => {
    if (node) cardNodeRefs.current.set(id, node);
    else cardNodeRefs.current.delete(id);
  };

  const widgetLabel = (type: CardState["type"]) =>
    WIDGET_LIBRARY.find((w) => w.type === type)?.label ?? type;

  const botoesNode = (
    <div
      ref={botao}
      className={styles.botoesWrapper}
      style={{ top: 590 }}
    >
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
          transform: salvando ? "scale(0.96)" : "scale(1)",
        }}
      >
        {salvando ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        ref={telaAnimacaoRef}
        className={`TelaAnimacao ${styles.telaAnimacao}`}
      >
        <section
          style={getBackgroundStyle(corClicada)}
          className={`VizualizacaoCard ${styles.visualizacaoCard}`}
        >
          <section
            ref={carrosselRef}
            className={`CarrosselRep ${styles.carrossel}`}
            style={{
              cursor: isExpanded ? "grab" : "default",
              background:
                "linear-gradient(180deg, rgb(51, 52, 60) 0%, rgb(38, 39, 45) 100%)",
            }}
          ></section>
        </section>

        {cards
          .filter((c) => c.placed)
          .map((card) => (
            <WidgetCard
              key={card.id}
              card={card}
              label={widgetLabel(card.type)}
              ref={registerCardNode(card.id)}
              style={{ position: "absolute", left: card.x, top: card.y }}
            />
          ))}
      </div>

      {mounted && createPortal(botoesNode, document.body)}

      <div ref={sideAnimacaoRef} className={styles.sideAnimacao}>
        <section className={styles.sideCard}>
          <div className={styles.cardListWrapper}>
            {cards
              .filter((c) => !c.placed)
              .map((card) => (
                <WidgetCard
                  key={card.id}
                  card={card}
                  label={widgetLabel(card.type)}
                  ref={registerCardNode(card.id)}
                />
              ))}
          </div>
        </section>
      </div>

      <div ref={baixoRef} className={styles.baixoWrapper}
      style={{
        top:"1000px"
      }}>
        <section className={styles.baixoCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              height: "100%",
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
        </section>
      </div>
    </div>
  );
}