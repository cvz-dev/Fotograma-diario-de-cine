// ─────────────────────────────────────────────────────────────────────────
//  Iconos en línea (estilo Lucide). La estrella soporta relleno fraccional
//  para medias estrellas (0.5) mediante un clip horizontal por porcentaje.
// ─────────────────────────────────────────────────────────────────────────

let __starUid = 0;

// fill: 0..1  (0 = vacía, 0.5 = media, 1 = llena)
function Star({ fill = 0, size = 18, className = "" }) {
  const uid = React.useMemo(() => `star-clip-${__starUid++}`, []);
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  const path =
    "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.98 6.12 21.17l1.12-6.55L2.48 9.98l6.58-.96L12 2.5z";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ display: "block", flex: "none" }}
    >
      <defs>
        <clipPath id={uid}>
          <rect x="0" y="0" width={`${pct}%`} height="100%" />
        </clipPath>
      </defs>
      {/* contorno / vacío */}
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.4"
        strokeLinejoin="round" opacity="0.35" />
      {/* relleno recortado */}
      <g clipPath={`url(#${uid})`}>
        <path d={path} fill="currentColor" stroke="currentColor"
          strokeWidth="1.4" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Heart({ filled = false, size = 18, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill={filled ? "currentColor" : "none"} stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block" }}>
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z" />
    </svg>
  );
}

function Search({ size = 18, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" style={{ display: "block" }}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function ArrowLeft({ size = 18, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function Clock({ size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      strokeLinejoin="round" style={{ display: "block" }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function Calendar({ size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      strokeLinejoin="round" style={{ display: "block" }}>
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

function Megaphone({ size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M15 8a4 4 0 0 1 0 8M18 5a8 8 0 0 1 0 14" />
    </svg>
  );
}

function PenTool({ size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      strokeLinejoin="round" style={{ display: "block" }}>
      <path d="m12 19 7-7 3 3-7 7-3-3z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="m2 2 7.6 7.6" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function Film({ size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      strokeLinejoin="round" style={{ display: "block" }}>
      <rect x="2.5" y="3.5" width="19" height="17" rx="2.5" />
      <path d="M7 3.5v17M17 3.5v17M2.5 9h4.5M17 9h4.5M2.5 15h4.5M17 15h4.5" />
    </svg>
  );
}

Object.assign(window, {
  Star, Heart, Search, ArrowLeft, Clock, Calendar, Megaphone, PenTool, Film,
});
