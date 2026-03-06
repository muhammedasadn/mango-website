"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, Truck, RotateCcw, Zap } from "lucide-react";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductBottleScroll from "@/components/ProductBottleScroll";
import ProductTextOverlays from "@/components/ProductTextOverlays";

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: "easeIn" as const } },
};

const slideUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const product = products[currentIndex];

  // Scroll reset on flavor change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [currentIndex]);

  // Update CSS variable for background gradient
  useEffect(() => {
    document.documentElement.style.setProperty("--product-gradient", product.gradient);
    document.body.style.background = product.gradient;
    document.body.style.backgroundAttachment = "fixed";
  }, [product]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Fixed Navigation Arrows */}
      <button
        onClick={goPrev}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer group"
        aria-label="Previous flavor"
      >
        <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={goNext}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer group"
        aria-label="Next flavor"
      >
        <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Fixed Bottom Pill Menu */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setCurrentIndex(i)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${i === currentIndex
              ? "text-white shadow-lg"
              : "text-white/50 hover:text-white/80"
              }`}
            style={i === currentIndex ? { background: p.gradient } : {}}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* ===== HOMEPAGE HERO ===== */}
          <section className="relative w-full h-screen overflow-hidden">
            <ProductBottleScroll product={product} />
            <ProductTextOverlays product={product} />
          </section>

          {/* ===== STATS BAR ===== */}
          <motion.section
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="py-16 px-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-12 md:gap-20">
                {product.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                      {stat.val}
                    </div>
                    <div className="text-sm text-white/60 uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ===== DETAILS SECTION ===== */}
          <motion.section
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="py-24 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">
                    Deep Dive
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {product.detailsSection.title}
                  </h2>
                  <p className="text-white/70 text-lg leading-relaxed">
                    {product.detailsSection.description}
                  </p>
                </div>
                <div className="relative">
                  <div
                    className="aspect-square rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: `${product.gradient}` }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <motion.div
                        className="text-center p-8"
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                      >
                        <div className="text-8xl mb-4 drop-shadow-2xl">
                          {product.id === "mango" ? "🥭" : "🍎"}
                        </div>
                        <p className="text-white/80 font-light text-sm">
                          {product.detailsSection.imageAlt}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                  {/* Decorative glow */}
                  <div
                    className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl -z-10"
                    style={{ background: product.gradient }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ===== FRESHNESS SECTION ===== */}
          <motion.section
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="py-24 px-6"
          >
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">
                Our Process
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                {product.freshnessSection.title}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
                {product.freshnessSection.description}
              </p>
              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                {product.features.map((f) => (
                  <span
                    key={f}
                    className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ===== BUY NOW SECTION ===== */}
          <motion.section
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="py-24 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <div className="rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left: Pricing */}
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">
                      Get Yours
                    </span>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-2">
                      {product.buyNowSection.price}
                    </h2>
                    <p className="text-white/50 text-sm mb-8">
                      {product.buyNowSection.unit}
                    </p>

                    {/* Processing tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {product.buyNowSection.processingParams.map((param) => (
                        <span
                          key={param}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs"
                        >
                          <Zap className="w-3 h-3" style={{ color: product.themeColor }} />
                          {param}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 cursor-pointer"
                      style={{ background: product.gradient }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </motion.button>
                  </div>

                  {/* Right: Promises */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ background: `${product.themeColor}20` }}
                      >
                        <Truck className="w-5 h-5" style={{ color: product.themeColor }} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          Delivery Promise
                        </h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                          {product.buyNowSection.deliveryPromise}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ background: `${product.themeColor}20` }}
                      >
                        <RotateCcw className="w-5 h-5" style={{ color: product.themeColor }} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          Return Policy
                        </h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                          {product.buyNowSection.returnPolicy}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ===== NEXT FLAVOR CTA ===== */}
          <motion.section
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="py-24 px-6"
          >
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-white/40 text-sm uppercase tracking-widest mb-4">
                Continue the journey
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Try{" "}
                <span
                  style={{
                    background: products[(currentIndex + 1) % products.length].gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {products[(currentIndex + 1) % products.length].name}
                </span>{" "}
                next
              </h2>
              <motion.button
                whileHover={{ scale: 1.05, skewX: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={goNext}
                className="px-10 py-4 rounded-xl text-white font-bold text-lg cursor-pointer relative overflow-hidden group"
                style={{ background: products[(currentIndex + 1) % products.length].gradient }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore {products[(currentIndex + 1) % products.length].name}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>
          </motion.section>

          {/* Footer */}
          <Footer />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
