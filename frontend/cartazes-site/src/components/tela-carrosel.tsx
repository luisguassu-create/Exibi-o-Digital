"use client";

import React from "react";
import ReelCarousel from "@/components/ReelCarousel";
// import TelaImportada from "@/components/tela-carrosel"

interface Props {
  corFundo: string;
}

export default function TelaCarroselRespeitosa({corFundo}: Props){
  return (
    <div style={{background: corFundo}}>
        <ReelCarousel />
    </div>  
  );
}