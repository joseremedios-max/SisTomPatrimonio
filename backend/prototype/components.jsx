// Shared UI components
const { useState, useEffect, useMemo, useRef } = React;

/* ============ ICON SET (minimal, line) ============ */
function Icon({ name, size = 16, stroke = 1.5, style }) {
  const s = { width: size, height: size, ...(style || {}) };
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", style: s };
  switch (name) {
    case "search":  return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "map":     return <svg {...props}><path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5"/><path d="M15 6.5V20"/></svg>;
    case "pin":     return <svg {...props}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case "layers":  return <svg {...props}><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>;
    case "filter":  return <svg {...props}><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></svg>;
    case "grid":    return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "list":    return <svg {...props}><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>;
    case "arrow":   return <svg {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
    case "chev":    return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "down":    return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "x":       return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "plus":    return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "check":   return <svg {...props}><path d="m5 12 5 5L20 7"/></svg>;
    case "eye":     return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "edit":    return <svg {...props}><path d="M4 20h4l11-11-4-4L4 16z"/></svg>;
    case "trash":   return <svg {...props}><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7v13h12V7"/><path d="M9 4h6v3H9z"/></svg>;
    case "doc":     return <svg {...props}><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/></svg>;
    case "upload":  return <svg {...props}><path d="M12 16V4"/><path d="m6 10 6-6 6 6"/><path d="M4 18v2h16v-2"/></svg>;
    case "down2":   return <svg {...props}><path d="M12 4v12"/><path d="m6 12 6 6 6-6"/><path d="M4 20h16"/></svg>;
    case "alert":   return <svg {...props}><path d="M12 3 1 21h22z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.6" fill="currentColor"/></svg>;
    case "info":    return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/></svg>;
    case "lock":    return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
    case "user":    return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>;
    case "users":   return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M3 20c1.2-3.2 3.6-5 6-5s4.8 1.8 6 5"/><circle cx="17" cy="9" r="3"/><path d="M14 16c1.6-1 4-1 5 0 1 .8 1.6 2 2 4"/></svg>;
    case "dash":    return <svg {...props}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>;
    case "house":   return <svg {...props}><path d="M3 11 12 3l9 8"/><path d="M5 10v11h14V10"/><path d="M10 21v-6h4v6"/></svg>;
    case "scroll":  return <svg {...props}><path d="M5 4h11l3 3v13H5z"/><path d="M5 4v6h11"/><path d="M9 14h7"/><path d="M9 17h5"/></svg>;
    case "gavel":   return <svg {...props}><path d="m4 20 7-7"/><path d="m11 8 5 5"/><path d="m9 6 7 7 3-3-7-7z"/><path d="M3 21h6"/></svg>;
    case "shield":  return <svg {...props}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/></svg>;
    case "chart":   return <svg {...props}><path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="14" width="3" height="4"/></svg>;
    case "calendar":return <svg {...props}><rect x="3" y="5" width="18" height="16"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></svg>;
    case "settings":return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1c.6.5 1.3.9 2 1.2L10 21h4l.6-2.7c.7-.3 1.4-.7 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/></svg>;
    case "compass": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="m15 9-5 2-2 5 5-2z"/></svg>;
    case "external":return <svg {...props}><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v6H4V5h6"/></svg>;
    case "history": return <svg {...props}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v5l3 2"/></svg>;
    case "bell":    return <svg {...props}><path d="M6 9a6 6 0 0 1 12 0v5l2 3H4l2-3z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case "logout":  return <svg {...props}><path d="M14 7V5H4v14h10v-2"/><path d="M20 12H10"/><path d="m16 8 4 4-4 4"/></svg>;
    case "minus":   return <svg {...props}><path d="M5 12h14"/></svg>;
    case "more":    return <svg {...props}><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></svg>;
    default: return null;
  }
}

/* ============ STATUS BADGE ============ */
const STATUS_META = {
  preservado: { label: "Preservado", cls: "preservado" },
  atencao:    { label: "Em atenção", cls: "atencao" },
  risco:      { label: "Em risco",   cls: "risco" },
  restaurado: { label: "Restaurado", cls: "restaurado" },
  semvist:    { label: "Sem vistoria", cls: "semvist" },
};
function StatusBadge({ status }) {
  const m = STATUS_META[status] || { label: status, cls: "" };
  return <span className={`badge ${m.cls}`}><span className="dot"/>{m.label}</span>;
}

/* ============ PUBLIC HEADER ============ */
function PublicHeader({ route, go, compact }) {
  const items = [
    ["home", "Início"],
    ["map", "Mapa"],
    ["acervo", "Acervo"],
    ["imaterial", "Imaterial"],
    ["arqueo", "Arqueológicos"],
    ["sobre", "Sobre"],
  ];
  return (
    <header className={`pub-header ${compact ? "compact" : ""}`}>
      <div className="mainbar">
        <div className="brand" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          <div className="crest" aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em" }}>SIP</div>
          <div className="brand-text">
            <div className="name">{compact ? "SIP · Maranhão" : "Sistema Integrado de Informações Patrimoniais"}</div>
            <div className="sub">{compact ? "Acervo público" : "SIP · Acervo do Maranhão"}</div>
          </div>
        </div>
        <nav>
          {items.map(([k, l]) => (
            <a key={k} className={route === k ? "active" : ""} onClick={() => go(k)}>{l}</a>
          ))}
          <span style={{ width: 1, height: 18, background: "#3A4038", margin: "0 6px" }}/>
          <button className="cta" onClick={() => go("login")}>
            <Icon name="lock" size={12}/>
            Painel admin
          </button>
        </nav>
      </div>
    </header>
  );
}

/* ============ FOOTER ============ */
function PublicFooter() {
  return (
    <footer style={{ background: "#161B18", color: "#B6B3A4", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="crest" style={{ width: 40, height: 40, background: "linear-gradient(135deg, var(--petroleum) 0%, #0F2628 100%)", color: "var(--gold)", display: "grid", placeItems: "center", border: "1px solid #4A4F47", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", borderRadius: "var(--radius-sm)" }}>SIP</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#FBF7EC", lineHeight: 1.15 }}>Sistema Integrado de<br/>Informações Patrimoniais</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 5, color: "#8E8E7D" }}>SIP · Maranhão</div>
            </div>
          </div>
          <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, maxWidth: 360 }}>
            Plataforma pública de consulta, visualização e gestão de informações sobre o patrimônio cultural material, imaterial e arqueológico do Maranhão.
          </p>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid #2A2F2C", display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6A6F66" }}>Parceiros</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ background: "#FBF8F0", padding: "6px 10px", borderRadius: 4, height: 38, display: "flex", alignItems: "center" }}>
                <img src="assets/logo-gov-ma.png" alt="Governo do Maranhão" style={{ height: 22, width: "auto", display: "block" }}/>
              </div>
              <div style={{ background: "#FBF8F0", padding: "4px 8px", borderRadius: 4, height: 38, display: "flex", alignItems: "center" }}>
                <img src="assets/logo-iphan.png" alt="IPHAN" style={{ height: 26, width: "auto", display: "block" }}/>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="caps" style={{ color: "#6A6F66", marginBottom: 14 }}>Acervo</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8, fontSize: 13 }}>
            <li>Mapa interativo</li>
            <li>Imóveis históricos</li>
            <li>Patrimônio imaterial</li>
            <li>Sítios arqueológicos</li>
            <li>Documentos públicos</li>
          </ul>
        </div>
        <div>
          <div className="caps" style={{ color: "#6A6F66", marginBottom: 14 }}>Institucional</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8, fontSize: 13 }}>
            <li>Sobre o sistema</li>
            <li>Metodologia</li>
            <li>Órgãos parceiros</li>
            <li>Política de dados</li>
            <li>Acessibilidade</li>
          </ul>
        </div>
        <div>
          <div className="caps" style={{ color: "#6A6F66", marginBottom: 14 }}>Contato</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8, fontSize: 13 }}>
            <li>Coordenação SIP — IPHAN-MA</li>
            <li>Av. dos Holandeses, s/nº · São Luís</li>
            <li>+55 98 3214-0000</li>
            <li>contato@sip.ma.gov.br</li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #2A2F2C", padding: "16px 32px", display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "#6A6F66", textTransform: "uppercase" }}>
        <span>© 2026 Governo do Maranhão · IPHAN-MA · Todos os direitos reservados</span>
        <span>Dados de demonstração — Protótipo institucional</span>
      </div>
    </footer>
  );
}

/* ============ GEOGRAPHIC PROJECTION ============ */
// Hand-calibrated bounds for the simplified silhouette below.
const MA_GEO_BOUNDS = {
  minLon: -48.8, maxLon: -41.7,
  minLat: -10.4, maxLat:  -0.9,
};
const MA_VIEW_BOUNDS = {
  xMin: 16, xMax: 74,
  yMin:  4, yMax: 87,
};
function projectToMAViewBox(latitude, longitude) {
  if (latitude == null || longitude == null) return { x: 45, y: 45 };
  const { minLon, maxLon, minLat, maxLat } = MA_GEO_BOUNDS;
  const { xMin, xMax, yMin, yMax } = MA_VIEW_BOUNDS;
  const x = xMin + ((longitude - minLon) / (maxLon - minLon)) * (xMax - xMin);
  const y = yMin + ((maxLat - latitude) / (maxLat - minLat)) * (yMax - yMin);
  return { x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(95, y)) };
}

function pinPosition(item) {
  if (typeof item.mapX === "number" && typeof item.mapY === "number") {
    return { x: item.mapX, y: item.mapY };
  }
  return projectToMAViewBox(item.latitude, item.longitude);
}

/* ============ MAP COMPONENT (geographically-faithful Maranhão) ============ */
// Outline traced from a reference silhouette of Maranhão.
const MA_OUTLINE = "M 37.29,7.50 L 38.91,8.67 L 39.94,7.50 L 39.79,9.26 L 40.38,9.85 L 41.40,8.67 L 42.58,9.70 L 43.46,9.11 L 42.72,11.61 L 43.61,13.22 L 44.63,12.78 L 44.34,11.02 L 45.81,10.14 L 46.39,11.46 L 47.57,10.00 L 47.86,11.02 L 47.28,11.61 L 50.50,14.55 L 50.65,15.43 L 48.30,17.92 L 49.33,18.36 L 51.09,16.45 L 51.53,18.07 L 49.77,19.68 L 49.77,21.30 L 48.89,22.33 L 49.04,24.23 L 47.86,25.85 L 48.16,26.88 L 52.12,23.65 L 51.97,21.74 L 53.44,19.54 L 54.47,19.68 L 54.47,20.86 L 53.00,22.03 L 53.29,22.77 L 55.64,20.71 L 58.28,19.83 L 59.90,20.27 L 60.63,18.95 L 61.51,18.95 L 65.33,19.98 L 67.53,21.44 L 68.56,23.06 L 72.67,23.79 L 73.55,22.77 L 74.28,24.53 L 71.20,27.76 L 67.39,28.78 L 66.50,32.01 L 63.86,34.95 L 63.72,36.12 L 64.74,37.00 L 63.86,39.94 L 65.48,43.61 L 63.13,46.69 L 62.25,50.22 L 64.01,52.86 L 64.30,56.67 L 63.57,57.41 L 60.63,57.26 L 59.75,58.44 L 57.70,56.38 L 54.91,56.97 L 52.12,59.90 L 50.50,60.34 L 48.89,61.81 L 47.28,61.81 L 45.81,63.13 L 43.75,63.13 L 41.40,64.16 L 40.23,68.71 L 36.71,75.61 L 36.85,79.43 L 37.73,81.33 L 37.00,82.22 L 36.85,85.74 L 35.83,87.50 L 33.33,86.18 L 31.13,83.24 L 31.86,81.63 L 30.54,80.75 L 27.31,75.90 L 29.37,74.14 L 29.66,72.09 L 32.45,70.47 L 32.89,67.98 L 30.98,66.51 L 29.66,66.80 L 28.34,68.27 L 27.61,68.12 L 24.08,63.28 L 23.64,61.37 L 21.59,60.20 L 24.52,57.11 L 24.67,53.89 L 25.55,52.56 L 24.67,51.39 L 24.82,47.57 L 22.76,44.78 L 21.29,44.64 L 19.83,43.02 L 18.80,43.46 L 17.62,41.85 L 16.16,42.00 L 15.72,41.26 L 20.41,37.00 L 22.61,37.15 L 24.23,36.12 L 25.70,32.16 L 27.46,31.87 L 28.49,30.69 L 27.90,29.81 L 28.19,28.64 L 32.74,22.62 L 31.86,20.12 L 34.06,18.66 L 33.62,17.04 L 35.97,13.96 L 35.24,11.17 L 37.29,7.50 Z";

// Cities used as reference ticks inside the map. Coordinates are tuned so
// each city falls inside the MA_OUTLINE landmass (avoiding bays and the
// open ocean) — keeps pins/medallions from floating outside the state.
const MA_CITIES = [
  // [name, x, y, isCapital]
  ["São Luís",       54.5, 20.0, true ],
  ["Alcântara",      43.0, 18.5, false],
  ["Cururupu",       36.5, 17.5, false],
  ["Tutóia",         62.0, 23.0, false],
  ["Pinheiro",       38.5, 22.0, false],
  ["Rosário",        53.0, 26.0, false],
  ["Itapecuru-Mirim",51.0, 29.0, false],
  ["Bacabal",        44.0, 33.5, false],
  ["Codó",           54.5, 33.5, false],
  ["Caxias",         59.0, 38.5, false],
  ["Timon",          63.0, 41.0, false],
  ["Barra do Corda", 43.0, 46.5, false],
  ["Presidente Dutra",51.0, 45.0, false],
  ["Imperatriz",     30.5, 59.0, false],
  ["Açailândia",     30.0, 53.0, false],
  ["Balsas",         44.0, 62.0, false],
  ["Riachão",        34.5, 76.0, false],
  ["Carolina",       35.0, 80.0, false],
];

const MA_RIVERS = [
  // [path, name, labelX, labelY, labelRot]
  // Parnaíba — east border with Piauí
  ["M 71,22 C 70,28 69,34 67,40 C 65,46 62,52 60,57", "R. Parnaíba",  73, 36, 75],
  // Tocantins — southwest
  ["M 35,87 C 33,82 31,76 28,70 C 24,62 21,55 19,46", "R. Tocantins", 21, 52, -65],
];

function MapBase({
  children,
  simple,
  showLabels = true,
  showCities = true,
  showChrome = true,
  interactive = false,
  hideAttrib = false,
  bare = false,
  showNeighbors = true,
  showCompass = true,
  showScale = true,
  align = "center",
}) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 45, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef(null);
  const svgRef = useRef(null);

  const VB_W = 90, VB_H = 95;
  // Viewport viewBox after zoom: width = VB_W / zoom, height = VB_H / zoom
  const vw = VB_W / zoom;
  const vh = VB_H / zoom;
  const vx = Math.max(0, Math.min(VB_W - vw, center.x - vw / 2));
  const vy = Math.max(0, Math.min(VB_H - vh, center.y - vh / 2));

  const onWheel = (e) => {
    if (!interactive) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom(z => {
      const next = Math.min(6, Math.max(1, z * (1 + delta)));
      return Math.round(next * 100) / 100;
    });
  };

  const onMouseDown = (e) => {
    if (!interactive || zoom <= 1.001) return;
    dragState.current = { x: e.clientX, y: e.clientY, center: { ...center } };
    setIsDragging(true);
  };
  const onMouseMove = (e) => {
    if (!dragState.current) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - dragState.current.x) / rect.width * vw;
    const dy = (e.clientY - dragState.current.y) / rect.height * vh;
    setCenter({
      x: dragState.current.center.x - dx,
      y: dragState.current.center.y - dy,
    });
  };
  const onMouseUp = () => { dragState.current = null; setIsDragging(false); };

  useEffect(() => {
    if (!interactive) return;
    const up = () => { dragState.current = null; setIsDragging(false); };
    const move = (e) => onMouseMove(e);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
    };
  }, [interactive, zoom]);

  const handleZoom = (factor) => {
    setZoom(z => Math.min(6, Math.max(1, z * factor)));
  };
  const handleReset = () => { setZoom(1); setCenter({ x: 45, y: 45 }); };

  // Inverse-scale factor so chrome (pins, labels) stay readable as we zoom in
  const k = 1 / zoom;

  return (
    <div className={`map-wrap${bare ? " bare" : ""}`}
      onWheel={onWheel}
      style={interactive ? { cursor: isDragging ? "grabbing" : (zoom > 1 ? "grab" : "default") } : null}>
      {!bare && <div className="map-grid"/>}
      <svg
        ref={svgRef}
        viewBox={`${vx} ${vy} ${vw} ${vh}`}
        preserveAspectRatio={align === "right" ? "xMaxYMid meet" : align === "left" ? "xMinYMid meet" : "xMidYMid meet"}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", userSelect: "none" }}
        onMouseDown={onMouseDown}>
        <defs>
          <pattern id="ocean-fine" patternUnits="userSpaceOnUse" width="1.4" height="1.4">
            <rect width="1.4" height="1.4" fill="rgba(31,74,78,0.022)"/>
            <circle cx="0.7" cy="0.7" r="0.08" fill="rgba(31,74,78,0.11)"/>
          </pattern>
          {/* deep parchment sea — warm tan that darkens toward the edges so
              the landmass reads with strong figure-ground contrast */}
          <radialGradient id="ocean-deep" cx="0.44" cy="0.30" r="1.08">
            <stop offset="0%"   stopColor="#D9CFB1"/>
            <stop offset="52%"  stopColor="#C7BA94"/>
            <stop offset="100%" stopColor="#AC9C74"/>
          </radialGradient>
          <pattern id="land-tex" patternUnits="userSpaceOnUse" width="2.2" height="2.2">
            <rect width="2.2" height="2.2" fill="transparent"/>
            <circle cx="1.1" cy="1.1" r="0.16" fill="rgba(109,104,80,0.08)"/>
          </pattern>
          {/* brighter, richer land — high-key cream lifting off the sea */}
          <linearGradient id="land-fill" x1="0.15" y1="0" x2="0.6" y2="1">
            <stop offset="0%"   stopColor="#FCF5E0"/>
            <stop offset="46%"  stopColor="#F3E8C4"/>
            <stop offset="100%" stopColor="#E7DAAF"/>
          </linearGradient>
          <radialGradient id="land-glow" cx="0.5" cy="0.30" r="0.9">
            <stop offset="0%"   stopColor="rgba(255,251,236,0.72)"/>
            <stop offset="100%" stopColor="rgba(255,251,236,0)"/>
          </radialGradient>
          {/* relief shade — darkens the south/east interior for a domed lift */}
          <radialGradient id="land-relief" cx="0.40" cy="0.30" r="0.98">
            <stop offset="52%"  stopColor="rgba(96,74,32,0)"/>
            <stop offset="100%" stopColor="rgba(96,74,32,0.20)"/>
          </radialGradient>
          {/* deep, directional drop shadow — lifts the state off the chart */}
          <filter id="ma-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0.15" dy="0.95" stdDeviation="0.95" floodColor="#241B0C" floodOpacity="0.36"/>
          </filter>
          {/* soft blur used for the luminous coastline halo */}
          <filter id="coast-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="0.6"/>
          </filter>
          <clipPath id="ma-clip">
            <path d={MA_OUTLINE}/>
          </clipPath>
        </defs>

        {/* Ocean / surrounding context — deep parchment sea + faint weave */}
        {!bare && <rect x="0" y="0" width="90" height="95" fill="url(#ocean-deep)"/>}
        {!bare && <rect x="0" y="0" width="90" height="95" fill="url(#ocean-fine)"/>}

        {/* Bathymetric echo lines — concentric coastline rings drawn behind
            the land. The same outline is stroked at decreasing widths; the
            land fill (painted on top) masks the inner halves, leaving rings
            hugging the coast like an antique sea chart. */}
        {!bare && !simple && (
          <g fill="none" stroke="#356E72" strokeLinejoin="round">
            <path d={MA_OUTLINE} strokeWidth="3.6" opacity="0.045"/>
            <path d={MA_OUTLINE} strokeWidth="2.4" opacity="0.06"/>
            <path d={MA_OUTLINE} strokeWidth="1.4" opacity="0.09"/>
            <path d={MA_OUTLINE} strokeWidth="0.7" opacity="0.15"/>
          </g>
        )}

        {/* Luminous coastline halo — warm glow hugging the shore */}
        {!simple && (
          <path d={MA_OUTLINE} fill="none" stroke="#FBEFCC" strokeWidth="1.1" opacity="0.6" filter="url(#coast-glow)"/>
        )}

        {/* Maranhão landmass */}
        <path d={MA_OUTLINE} fill="url(#land-fill)" stroke="#564E32" strokeWidth="0.46" strokeLinejoin="round" filter="url(#ma-shadow)"/>

        {/* Inner texture + warm glow + relief shade — clipped to land */}
        <g clipPath="url(#ma-clip)">
          <rect x="0" y="0" width="90" height="95" fill="url(#land-tex)"/>
          <rect x="0" y="0" width="90" height="95" fill="url(#land-glow)"/>
          <rect x="0" y="0" width="90" height="95" fill="url(#land-relief)"/>

          {/* Faint contour-like lines for relief feel (south is more rugged) */}
          {!simple && (
            <g fill="none" stroke="rgba(101,90,52,0.22)" strokeWidth="0.11" strokeLinecap="round">
              <path d="M 20,52 C 28,50 38,52 50,50 C 58,49 64,50 68,52"/>
              <path d="M 22,62 C 30,60 40,62 52,60 C 58,59 62,60 64,62"/>
              <path d="M 26,72 C 32,71 38,72 44,71 C 50,70 54,71 58,72"/>
              <path d="M 30,78 C 34,77 38,78 42,77"/>
              {/* Chapada das Mesas — hachured uplands in the deep south */}
              <g stroke="rgba(101,90,52,0.30)" strokeWidth="0.10">
                <path d="M 33,79 l 0.7,-1.1 M 34.2,79.2 l 0.7,-1.1 M 35.4,79 l 0.7,-1.1 M 36.6,79.1 l 0.7,-1.1"/>
              </g>
            </g>
          )}

          {/* Rios principais — keep only Parnaíba (east border) and Tocantins (southwest border).
              These are real, identifiable, labeled — not the random squiggles. */}
          {!simple && (
            <g fill="none" stroke="#3B6A6F" strokeLinecap="round" opacity="0.65">
              {MA_RIVERS.map(([d], i) => (
                <path key={i} d={d} strokeWidth="0.28"/>
              ))}
              {/* hairline overlay for slight gloss */}
              {MA_RIVERS.map(([d], i) => (
                <path key={"o" + i} d={d} strokeWidth="0.10" stroke="rgba(255,255,255,0.4)"/>
              ))}
            </g>
          )}

          {/* Lençóis Maranhenses — sand dunes coastal strip */}
          {!simple && (
            <g fill="rgba(212,180,108,0.6)" stroke="rgba(168,136,66,0.42)" strokeWidth="0.12">
              <ellipse cx="56" cy="20" rx="3.3" ry="0.9"/>
              <ellipse cx="61" cy="20.3" rx="2.2" ry="0.7"/>
              <ellipse cx="64.5" cy="21" rx="1.4" ry="0.5"/>
            </g>
          )}

          {/* lit inner coastline — bright rim just inside the shore (the
              clip keeps only the inner half, reading as a sunlit edge) */}
          {!simple && (
            <path d={MA_OUTLINE} fill="none" stroke="rgba(255,253,244,0.65)" strokeWidth="0.5"/>
          )}
        </g>

        {/* River labels — outside clip so they read clearly */}
        {!simple && showLabels && (
          <g fontFamily="var(--font-mono)" fill="#3B6A6F" opacity="0.85" fontStyle="italic">
            {MA_RIVERS.map(([, name, lx, ly, rot], i) => (
              <text
                key={i}
                x={lx} y={ly}
                fontSize={Math.max(1.2, 1.6 * k)}
                letterSpacing="0.05"
                transform={`rotate(${rot} ${lx} ${ly})`}>
                {name}
              </text>
            ))}
          </g>
        )}

        {/* Estados vizinhos */}
        {!simple && showLabels && showNeighbors && (
          <g fontFamily="var(--font-mono)" fill="#A39A7B">
            <text x="2"  y="38" fontSize={2.1 * k} letterSpacing="0.6">PARÁ</text>
            <text x="3"  y="78" fontSize={2.1 * k} letterSpacing="0.6">TOCANTINS</text>
            <text x="79" y="55" fontSize={2.1 * k} letterSpacing="0.6">PIAUÍ</text>
            <text x="45" y="3.5" fontSize={1.9 * k} letterSpacing="0.55" fontStyle="italic" fill="#7A8B8E">OCEANO ATLÂNTICO</text>
          </g>
        )}

        {/* Cities — capital gets a star medallion; minor cities show name only
            (dot removed at the user's request). Labels render at reduced
            opacity so they stay subtle against the parchment. */}
        {!simple && showCities && showLabels && (
          <g fontFamily="var(--font-mono)">
            {MA_CITIES.map(([n, x, y, capital]) => (
              <g key={n}>
                {capital && (
                  <g transform={`translate(${x} ${y}) scale(${k})`}>
                    <circle r="0.95" fill="#FBF7EC" stroke="#3A3325" strokeWidth="0.3"/>
                    <path d="M 0,-0.85 L 0.20,-0.27 L 0.81,-0.27 L 0.33,0.10 L 0.50,0.69 L 0,0.34 L -0.50,0.69 L -0.33,0.10 L -0.81,-0.27 L -0.20,-0.27 Z" fill="#3A3325"/>
                  </g>
                )}
                <text
                  x={+x + (capital ? 1.15 * k : 0.55 * k)}
                  y={+y + 0.55 * k}
                  fontSize={capital ? 1.85 * k : 1.45 * k}
                  fill={capital ? "#1A1408" : "#2A2214"}
                  fillOpacity={capital ? 0.85 : 0.55}
                  fontWeight={capital ? 600 : 500}
                  letterSpacing="0.04"
                  paintOrder="stroke"
                  stroke="rgba(244,234,208,0.92)"
                  strokeWidth={0.38 * k}
                  strokeLinejoin="round">{n}</text>
              </g>
            ))}
          </g>
        )}

        {/* PINS — rendered inside the SVG so they share viewBox coords.
            Children render with an inverse-scale applied so pin size stays
            constant on screen as the user zooms in. */}
        <g className="pins-layer">
          {React.Children.map(children, child => {
            if (!child) return null;
            return React.cloneElement(child, { size: (child.props.size || 1) * k });
          })}
        </g>
      </svg>

      {!simple && showChrome && (
        <>
          {/* compass — refined */}
          {showCompass && (
            <div style={{ position: "absolute", top: 14, right: 14, width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(26,31,28,0.18)", background: "rgba(251,247,236,0.92)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--ink-2)", boxShadow: "var(--shadow-sm)" }}>
              <svg width="34" height="34" viewBox="0 0 34 34" style={{ position: "absolute" }}>
                <polygon points="17,5 19,17 17,15 15,17" fill="var(--clay)"/>
                <polygon points="17,29 19,17 17,19 15,17" fill="var(--ink-2)" opacity="0.65"/>
                <circle cx="17" cy="17" r="1.4" fill="var(--paper)" stroke="var(--ink-2)" strokeWidth="0.5"/>
              </svg>
              <div style={{ position: "absolute", top: 2, fontWeight: 600 }}>N</div>
            </div>
          )}
          {/* scale — clean bar */}
          {showScale && (
            <div style={{ position: "absolute", bottom: 14, left: 14, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--ink-2)", textTransform: "uppercase", background: "rgba(251,247,236,0.7)", padding: "5px 8px", borderRadius: 3, backdropFilter: "blur(6px)" }}>
              <div style={{ display: "flex", borderRadius: 2, overflow: "hidden", border: "1px solid var(--ink-2)" }}>
                <div style={{ width: 34, height: 5, background: "var(--ink-2)" }}/>
                <div style={{ width: 34, height: 5, background: "var(--paper)" }}/>
                <div style={{ width: 34, height: 5, background: "var(--ink-2)" }}/>
              </div>
              <div style={{ marginTop: 3, display: "flex", justifyContent: "space-between", width: 102 }}>
                <span>0</span><span>{Math.round(50 / zoom)}</span><span>{Math.round(100 / zoom)} km</span>
              </div>
            </div>
          )}
          {!hideAttrib && (
            <div className="map-attrib">SIRGAS 2000 · IBGE 1:1.000.000 · SIP — IPHAN-MA</div>
          )}
          {interactive && (
            <div className="gis-btn-group" style={{ position: "absolute", right: 14, bottom: 60 }}>
              <button title="Aproximar" onClick={() => handleZoom(1.4)}><Icon name="plus" size={14}/></button>
              <button title="Afastar" onClick={() => handleZoom(1 / 1.4)}><Icon name="minus" size={14}/></button>
              <button title="Centralizar" onClick={handleReset}><Icon name="compass" size={14}/></button>
            </div>
          )}
          {interactive && zoom > 1.01 && (
            <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", padding: "4px 10px", background: "rgba(21,25,26,0.78)", color: "#F5EFDB", fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.08em", borderRadius: 999, textTransform: "uppercase" }}>
              Zoom · {zoom.toFixed(1)}× · arraste para navegar
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============ MAP PIN — antique engraving emblems ============
 * Each pin is a small parchment-medallion stamp sitting above an ink cross
 * that marks the exact location. The emblem inside the medallion varies by
 * situação and is rendered as architectural silhouettes (igreja, sobrado,
 * ruína, coroa, pergaminho) — like marks on an 18th-century cartouche.
 * Anchor is the tip (0, 0); the medallion sits ~3 svg units above.
 */
const PIN_COLORS = {
  preservado: "#3F5240",  // muted moss ink
  atencao:    "#75571F",  // deep amber ink
  risco:      "#8B3E27",  // burnt sienna ink
  restaurado: "#2A4A50",  // deep petroleum ink
  semvist:    "#4A4639",  // graphite ink
};
const PIN_PARCHMENT = "#F2E6C6";

function MapPin({
  item,
  active,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  restricted,
  approx,
  size = 1,
  showLabel = false,
}) {
  const { x, y } = pinPosition(item);
  const c = PIN_COLORS[item.situacao] || "#2A2418";
  const s = size;
  const isInteractive = Boolean(onClick);
  const handleKeyDown = (e) => {
    if (!isInteractive || !["Enter", " "].includes(e.key)) return;
    e.preventDefault();
    onClick(e);
  };

  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      className={`map-pin-svg ${isInteractive ? "clickable" : ""} ${active ? "active" : ""} ${restricted ? "restricted" : ""}`}
      role={isInteractive ? "button" : "img"}
      tabIndex={isInteractive ? 0 : -1}
      aria-label={`${item.nome} — ${item.municipio}${restricted ? " (localização aproximada — restrito)" : ""}`}
    >
      <title>{item.nome} · {item.municipio}{restricted ? " · localização aproximada" : ""}</title>

      <g className="pin-inner">

      {/* approx halo for restricted / coordenadas protegidas */}
      {restricted && (
        <circle cx="0" cy="-3.2" r="2.4" fill="none" stroke={c} strokeOpacity="0.45" strokeWidth="0.20" strokeDasharray="0.5 0.4"/>
      )}

      {/* active selection ring */}
      {active && (
        <>
          <circle cx="0" cy="-3.2" r="2.5" fill={c} fillOpacity="0.10" stroke={c} strokeOpacity="0.50" strokeWidth="0.22"/>
          <circle cx="0" cy="-3.2" r="2.1" fill="none" stroke={c} strokeOpacity="0.30" strokeWidth="0.12"/>
        </>
      )}

      {/* Anchor mark — small ink cross at the exact location */}
      <g stroke={c} strokeWidth="0.20" strokeLinecap="round" opacity={approx ? 0.7 : 1}>
        <line x1="-0.50" y1="0" x2="0.50" y2="0"/>
        <line x1="0" y1="-0.50" x2="0" y2="0.50"/>
        <circle cx="0" cy="0" r="0.13" fill={c} stroke="none"/>
      </g>

      {/* Hairline connector — ties the anchor to the medallion */}
      <line x1="0" y1="-0.55" x2="0" y2="-1.55" stroke={c} strokeWidth="0.13" strokeLinecap="round"/>

      {/* Parchment medallion + emblem */}
      <g transform="translate(0, -3.2)" opacity={approx ? 0.85 : 1}>
        {/* soft shadow under the medallion */}
        <ellipse cx="0.1" cy="1.78" rx="1.55" ry="0.22" fill="rgba(20,18,12,0.22)"/>
        {/* parchment disc */}
        <circle r="1.70" fill={PIN_PARCHMENT} stroke={c} strokeWidth="0.22"/>
        {/* inner concentric line — engraving border */}
        <circle r="1.42" fill="none" stroke={c} strokeWidth="0.08" opacity="0.55"/>

        {/* SYMBOL per situação — antique architectural silhouettes */}
        {item.situacao === "preservado" && (
          /* Igreja barroca — fachada com cruz */
          <g fill={c} stroke={c} strokeWidth="0.10" strokeLinejoin="round">
            {/* cruz no alto */}
            <line x1="0" y1="-1.15" x2="0" y2="-0.60" strokeWidth="0.14" strokeLinecap="round"/>
            <line x1="-0.18" y1="-0.92" x2="0.18" y2="-0.92" strokeWidth="0.14" strokeLinecap="round"/>
            {/* frontão triangular */}
            <path d="M -0.72,-0.55 L 0,-0.92 L 0.72,-0.55 Z"/>
            {/* corpo da igreja */}
            <rect x="-0.72" y="-0.55" width="1.44" height="1.05"/>
            {/* portal */}
            <path d="M -0.20,0.50 L -0.20,0.10 A 0.20,0.20 0 0 1 0.20,0.10 L 0.20,0.50 Z" fill={PIN_PARCHMENT} stroke={c} strokeWidth="0.08"/>
          </g>
        )}

        {item.situacao === "atencao" && (
          /* Sobrado colonial — casa de três águas com telhado */
          <g fill={c} stroke={c} strokeWidth="0.10" strokeLinejoin="round">
            {/* telhado */}
            <path d="M -0.95,-0.20 L 0,-0.85 L 0.95,-0.20 L 0.78,-0.20 L 0.78,-0.05 L -0.78,-0.05 L -0.78,-0.20 Z"/>
            {/* corpo */}
            <rect x="-0.78" y="-0.05" width="1.56" height="0.78"/>
            {/* janelas */}
            <rect x="-0.50" y="0.05" width="0.22" height="0.30" fill={PIN_PARCHMENT} stroke={c} strokeWidth="0.07"/>
            <rect x="0.28" y="0.05" width="0.22" height="0.30" fill={PIN_PARCHMENT} stroke={c} strokeWidth="0.07"/>
            {/* porta */}
            <rect x="-0.13" y="0.30" width="0.26" height="0.43" fill={PIN_PARCHMENT} stroke={c} strokeWidth="0.07"/>
          </g>
        )}

        {item.situacao === "risco" && (
          /* Ruína — arco quebrado sobre base de pedra */
          <g stroke={c} strokeWidth="0.16" fill="none" strokeLinejoin="round" strokeLinecap="round">
            {/* coluna esquerda íntegra */}
            <path d="M -0.85,0.62 L -0.85,-0.20 A 0.45,0.45 0 0 1 -0.40,-0.65"/>
            {/* coluna direita parcial */}
            <path d="M 0.85,0.62 L 0.85,0.05"/>
            {/* arco quebrado (linha pontilhada) */}
            <path d="M 0.85,0.05 L 0.55,-0.40" strokeDasharray="0.16 0.14" strokeWidth="0.14"/>
            {/* base de pedra */}
            <rect x="-1.05" y="0.55" width="2.10" height="0.22" fill={c} stroke={c} strokeWidth="0.05"/>
            {/* trincas/pedras caídas */}
            <line x1="-0.30" y1="0.20" x2="-0.05" y2="0.30" strokeWidth="0.09"/>
            <line x1="0.18" y1="0.38" x2="0.42" y2="0.50" strokeWidth="0.09"/>
            <circle cx="0.18" cy="0.40" r="0.07" fill={c} stroke="none"/>
          </g>
        )}

        {item.situacao === "restaurado" && (
          /* Coroa barroca — três pontas com pérolas */
          <g fill={c} stroke={c} strokeWidth="0.08" strokeLinejoin="round">
            {/* corpo da coroa */}
            <path d="M -0.90,0.45 L -0.90,-0.10 L -0.45,0.18 L 0,-0.75 L 0.45,0.18 L 0.90,-0.10 L 0.90,0.45 Z"/>
            {/* base ornamentada */}
            <line x1="-0.95" y1="0.45" x2="0.95" y2="0.45" strokeWidth="0.25" strokeLinecap="round"/>
            {/* pérolas */}
            <circle cx="-0.90" cy="-0.18" r="0.11" fill={c}/>
            <circle cx="0" cy="-0.82" r="0.13" fill={c}/>
            <circle cx="0.90" cy="-0.18" r="0.11" fill={c}/>
            {/* gema central */}
            <circle cx="0" cy="0.18" r="0.10" fill={PIN_PARCHMENT} stroke={c} strokeWidth="0.07"/>
          </g>
        )}

        {item.situacao === "semvist" && (
          /* Pergaminho enrolado — folio sem registro */
          <g stroke={c} strokeWidth="0.12" fill={PIN_PARCHMENT} strokeLinejoin="round" strokeLinecap="round">
            {/* topo enrolado */}
            <path d="M -0.78,-0.62 L 0.78,-0.62 Q 0.94,-0.40 0.78,-0.18 L -0.78,-0.18 Q -0.94,-0.40 -0.78,-0.62 Z"/>
            <line x1="-0.78" y1="-0.40" x2="0.78" y2="-0.40" strokeWidth="0.07" opacity="0.7"/>
            {/* corpo */}
            <path d="M -0.78,-0.18 L 0.78,-0.18 L 0.78,0.50 Q 0.94,0.72 0.78,0.86 L -0.78,0.86 Q -0.94,0.72 -0.78,0.50 Z"/>
            {/* linhas de escritura */}
            <line x1="-0.45" y1="0.08" x2="0.45" y2="0.08" strokeWidth="0.07"/>
            <line x1="-0.45" y1="0.30" x2="0.30" y2="0.30" strokeWidth="0.07"/>
            <line x1="-0.45" y1="0.52" x2="0.20" y2="0.52" strokeWidth="0.07"/>
          </g>
        )}
      </g>

      {/* Municipality label — only for hero / non-interactive contexts */}
      {showLabel && (
        <text
          x={2.0}
          y={-3.2}
          fontSize={2.3}
          fontFamily="var(--font-mono)"
          fill={c}
          letterSpacing="0.02"
          dominantBaseline="middle"
          paintOrder="stroke"
          stroke="rgba(251,248,240,0.94)"
          strokeWidth={0.65}
          strokeLinejoin="round"
          fontWeight="500"
        >{item.municipio}</text>
      )}
      </g>
    </g>
  );
}

/* ============ EXPORT ============ */
Object.assign(window, {
  Icon, StatusBadge, STATUS_META, PublicHeader, PublicFooter, MapBase, MapPin,
  projectToMAViewBox, pinPosition, MA_GEO_BOUNDS, MA_VIEW_BOUNDS, PIN_COLORS, PIN_PARCHMENT,
});
