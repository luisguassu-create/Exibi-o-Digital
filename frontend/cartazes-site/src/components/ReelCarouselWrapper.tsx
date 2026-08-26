// src/components/ReelCarouselWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const ReelCarousel = dynamic(
  // @ts-ignore
  () => import("https://framerusercontent.com/modules/qgQ9uBlwk7TgOaVACsv8/hhIfutvtbTOT7vCLwARr/ReelCarousel_1.js"),
  { ssr: false }
);

export default function ReelCarouselWrapper() {
  return <ReelCarousel />;
}