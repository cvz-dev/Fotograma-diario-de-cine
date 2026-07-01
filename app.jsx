// ─────────────────────────────────────────────────────────────────────────
//  App — SPA con dos vistas: Diary (grid) y Detalle. Estado en memoria.
// ─────────────────────────────────────────────────────────────────────────

// Lleva la vista al inicio al cambiar de sección/película.
const scrollTop = () => {
  // 'instant' anula el scroll-behavior:smooth del <html>; reseteo directo por si acaso.
  try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

// Favoritas persistentes: arranca vacío y guarda en el navegador lo que marques.
const LIKES_KEY = "sebastian-cine-favoritas";
const loadLikes = () => {
  try { return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || "[]")); }
  catch (e) { return new Set(); }
};

// Perfil de usuario persistente (sin backend): null hasta que se configure.
const PROFILE_KEY = "fotograma-perfil-usuario";
const loadProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && p.firstName ? p : null;
  } catch (e) { return null; }
};

function App() {
  const [films, setFilms] = React.useState(() => {
    const likes = loadLikes();
    // Ignora el `liked` de los datos: la verdad vive en localStorage (vacío al inicio).
    return FILMS.map((f) => ({ ...f, liked: likes.has(f.id) }));
  });
  const [activeId, setActiveId] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState("recent");
  const [genre, setGenre] = React.useState("all");
  const [decade, setDecade] = React.useState("all");
  const [view, setView] = React.useState("diary"); // 'diary' | 'favoritas'
  const [profile, setProfile] = React.useState(loadProfile);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const saveProfile = React.useCallback((p) => {
    setProfile(p);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch (e) { /* sin almacenamiento */ }
    setProfileOpen(false);
  }, []);

  const toggleLike = React.useCallback((id) => {
    setFilms((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, liked: !f.liked } : f));
      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify(next.filter((f) => f.liked).map((f) => f.id)));
      } catch (e) { /* almacenamiento no disponible */ }
      return next;
    });
  }, []);

  const active = films.find((f) => f.id === activeId) || null;

  // Tras cambiar de sección o de película, asegura que la nueva vista
  // arranque arriba (el reset síncrono puede ocurrir antes del repintado).
  React.useLayoutEffect(() => { scrollTop(); }, [view, activeId]);

  const parseDate = (s) => {
    const m = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
    const [d, mon, y] = s.toLowerCase().split(" ");
    return new Date(+y, m[mon.slice(0, 3)] ?? 0, +d).getTime();
  };

  // géneros y décadas
  const genres = React.useMemo(
    () => [...new Set(films.map((f) => f.genre))].sort((a, b) => a.localeCompare(b, "es")),
    [films]
  );
  const decades = React.useMemo(() => {
    const maxDec = Math.max(2020, ...films.map((f) => Math.floor(f.year / 10) * 10));
    const out = [];
    for (let d = 1950; d <= maxDec; d += 10) out.push(d);
    return out;
  }, [films]);

  const matchesQuery = React.useCallback((f, q) =>
    !q ||
    f.task.toLowerCase().includes(q) ||
    f.film.toLowerCase().includes(q) ||
    f.director.toLowerCase().includes(q) ||
    f.genre.toLowerCase().includes(q) ||
    String(f.year).includes(q) ||
    f.tags.some((t) => t.toLowerCase().includes(q)), []);

  // conteos cruzados (cada filtro cuenta respetando los OTROS filtros activos)
  const genreCounts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const c = {};
    films.filter((f) => matchesQuery(f, q) && (decade === "all" || Math.floor(f.year / 10) * 10 === decade))
      .forEach((f) => { c[f.genre] = (c[f.genre] || 0) + 1; });
    return c;
  }, [films, query, decade, matchesQuery]);

  const decadeCounts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const c = {};
    films.filter((f) => matchesQuery(f, q) && (genre === "all" || f.genre === genre))
      .forEach((f) => { const d = Math.floor(f.year / 10) * 10; c[d] = (c[d] || 0) + 1; });
    return c;
  }, [films, query, genre, matchesQuery]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = films.filter((f) =>
      (genre === "all" || f.genre === genre) &&
      (decade === "all" || Math.floor(f.year / 10) * 10 === decade) &&
      matchesQuery(f, q)
    );
    list = [...list];
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating || parseDate(b.watched) - parseDate(a.watched));
    else if (sort === "director") list.sort((a, b) => a.director.localeCompare(b.director, "es"));
    else list.sort((a, b) => parseDate(b.watched) - parseDate(a.watched));
    return list;
  }, [films, query, sort, genre, decade, matchesQuery]);

  // Favoritas: solo las marcadas, respetando búsqueda y orden (sin filtros de género/década).
  const favorites = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = films.filter((f) => f.liked && matchesQuery(f, q));
    list = [...list];
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating || parseDate(b.watched) - parseDate(a.watched));
    else if (sort === "director") list.sort((a, b) => a.director.localeCompare(b.director, "es"));
    else list.sort((a, b) => parseDate(b.watched) - parseDate(a.watched));
    return list;
  }, [films, query, sort, matchesQuery]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar films={films} query={query} setQuery={setQuery} view={view}
        profile={profile} onOpenProfile={() => setProfileOpen(true)}
        onHome={() => { setView("diary"); setActiveId(null); setQuery(""); }}
        onFavorites={() => { setView("favoritas"); setActiveId(null); }}
        onSearchFocus={() => setActiveId(null)} />

      <ProfileModal open={profileOpen} profile={profile}
        onSave={saveProfile} onClose={() => setProfileOpen(false)} />

      {active ? (
        <DetailView film={active} onBack={() => setActiveId(null)} onToggleLike={toggleLike} />
      ) : view === "favoritas" ? (
        <FavoritesView films={favorites} sort={sort} setSort={setSort} totalFilms={films.length} profile={profile}
          onOpen={(f) => setActiveId(f.id)} onToggleLike={toggleLike} onBrowse={() => setView("diary")} />
      ) : (
        <React.Fragment>
          {!query.trim() && (
            <ProfileHeader films={films} onOpen={(f) => setActiveId(f.id)} onToggleLike={toggleLike} />
          )}
          <Toolbar sort={sort} setSort={setSort} total={visible.length} query={query}
            genres={genres} genre={genre} setGenre={setGenre} counts={genreCounts}
            decades={decades} decade={decade} setDecade={setDecade} decadeCounts={decadeCounts} />

          <main className="max-w-[1180px] mx-auto px-5 sm:px-8 py-9">
            {visible.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display uppercase text-[28px] tracking-wide" style={{ color: "var(--text-dim)" }}>Sin coincidencias</p>
                <p className="mt-2 text-[14px]" style={{ color: "var(--text-faint)" }}>No hay tareas que coincidan con el filtro actual.</p>
                <button onClick={() => { setQuery(""); setGenre("all"); setDecade("all"); }}
                  className="mt-5 px-4 py-2 rounded-full text-[13px] font-medium"
                  style={{ background: "var(--accent)", color: "#1a1206" }}>Limpiar filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
                {visible.map((f) => (
                  <PosterCard key={f.id} film={f} onOpen={(x) => setActiveId(x.id)} onToggleLike={toggleLike} />
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
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
