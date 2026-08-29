"use client";

import React, { forwardRef, useEffect, useState } from "react";
import styles from "./Widgets.module.css";

// 1. Incluímos o tipo "arrows"
export type WidgetType = "clock" | "weather" | "arrows";

export interface WidgetDef {
  type: WidgetType;
  label: string;
}

// 2. Adicionamos as Setas no Catálogo da Sidebar
export const WIDGET_LIBRARY: WidgetDef[] = [
  { type: "clock", label: "Horário" },
  { type: "weather", label: "Temperatura" },
  { type: "arrows", label: "Navegação" },
];

export interface CardState {
  id: string;
  type: WidgetType;
  placed: boolean; // true = na tela (separadas), false = na sidebar (juntas)
  x: number;
  y: number;
}

// ---------------------------------------------------------------------
// Widget: Relógio
// ---------------------------------------------------------------------
function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.widgetBody}>
      <span className={styles.widgetValue}>
        {now ? now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------
// Widget: Clima
// ---------------------------------------------------------------------
const FALLBACK_COORDS = { latitude: -23.5505, longitude: -46.6333 };

function WeatherWidget() {
  const [temp, setTemp] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function fetchTemp(lat: number, lon: number) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        if (cancelled) return;
        setTemp(Math.round(data.current_weather.temperature));
        setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchTemp(pos.coords.latitude, pos.coords.longitude),
        () => fetchTemp(FALLBACK_COORDS.latitude, FALLBACK_COORDS.longitude),
        { timeout: 5000 }
      );
    } else {
      fetchTemp(FALLBACK_COORDS.latitude, FALLBACK_COORDS.longitude);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.widgetBody}>
      <span className={styles.widgetValue}>
        {status === "loading" && "..."}
        {status === "error" && "N/D"}
        {status === "ok" && `${temp}°C`}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------
// Widget: Setas (Novo Widget-Card)
// ---------------------------------------------------------------------
interface ArrowsWidgetProps {
  placed: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

function ArrowsWidget({ placed, onPrev, onNext }: ArrowsWidgetProps) {
  return (
    <div className={`${styles.arrowsWrapper} ${placed ? styles.placed : styles.inSidebar}`}>
      <button
        type="button"
        className={styles.arrowButton}
        onClick={onPrev}
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        type="button"
        className={styles.arrowButton}
        onClick={onNext}
        aria-label="Próximo"
      >
        ›
      </button>
    </div>
  );
}

// Switch renderizador de cada tipo de conteúdo
function WidgetContent({ card }: { card: CardState }) {
  switch (card.type) {
    case "clock":
      return <ClockWidget />;
    case "weather":
      return <WeatherWidget />;
    case "arrows":
      return <ArrowsWidget placed={card.placed} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------
// Card Geral (Renderiza o catálogo/sidebar ou o canvas)
// ---------------------------------------------------------------------
interface WidgetCardProps {
  card: CardState;
  label: string;
  style?: React.CSSProperties;
}

const WidgetCard = forwardRef<HTMLDivElement, WidgetCardProps>(
  ({ card, label, style }, ref) => {
    return (
      <div
        ref={ref}
        data-flip-id={card.id}
        className={`${styles.card} ${card.type === "arrows" ? styles.arrowsCard : ""}`}
        style={style}
      >
        <span className={styles.cardLabel}>{label}</span>
        <WidgetContent card={card} />
      </div>
    );
  }
);

WidgetCard.displayName = "WidgetCard";

export default WidgetCard;