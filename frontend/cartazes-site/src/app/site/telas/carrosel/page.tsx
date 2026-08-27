// src/app/site/telas/carrosel/page.tsx
import ReelCarousel from "@/components/ReelCarousel";

export default function TelaCarrosel() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
     
      <div style={{ width: "100%", maxWidth: 900, height: 600 }}>
        <ReelCarousel />
      </div>
    </main>
  );
}