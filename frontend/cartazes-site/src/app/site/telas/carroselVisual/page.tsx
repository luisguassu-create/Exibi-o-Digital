        "use client"

        // Coverflow Carousel — Originkit
        // Conectado à Tela de Modificação: lê o layout salvo e aplica na tela de visualização.
        // O fundo da tela agora muda dinamicamente conforme o folder ativo no carrossel,
        // usando folderBackgrounds salvo pela TelaModificacao (não pinta o card/imagem).

        import * as React from "react"
        import { useCallback, useEffect, useMemo, useRef, useState } from "react"
        import { createPortal } from "react-dom"
        import {
            motion,
            AnimatePresence,
            useMotionValue,
            useReducedMotion,
            useTransform,
            type MotionValue,
        } from "framer-motion"

        import folder1 from "@/app/imagens/folders/Folder 1.jpg" 
        import folder2 from "@/app/imagens/folders/Folder 2.jpg" 
        import folder3 from "@/app/imagens/folders/Folder 3.jpg" 
        import folder4 from "@/app/imagens/folders/Folder 4.jpg" 
        import folder5 from "@/app/imagens/folders/Folder 5.jpg" 
        import folder6 from "@/app/imagens/folders/Folder 6.jpg" 

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
        // Contrato com a Tela de Modificação
        // -----------------------------------------------------------------------------

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

        export type SavedLayout = {
            corFundo?: string
            // Cor de fundo da visualização associada a cada folder (chave = "1".."6")
            // Definida na Tela de Modificação. Não pinta a imagem do folder.
            folderBackgrounds?: Record<string, string>
            elSize: { width: number; height: number }
            carrossel: { x: number; y: number; width: number; height: number }
            widgets: SavedWidget[]
        }

     const getBackgroundStyle = (cor?: string): React.CSSProperties => {
    if (!cor) {
        return {
            backgroundColor: "#ffffff",
            backgroundImage: "none",
        }
    }

    const isGradient = cor.includes("gradient")

    return {
        backgroundColor: isGradient ? "#ffffff" : cor,
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
            layout?: SavedLayout | null
        }

        // -----------------------------------------------------------------------------
        // Constants
        // -----------------------------------------------------------------------------
        const FoldersLista = [
            folder1,
            folder2,
            folder3,
            folder4,
            folder5,
            folder6,
        ]

        const DEFAULT_IMAGES: CoverflowImage[] = FoldersLista.map((imgObj, i) => ({
            src: imgObj,
            alt: `Folder ${i + 1}`,
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
        // Card Component (sem tint — a cor nunca pinta a imagem do folder)
        // -----------------------------------------------------------------------------

        function Card({
            item,
            index,
            pos,
            count,
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
                return radius
            })

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
        // Widgets
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
            return (
                <>
                    <span style={{ color: labelColor, fontSize: 13, fontWeight: 500 }}>Temperatura</span>
                    <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>--°C</span>
                </>
            )
        }

        function ArrowOverlayButtons({
            y,
            onPrev,
            onNext,
        }: {
            y: number
            onPrev: () => void
            onNext: () => void
        }) {
            const btnStyle: React.CSSProperties = {
                position: "absolute",
                top: y,
                transform: "translateY(-50%)",
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
                zIndex: 900,
                pointerEvents: "auto",
                boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            }

            return (
                <>
                    <button
                        style={{ ...btnStyle, left: 16 }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onPrev()
                        }}
                    >
                        ‹
                    </button>
                    <button
                        style={{ ...btnStyle, right: 16 }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onNext()
                        }}
                    >
                        ›
                    </button>
                </>
            )
        }

        function WidgetOverlay({
            widget,
            scale,
        }: {
            widget: SavedWidget
            scale: number
        }) {
            const isClock = widget.type === "clock"
            const isWeather = widget.type === "weather"

            const fontScale = Math.min(1.4, Math.max(0.6, scale))

            const cardStyle: React.CSSProperties = {
                position: "absolute",
                left: widget.x * scale,
                top: widget.y * scale,
                width: widget.width * scale,
                height: widget.height * scale,
                zIndex: 900,
                pointerEvents: "none",
                borderRadius: 14 * fontScale,
                background: "rgba(255,255,255,0.07)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                backdropFilter: "blur(6px)",
                padding: `${10 * fontScale}px ${16 * fontScale}px`,
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
            radius: 12,
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
            const [mounted, setMounted] = useState(false)
            const router = useRouter()

            useEffect(() => {
                setMounted(true)
            }, [])

            const savedLayout = useSavedLayout(props.layout)

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

            const scale = useMemo(() => {
                if (!elSize || !elSize.width || !elSize.height || !stageSize.width || !stageSize.height) {
                    return 1
                }
                return Math.min(stageSize.width / elSize.width, stageSize.height / elSize.height)
            }, [elSize, stageSize])

            const delimiterWidth = elSize ? elSize.width * scale : stageSize.width
            const delimiterHeight = elSize ? elSize.height * scale : stageSize.height

            function clicouTela() {
                if (aberto) return
                setMostrarBotao((prev) => !prev)
            }

            const mergedProps = { ...COMPONENT_DEFAULTS, ...props }
            const {
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

            const images = DEFAULT_IMAGES; 

            const count = Math.max(1, images.length)

            const hasLayout = !!savedLayout && !!elSize
            const carrossel = savedLayout?.carrossel

            const sizing: Sizing = useMemo(
                () => ({
                    restWidth: hasLayout ? carrossel!.width * scale * 0.7 : restWidth * scale,
                    restHeight: hasLayout ? carrossel!.height * scale * 0.7 : restHeight * scale,
                    activeWidth: hasLayout ? carrossel!.width * scale : activeWidth * scale,
                    activeHeight: hasLayout ? carrossel!.height * scale : activeHeight * scale,
                }),
                [restWidth, restHeight, activeWidth, activeHeight, hasLayout, carrossel, scale]
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

            // -------------------------------------------------------------------------
            // Rastreia qual folder está ativo/centralizado no carrossel, pra saber qual
            // folderBackground aplicar no fundo da tela em tempo real.
            // -------------------------------------------------------------------------
            const [activeFolderIndex, setActiveFolderIndex] = useState(0)

            useEffect(() => {
                const unsubscribe = pos.on("change", (v: number) => {
                    const idx = ((Math.round(v) % count) + count) % count
                    setActiveFolderIndex((prev) => (prev === idx ? prev : idx))
                })
                return () => unsubscribe()
            }, [pos, count])

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

            const containerStyle: React.CSSProperties = hasLayout
                ? {
                    ...style,
                    position: "absolute",
                    left: carrossel!.x * scale,
                    top: carrossel!.y * scale,
                    width: carrossel!.width * scale,
                    height: carrossel!.height * scale,
                    background: "transparent",
                    overflow: "hidden",
                    userSelect: "none",
                    touchAction: isStatic ? undefined : "pan-y",
                    outline: "none",
                    borderRadius: radius,
                }
                : {
                    ...style,
                    position: "relative",
                    background: "transparent",
                    width: "100%",
                    height: "100%",
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

            // -------------------------------------------------------------------------
            // Fundo dinâmico: usa a cor definida para o folder ativo (folderBackgrounds),
            // caindo para corFundo padrão quando o folder ativo não tem cor própria.
            // -------------------------------------------------------------------------
            const activeFolderId = String(activeFolderIndex + 1)
            const dynamicBackground =
                savedLayout?.folderBackgrounds?.[activeFolderId] ?? savedLayout?.corFundo

            const stageBackgroundStyle = getBackgroundStyle(dynamicBackground)

            return (
              <div
    ref={stageRef}
    className="fixed inset-0 z-[9999] overflow-hidden"
 style={
    hasLayout
        ? {
            ...stageBackgroundStyle,
            transition: "none",
        }
        : {
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
        }
}
    onClick={clicouTela}
>   
                    {hasLayout ? (
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
                            <div style={containerStyle}>
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

                            {savedLayout!.widgets.map((widget) =>
                                widget.type === "arrows" ? (
                                    <ArrowOverlayButtons
                                        key={widget.id}
                                        y={widget.y * scale}
                                        onPrev={goPrev}
                                        onNext={goNext}
                                    />
                                ) : (
                                    <WidgetOverlay
                                        key={widget.id}
                                        widget={widget}
                                        scale={scale}
                                    />
                                )
                            )}
                        </div>
                    ) : (
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

                    <AnimatePresence>
                        {mostrarBotao && (
                            <motion.button
                                initial={{ opacity: 0, y: 30, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 30, x: "-50%" }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{
                                    position: "fixed",
                                    bottom: "20px",
                                    left: "50%",
                                    zIndex: 10000,
                                    padding: "10px 20px",
                                    background: "rgb(255, 254, 254)",
                                    color: "black",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                                className="botaoLow"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setAberto(true)
                                }}
                            >
                                Sair da Visualização
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {mounted && createPortal(
                        <ModalSair isOpen={aberto} onClose={() => setAberto(false)} />,
                        document.body
                    )}
                </div>
            )
        }