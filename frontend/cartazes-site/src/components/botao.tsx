"use client";

import { ButtonHTMLAttributes } from "react";
import "./botao.css";

interface NovoCartazButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function NovoCartazButton({
  label = "Novo Cartaz",
  className,
  ...props
}: NovoCartazButtonProps) {
  return (
    <button
      type="button"
      className={`btnCartaz ${className ?? ""}`}
      {...props}
    >
      <span className="iconPlus">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="plusGrad" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#7c8cff" />
              <stop offset="100%" stopColor="#b06cff" />
            </linearGradient>
          </defs>
          <path
            d="M12 5v14M5 12h14"
            stroke="url(#plusGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="label">{label}</span>
    </button>
  );
}