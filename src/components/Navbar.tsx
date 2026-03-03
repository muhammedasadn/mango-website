"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-black/40 backdrop-blur-xl border-b border-white/10"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    {/* Abstract Lightning/Banana SVG Icon */}
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="iconGrad" x1="0" y1="0" x2="36" y2="36">
                                <stop offset="0%" stopColor="#FFB74D" />
                                <stop offset="100%" stopColor="#FF6B6B" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M18 2C10 2 6 8 8 16C10 24 16 28 18 34C20 28 26 24 28 16C30 8 26 2 18 2Z"
                            fill="url(#iconGrad)"
                        />
                        <path
                            d="M15 12L20 18L15 24"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span
                        className="text-xl font-bold"
                        style={{
                            background: "linear-gradient(135deg, #FFB74D, #FF6B6B)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Nano Banana
                    </span>
                </div>

                {/* Order Now Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm overflow-hidden group cursor-pointer"
                >
                    <span className="relative z-10">Order Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
                </motion.button>
            </div>
        </motion.nav>
    );
}
