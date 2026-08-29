"use client"

// Coverflow Carousel — Originkit
// Agora conectado à Tela de Modificação: lê o layout salvo (cor de fundo,
// posição/tamanho do carrossel e dos widgets) e aplica na tela de visualização.

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type MotionValue,
} from "framer-motion"
import { useRouter } from "next/navigation"
import ModalSair from "@/components/moda-sairVisual"

const RenderTarget = {
    current: () => "preview",
    canvas: "canvas",
    export: "export",
    thumbnail: "thumbnail",
    preview: "preview",
}

// -----------------------------------------------------------------------------
// NOVO: contrato com a Tela de Modificação
// -----------------------------------------------------------------------------

// Mesma chave usada em TelaModificacao.tsx — é assim que as duas telas
// "conversam" (via localStorage), sem precisar de um estado global.
const STORAGE_KEY = "tela-modificacao-layout"
const LAYOUT_UPDATED_EVENT = "tela-modificacao-layout-updated"

type SavedWidget = {
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
}

// Estrutura equivalente à `SavedLayout` exportada por TelaModificacao.tsx.
// Se preferir, troque por: `import type { SavedLayout } from "../TelaModificacao/TelaModificacao"`
//
// x/y/width/height do carrossel e de cada widget são sempre a CAIXA FINAL
// RENDERIZADA no editor (relativa ao `el`), não valores de transform. Não
// precisamos mais de um "scale" isolado — o tamanho já vem pronto.
export type SavedLayout = {
    corFundo?: string
    elSize: { width: number; height: number }
    carrossel: { x: number; y: number; width: number; height: number }
    widgets: SavedWidget[]
}

const getBackgroundStyle = (cor?: string): React.CSSProperties => {
    if (!cor) return { backgroundColor: "white" }
    const isGradient = cor.includes("gradient")
    return {
        backgroundColor: isGradient ? "transparent" : cor,
        backgroundImage: isGradient ? cor : "none",
    }
}

function readSavedLayout(): SavedLayout | null {
    if (typeof window === "undefined") return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as SavedLayout) : null
    } catch {
        return null
    }
}

/**
 * Hook que mantém o layout salvo pela Tela de Modificação sempre atualizado:
 * - lê do localStorage assim que monta
 * - escuta o evento customizado (disparado na mesma aba quando o usuário salva)
 * - escuta o evento nativo "storage" (disparado quando o salvamento acontece
 *   em outra aba/rota)
 */
function useSavedLayout(overrideLayout?: SavedLayout | null) {
    const [layout, setLayout] = useState<SavedLayout | null>(overrideLayout ?? null)

    useEffect(() => {
        if (overrideLayout) {
            setLayout(overrideLayout)
            return
        }

        setLayout(readSavedLayout())

        const onCustomUpdate = (e: Event) => {
            const detail = (e as CustomEvent<SavedLayout>).detail
            setLayout(detail ?? readSavedLayout())
        }
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) setLayout(readSavedLayout())
        }

        window.addEventListener(LAYOUT_UPDATED_EVENT, onCustomUpdate as EventListener)
        window.addEventListener("storage", onStorage)
        return () => {
            window.removeEventListener(LAYOUT_UPDATED_EVENT, onCustomUpdate as EventListener)
            window.removeEventListener("storage", onStorage)
        }
    }, [overrideLayout])

    return layout
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CoverflowImage = {
    src?: any
    srcUrl?: string
    alt?: string
}

type Props = {
    images?: CoverflowImage[]
    activeWidth?: number
    activeHeight?: number
    restWidth?: number
    restHeight?: number
    gap?: number
    radius?: number
    showArrows?: boolean
    arrowColor?: string
    arrowBackground?: string
    arrowSize?: number
    arrowPosition?: number
    autoplay?: boolean
    autoplayDirection?: "leftToRight" | "rightToLeft"
    transition?: any
    style?: React.CSSProperties
    // NOVO: permite injetar o layout diretamente via prop (ex: vindo de um
    // contexto/estado do app) em vez de depender só do localStorage.
    layout?: SavedLayout | null
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const PLACEHOLDER_URLS = [
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/612d1402-0ad9-4135-3bbc-a30a6a252b00/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/6d2ad64a-102d-4eab-0efe-31479e34b500/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/be854dd1-37aa-4fc7-f569-fdb948109300/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/51984031-9176-484b-f5e0-4af9a8e9ed00/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/34ce1842-4b7a-4d52-0302-38582c341700/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/88369c6d-00cc-4ac9-74ca-0f0965e06300/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/aeaa0756-9647-4f6c-d900-204bd25e4a00/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/316d1761-fd79-4ca9-b8d4-f2bb20521a00/w=800",
]

const DEFAULT_IMAGES: CoverflowImage[] = PLACEHOLDER_URLS.map((url, i) => ({
    srcUrl: url,
    alt: `Coverflow card ${i + 1}`,
}))

const GRADIENT_FALLBACKS = [
    "linear-gradient(160deg, #ff6b6b, #ffd93d)",
    "linear-gradient(160deg, #4facfe, #00f2fe)",
    "linear-gradient(160deg, #43e97b, #38f9d7)",
    "linear-gradient(160deg, #fa709a, #fee140)",
    "linear-gradient(160deg, #a18cd1, #fbc2eb)",
    "linear-gradient(160deg, #f093fb, #f5576c)",
    "linear-gradient(160deg, #5ee7df, #b490ca)",
]

const RENDER_RANGE = 0

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function resolveImageSrc(input: any): string {
    if (!input) return ""
    if (typeof input === "string") return input
    if (typeof input === "object" && input.src) return input.src
    return ""
}

function resolveImageSrcSet(input: any): string | undefined {
    if (input && typeof input === "object" && input.srcSet) return input.srcSet
    return undefined
}

function resolveItemSrc(item: CoverflowImage | undefined): string {
    const override = item?.srcUrl && item.srcUrl.trim()
    if (override) return override
    return resolveImageSrc(item?.src)
}

type Sizing = {
    restWidth: number
    restHeight: number
    activeWidth: number
    activeHeight: number
}

function relOf(index: number, pos: number, count: number): number {
    let rel = (((index - pos) % count) + count) % count
    if (rel > count / 2) rel -= count
    return rel
}

function xForRel(rel: number, s: Sizing, gap: number): number {
    const ar = Math.abs(rel)
    const c1 = s.activeWidth / 2 + gap + s.restWidth / 2
    const pitch = s.restWidth + gap
    const mag = ar <= 1 ? ar * c1 : c1 + (ar - 1) * pitch
    return (rel < 0 ? -1 : 1) * mag
}

function blendForRel(rel: number): number {
    return Math.min(Math.abs(rel), 1)
}

// -----------------------------------------------------------------------------
// Card Component
// -----------------------------------------------------------------------------

function Card({
    item,
    index,
    pos,
    count,
    R,
    sizing,
    gap,
    radius,
    gradient,
    onSelect,
}: {
    item: CoverflowImage | undefined
    index: number
    pos: MotionValue<number>
    count: number
    R: number
    sizing: Sizing
    gap: number
    radius: number
    gradient: string
    onSelect: ((index: number) => void) | undefined
}) {
    const src = resolveItemSrc(item)
    const srcSet = resolveImageSrcSet(item?.src)

    const x = useTransform(pos, (p: number) =>
        xForRel(relOf(index, p, count), sizing, gap)
    )

    const opacity = useTransform(pos, (p: number) => {
        const ar = Math.abs(relOf(index, p, count))
        return ar >= 1 ? 0 : 1 - ar
    })

    const zIndex = useTransform(pos, (p: number) =>
        Math.round(1000 - Math.abs(relOf(index, p, count)) * 100)
    )
    const width = useTransform(pos, (p: number) => {
        const a = blendForRel(relOf(index, p, count))
        return sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a
    })
    const height = useTransform(pos, (p: number) => {
        const a = blendForRel(relOf(index, p, count))
        return (
            sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a
        )
    })
    const borderRadius = useTransform(pos, (p: number) => {
        const a = blendForRel(relOf(index, p, count))
        const w =
            sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a
        const h =
            sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a
        return (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(w, h) / 2)
    })
    const boxShadow = useTransform(pos, (p: number) =>
        Math.abs(relOf(index, p, count)) < 0.5
            ? "0 24px 70px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 14px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.05)"
    )

    return (
        <motion.div
            onClick={onSelect ? () => onSelect(index) : undefined}
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                x,
                zIndex,
                opacity,
                cursor: onSelect ? "pointer" : "default",
            }}
        >
            <motion.div
                style={{
                    x: "-50%",
                    y: "-50%",
                    width,
                    height,
                    borderRadius,
                    overflow: "hidden",
                    background: gradient,
                    boxShadow,
                }}
            >
                {src ? (
                    <img
                        src={src}
                        srcSet={srcSet}
                        alt={item?.alt || ""}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            pointerEvents: "none",
                            userSelect: "none",
                        }}
                    />
                ) : null}
            </motion.div>
        </motion.div>
    )
}

// -----------------------------------------------------------------------------
// NOVO: conteúdo real de cada widget na tela de visualização (não é mais um
// badge tipo pílula — segue o mesmo visual do card "Horário / Temperatura").
// Ajuste os tipos/labels aqui conforme os tipos reais do seu WIDGET_LIBRARY.
// -----------------------------------------------------------------------------

function ClockWidgetContent({ labelColor }: { labelColor: string }) {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    const hh = String(now.getHours()).padStart(2, "0")
    const mm = String(now.getMinutes()).padStart(2, "0")

    return (
        <>
            <span style={{ color: labelColor, fontSize: 13, fontWeight: 500 }}>Horário</span>
            <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>
                {hh}:{mm}
            </span>
        </>
    )
}

function WeatherWidgetContent({ labelColor }: { labelColor: string }) {
    // Sem integração com uma API de clima ainda — troque por dados reais
    // quando tiver uma fonte (props, fetch, etc).
    return (
        <>
            <span style={{ color: labelColor, fontSize: 13, fontWeight: 500 }}>Temperatura</span>
            <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>--°C</span>
        </>
    )
}

function ArrowsWidgetContent({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
    const btnStyle: React.CSSProperties = {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        background: "rgba(255,255,255,0.9)",
        color: "black",
        fontSize: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    }
    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
            <button style={btnStyle} onClick={(e) => { e.stopPropagation(); onPrev() }}>
                ‹
            </button>
            <button style={btnStyle} onClick={(e) => { e.stopPropagation(); onNext() }}>
                ›
            </button>
        </div>
    )
}

function WidgetOverlay({
    widget,
    scale,
    onPrev,
    onNext,
}: {
    widget: SavedWidget
    scale: number
    onPrev: () => void
    onNext: () => void
}) {
    const isArrows = widget.type === "arrows"
    const isClock = widget.type === "clock"
    const isWeather = widget.type === "weather"

    // Fonte/padding acompanham a escala pra não ficarem desproporcionais em
    // telas muito maiores/menores que o editor.
    const fontScale = Math.min(1.4, Math.max(0.6, scale))

    const cardStyle: React.CSSProperties = {
        position: "absolute",
        left: widget.x * scale,
        top: widget.y * scale,
        width: widget.width * scale,
        height: widget.height * scale,
        zIndex: 900,
        pointerEvents: isArrows ? "auto" : "none",
        borderRadius: 14 * fontScale,
        background: isArrows ? "transparent" : "rgba(255,255,255,0.07)",
        boxShadow: isArrows ? "none" : "0 12px 30px rgba(0,0,0,0.35)",
        backdropFilter: isArrows ? undefined : "blur(6px)",
        padding: isArrows ? 0 : `${10 * fontScale}px ${16 * fontScale}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4 * fontScale,
        fontSize: 13 * fontScale,
    }

    let content: React.ReactNode = (
        <span style={{ color: "white", fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>
            {widget.type}
        </span>
    )
    if (isClock) content = <ClockWidgetContent labelColor="#d8b98f" />
    if (isWeather) content = <WeatherWidgetContent labelColor="#a9b8f5" />
    if (isArrows) content = <ArrowsWidgetContent onPrev={onPrev} onNext={onNext} />

    return <div style={cardStyle}>{content}</div>
}

// -----------------------------------------------------------------------------
// Component Defaults
// -----------------------------------------------------------------------------

const COMPONENT_DEFAULTS = {
    images: DEFAULT_IMAGES,
    activeWidth: 400,
    activeHeight: 600,
    restWidth: 200,
    restHeight: 270,
    gap: 30,
    radius: 2,
    showArrows: true,
    arrowColor: "#000000",
    arrowBackground: "#FFFFFF",
    arrowSize: 56,
    arrowPosition: 95,
    autoplay: true,
    autoplayDirection: "rightToLeft" as const,
    transition: {
        type: "tween",
        duration: 0.5,
        delay: 2.5,
        ease: "easeInOut",
    },
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function CoverflowCarousel(props: Props) {
    const [mostrarBotao, setMostrarBotao] = useState(false)
    const [aberto, setAberto] = useState(false)
    const router = useRouter()

    // NOVO: layout vindo da Tela de Modificação (prop ou localStorage)
    const savedLayout = useSavedLayout(props.layout)

    // NOVO: mede o "palco" (a tela cheia disponível) para calcular o
    // "delimitador" — uma área do MESMO FORMATO do `el` do editor
    // (elSize), só que escalada pra caber na tela real, mantendo a
    // proporção (como um `object-fit: contain`). É essa área que vira, de
    // fato, a versão "grande" do `el` da tela de modificação.
    const stageRef = useRef<HTMLDivElement | null>(null)
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const node = stageRef.current
        if (!node) return

        const measure = () => {
            const rect = node.getBoundingClientRect()
            setStageSize({ width: rect.width, height: rect.height })
        }

        measure()
        window.addEventListener("resize", measure)

        let resizeObserver: ResizeObserver | undefined
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(measure)
            resizeObserver.observe(node)
        }

        return () => {
            window.removeEventListener("resize", measure)
            resizeObserver?.disconnect()
        }
    }, [])

    const elSize = savedLayout?.elSize

    // Um ÚNICO fator de escala (não X e Y separados) — assim a proporção do
    // editor é preservada e nada fica esticado/distorcido.
    const scale = useMemo(() => {
        if (!elSize || !elSize.width || !elSize.height || !stageSize.width || !stageSize.height) {
            return 1
        }
        return Math.min(stageSize.width / elSize.width, stageSize.height / elSize.height)
    }, [elSize, stageSize])

    // Tamanho final do delimitador (o `el` "grande"), centralizado no palco.
    const delimiterWidth = elSize ? elSize.width * scale : stageSize.width
    const delimiterHeight = elSize ? elSize.height * scale : stageSize.height

    function clicouTela() {
        // Se o modal estiver aberto, ignora cliques na tela para não esconder o botão de fundo
        if (aberto) return
        setMostrarBotao((prev) => !prev)
    }

    const mergedProps = { ...COMPONENT_DEFAULTS, ...props }
    const {
        images: rawImages,
        activeWidth,
        activeHeight,
        restWidth,
        restHeight,
        gap,
        radius,
        autoplay,
        autoplayDirection,
        transition: transitionProp,
        style,
    } = mergedProps

    const renderTarget = RenderTarget.current()
    const isStatic =
        renderTarget === RenderTarget.export ||
        renderTarget === RenderTarget.thumbnail
    const prefersReducedMotion = useReducedMotion()

    const images = useMemo(
        () =>
            Array.isArray(rawImages) && rawImages.length > 0
                ? rawImages
                : DEFAULT_IMAGES,
        [rawImages]
    )
    const count = Math.max(1, images.length)

    const sizing: Sizing = useMemo(
        () => ({ restWidth, restHeight, activeWidth, activeHeight }),
        [restWidth, restHeight, activeWidth, activeHeight]
    )

    const moveDur =
        typeof transitionProp?.duration === "number"
            ? transitionProp.duration
            : 0.5
    const dwell =
        typeof transitionProp?.delay === "number"
            ? Math.max(0, transitionProp.delay)
            : 2.5

    const R = RENDER_RANGE

    const pos = useMotionValue(0)
    const targetRef = useRef(0)
    const rafRef = useRef<number | null>(null)
    const lastTRef = useRef<number | null>(null)
    const autoplayingRef = useRef(false)
    const dirRef = useRef(1)
    const dwellAccRef = useRef(0)

    const moveDurRef = useRef(moveDur)
    moveDurRef.current = moveDur
    const dwellRef = useRef(dwell)
    dwellRef.current = dwell
    const reducedRef = useRef(prefersReducedMotion)
    reducedRef.current = prefersReducedMotion

    const tick = useCallback(
        (t: number) => {
            const last = lastTRef.current ?? t
            const dt = Math.min((t - last) / 1000, 1 / 30)
            lastTRef.current = t

            const cur = pos.get()
            const diff = targetRef.current - cur
            const dur = Math.max(0.08, moveDurRef.current)
            const step = (1 / dur) * dt
            const arriving = reducedRef.current || Math.abs(diff) <= step

            if (arriving) {
                pos.set(targetRef.current)
                if (autoplayingRef.current) {
                    dwellAccRef.current += dt
                    if (dwellAccRef.current >= Math.max(0, dwellRef.current)) {
                        dwellAccRef.current = 0
                        targetRef.current += dirRef.current
                    }
                    rafRef.current = requestAnimationFrame(tick)
                    return
                }
                rafRef.current = null
                lastTRef.current = null
                return
            }

            pos.set(cur + Math.sign(diff) * step)
            rafRef.current = requestAnimationFrame(tick)
        },
        [pos]
    )

    const ensureRunning = useCallback(() => {
        if (rafRef.current == null) {
            lastTRef.current = null
            rafRef.current = requestAnimationFrame(tick)
        }
    }, [tick])

    const goNext = useCallback(() => {
        targetRef.current += 1
        ensureRunning()
    }, [ensureRunning])

    const goPrev = useCallback(() => {
        targetRef.current -= 1
        ensureRunning()
    }, [ensureRunning])

    const goTo = useCallback(
        (index: number) => {
            const cur = targetRef.current
            let d = index - cur
            d = ((d % count) + count) % count
            if (d > count / 2) d -= count
            targetRef.current = cur + d
            ensureRunning()
        },
        [ensureRunning, count]
    )

    useEffect(() => {
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }, [])

    useEffect(() => {
        const on = !isStatic && autoplay && count > 1
        autoplayingRef.current = on
        if (on) {
            dirRef.current = autoplayDirection === "leftToRight" ? -1 : 1
            dwellAccRef.current = 0
            ensureRunning()
        }
        return () => {
            autoplayingRef.current = false
        }
    }, [isStatic, autoplay, autoplayDirection, count, ensureRunning])

    const isHoveredRef = useRef(false)
    useEffect(() => {
        if (isStatic) return
        const onKey = (e: KeyboardEvent) => {
            if (!isHoveredRef.current) return
            if (e.key === "ArrowLeft") {
                e.preventDefault()
                goPrev()
            } else if (e.key === "ArrowRight") {
                e.preventDefault()
                goNext()
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isStatic, goPrev, goNext])

    // NOVO: se houver layout salvo, o container do carrossel é posicionado e
    // dimensionado de acordo com o que foi definido no editor, dentro do
    // delimitador (escalado com um único fator, sem distorção). Sem layout
    // salvo, mantém o comportamento padrão (caixa centralizada em tela cheia).
    const hasLayout = !!savedLayout && !!elSize
    const carrossel = savedLayout?.carrossel

    const containerStyle: React.CSSProperties = hasLayout
        ? {
              ...style,
              position: "absolute",
              left: carrossel!.x * scale,
              top: carrossel!.y * scale,
              width: carrossel!.width * scale,
              height: carrossel!.height * scale,
              // "blue" era um placeholder — o container do carrossel usa um
              // fundo neutro (igual ao "CarrosselRep" do editor), já que a
              // cor escolhida pelo usuário vai para o fundo da TELA
              // (delimitador), não do carrossel em si.
              background: "linear-gradient(180deg, rgb(51, 52, 60) 0%, rgb(38, 39, 45) 100%)",
              overflow: "hidden",
              userSelect: "none",
              touchAction: isStatic ? undefined : "pan-y",
              outline: "none",
              borderRadius: 10,
          }
        : {
              ...style,
              position: "relative",
              background: "linear-gradient(180deg, rgb(51, 52, 60) 0%, rgb(38, 39, 45) 100%)",
              width: "100%",
              height: "100%",
              minWidth: 3000,
              minHeight: 240,
              overflow: "hidden",
              userSelect: "none",
              touchAction: isStatic ? undefined : "pan-y",
              outline: "none",
          }

    const selectable = !isStatic
    const cards = images.map((img, i) => (
        <Card
            key={i}
            item={img}
            index={i}
            pos={pos}
            count={count}
            R={R}
            sizing={sizing}
            gap={gap}
            radius={radius}
            gradient={GRADIENT_FALLBACKS[i % GRADIENT_FALLBACKS.length]}
            onSelect={selectable ? goTo : undefined}
        />
    ))

    // NOVO: fundo da TELA de visualização = cor escolhida no editor (corFundo).
    // Antes era sempre um overlay preto semitransparente ("bg-black/50"). O
    // próprio palco inteiro (fixed inset-0) recebe essa cor — é ele que
    // representa o `el` da tela de modificação agora.
    const stageBackgroundStyle = getBackgroundStyle(savedLayout?.corFundo)

    return (
        <div
            ref={stageRef}
            className="fixed inset-0 z-[9999] overflow-hidden"
            style={hasLayout ? stageBackgroundStyle : { backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={clicouTela}
        >
            {hasLayout ? (
                // NOVO: "delimitador" — mesma proporção do `el` do editor,
                // escalado com um único fator e centralizado no palco. Tudo
                // que está dentro dele (carrossel + widgets) usa a MESMA
                // escala, então as proporções batem exatamente com o editor.
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: delimiterWidth,
                        height: delimiterHeight,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div className="overflow-hidden rounded-lg text-black shadow-2xl" style={containerStyle}>
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                overflow: "hidden",
                                isolation: "isolate",
                                zIndex: 0,
                            }}
                        >
                            {cards}
                        </div>
                    </div>

                    {/* NOVO: widgets posicionados no editor, na mesma escala do delimitador */}
                    {savedLayout!.widgets.map((widget) => (
                        <WidgetOverlay
                            key={widget.id}
                            widget={widget}
                            scale={scale}
                            onPrev={goPrev}
                            onNext={goNext}
                        />
                    ))}
                </div>
            ) : (
                // Fallback: nenhum layout salvo ainda — comportamento padrão antigo
                <div className="flex h-full w-full items-center justify-center p-4">
                    <div className="w-full max-w-[900px] overflow-hidden rounded-lg bg-white p-6 text-black shadow-2xl" style={containerStyle}>
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                overflow: "hidden",
                                isolation: "isolate",
                                zIndex: 0,
                            }}
                        >
                            {cards}
                        </div>
                    </div>
                </div>
            )}

            {/* Animação do botão inferior */}
            <AnimatePresence>
                {mostrarBotao && (
                    <motion.button
                        initial={{ opacity: 0, y: 30, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 30, x: "-50%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "50%",
                            zIndex: 2000,
                            padding: "10px 20px",
                            background: "rgb(255, 254, 254)",
                            color: "black",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                        className="botaoLow"
                        onClick={(e) => {
                            e.stopPropagation() // Não fecha o botão ao clicar nele
                            setAberto(true)      // Abre o modal de confirmação
                        }}
                    >
                        Sair da Visualização
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Modal montado separadamente do botão */}
            <ModalSair isOpen={aberto} onClose={() => setAberto(false)} />
        </div>
    )
}