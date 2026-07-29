'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    images = ['/placeholder.svg'];
  }

  const goTo = (index: number) => setCurrentIndex(index);
  const prev = () => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const next = () => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${name} - Image ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-110"
              onClick={() => setLightboxOpen(true)}
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
          >
            <Expand className="h-4 w-4" />
          </button>

          <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm shadow-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-foreground ring-1 ring-foreground shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${name} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${name} - Image ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
