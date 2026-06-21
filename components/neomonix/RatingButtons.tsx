'use client';

import type { ReviewQuality } from '@/lib/srs/sm2';

interface RatingButtonsProps {
  onRate: (quality: ReviewQuality) => void;
}

const ratings: { quality: ReviewQuality; label: string; sub: string; cls: string }[] = [
  { quality: 0, label: 'Again', sub: 'Forgot it', cls: 'btn-again' },
  { quality: 2, label: 'Hard', sub: 'Tough recall', cls: 'btn-hard' },
  { quality: 3, label: 'Good', sub: 'Got it', cls: 'btn-good' },
  { quality: 5, label: 'Easy', sub: 'Perfect!', cls: 'btn-easy' },
];

export default function RatingButtons({ onRate }: RatingButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {ratings.map(({ quality, label, sub, cls }) => (
        <button
          key={quality}
          onClick={() => onRate(quality)}
          className={`${cls} flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95`}
        >
          <span>{label}</span>
          <span className="text-xs font-normal opacity-70">{sub}</span>
        </button>
      ))}
    </div>
  );
}
