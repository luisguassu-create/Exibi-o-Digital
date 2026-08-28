"use client";

import React, { forwardRef, useEffect, useState } from "react";
import styles from "./Widgets.module.css";

export type WidgetType = "clock" | "weather";

export interface WidgetDef {
  type: WidgetType;
  label: string;
}

// Catálogo de widgets disponíveis. Pra adicionar um novo tipo de card,
// basta adicionar uma entrada aqui e um "case" no <WidgetContent>.
export const WIDGET_LIBRARY: WidgetDef[] = [
  { type: "clock", label: "Horário" },
  { type: "weather", label: "Temperatura" },
];

export interface CardState {
  id: string;
  type: WidgetType;
  placed: boolean; // true = está dentro do `el`, false = está na sidebar
  x: number; // posição em px relativa ao `el`, só usada quando placed
  y: number;
}

// ---------------------------------------------------------------------
// Widget: Horário (relógio ao vivo)
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
      {/* <span className={styles.widgetIcon}>🕒</span> */}
      <span className={styles.widgetValue}>
        {now ? now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------
// Widget: Temperatura (Open-Meteo, gratuito, sem API key)
// Usa geolocalização do navegador; se o usuário negar, cai num fallback
// fixo (ajuste as coordenadas se quiser outra cidade padrão).
// ---------------------------------------------------------------------
const FALLBACK_COORDS = { latitude: -23.5505, longitude: -46.6333 }; // São Paulo, SP

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
      {/* <span className={styles.widgetIcon}>🌡️</span> */}
      <span className={styles.widgetValue}>
        {status === "loading" && "..."}
        {status === "error" && "N/D"}
        {status === "ok" && `${temp}°C`}
      </span>
    </div>
  );
}

function WidgetContent({ type }: { type: WidgetType }) {
  switch (type) {
    case "clock":
      return <ClockWidget />;
    case "weather":
      return <WeatherWidget />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------
// Card arrastável. O forwardRef é o nó que o Draggable do GSAP vai
// controlar; data-flip-id é a chave que o plugin Flip usa pra encontrar
// o elemento antes/depois de ele trocar de pai no React.
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
        className={styles.card}
        style={style}
      >
        <span className={styles.cardLabel}>{label}</span>
        <WidgetContent type={card.type} />
      </div>
    );
  }
);

WidgetCard.displayName = "WidgetCard";

export default WidgetCard;