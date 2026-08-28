"use client";

import { ButtonHTMLAttributes } from "react";
import AddIcon from '@mui/icons-material/Add';
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
        <AddIcon  />
      </span>
      
     
      <span className="label">{label}</span>
    </button>
  );
}