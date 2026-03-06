"use client";

import { motion } from "framer-motion";

const footerLinks = {
    Shop: ["All Juices", "Cream Mango", "Ruby Pomegranate"],
    Support: ["FAQs", "Shipping Info", "Returns", "Contact Us"],
    Company: ["About Us", "Blog", "Careers", "Press"],
};

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-400 pt-20 pb-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient
                                        id="footerIconGrad"
                                        x1="0"
                                        y1="0"
                                        x2="36"
                                        y2="36"
                                    >
                                        <stop offset="0%" stopColor="#FFB74D" />
                                        <stop offset="100%" stopColor="#FF6B6B" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M18 2C10 2 6 8 8 16C10 24 16 28 18 34C20 28 26 24 28 16C30 8 26 2 18 2Z"
                                    fill="url(#footerIconGrad)"
                                />
                            </svg>
                            <span
                                className="text-lg font-bold"
                                style={{
                                    background: "linear-gradient(135deg, #FFB74D, #FF6B6B)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Fresh Essence
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-500">
                            Premium cold-pressed juices crafted for the modern health
                            enthusiast. No compromises, just pure goodness.
                        </p>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                                {title}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="border-t border-white/5 pt-10 pb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-white font-semibold text-sm mb-1">
                                Stay Fresh
                            </h3>
                            <p className="text-sm text-gray-500">
                                Subscribe for new flavors and exclusive drops.
                            </p>
                        </div>
                        <motion.div
                            className="flex gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 w-64"
                            />
                            <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                Subscribe
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">
                        © 2026 Fresh Essence. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {["Privacy", "Terms", "Cookies"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-xs text-gray-600 hover:text-white transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
