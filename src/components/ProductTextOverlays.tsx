"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductTextOverlaysProps {
    product: Product;
}

interface TextSectionProps {
    title: string;
    subtitle: string;
    isActive: boolean;
}

function TextSection({ title, subtitle, isActive }: TextSectionProps) {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, y: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-20"
                >
                    <motion.h2
                        className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-tight drop-shadow-2xl uppercase tracking-tight"
                        style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                    >
                        {title}
                    </motion.h2>
                    {subtitle && (
                        <motion.p
                            className="text-xl md:text-3xl text-white mt-6 max-w-2xl font-medium drop-shadow-xl tracking-wide"
                            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function ProductTextOverlays({ product }: ProductTextOverlaysProps) {
    const [currentSection, setCurrentSection] = useState(0);

    const sections = [
        product.section1,
        product.section2,
        product.section3,
        product.section4,
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSection((prev) => (prev + 1) % sections.length);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval);
    }, [sections.length]);

    return (
        <div className="absolute inset-0 h-screen pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Added a subtle vignette to make text pop more universally */}
            <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-black/10 to-black/60 z-10" />

            {sections.map((sec, i) => (
                <TextSection
                    key={i}
                    title={sec.title}
                    subtitle={sec.subtitle}
                    isActive={i === currentSection}
                />
            ))}
        </div>
    );
}
