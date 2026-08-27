"use client";

import React from "react";
import ReelCarousel from "@/components/ReelCarousel";
import TelaCarroselRespeitosa from "./tela-carrosel";

interface Props {
  children?: React.ReactNode;
  showOverlay?: boolean;
  corFundo: string;
}

export default function TelaCarrosel({
  children,
  showOverlay = true,
  corFundo
}: Props) {
  return (
    <div className="relative min-h-screen w-full">
      <main>{children}</main>

      {showOverlay && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" style={{backgroundColor: "black"}}>
          <div className="w-full max-w-[900px] overflow-hidden rounded-lg bg-white p-6 text-black shadow-2xl">
            <div className="h-[600px] w-full">
              <TelaCarroselRespeitosa corFundo={"black"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}