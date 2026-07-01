// ─────────────────────────────────────────────────────────────────────────
//  Vista de detalle — ficha técnica / review estilo Letterboxd
//  Hero a pantalla completa con backdrop difuminado (póster ampliado) + póster.
// ─────────────────────────────────────────────────────────────────────────

function MetaChip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[11px] tracking-[0.18em]"
      style={{ color: "var(--text-dim)" }}>
      {icon}{children}
    </span>
  );
}

function Section({ icon, kicker, title, children }) {
  return (
    <section className="relative">
      <div className="flex items-center gap-2.5 mb-3">
        {icon ? <span style={{ color: "var(--accent)" }}>{icon}</span> : null}
        {kicker ? (
          <span className="font-mono uppercase text-[11px] tracking-[0.22em] whitespace-nowrap flex-none"
            style={{ color: "var(--accent)" }}>{kicker}</span>
        ) : null}
        <span className="flex-1 h-px" style={{ background: "var(--line)" }} />
      </div>
      <h3 className="font-display font-semibold uppercase tracking-wide mb-3"
        style={{ fontSize: "clamp(22px,3.4vw,30px)", color: "var(--text)" }}>{title}</h3>
      <div className="text-[15.5px] leading-[1.72] max-w-[68ch]"
        style={{ color: "var(--text-soft)" }}>{children}</div>
    </section>
  );
}

function DetailView({ film, onBack, onToggleLike }) {
  const [content, setContent] = React.useState({ review: "", opinion: "", actividad: "" });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`contenido/${film.contentFile || film.id}.md`)
      .then(r => r.text())
      .then(md => {
        const extract = (heading) => {
          const match = md.match(new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i'));
          return match ? match[1].trim() : "";
        };
        const headings = [...md.matchAll(/^## (.+)/gm)].map(m => m[1].trim());
        const thirdTitle = headings[2] || "";
        setContent({
          review: extract("Reseña"),
          opinion: extract("Opinión"),
          actividadTitle: thirdTitle,
          actividad: thirdTitle ? extract(thirdTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : "",
        });
        setLoading(false);
      });
  }, [film.id]);

  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <div className="relative">
        {/* backdrop difuminado: el póster tipográfico ampliado */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ transform: "scale(1.25)", filter: "blur(46px) saturate(1.1)", opacity: 0.55 }}>
            <Poster film={film} className="!aspect-auto h-full w-full" style={{ height: "100%" }} />
          </div>
          <div className="absolute inset-0" style={{
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--bg) 35%, transparent) 0%, color-mix(in oklch, var(--bg) 60%, transparent) 45%, var(--bg) 96%)",
          }} />
          <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "var(--grain)" }} />
        </div>

        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8 pt-6 pb-10">
<div className="flex flex-col sm:flex-row gap-7 sm:gap-9 items-start">
            {/* póster */}
            <div className="w-[150px] sm:w-[210px] flex-none rounded-md overflow-hidden ring-1"
              style={{ "--tw-ring-color": "rgba(255,255,255,.12)", boxShadow: "0 26px 60px -28px rgba(0,0,0,.95)" }}>
              <Poster film={film} />
            </div>

            {/* cabecera de texto */}
            <div className="min-w-0 flex-1 pt-1">
              <p className="font-mono uppercase text-[11px] tracking-[0.22em] mb-3"
                style={{ color: "var(--accent)" }}>Evidencia · Tarea {film.posterNo}</p>
              <h1 className="font-display font-semibold uppercase leading-[0.95] tracking-[0.01em]"
                style={{ fontSize: "clamp(32px,6vw,58px)", color: "var(--text)", textWrap: "balance" }}>
                {film.film}
              </h1>

              <div className="mt-3">
                <p className="font-display uppercase text-[15px] tracking-wide"
                  style={{ color: "var(--text-dim)" }}>
                  {film.task} · <span style={{ color: "var(--text-faint)" }}>{film.year}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                  <MetaChip icon={<PenTool size={14} />}>{film.director}</MetaChip>
                  <MetaChip icon={<Clock size={14} />}>{film.runtime}</MetaChip>
                  <MetaChip icon={<Calendar size={14} />}>{film.watched}</MetaChip>
                </div>
              </div>

              {/* rating destacado */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background: "color-mix(in oklch, var(--surface) 80%, transparent)", border: "1px solid var(--line)" }}>
                  <StarRating value={film.rating} size={26} gap={3} />
                  <span className="font-display font-semibold text-[26px] tabular-nums leading-none"
                    style={{ color: "var(--text)" }}>{film.rating.toFixed(1)}</span>
                  <span className="font-mono text-[11px] self-end mb-0.5"
                    style={{ color: "var(--text-faint)" }}>/ 5</span>
                </div>

                <button onClick={() => onToggleLike(film.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                  style={{
                    background: film.liked ? "color-mix(in oklch, var(--accent) 16%, transparent)" : "var(--surface)",
                    color: film.liked ? "var(--accent)" : "var(--text-dim)",
                    border: `1px solid ${film.liked ? "var(--accent)" : "var(--line)"}`,
                  }}
                  onMouseEnter={e => { if (!film.liked) { e.currentTarget.style.background = "color-mix(in oklch, var(--accent) 10%, transparent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.border = "1px solid color-mix(in oklch, var(--accent) 35%, transparent)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={e => { if (!film.liked) { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.border = "1px solid var(--line)"; e.currentTarget.style.transform = "translateY(0)"; } }}>
                  <HeartBurst filled={film.liked} size={16} />
                  {film.liked ? "En favoritas" : "Marcar favorita"}
                </button>
              </div>

              {/* tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {film.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full font-mono uppercase text-[10px] tracking-[0.18em]"
                    style={{ background: "var(--surface)", color: "var(--text-dim)", border: "1px solid var(--line)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ──────────────────────────────────────────── */}
      <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8 pb-24">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div className="space-y-12 sm:pl-[239px]">
            {loading ? (
              <div className="space-y-3 pt-2">
                {[1, 0.7, 0.5].map((op, i) => (
                  <div key={i} className="h-4 rounded-full animate-pulse" style={{ background: "var(--surface)", opacity: op, width: `${70 - i * 15}%` }} />
                ))}
              </div>
            ) : (
              <>
                <Section title="Reseña">
                  <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(content.review) }} />
                </Section>

                <Section title="Opinión">
                  <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(content.opinion) }} />
                </Section>

                {content.actividadTitle && (
                  <Section title={content.actividadTitle}>
                    <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(content.actividad) }} />
                  </Section>
                )}
              </>
            )}
          </div>

          {/* columna lateral: ficha rápida */}
          <aside className="lg:pt-2">
            <div className="rounded-xl p-5 sticky top-20"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
              <h4 className="font-mono uppercase text-[11px] tracking-[0.22em] mb-4" style={{ color: "var(--text-faint)" }}>Ficha técnica</h4>
              <dl className="space-y-3.5 text-[13.5px]">
                {[
                  ["Título", film.film],
                  ["Género", film.genre],
                  ["Productor", film.producer],
                  ["Casa productora", film.studio],
                  ["Director", film.director],
                  ["Guión", film.writer],
                  ["Fotografía", film.cinematography],
                  ["Duración", film.runtime],
                  ["País", film.country],
                  ["Año", String(film.year)],
                ].map(([k, val]) => (
                  <div key={k} className="flex justify-between gap-4 pb-3.5 border-b last:border-0"
                    style={{ borderColor: "var(--line)" }}>
                    <dt className="font-mono uppercase text-[10px] tracking-[0.18em] pt-0.5 flex-none" style={{ color: "var(--text-faint)" }}>{k}</dt>
                    <dd className="text-right" style={{ color: "var(--text)" }}>{val}</dd>
                  </div>
                ))}
                <div className="flex justify-between items-center gap-4">
                  <dt className="font-mono uppercase text-[10px] tracking-[0.18em]" style={{ color: "var(--text-faint)" }}>Calificación</dt>
                  <dd><StarRating value={film.rating} size={16} showNumber /></dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DetailView });
