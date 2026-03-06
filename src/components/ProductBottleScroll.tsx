"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductBottleScrollProps {
    product: Product;
}


export default function ProductBottleScroll({ product }: ProductBottleScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const currentFrameRef = useRef(0);
    const TOTAL_FRAMES = product.frameCount || 120;
    const PLAYBACK_SPEED = 30; // ms per frame

    // Preload images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loaded = 0;

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            if (product.id === "mango") {
                img.src = `${product.folderPath}/${i}.webp`;
            } else if (product.id === "pomegranate") {
                const padded = i.toString().padStart(3, "0");
                img.src = `${product.folderPath}/ezgif-frame-${padded}.jpg`;
            } else {
                img.src = `${product.folderPath}/${i}.webp`;
            }
            img.onload = () => {
                loaded++;
                setLoadedCount(loaded);
            };
            loadedImages.push(img);
        }

        setImages(loadedImages);

        return () => {
            loadedImages.forEach((img) => {
                img.onload = null;
            });
        };
    }, [product.folderPath]);

    // Draw frame to canvas
    const drawFrame = useCallback(
        (index: number) => {
            const canvas = canvasRef.current;
            if (!canvas || images.length === 0) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const img = images[Math.round(index)];
            if (!img || !img.complete) return;

            // Set canvas to image dimensions
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            ctx.clearRect(0, 0, rect.width, rect.height);

            // "Cover" fit
            const imgAspect = img.naturalWidth / img.naturalHeight;
            const canvasAspect = rect.width / rect.height;

            let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

            if (imgAspect > canvasAspect) {
                drawHeight = rect.height;
                drawWidth = rect.height * imgAspect;
                offsetX = (rect.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = rect.width;
                drawHeight = rect.width / imgAspect;
                offsetX = 0;
                offsetY = (rect.height - drawHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        },
        [images]
    );

    // Auto-play animation loop
    useEffect(() => {
        if (loadedCount < TOTAL_FRAMES * 0.5 || images.length === 0) return; // Start playing when 50% loaded

        let lastTime = 0;
        let animationFrameId: number;

        const loop = (timestamp: number) => {
            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;

            if (elapsed > PLAYBACK_SPEED) {
                currentFrameRef.current = (currentFrameRef.current + 1) % TOTAL_FRAMES;
                drawFrame(currentFrameRef.current);
                lastTime = timestamp;
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [loadedCount, images, drawFrame, TOTAL_FRAMES]);

    // Draw first frame when loaded
    useEffect(() => {
        if (loadedCount >= 1 && images.length > 0) {
            drawFrame(0);
        }
    }, [loadedCount, images, drawFrame]);

    // Resize handler
    useEffect(() => {
        const handleResize = () => drawFrame(currentFrameRef.current);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [drawFrame]);

    const loadProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

    return (
        <div ref={containerRef} className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Loading indicator */}
            <AnimatePresence>
                {loadProgress < 50 && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md"
                    >
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300"
                                style={{ width: `${loadProgress * 2}%` }}
                            />
                        </div>
                        <p className="text-white/60 text-sm mt-3 font-light tracking-widest uppercase">
                            Loading... {Math.min(loadProgress * 2, 100)}%
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ambient Background Glow matching product */}
            <motion.div
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    background: `radial-gradient(circle at center, ${product.themeColor} 0%, transparent 70%)`
                }}
            />

            <motion.canvas
                ref={canvasRef}
                initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="w-full h-full relative z-10"
                style={{ display: "block", objectFit: "cover" }}
            />
        </div>
    );
}
