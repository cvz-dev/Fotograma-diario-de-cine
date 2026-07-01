// ─────────────────────────────────────────────────────────────────────────
//  Componentes compartidos — StarRating, Poster, PosterCard, ProfileHeader
// ─────────────────────────────────────────────────────────────────────────

// Fila de 5 estrellas con soporte de medias estrellas.
function StarRating({ value = 0, size = 18, gap = 2, showNumber = false, className = "" }) {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    const fill = Math.max(0, Math.min(1, value - (i - 1)));
    return <Star key={i} fill={fill} size={size} />;
  });
  return (
    <div className={`flex items-center ${className}`} style={{ color: "var(--accent)" }}>
      <div className="flex" style={{ gap: `${gap}px` }}>{stars}</div>
      {showNumber && (
        <span className="ml-2 font-mono text-[11px] tracking-[0.18em]"
          style={{ color: "var(--text-dim)" }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Póster: muestra la imagen real si existe, si no el diseño tipográfico.
function Poster({ film, hideYear = false, className = "", style = {} }) {
  if (film.poster) {
    return (
      <div className={`relative w-full overflow-hidden select-none ${className}`}
        style={{ aspectRatio: "2 / 3", background: "var(--poster-dark)", ...style }}>
        <img src={film.poster} alt={film.film}
          className="absolute inset-0 w-full h-full object-cover"
          style={film.posterZoom ? { transform: `scale(${film.posterZoom})`, transformOrigin: film.posterOrigin || "center center" } : undefined} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 50%)" }} />
      </div>
    );
  }

  const v = film.variant;
  const base =
    v === "light"
      ? { bg: "var(--poster-light)", ink: "#16191d", dim: "rgba(22,25,29,.55)" }
      : v === "accent"
      ? { bg: "var(--poster-accent)", ink: "#eaf1fb", dim: "rgba(234,241,251,.62)" }
      : { bg: "var(--poster-dark)", ink: "#e9ecf1", dim: "rgba(233,236,241,.55)" };

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ aspectRatio: "2 / 3", background: base.bg, ...style }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,.06), transparent 55%), radial-gradient(130% 100% at 50% 120%, rgba(0,0,0,.45), transparent 60%)",
      }} />
      <div className="absolute -right-3 -bottom-7 font-display font-semibold leading-none pointer-events-none"
        style={{ fontSize: "clamp(90px, 24vw, 190px)", color: base.ink, opacity: 0.07 }}>
        {film.posterNo}
      </div>
      <div className="relative h-full flex flex-col p-[8%]">
        <div className="flex items-center justify-end font-mono uppercase"
          style={{ color: base.dim, fontSize: "clamp(8px,1.6vw,11px)", letterSpacing: ".18em" }}>
          {!hideYear && <span>{film.year}</span>}
        </div>
        <div className="mt-auto">
          <h3 className="font-display font-semibold uppercase leading-[0.92] tracking-[0.005em]"
            style={{ color: base.ink, fontSize: "clamp(20px, 5.6vw, 34px)", textWrap: "balance" }}>
            {film.film}
          </h3>
          <p className="mt-2 font-mono uppercase"
            style={{ color: base.dim, fontSize: "clamp(8px,1.7vw,11px)", letterSpacing: ".18em" }}>
            Dir. {film.director}
          </p>
        </div>
      </div>
    </div>
  );
}

// Tarjeta del grid (póster + título de tarea + estrellas + corazón).
function PosterCard({ film, onOpen, onToggleLike }) {
  return (
    <button
      onClick={() => onOpen(film)}
      className="group text-left focus:outline-none"
    >
      <div className="relative rounded-[5px] overflow-hidden ring-1 transition-all duration-300
                      group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
        style={{
          boxShadow: "0 1px 0 rgba(255,255,255,.04) inset, 0 18px 36px -22px rgba(0,0,0,.9)",
          "--tw-ring-color": "rgba(255,255,255,.08)",
        }}>
        <Poster film={film} hideYear />
        {/* halo naranja al hover (inset para que no lo recorte el overflow) */}
        <div className="absolute inset-0 rounded-[5px] ring-2 ring-inset ring-transparent transition-all duration-300
                        group-hover:ring-[var(--accent)] group-focus-visible:ring-[var(--accent)]
                        opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-events-none" />
        <span
          onClick={(e) => { e.stopPropagation(); onToggleLike(film.id); }}
          role="button"
          tabIndex={-1}
          className="absolute top-2.5 right-2.5 grid place-items-center w-8 h-8 rounded-full backdrop-blur
                     transition-all duration-200 hover:scale-110 group-hover:!opacity-100"
          style={{
            background: "rgba(8,10,13,.18)",
            color: film.liked ? "var(--accent)" : "rgba(255,255,255,.55)",
            border: "1px solid rgba(255,255,255,.06)",
            opacity: film.liked ? 1 : 0,
          }}
        >
          <HeartBurst filled={film.liked} size={15} />
        </span>
      </div>

      <div className="mt-2.5 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <StarRating value={film.rating} size={14} />
          <span className="font-mono text-[10px] tracking-[0.18em] tabular-nums"
            style={{ color: "var(--text-faint)" }}>{film.watched}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <h4 className="text-[13.5px] leading-snug font-medium min-w-0"
            style={{ color: "var(--text)", textWrap: "balance", minHeight: "2.75em" }}>
            {film.film}
          </h4>
        </div>
      </div>
    </button>
  );
}

function HeartBurst({ filled, size = 16 }) {
  const [burst, setBurst] = React.useState(false);
  const prev = React.useRef(filled);

  React.useEffect(() => {
    if (filled && !prev.current) {
      setBurst(true);
      const id = setTimeout(() => setBurst(false), 460);
      return () => clearTimeout(id);
    }
    prev.current = filled;
  }, [filled]);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span className={burst ? 'heart-pop' : ''} style={{ display: 'inline-flex' }}>
        <Heart filled={filled} size={size} />
      </span>
      {burst && [0, 45, 90, 135, 180, 225, 270, 315].map(r => (
        <span key={r} className="burst-line-anim" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '1.5px', height: '4px',
          marginLeft: '-0.75px', marginTop: '-2px',
          background: 'var(--accent)', borderRadius: '1px',
          '--r': `${r}deg`,
        }} />
      ))}
    </span>
  );
}

Object.assign(window, { StarRating, Poster, PosterCard, HeartBurst });
