"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductTextOverlaysProps {
    product: Product;
}

interface TextSectionProps {
    title: string;
    subtitle: string;
    progress: import("framer-motion").MotionValue<number>;
    fadeIn: [number, number];
    fadeOut: [number, number];
}

function TextSection({ title, subtitle, progress, fadeIn, fadeOut }: TextSectionProps) {
    const opacity = useTransform(
        progress,
        [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        progress,
        [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
        [60, 0, 0, -60]
    );

    const scale = useTransform(
        progress,
        [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
        [0.9, 1, 1, 0.9]
    );

    return (
        <motion.div
            style={{ opacity, y, scale }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight drop-shadow-2xl">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg md:text-2xl text-white/80 mt-4 max-w-xl font-light drop-shadow-lg">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}

export default function ProductTextOverlays({ product }: ProductTextOverlaysProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const sections = [
        { data: product.section1, fadeIn: [0.0, 0.05] as [number, number], fadeOut: [0.15, 0.22] as [number, number] },
        { data: product.section2, fadeIn: [0.22, 0.28] as [number, number], fadeOut: [0.38, 0.45] as [number, number] },
        { data: product.section3, fadeIn: [0.45, 0.52] as [number, number], fadeOut: [0.62, 0.68] as [number, number] },
        { data: product.section4, fadeIn: [0.70, 0.76] as [number, number], fadeOut: [0.88, 0.95] as [number, number] },
    ];

    return (
        <div ref={containerRef} className="absolute inset-0 h-[500vh] pointer-events-none">
            <div className="sticky top-0 h-screen w-full">
                {sections.map((sec, i) => (
                    <TextSection
                        key={i}
                        title={sec.data.title}
                        subtitle={sec.data.subtitle}
                        progress={scrollYProgress}
                        fadeIn={sec.fadeIn}
                        fadeOut={sec.fadeOut}
                    />
                ))}
            </div>
        </div>
    );
}
