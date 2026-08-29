"use client"

// Coverflow Carousel — Originkit
// Using component defaults.

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type MotionValue,
} from "framer-motion"

const RenderTarget = {
    current: () => "preview",
    canvas: "canvas",
    export: "export",
    thumbnail: "thumbnail",
    preview: "preview",
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

// Alterado para 0 para ocultar visualmente qualquer imagem nas laterais
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

    // Ajuste de Opacidade: Somente a imagem no centro (rel zero ou transicionando para ele) fica visível
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
// ArrowButton Component
// -----------------------------------------------------------------------------

function ArrowButton({
    side,
    onClick,
    color,
    background,
    size,
    position,
}: {
    side: "left" | "right"
    onClick: () => void
    color: string
    background: string
    size: number
    position: number
}) {
    const isLeft = side === "left"
    const p = Math.max(0, Math.min(100, position))
    const inset = `calc((50% - ${size}px) * ${(100 - p) / 100})`
    return (
        <button
            type="button"
            aria-label={isLeft ? "Previous" : "Next"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            style={{
                position: "absolute",
                top: "50%",
                [isLeft ? "left" : "right"]: inset,
                transform: "translateY(-50%)",
                width: size,
                height: size,
                borderRadius: "50%",
                border: "none",
                background,
                color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                zIndex: 2000,
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                WebkitTapHighlightColor: "transparent",
            }}
        >
            <svg
                width={size * 0.4}
                height={size * 0.4}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: "none" }}
            >
                {isLeft ? (
                    <polyline points="15 18 9 12 15 6" />
                ) : (
                    <polyline points="9 18 15 12 9 6" />
                )}
            </svg>
        </button>
    )
}

// -----------------------------------------------------------------------------
// Component Defaults
// -----------------------------------------------------------------------------

const COMPONENT_DEFAULTS = {
    images: DEFAULT_IMAGES,
    activeWidth: 600,
    activeHeight: 400,
    restWidth: 200,
    restHeight: 270,
    gap: 30,
    radius: 2,
    showArrows: true,
    arrowColor: "#000000",
    arrowBackground: "#FFFFFF",
    arrowSize: 56,
    arrowPosition: 95,
    autoplay: true, // Ativado por padrão para passar as imagens sozinho
    autoplayDirection: "rightToLeft" as const,
    transition: {
        type: "tween",
        duration: 0.5, // Duração do deslize de uma foto para outra
        delay: 2.5,   // Tempo em segundos que a imagem fica parada antes de trocar
        ease: "easeInOut",
    },
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function CoverflowCarousel(props: Props) {
    const mergedProps = { ...COMPONENT_DEFAULTS, ...props }
    const {
        images: rawImages,
        activeWidth,
        activeHeight,
        restWidth,
        restHeight,
        gap,
        radius,
        showArrows,
        arrowColor,
        arrowBackground,
        arrowSize,
        arrowPosition,
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

    const containerStyle: React.CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 320,
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

    const arrows = showArrows && count > 1 && (
        <>
            <ArrowButton
                side="left"
                onClick={isStatic ? () => {} : goPrev}
                color={arrowColor}
                background={arrowBackground}
                size={arrowSize}
                position={arrowPosition}
            />
            <ArrowButton
                side="right"
                onClick={isStatic ? () => {} : goNext}
                color={arrowColor}
                background={arrowBackground}
                size={arrowSize}
                position={arrowPosition}
            />
        </>
    )

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div
                className="w-full max-w-[900px] overflow-hidden rounded-lg bg-white p-6 text-black shadow-2xl"
                tabIndex={0}
                onMouseEnter={() => {
                    isHoveredRef.current = true
                }}
                onMouseLeave={() => {
                    isHoveredRef.current = false
                }}
                onFocus={() => {
                    isHoveredRef.current = true
                }}
                onBlur={() => {
                    isHoveredRef.current = false
                }}
                style={containerStyle}
            >
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
                {arrows}
            </div>
        </div>
    )
}