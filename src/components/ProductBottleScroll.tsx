"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductBottleScrollProps {
    product: Product;
}

const TOTAL_FRAMES = 120;

export default function ProductBottleScroll({ product }: ProductBottleScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Preload images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loaded = 0;

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `${product.folderPath}/${i}.webp`;
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

            // "Contain" fit
            const imgAspect = img.naturalWidth / img.naturalHeight;
            const canvasAspect = rect.width / rect.height;

            let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

            if (imgAspect > canvasAspect) {
                drawWidth = rect.width;
                drawHeight = rect.width / imgAspect;
                offsetX = 0;
                offsetY = (rect.height - drawHeight) / 2;
            } else {
                drawHeight = rect.height;
                drawWidth = rect.height * imgAspect;
                offsetX = (rect.width - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        },
        [images]
    );

    // React to scroll
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const frame = Math.min(Math.max(Math.round(latest), 0), TOTAL_FRAMES - 1);
        if (frame !== currentFrameRef.current) {
            currentFrameRef.current = frame;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => drawFrame(frame));
        }
    });

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
        <div ref={containerRef} className="h-[500vh] relative">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Loading indicator */}
                {loadProgress < 100 && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300"
                                style={{ width: `${loadProgress}%` }}
                            />
                        </div>
                        <p className="text-white/60 text-sm mt-3 font-light">
                            Loading experience... {loadProgress}%
                        </p>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ display: "block" }}
                />
            </div>
        </div>
    );
}
