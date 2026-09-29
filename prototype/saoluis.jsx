/* ============ SÃO LUÍS — MAPA DO REGISTRO PATRIMONIAL ============
 * Mapa urbano interativo do Centro Histórico de São Luís (Patrimônio
 * Mundial UNESCO), inspirado no portal do Registro de Imóveis (ONR):
 * base de satélite (Esri World Imagery via Leaflet), polígonos de
 * parcela por bem tombado, marcadores por situação e um painel lateral
 * de busca + ficha registral. Leaflet é carregado por CDN (global `L`).
 */

const SLZ_CENTER = [-2.5293, -44.3052];
const SLZ_SERVENTIA = "1º Ofício de Registro de Imóveis — São Luís/MA";

const SLZ_STATUS = {
  preservado: { label: "Preservado",  color: "#355C39" },
  atencao:    { label: "Em atenção",  color: "#A87018" },
  risco:      { label: "Em risco",    color: "#93432A" },
  restaurado: { label: "Restaurado",  color: "#1F5A60" },
};

// Bens tombados do Centro Histórico (Praia Grande / Reviver). Coordenadas
// aproximadas para fins de protótipo; polígonos representam a parcela.
const SLZ_BENS = [
  { id: "SLZ-0001", nome: "Palácio dos Leões",        tipo: "Palácio",   situacao: "restaurado", endereco: "Av. Dom Pedro II, s/n", epoca: "séc. XVIII", esfera: "Estadual", matricula: "M. 4.812", lat: -2.52985, lon: -44.30385, w: 0.00034, h: 0.00040 },
  { id: "SLZ-0002", nome: "Palácio La Ravardière",    tipo: "Palácio",   situacao: "preservado", endereco: "Praça Dom Pedro II",     epoca: "1689 (recon.)", esfera: "Municipal", matricula: "M. 4.815", lat: -2.53012, lon: -44.30448, w: 0.00026, h: 0.00030 },
  { id: "SLZ-0003", nome: "Catedral da Sé",           tipo: "Igreja",    situacao: "preservado", endereco: "Praça Dom Pedro II",     epoca: "1763", esfera: "Federal", matricula: "M. 2.190", lat: -2.53058, lon: -44.30508, w: 0.00024, h: 0.00034 },
  { id: "SLZ-0004", nome: "Teatro Arthur Azevedo",    tipo: "Teatro",    situacao: "restaurado", endereco: "Rua do Sol, 180",        epoca: "1817", esfera: "Estadual", matricula: "M. 3.044", lat: -2.52905, lon: -44.30560, w: 0.00028, h: 0.00030 },
  { id: "SLZ-0005", nome: "Convento das Mercês",      tipo: "Convento",  situacao: "preservado", endereco: "Rua da Palma, 502",      epoca: "1654", esfera: "Federal", matricula: "M. 1.778", lat: -2.52818, lon: -44.30442, w: 0.00032, h: 0.00034 },
  { id: "SLZ-0006", nome: "Casa das Tulhas",          tipo: "Mercado",   situacao: "atencao",    endereco: "Rua da Estrela",         epoca: "1861", esfera: "Municipal", matricula: "M. 5.330", lat: -2.52958, lon: -44.30702, w: 0.00030, h: 0.00026 },
  { id: "SLZ-0007", nome: "Igreja do Desterro",       tipo: "Igreja",    situacao: "atencao",    endereco: "Largo do Desterro",      epoca: "séc. XVII", esfera: "Federal", matricula: "M. 1.402", lat: -2.52690, lon: -44.30330, w: 0.00024, h: 0.00030 },
  { id: "SLZ-0008", nome: "Fonte do Ribeirão",        tipo: "Chafariz",  situacao: "preservado", endereco: "Largo do Ribeirão",      epoca: "1796", esfera: "Municipal", matricula: "M. 6.011", lat: -2.52742, lon: -44.30642, w: 0.00018, h: 0.00020 },
  { id: "SLZ-0009", nome: "Solar dos Vasconcelos",    tipo: "Solar",     situacao: "risco",      endereco: "Rua da Estrela, 200",    epoca: "séc. XIX", esfera: "Estadual", matricula: "M. 4.501", lat: -2.52992, lon: -44.30662, w: 0.00022, h: 0.00026 },
  { id: "SLZ-0010", nome: "Cafua das Mercês",         tipo: "Sobrado",   situacao: "atencao",    endereco: "Rua Jacinto Maia, 43",   epoca: "séc. XVIII", esfera: "Municipal", matricula: "M. 2.884", lat: -2.52768, lon: -44.30402, w: 0.00022, h: 0.00024 },
  { id: "SLZ-0011", nome: "Igreja de São João Batista", tipo: "Igreja",  situacao: "preservado", endereco: "Rua de São João",        epoca: "1719", esfera: "Federal", matricula: "M. 1.640", lat: -2.53092, lon: -44.30432, w: 0.00024, h: 0.00030 },
  { id: "SLZ-0012", nome: "Sobrados da Rua Portugal", tipo: "Conjunto",  situacao: "restaurado", endereco: "Rua Portugal (Beco Catarina Mina)", epoca: "séc. XIX", esfera: "Municipal", matricula: "M. 5.902", lat: -2.52915, lon: -44.30682, w: 0.00040, h: 0.00022 },
];

function slzInscricao(id) {
  // Inscrição imobiliária fictícia, derivada do código do bem.
  const n = id.replace(/\D/g, "");
  return `21.06.${n.slice(0, 3)}.${n.slice(3)}-${(parseInt(n, 10) % 9) + 1}`;
}

function slzQuad(b) {
  // Parcela aproximada: quadrilátero levemente enviesado em torno do ponto.
  const sk = b.w * 0.35;
  return [
    [b.lat + b.h, b.lon - b.w + sk],
    [b.lat + b.h, b.lon + b.w + sk],
    [b.lat - b.h, b.lon + b.w - sk],
    [b.lat - b.h, b.lon - b.w - sk],
  ];
}

function SaoLuisScreen({ go }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({});      // id -> { poly, marker, color }
  const baseRef = useRef(null);      // { sat, labels, streets }

  const [sel, setSel] = useState(null);
  const [query, setQuery] = useState("");
  const [situ, setSitu] = useState("todas");
  const [base, setBase] = useState("satelite");
  const [coords, setCoords] = useState(null);
  const [ready, setReady] = useState(typeof L !== "undefined");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SLZ_BENS.filter(b => {
      if (situ !== "todas" && b.situacao !== situ) return false;
      if (!q) return true;
      return `${b.nome} ${b.endereco} ${b.id} ${b.tipo} ${b.matricula}`.toLowerCase().includes(q);
    });
  }, [query, situ]);

  const selBem = sel ? SLZ_BENS.find(b => b.id === sel) : null;

  const flyTo = (b, z) => {
    const map = mapRef.current;
    if (map) map.flyTo([b.lat, b.lon], z || Math.max(17, map.getZoom()), { duration: 0.6 });
  };
  const select = (id) => {
    setSel(id);
    const b = SLZ_BENS.find(x => x.id === id);
    if (b) flyTo(b);
  };

  /* ---- init Leaflet once ---- */
  useEffect(() => {
    if (typeof L === "undefined") {
      // Leaflet ainda não disponível: tenta novamente em breve.
      const t = setInterval(() => { if (typeof L !== "undefined") { setReady(true); clearInterval(t); } }, 200);
      return () => clearInterval(t);
    }
    if (!mapEl.current || mapRef.current) return;

    const map = L.map(mapEl.current, {
      center: SLZ_CENTER, zoom: 16, minZoom: 13, maxZoom: 19,
      zoomControl: false, attributionControl: true,
    });
    mapRef.current = map;

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

    const sat = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, attribution: "Imagery © Esri · Maxar · Earthstar Geographics" }
    );
    const labels = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.9 }
    );
    const streets = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "© OpenStreetMap · © CARTO" }
    );
    sat.addTo(map); labels.addTo(map);
    baseRef.current = { sat, labels, streets };

    SLZ_BENS.forEach(b => {
      const color = (SLZ_STATUS[b.situacao] || {}).color || "#555";
      const poly = L.polygon(slzQuad(b), {
        color, weight: 1.5, opacity: 0.95, fillColor: color, fillOpacity: 0.30,
      }).addTo(map);
      const icon = L.divIcon({
        className: "slz-pin", html: `<span style="--c:${color}"></span>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      const marker = L.marker([b.lat, b.lon], { icon, title: b.nome }).addTo(map);
      poly.bindTooltip(b.nome, { direction: "top", offset: [0, -4], className: "slz-tip" });
      const click = () => select(b.id);
      poly.on("click", click);
      marker.on("click", click);
      layersRef.current[b.id] = { poly, marker, color };
    });

    map.on("mousemove", (e) => setCoords([e.latlng.lat, e.latlng.lng]));
    map.on("click", (e) => { if (e.originalEvent && e.originalEvent.target === map.getContainer()) setSel(null); });

    setReady(true);
    setTimeout(() => map.invalidateSize(), 60);
    setTimeout(() => map.invalidateSize(), 350);

    return () => { map.remove(); mapRef.current = null; layersRef.current = {}; };
  }, [ready]);

  /* ---- base layer switch ---- */
  useEffect(() => {
    const b = baseRef.current, map = mapRef.current;
    if (!b || !map) return;
    [b.sat, b.labels, b.streets].forEach(l => l && map.hasLayer(l) && map.removeLayer(l));
    if (base === "satelite") { b.sat.addTo(map); b.labels.addTo(map); }
    else { b.streets.addTo(map); }
  }, [base, ready]);

  /* ---- show/hide by filter ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const ids = new Set(filtered.map(b => b.id));
    Object.entries(layersRef.current).forEach(([id, l]) => {
      const on = ids.has(id);
      [l.poly, l.marker].forEach(layer => {
        if (on && !map.hasLayer(layer)) layer.addTo(map);
        if (!on && map.hasLayer(layer)) map.removeLayer(layer);
      });
    });
  }, [filtered, ready]);

  /* ---- selection highlight ---- */
  useEffect(() => {
    Object.entries(layersRef.current).forEach(([id, l]) => {
      const on = id === sel;
      l.poly.setStyle({ weight: on ? 3 : 1.5, fillOpacity: on ? 0.5 : 0.30 });
      if (on) l.poly.bringToFront();
      const el = l.marker.getElement && l.marker.getElement();
      if (el) el.classList.toggle("sel", on);
    });
  }, [sel, filtered, ready]);

  const counts = useMemo(() => {
    const c = { todas: SLZ_BENS.length };
    Object.keys(SLZ_STATUS).forEach(k => c[k] = SLZ_BENS.filter(b => b.situacao === k).length);
    return c;
  }, []);

  return (
    <div className="slz-shell">
      {/* ---------- SIDEBAR (estilo portal de registro) ---------- */}
      <aside className="slz-side">
        <div className="slz-side-head">
          <button className="slz-back" onClick={() => go("map")}>
            <Icon name="arrow" size={13} style={{ transform: "rotate(180deg)" }}/> Mapa do Maranhão
          </button>
          <div className="slz-title">Registro Patrimonial</div>
          <div className="slz-sub">São Luís · Centro Histórico — Patrimônio Mundial</div>
        </div>

        <div className="slz-search">
          <label className="slz-field-label">Buscar no acervo registral</label>
          <div className="slz-input-wrap">
            <Icon name="search" size={14}/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Endereço, bem ou matrícula…"
            />
            {query && <button className="slz-clear" onClick={() => setQuery("")} aria-label="Limpar"><Icon name="x" size={12}/></button>}
          </div>

          <label className="slz-field-label" style={{ marginTop: 12 }}>Camada para busca — situação</label>
          <div className="slz-chips">
            {[["todas", "Todas"], ...Object.entries(SLZ_STATUS).map(([k, v]) => [k, v.label])].map(([k, label]) => (
              <button
                key={k}
                className={`slz-chip ${situ === k ? "active" : ""}`}
                onClick={() => setSitu(k)}
                style={situ === k && k !== "todas" ? { borderColor: SLZ_STATUS[k].color, color: SLZ_STATUS[k].color } : null}
              >
                {k !== "todas" && <span className="slz-dot" style={{ background: SLZ_STATUS[k].color }}/>}
                {label}<span className="slz-chip-n">{counts[k]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- ficha registral do bem selecionado ---- */}
        {selBem && (
          <div className="slz-detail">
            <div className="slz-detail-top">
              <span className="badge" style={{ color: SLZ_STATUS[selBem.situacao].color, borderColor: SLZ_STATUS[selBem.situacao].color, background: "transparent" }}>
                <span className="dot" style={{ background: SLZ_STATUS[selBem.situacao].color }}/>{SLZ_STATUS[selBem.situacao].label}
              </span>
              <button className="slz-clear" onClick={() => setSel(null)} aria-label="Fechar"><Icon name="x" size={13}/></button>
            </div>
            <div className="slz-detail-name">{selBem.nome}</div>
            <div className="slz-detail-addr">{selBem.endereco}</div>
            <div className="slz-detail-grid">
              <div><span>Matrícula</span><b>{selBem.matricula}</b></div>
              <div><span>Inscrição</span><b>{slzInscricao(selBem.id)}</b></div>
              <div><span>Tipologia</span><b>{selBem.tipo}</b></div>
              <div><span>Época</span><b>{selBem.epoca}</b></div>
              <div><span>Esfera</span><b>{selBem.esfera}</b></div>
              <div><span>Código SIP</span><b>{selBem.id}</b></div>
            </div>
            <div className="slz-detail-serv">{SLZ_SERVENTIA}</div>
            <button className="btn primary sm" style={{ width: "100%", marginTop: 10 }} onClick={() => go("acervo")}>
              Consultar no acervo <Icon name="arrow" size={12}/>
            </button>
          </div>
        )}

        {/* ---- lista de resultados ---- */}
        <div className="slz-list-head">
          <span>{filtered.length} {filtered.length === 1 ? "bem" : "bens"} no perímetro</span>
          <span className="slz-list-sub">SIRGAS 2000</span>
        </div>
        <div className="slz-list">
          {filtered.map(b => (
            <button
              key={b.id}
              className={`slz-row ${sel === b.id ? "active" : ""}`}
              onClick={() => select(b.id)}
            >
              <span className="slz-row-dot" style={{ background: SLZ_STATUS[b.situacao].color }}/>
              <span className="slz-row-body">
                <span className="slz-row-name">{b.nome}</span>
                <span className="slz-row-meta">{b.tipo} · {b.endereco}</span>
              </span>
              <span className="slz-row-code">{b.matricula}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="slz-empty">Nenhum bem corresponde aos filtros.</div>
          )}
        </div>
      </aside>

      {/* ---------- MAP ---------- */}
      <div className="slz-map-wrap">
        <div ref={mapEl} className="slz-map"/>

        {/* toolbar flutuante — estilo ONR */}
        <div className="slz-toolbar">
          <div className="slz-scope">Centro Histórico · São Luís/MA</div>
          <div className="slz-base-toggle">
            <button className={base === "satelite" ? "active" : ""} onClick={() => setBase("satelite")}>Satélite</button>
            <button className={base === "ruas" ? "active" : ""} onClick={() => setBase("ruas")}>Carta</button>
          </div>
        </div>

        <div className="slz-coords">
          {coords
            ? <>lat {coords[0].toFixed(5)} · lon {coords[1].toFixed(5)}</>
            : <>lat −2.529 · lon −44.305</>}
        </div>

        {!ready && (
          <div className="slz-loading">Carregando base cartográfica…</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SaoLuisScreen, SLZ_BENS, SLZ_STATUS });
