"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

type Card = {
  id: number
  titulo: string
  descricao: string
}

type Pagina = {
  id: number
  titulo: string
  cards: Card[]
}

const paginas: Pagina[] = [
  {
    id: 1,
    titulo: "Página 1",
    cards: [
      {
        id: 1,
        titulo: "Card 1",
        descricao: "Conteúdo do primeiro card.",
      },
      {
        id: 2,
        titulo: "Card 2",
        descricao: "Conteúdo do segundo card.",
      },
      {
        id: 3,
        titulo: "Card 3",
        descricao: "Conteúdo do terceiro card.",
      },
      {
        id: 4,
        titulo: "Card 4",
        descricao: "Conteúdo do quarto card.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Página 2",
    cards: [
      {
        id: 5,
        titulo: "Card 5",
        descricao: "Conteúdo do quinto card.",
      },
      {
        id: 6,
        titulo: "Card 6",
        descricao: "Conteúdo do sexto card.",
      },
      {
        id: 7,
        titulo: "Card 7",
        descricao: "Conteúdo do sétimo card.",
      },
      {
        id: 8,
        titulo: "Card 8",
        descricao: "Conteúdo do oitavo card.",
      },
    ],
  },
  {
    id: 3,
    titulo: "Página 3",
    cards: [
      {
        id: 9,
        titulo: "Card 9",
        descricao: "Conteúdo do nono card.",
      },
      {
        id: 10,
        titulo: "Card 10",
        descricao: "Conteúdo do décimo card.",
      },
      {
        id: 11,
        titulo: "Card 11",
        descricao: "Conteúdo do décimo primeiro card.",
      },
      {
        id: 12,
        titulo: "Card 12",
        descricao: "Conteúdo do décimo segundo card.",
      },
    ],
  },
]

export default function CarroselVisual() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(1)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap() + 1)

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api) return

    const intervalo = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 10000)

    return () => clearInterval(intervalo)
  }, [api])

  return (
 <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" >
          <div className="w-full max-w-[900px] overflow-hidden rounded-lg bg-white p-6 text-black shadow-2xl">

      <Carousel
        setApi={setApi}
        opts={{
          loop: false,
        }}
        className="w-full"
      >

        <CarouselContent>

          {paginas.map((pagina) => (
            <CarouselItem key={pagina.id}>

              <section className="w-full">

                <h1 className="text-3xl font-bold mb-6">
                  {pagina.titulo}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                  {pagina.cards.map((card) => (
                    <article
                      key={card.id}
                      className="rounded-xl border bg-white p-6 shadow-sm"
                    >
                      <h2 className="text-xl font-semibold">
                        {card.titulo}
                      </h2>

                      <p className="mt-2 text-gray-500">
                        {card.descricao}
                      </p>
                    </article>
                  ))}

                </div>

              </section>

            </CarouselItem>
          ))}

        </CarouselContent>

      </Carousel>

      <div className="flex items-center justify-center gap-5 mt-8">

        <button
          onClick={() => api?.scrollPrev()}
          className="rounded-lg border px-5 py-2"
        >
          Anterior
        </button>

        <span>
          Página {current} de {paginas.length}
        </span>

        <button
          onClick={() => api?.scrollNext()}
          className="rounded-lg border px-5 py-2"
        >
          Próxima
        </button>

      </div>

      <div className="flex justify-center gap-2 mt-5">

        {paginas.map((pagina, index) => (
          <button
            key={pagina.id}
            onClick={() => api?.scrollTo(index)}
            className={`h-3 w-3 rounded-full ${
              current === index + 1
                ? "bg-black"
                : "bg-gray-300"
            }`}
          />
        ))}

      </div>

  </div>
   </div>
  )
}