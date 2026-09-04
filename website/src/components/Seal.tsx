/** Hanko-style square seal monogram — the shared mark for raffaelesollecito.org and the résumé. */
export function Seal({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      role="img"
    >
      <rect x="3" y="3" width="58" height="58" rx="6" fill="#c5311d" />
      <rect x="7.5" y="7.5" width="49" height="49" rx="3" fill="none" stroke="#f7f5f0" strokeWidth="1.6" opacity="0.85" />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fontFamily="var(--font-display), 'Source Serif 4', Georgia, serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="-1"
        fill="#f7f5f0"
      >
        RS
      </text>
    </svg>
  );
}
