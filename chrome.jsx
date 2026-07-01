// ─────────────────────────────────────────────────────────────────────────
//  Chrome — encabezado de perfil, búsqueda y filtros (tabs)
// ─────────────────────────────────────────────────────────────────────────

// Monograma-carrete reutilizable (avatar de perfil).
// Si `initials` viene vacío, muestra un glifo neutro (perfil sin configurar).
function ReelMark({ size = 34, initials = "" }) {
  return (
    <span className="relative grid place-items-center flex-none rounded-full"
      style={{
        width: size, height: size,
        background: initials
          ? "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--accent) 26%, #11161c) 34%, transparent 36%), conic-gradient(from 0deg, #1b222b, #0d1116, #1b222b)"
          : "radial-gradient(circle at 50% 50%, #11161c 34%, transparent 36%), conic-gradient(from 0deg, #1b222b, #0d1116, #1b222b)",
        boxShadow: `0 0 0 1px rgba(255,255,255,.1), inset 0 0 0 ${Math.round(size * 0.11)}px #0c0f13`,
      }}>
      {initials ? (
        <span className="font-display font-semibold tracking-tight"
          style={{ color: "#eaf1fb", fontSize: size * 0.42 }}>{initials}</span>
      ) : (
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none" aria-hidden="true"
          style={{ color: "var(--text-faint)" }}>
          <circle cx="12" cy="8.5" r="3.4" stroke="currentColor" strokeWidth="1.7" />
          <path d="M5.5 19.2c1.1-3.4 4-5 6.5-5s5.4 1.6 6.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

// Calcula iniciales (1ª letra del nombre + 1ª letra del apellido).
function profileInitials(profile) {
  if (!profile || !profile.firstName) return "";
  const a = (profile.firstName || "").trim().charAt(0);
  const b = (profile.lastName || "").trim().charAt(0);
  return (a + b).toUpperCase();
}

// Marca de la app: un "fotograma" (cuadro de película con perforaciones).
function FotogramaMark({ size = 34 }) {
  const r = size * 0.22;          // radio del cuadro
  const p = size * 0.13;          // tamaño de perforación
  const holes = [0.5, 0.5];       // y-fracciones (una fila de perforaciones arriba/abajo)
  return (
    <span className="relative grid place-items-center flex-none"
      style={{
        width: size, height: size, borderRadius: r,
        background: "linear-gradient(160deg, #161c24, #0c0f13)",
        boxShadow: "0 0 0 1px rgba(255,255,255,.1), 0 6px 16px -8px rgba(0,0,0,.9)",
      }}>
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none" aria-hidden="true">
        {/* cuadro / apertura del fotograma */}
        <rect x="6.5" y="4" width="11" height="16" rx="1.6"
          stroke="var(--accent)" strokeWidth="1.7" />
        {/* perforaciones izquierda */}
        <rect x="2.4" y="5.5" width="2.4" height="3.2" rx="0.7" fill="var(--accent)" />
        <rect x="2.4" y="15.3" width="2.4" height="3.2" rx="0.7" fill="var(--accent)" />
        {/* perforaciones derecha */}
        <rect x="19.2" y="5.5" width="2.4" height="3.2" rx="0.7" fill="var(--accent)" />
        <rect x="19.2" y="15.3" width="2.4" height="3.2" rx="0.7" fill="var(--accent)" />
        {/* línea interior (separador de cuadro) */}
        <line x1="6.5" y1="12" x2="17.5" y2="12" stroke="var(--accent)" strokeWidth="1.1" opacity="0.5" />
      </svg>
    </span>
  );
}

// ── Barra superior global (vive sobre ambas vistas) ──────────────────────
function NavBar({ films, query, setQuery, onHome, onFavorites, onSearchFocus, view, profile, onOpenProfile }) {
  const liked = films.filter((f) => f.liked).length;
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setQuery]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{ background: "color-mix(in oklch, #0a0d11 88%, transparent)", borderColor: "var(--line)" }}>
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8 h-[58px] flex items-center gap-3 sm:gap-5">
        {/* marca */}
        <button onClick={onHome} className="flex items-center gap-2.5 flex-none group focus:outline-none">
          <img src="logo.svg" alt="Fotograma" style={{ height: 28, width: "auto" }} />
          <span className="hidden sm:flex flex-col leading-none text-left whitespace-nowrap">
            <span className="font-display font-semibold uppercase tracking-[0.10em] text-[17px] transition-colors"
              style={{ color: "var(--text)" }}>{PROFILE.app}</span>
            <span className="font-mono uppercase text-[10px] tracking-[0.22em] mt-0.5"
              style={{ color: "var(--accent)" }}>{PROFILE.appTagline}</span>
          </span>
        </button>

        {/* buscador (centro) */}
        <div className="relative flex items-center flex-1 max-w-[460px] mx-auto">
          <span className="absolute left-3.5 pointer-events-none" style={{ color: "var(--text-faint)" }}>
            <Search size={16} />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={onSearchFocus || onHome}
            placeholder="Buscar película, director o etiqueta…"
            className="w-full pl-10 pr-10 py-2.5 rounded-full text-[13.5px] outline-none transition-colors"
            style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--line)" }}
            onMouseEnter={(e) => !query && (e.currentTarget.style.borderColor = "color-mix(in oklch, var(--accent) 40%, var(--line))")}
            onMouseLeave={(e) => document.activeElement !== e.currentTarget && (e.currentTarget.style.borderColor = "var(--line)")}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          />
          {query ? (
            <button onClick={() => setQuery("")}
              className="absolute right-3 grid place-items-center w-5 h-5 rounded-full text-[13px] transition-colors"
              style={{ color: "var(--text-faint)", background: "var(--line)" }}
              aria-label="Limpiar búsqueda">×</button>
          ) : (
            <kbd className="absolute right-3 hidden sm:grid place-items-center w-5 h-5 rounded font-mono text-[11px] pointer-events-none"
              style={{ color: "var(--text-faint)", background: "var(--bg)", border: "1px solid var(--line)" }}>/</kbd>
          )}
        </div>

        {/* favoritas + perfil */}
        <div className="flex items-center gap-2 flex-none">
          <button onClick={onFavorites}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-full font-mono text-[11px] tabular-nums transition-colors focus:outline-none"
            style={{
              background: view === "favoritas" ? "color-mix(in oklch, var(--accent) 18%, transparent)" : "var(--surface)",
              color: "var(--accent)",
              border: `1px solid ${view === "favoritas" ? "var(--accent)" : "var(--line)"}`,
            }}
            onMouseEnter={(e) => { if (view !== "favoritas") e.currentTarget.style.borderColor = "color-mix(in oklch, var(--accent) 45%, var(--line))"; }}
            onMouseLeave={(e) => { if (view !== "favoritas") e.currentTarget.style.borderColor = "var(--line)"; }}
            title="Ver tus favoritas" aria-label={`Ver tus ${liked} favoritas`}>
            <Heart filled size={14} />{liked}
          </button>
          <button onClick={onOpenProfile}
            className="flex items-center gap-2 h-9 pl-1 pr-1 sm:pr-3 rounded-full transition-colors focus:outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "color-mix(in oklch, var(--accent) 45%, var(--line))")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
            title={profile?.firstName ? "Editar tu perfil" : "Configurar tu perfil"}
            aria-label="Mi perfil">
            <ReelMark size={28} initials={profileInitials(profile)} />
            {profile?.firstName ? (
              <span className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: "var(--text)" }}>
                  {profile.firstName} {(profile.lastName || "").trim().charAt(0).toUpperCase()}.
                </span>
                {profile.username ? (
                  <span className="font-mono text-[10px] tracking-[0.18em]" style={{ color: "var(--text-faint)" }}>
                    @{profile.username}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="hidden sm:block text-[12px] font-medium whitespace-nowrap pr-0.5"
                style={{ color: "var(--text)" }}>Mi perfil</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

// Tira de película con perforaciones (sprocket holes) — borde de la cabecera.
function FilmStrip() {
  const holes = Array.from({ length: 60 });
  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center gap-[10px]"
      style={{ height: 18, background: "#0a0d11", boxShadow: "inset 0 -1px 0 rgba(255,255,255,.04)" }}>
      {holes.map((_, i) => (
        <span key={i} className="flex-none rounded-[2px]"
          style={{ width: 13, height: 8, background: "var(--bg)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.5)" }} />
      ))}
    </div>
  );
}

// Parser de fechas en español ("12 Mar 2026" → timestamp) para ordenar novedades.
const __MONTHS_ES = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
function parseWatched(s) {
  const [d, mon, y] = String(s).toLowerCase().split(" ");
  return new Date(+y, __MONTHS_ES[(mon || "").slice(0, 3)] ?? 0, +d).getTime();
}

// ── Sección Destacadas & Novedades (cabecera tipo cartelera) ─────────────
function ProfileHeader({ films, onOpen, onToggleLike }) {
  // Más recientes primero
  const byRecent = React.useMemo(
    () => [...films].sort((a, b) => parseWatched(b.watched) - parseWatched(a.watched)),
    [films]
  );

  const scrollRef = React.useRef(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(true);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 210, behavior: 'smooth' });
  };
  // Destacada: fijada por FEATURED_ID, o si está vacío la mejor calificada.
  const featured = React.useMemo(
    () => (FEATURED_ID && films.find((f) => f.id === FEATURED_ID))
      || [...films].sort((a, b) => b.rating - a.rating || parseWatched(b.watched) - parseWatched(a.watched))[0],
    [films]
  );
  // Novedades: las más recientes (excluyendo la destacada)
  const novedades = byRecent.filter((f) => f.id !== featured.id).slice(0, 6);

  if (!featured) return null;

  // Primer enunciado de la reseña como gancho.
  const hook = (() => {
    const plain = featured.excerpt || "";
    return (plain.split(/(?<=\.)\s/)[0] || featured.synopsis).trim();
  })();

  return (
    <header className="relative overflow-hidden" style={{ background: "#0c0f13" }}>
      <FilmStrip />

      <div className="relative border-b" style={{ borderColor: "var(--line)" }}>
        {/* backdrop atmosférico tipo proyector */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:
            "radial-gradient(90% 140% at 90% -20%, color-mix(in oklch, var(--accent) 24%, transparent), transparent 55%), conic-gradient(from 30deg at 12% -10%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 40%), radial-gradient(60% 100% at 0% 0%, rgba(255,255,255,.05), transparent 60%)",
        }} />
        <div className="absolute inset-0 opacity-[0.5] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "var(--grain)" }} />

        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8 pt-7 pb-9">
          {/* ── Cabecera de sección ── */}
          <div className="flex items-center justify-between gap-4 mb-7">
            <span className="inline-flex items-stretch overflow-hidden"
              style={{ border: "1px solid var(--accent)", borderRadius: "4px" }}>
              <span className="grid place-items-center px-2.5"
                style={{ background: "var(--accent)" }}>
                <Star fill={1} size={11} style={{ color: "#1a0d00" }} />
              </span>
              <span className="font-mono uppercase tracking-[0.28em] px-3 py-1.5"
                style={{ fontSize: "10px", color: "var(--accent)", background: "color-mix(in oklch, var(--accent) 7%, transparent)" }}>
                Destacada
              </span>
            </span>
          </div>

          {/* ── Destacada de la temporada ── */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-x-10 gap-y-7 items-stretch">
            {/* Póster destacado (abre el detalle) */}
            <button onClick={() => onOpen?.(featured)}
              className="group relative block w-[200px] sm:w-[240px] mx-auto lg:mx-0 focus:outline-none">
              <div className="relative rounded-[6px] overflow-hidden ring-1 transition-transform duration-300 group-hover:-translate-y-1"
                style={{ "--tw-ring-color": "rgba(255,255,255,.1)", boxShadow: "0 26px 60px -30px rgba(0,0,0,.95)" }}>
                <Poster film={featured} hideYear />
                <div className="absolute inset-0 rounded-[6px] ring-2 ring-inset ring-transparent transition-all duration-300 group-hover:ring-[var(--accent)] pointer-events-none" />
              </div>
              <span
                onClick={(e) => { e.stopPropagation(); onToggleLike?.(featured.id); }}
                role="button" tabIndex={-1}
                className="absolute top-2.5 right-2.5 grid place-items-center w-8 h-8 rounded-full backdrop-blur transition-all duration-200 hover:scale-110 group-hover:!opacity-100"
                style={{
                  background: "rgba(8,10,13,.18)",
                  color: featured.liked ? "var(--accent)" : "rgba(255,255,255,.55)",
                  border: "1px solid rgba(255,255,255,.06)",
                  opacity: featured.liked ? 1 : 0,
                }}>
                <HeartBurst filled={featured.liked} size={15} />
              </span>
            </button>

            {/* Ficha de la destacada */}
            <div className="min-w-0 flex flex-col justify-center">
              <h1 onClick={() => onOpen?.(featured)}
                className="font-display font-semibold uppercase leading-[0.9] tracking-[0.01em] cursor-pointer transition-colors hover:text-[var(--accent)]"
                style={{ fontSize: "clamp(34px,5.6vw,58px)", color: "var(--text)", textWrap: "balance" }}>
                {featured.film}
              </h1>

              <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono uppercase text-[11px] tracking-[0.18em]"
                style={{ color: "var(--text-faint)" }}>
                <span style={{ color: "var(--text-dim)" }}>Dir. {featured.director}</span>
                <span style={{ color: "var(--line)" }}>—</span>
                <span>{featured.year}</span>
                <span style={{ color: "var(--line)" }}>—</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={12} />{featured.runtime}</span>
              </div>

              <div className="mt-3.5 flex items-center gap-2.5">
                <StarRating value={featured.rating} size={17} gap={2} />
                <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--text-dim)" }}>{featured.rating.toFixed(1)}</span>
              </div>

              <p className="mt-4 text-[14.5px] sm:text-[15px] max-w-2xl leading-relaxed"
                style={{ color: "var(--text-soft)", textWrap: "pretty" }}>
                {hook}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button onClick={() => onOpen?.(featured)}
                  className="inline-flex items-center justify-center h-10 px-5 rounded-full font-medium text-[13.5px] transition-transform hover:-translate-y-0.5 focus:outline-none"
                  style={{ background: "var(--accent)", color: "#1a1206" }}>
                  Ver análisis
                </button>
                <span
                  onClick={() => onToggleLike?.(featured.id)}
                  role="button" tabIndex={0}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full font-mono text-[11px] cursor-pointer transition-all duration-200"
                  style={{
                    background: featured.liked ? "color-mix(in oklch, var(--accent) 16%, transparent)" : "var(--surface)",
                    color: featured.liked ? "var(--accent)" : "var(--text-dim)",
                    border: `1px solid ${featured.liked ? "var(--accent)" : "var(--line)"}`,
                  }}
                  onMouseEnter={e => { if (!featured.liked) { e.currentTarget.style.background = "color-mix(in oklch, var(--accent) 10%, transparent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.border = "1px solid color-mix(in oklch, var(--accent) 35%, transparent)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={e => { if (!featured.liked) { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.border = "1px solid var(--line)"; e.currentTarget.style.transform = "translateY(0)"; } }}>
                  <HeartBurst filled={featured.liked} size={14} />
                  {featured.liked ? "En favoritas" : "Añadir"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Novedades (últimas funciones registradas) ── */}
          {novedades.length > 0 && <div className="mt-9 pt-7 border-t" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display font-semibold uppercase tracking-wide text-[19px]"
                style={{ color: "var(--text)" }}>
                Novedades
              </h2>
              <div className="flex gap-1.5">
                {[{ dir: -1, d: "M15 18l-6-6 6-6", disabled: !canLeft }, { dir: 1, d: "M9 18l6-6-6-6", disabled: !canRight }].map(({ dir, d, disabled }) => (
                  <button key={dir} onClick={() => scrollBy(dir)} disabled={disabled}
                    className="grid place-items-center w-8 h-8 rounded-full transition-all duration-200"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      color: disabled ? "var(--text-faint)" : "var(--text-dim)",
                      opacity: disabled ? 0.4 : 1,
                      cursor: disabled ? "default" : "pointer",
                    }}
                    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "color-mix(in oklch, var(--accent) 35%, transparent)"; e.currentTarget.style.background = "color-mix(in oklch, var(--accent) 10%, transparent)"; } }}
                    onMouseLeave={e => { if (!disabled) { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--surface)"; } }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div ref={scrollRef} onScroll={updateScrollState} className="flex gap-4 overflow-x-auto no-scrollbar pt-2 pb-2 -mx-1 px-1">
              {novedades.map((f) => (
                <button key={f.id} onClick={() => onOpen?.(f)}
                  className="group relative flex-none w-[185px] text-left focus:outline-none">
                  <div className="relative rounded-[5px] overflow-hidden ring-1 transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ "--tw-ring-color": "rgba(255,255,255,.08)", boxShadow: "0 14px 30px -20px rgba(0,0,0,.9)" }}>
                    <Poster film={f} hideYear />
                    <div className="absolute inset-0 rounded-[5px] ring-2 ring-inset ring-transparent transition-all duration-300 group-hover:ring-[var(--accent)] pointer-events-none" />
                  </div>
                  <span
                    onClick={(e) => { e.stopPropagation(); onToggleLike?.(f.id); }}
                    role="button" tabIndex={-1}
                    className="absolute top-2.5 right-2.5 grid place-items-center w-7 h-7 rounded-full backdrop-blur transition-all duration-200 hover:scale-110 group-hover:!opacity-100"
                    style={{
                      background: "rgba(8,10,13,.18)",
                      color: f.liked ? "var(--accent)" : "rgba(255,255,255,.55)",
                      border: "1px solid rgba(255,255,255,.06)",
                      opacity: f.liked ? 1 : 0,
                    }}>
                    <HeartBurst filled={f.liked} size={13} />
                  </span>
                  <div className="mt-2.5 px-0.5">
                    <StarRating value={f.rating} size={15} />
                    <h3 className="mt-1.5 text-[14px] leading-tight font-medium truncate"
                      style={{ color: "var(--text)" }}>{f.film}</h3>
                    <span className="font-mono text-[11px] tracking-[0.18em]" style={{ color: "var(--text-faint)" }}>{f.watched}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>}
        </div>
      </div>

      <FilmStrip />
    </header>
  );
}

// Chevron para los menús desplegables.
function Chevron({ open = false, size = 13 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", opacity: 0.75, transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Menú desplegable de filtro (Género / Década) con conteos.
function FilterMenu({ label, value, onChange, options, width = 200, align = "left" }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const active = value !== "all";

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const current = options.find((o) => o.id === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-full text-[12.5px] font-medium transition-colors"
        style={{
          background: active ? "color-mix(in oklch, var(--accent) 16%, transparent)" : "var(--surface)",
          color: active ? "var(--accent)" : "var(--text-dim)",
          border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
        }}>
        <span className="font-mono uppercase text-[10px] tracking-[0.18em]" style={{ color: active ? "color-mix(in oklch, var(--accent) 75%, var(--text-faint))" : "var(--text-faint)" }}>{label}</span>
        <span className="whitespace-nowrap">{current.label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className={`absolute z-50 mt-2 ${align === "right" ? "right-0" : "left-0"} rounded-xl p-1.5 max-h-[320px] overflow-y-auto no-scrollbar`}
          style={{ width, background: "var(--surface)", border: "1px solid var(--line)", boxShadow: "0 24px 60px -24px rgba(0,0,0,.92)" }}>
          {options.map((o) => {
            const isActive = o.id === value;
            const disabled = !!o.disabled;
            return (
              <button key={o.id} disabled={disabled}
                onClick={() => { onChange(o.id); setOpen(false); }}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors text-left"
                style={{
                  background: isActive ? "color-mix(in oklch, var(--accent) 16%, transparent)" : "transparent",
                  color: isActive ? "var(--accent)" : disabled ? "var(--text-faint)" : "var(--text-soft)",
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? "default" : "pointer",
                }}
                onMouseEnter={(e) => { if (!isActive && !disabled) e.currentTarget.style.background = "var(--bg)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <span className="whitespace-nowrap">{o.label}</span>
                <span className="font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded"
                  style={{ background: isActive ? "color-mix(in oklch, var(--accent) 22%, transparent)" : "var(--bg)", color: isActive ? "var(--accent)" : "var(--text-faint)" }}>{o.count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Toolbar({ sort, setSort, total, query, genres, genre, setGenre, counts, decades, decade, setDecade, decadeCounts }) {
  const sorts = [
    { id: "recent", label: "Recientes" },
    { id: "rating", label: "Calificación" },
    { id: "director", label: "Director" },
  ];

  const genreOptions = [
    { id: "all", label: "Todos", count: total },
    ...genres.map((g) => ({ id: g, label: g, count: counts[g] || 0 })),
  ];
  const decadeOptions = [
    { id: "all", label: "Todas", count: total },
    ...decades.map((d) => {
      const n = decadeCounts[d] || 0;
      return { id: d, label: `${d}s`, count: n, disabled: n === 0 && decade !== d };
    }),
  ];

  const hasFilters = genre !== "all" || decade !== "all";

  return (
    <div className="sticky top-[57px] z-30 backdrop-blur-md border-b"
      style={{ background: "color-mix(in oklch, var(--bg) 85%, transparent)", borderColor: "var(--line)" }}>
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center gap-x-3 gap-y-2.5">
        <div className="flex items-center gap-2.5 mr-1">
          <h2 className="font-display font-semibold uppercase tracking-wide text-[19px]"
            style={{ color: "var(--text)" }}>{query && query.trim() ? "Resultados" : "Diary"}</h2>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded"
            style={{ color: "var(--text-dim)", background: "var(--surface)" }}>{total}</span>
          {query && query.trim() && (
            <span className="font-mono text-[11px] truncate max-w-[180px]" style={{ color: "var(--text-faint)" }}>
              para “<span style={{ color: "var(--accent)" }}>{query.trim()}</span>”
            </span>
          )}
        </div>

        <span className="hidden sm:inline font-mono uppercase text-[10px] tracking-[0.18em]"
          style={{ color: "var(--text-faint)" }}>Ordenar por</span>

        {/* tabs de orden */}
        <div className="flex items-center gap-1 p-1 rounded-full"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          {sorts.map((s) => {
            const active = sort === s.id;
            return (
              <button key={s.id} onClick={() => setSort(s.id)}
                className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200"
                style={{
                  background: active ? "var(--accent)" : "transparent",
                  color: active ? "#08111c" : "var(--text-dim)",
                  border: active ? "1px solid transparent" : "1px solid transparent",
                                  }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "color-mix(in oklch, var(--accent) 10%, transparent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.border = "1px solid color-mix(in oklch, var(--accent) 35%, transparent)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.transform = "translateY(0)"; } }}>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* separador + filtros desplegables (alineados a la derecha) */}
        <span className="hidden md:block w-px h-6 mx-1 ml-auto" style={{ background: "var(--line)" }} />
        <span className="hidden sm:inline font-mono uppercase text-[10px] tracking-[0.18em] md:ml-0 ml-auto"
          style={{ color: "var(--text-faint)" }}>Filtrar</span>
        <FilterMenu label="Género" value={genre} onChange={setGenre} options={genreOptions} width={210} />
        <FilterMenu label="Década" value={decade} onChange={setDecade} options={decadeOptions} width={150} align="right" />
        {hasFilters && (
          <button onClick={() => { setGenre("all"); setDecade("all"); }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[12px] font-medium transition-colors"
            style={{ color: "var(--text-faint)", background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
            title="Limpiar filtros">
            <span style={{ fontSize: 15, lineHeight: 1 }}>×</span> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

// ── Vista Favoritas (colección personal) ─────────────────────────────────
function FavoritesView({ films, sort, setSort, onOpen, onToggleLike, onBrowse, totalFilms, profile }) {
  const count = films.length;
  const avg = count ? films.reduce((s, f) => s + f.rating, 0) / count : 0;
  const fives = films.filter((f) => f.rating === 5).length;
  const sorts = [
    { id: "recent", label: "Recientes" },
    { id: "rating", label: "Calificación" },
    { id: "director", label: "Director" },
  ];

  return (
    <React.Fragment>
      <header className="relative overflow-hidden" style={{ background: "#0c0f13" }}>
        <FilmStrip />

        <div className="relative border-b" style={{ borderColor: "var(--line)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background:
              "radial-gradient(90% 140% at 90% -20%, color-mix(in oklch, var(--accent) 24%, transparent), transparent 55%), conic-gradient(from 30deg at 12% -10%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 40%), radial-gradient(60% 100% at 0% 0%, rgba(255,255,255,.05), transparent 60%)",
          }} />
          <div className="absolute inset-0 opacity-[0.5] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: "var(--grain)" }} />

          <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8 pt-7 pb-9">
            <div className="flex items-center justify-between gap-4 mb-5">
              <span className="inline-flex items-center gap-2 font-mono uppercase text-[11px] tracking-[0.22em] px-2.5 py-1.5 rounded"
                style={{ color: "var(--accent)", background: "color-mix(in oklch, var(--accent) 10%, transparent)", border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)" }}>
                <Heart filled size={12} />
                Tu colección
              </span>
              <button onClick={onBrowse}
                className="inline-flex items-center gap-1.5 font-mono uppercase text-[10px] tracking-[0.18em] transition-colors"
                style={{ color: "var(--text-faint)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                <span aria-hidden="true">←</span> Volver a Fotograma
              </button>
            </div>

            <h1 className="font-display font-semibold uppercase leading-[0.9] tracking-[0.01em]"
              style={{ fontSize: "clamp(36px,6.4vw,62px)", color: "var(--text)", textWrap: "balance" }}>
              Favoritas
            </h1>

          </div>
        </div>
      </header>

      {/* barra de orden (consistente con el diario) */}
      <div className="sticky top-[57px] z-30 backdrop-blur-md border-b"
        style={{ background: "color-mix(in oklch, var(--bg) 85%, transparent)", borderColor: "var(--line)" }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center gap-x-3 gap-y-2.5">
          <div className="flex items-center gap-2.5 mr-1">
            <h2 className="font-display font-semibold uppercase tracking-wide text-[19px]"
              style={{ color: "var(--text)" }}>Favoritas</h2>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded"
              style={{ color: "var(--text-dim)", background: "var(--surface)" }}>{count}</span>
          </div>

          <span className="hidden sm:inline font-mono uppercase text-[10px] tracking-[0.18em]"
            style={{ color: "var(--text-faint)" }}>Ordenar por</span>

          <div className="flex items-center gap-1 p-1 rounded-full ml-auto sm:ml-0"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
            {sorts.map((s) => {
              const active = sort === s.id;
              return (
                <button key={s.id} onClick={() => setSort(s.id)}
                  className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200"
                  style={{
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "#08111c" : "var(--text-dim)",
                    border: "1px solid transparent",
                                      }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "color-mix(in oklch, var(--accent) 10%, transparent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.border = "1px solid color-mix(in oklch, var(--accent) 35%, transparent)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.transform = "translateY(0)"; } }}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-[1180px] mx-auto px-5 sm:px-8 py-9">
        {count === 0 ? (
          <div className="py-24 text-center">
            <span className="mx-auto mb-5 grid place-items-center w-16 h-16 rounded-full"
              style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text-faint)" }}>
              <Heart size={26} />
            </span>
            <p className="font-display uppercase text-[28px] tracking-wide" style={{ color: "var(--text-dim)" }}>Aún no hay favoritas</p>
            <p className="mt-2 text-[14px]" style={{ color: "var(--text-faint)" }}>
              Marca una función con el corazón para guardarla en tu colección.
            </p>
            <button onClick={onBrowse}
              className="mt-5 px-4 py-2 rounded-full text-[13px] font-medium"
              style={{ background: "var(--accent)", color: "#1a1206" }}>Explorar Fotograma</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
            {films.map((f) => (
              <PosterCard key={f.id} film={f} onOpen={onOpen} onToggleLike={onToggleLike} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-7 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono uppercase text-[10px] tracking-[0.18em]" style={{ color: "var(--text-faint)" }}>
            {PROFILE.app} — {PROFILE.appTagline}
          </span>
          <span className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
            {PROFILE.author}
          </span>
        </div>
      </footer>
    </React.Fragment>
  );
}

// ── Modal de perfil — configurar/editar identidad (solo localStorage) ─────
function ProfileModal({ open, profile, onSave, onClose }) {
  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const firstRef = React.useRef(null);

  // Sembrar los campos con el perfil actual cada vez que se abre.
  React.useEffect(() => {
    if (open) {
      setUsername(profile?.username || "");
      setFirstName(profile?.firstName || "");
      setLastName(profile?.lastName || "");
      setTimeout(() => firstRef.current?.focus({ preventScroll: true }), 60);
    }
  }, [open, profile]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const canSave = firstName.trim() && lastName.trim();
  const initials = ((firstName.trim().charAt(0) || "") + (lastName.trim().charAt(0) || "")).toUpperCase();
  const hasProfile = !!profile?.firstName;

  const submit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      username: username.trim().replace(/^@+/, ""),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
  };

  const field = (label, value, setter, opts = {}) => (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono uppercase text-[10px] tracking-[0.18em]" style={{ color: "var(--text-faint)" }}>
        {label}{opts.optional ? <span style={{ textTransform: "none", letterSpacing: 0 }}> · opcional</span> : null}
      </span>
      <div className="relative flex items-center">
        {opts.prefix ? (
          <span className="absolute left-3 font-mono text-[14px]" style={{ color: "var(--text-faint)" }}>{opts.prefix}</span>
        ) : null}
        <input
          ref={opts.ref}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={opts.placeholder}
          maxLength={opts.maxLength || 40}
          className="w-full py-2.5 rounded-xl text-[14px] outline-none transition-colors"
          style={{
            background: "var(--bg)", color: "var(--text)", border: "1px solid var(--line)",
            paddingLeft: opts.prefix ? "1.9rem" : "0.85rem", paddingRight: "0.85rem",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
        />
      </div>
    </label>
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center p-4"
      style={{ background: "color-mix(in oklch, #05070a 72%, transparent)", backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form onSubmit={submit}
        className="w-full max-w-[420px] rounded-2xl p-6 sm:p-7"
        style={{
          background: "var(--surface)", border: "1px solid var(--line)",
          boxShadow: "0 30px 80px -30px rgba(0,0,0,.85)", animation: "fadeUp .28s ease both",
        }}>
        <div className="flex items-center gap-3.5">
          <ReelMark size={48} initials={initials} />
          <div className="leading-tight">
            <h2 className="font-display uppercase tracking-[0.05em] text-[20px]" style={{ color: "var(--text)" }}>
              {hasProfile ? "Editar perfil" : "Tu perfil"}
            </h2>
            <p className="text-[12.5px] mt-0.5" style={{ color: "var(--text-faint)" }}>
              {hasProfile ? "Actualiza tus datos cuando quieras." : "Identifícate para personalizar Fotograma."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {field("Nombre de usuario", username, setUsername, { prefix: "@", placeholder: "usuario", optional: true, maxLength: 24 })}
          {field("Nombre", firstName, setFirstName, { placeholder: "Ej. Juan", ref: firstRef })}
          {field("Apellido", lastName, setLastName, { placeholder: "Ej. Pérez" })}
        </div>

        <div className="mt-7 flex items-center justify-end gap-2.5">
          <button type="button" onClick={onClose}
            className="px-4 py-2.5 rounded-full text-[13px] font-medium transition-colors"
            style={{ background: "transparent", color: "var(--text-dim)", border: "1px solid var(--line)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
            Cancelar
          </button>
          <button type="submit" disabled={!canSave}
            className="px-5 py-2.5 rounded-full text-[13px] font-semibold transition-opacity"
            style={{
              background: "var(--accent)", color: "#1a1206",
              opacity: canSave ? 1 : 0.45, cursor: canSave ? "pointer" : "not-allowed",
            }}>
            {hasProfile ? "Guardar cambios" : "Guardar perfil"}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}

Object.assign(window, { ProfileHeader, Toolbar, NavBar, ReelMark, FavoritesView, ProfileModal, profileInitials });
