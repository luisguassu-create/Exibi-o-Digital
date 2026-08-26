import ReelCarouselWrapper from "@/components/ReelCarouselWrapper";

export default function ReelsPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Carrossel de Reels</h1>
      <div className="w-full max-w-4xl h-[600px]">
        <ReelCarouselWrapper />
      </div>
    </main>
  );
}