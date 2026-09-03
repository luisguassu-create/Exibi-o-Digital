"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function QuebraExpectativa() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            titleRef.current,
            {
                opacity: 0,
                y: 60,
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
            }
        );

        tl.fromTo(
            textRef.current,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            },
            "-=0.5"
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef}>
            <h1
                ref={titleRef}
                style={{
                    fontSize: "25px",
                    fontWeight: "700",
                }}
            >
                SENAI MATÃO-SP
            </h1>

            <p
                ref={textRef}
                style={{
                    width: "500px",
                    lineHeight: "1.5",
                }}
            >
                O SENAI Matão oferece cursos e formação profissional, preparando
                alunos para o mercado de trabalho e contribuindo para o desenvolvimento
                da indústria e da região.
            </p>
        </div>
    );
}