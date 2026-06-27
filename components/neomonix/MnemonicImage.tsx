'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface MnemonicImageProps {
  src?: string;
  alt: string;
}

export default function MnemonicImage({ src, alt }: MnemonicImageProps) {
  if (!src) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-full flex flex-col items-center justify-center gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
          borderRadius: '8px',
        }}
      >
        <Brain size={48} style={{ color: 'var(--primary-glow)', opacity: 0.5 }} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          no image yet
        </span>
      </motion.div>
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '8px',
        display: 'block',
      }}
    />
  );
}
