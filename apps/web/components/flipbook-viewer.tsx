'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.mjs';

export function FlipbookViewer({ pdfUrl }: { pdfUrl: string }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [img, setImg] = useState<string>('');
  const startX = useRef(0);

  useEffect(() => {
    getDocument(pdfUrl).promise.then(setDoc).catch(() => setDoc(null));
  }, [pdfUrl]);

  useEffect(() => {
    if (!doc) {
      return;
    }
    doc.getPage(page).then(async (p) => {
      const viewport = p.getViewport({ scale: 1.2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await p.render({ canvasContext: context, viewport }).promise;
      setImg(canvas.toDataURL('image/jpeg', 0.9));
    });
  }, [doc, page]);

  const atFirstPage = page <= 1;
  const atLastPage = Boolean(doc && page >= doc.numPages);

  const next = () => {
    if (!atLastPage && doc) {
      setPage((p) => Math.min(doc.numPages, p + 1));
    }
  };

  const prev = () => {
    if (!atFirstPage) {
      setPage((p) => Math.max(1, p - 1));
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="overflow-hidden rounded border border-black/15 bg-black/5"
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - startX.current;
          if (delta < -50) next();
          if (delta > 50) prev();
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={page}
            src={img}
            alt={`Magazine page ${page}`}
            className="mx-auto h-auto w-full max-w-3xl"
            initial={{ rotateY: -12, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={prev}
          disabled={atFirstPage}
          aria-disabled={atFirstPage}
        >
          Previous
        </button>
        <span>Page {page}{doc ? ` / ${doc.numPages}` : ''}</span>
        <button
          className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={next}
          disabled={atLastPage}
          aria-disabled={atLastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
