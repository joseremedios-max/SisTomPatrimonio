/* ============ PUBLIC SCREENS ============ */

/* Hero map pins — anchored exactly on the MA_CITIES reference grid so each
   pin lands on top of its corresponding city tick on the map. Situação is
   curated for visual variety. */
const HERO_PINS = [
  // === Capital + costa norte ===
  { id: "HRO-SLZ", nome: "São Luís — Centro Histórico", municipio: "São Luís", situacao: "preservado", mapX: 54.5, mapY: 20.0 },
  { id: "HRO-ALC", nome: "Alcântara",       municipio: "Alcântara",       situacao: "restaurado", mapX: 43.0, mapY: 18.5 },
  { id: "HRO-CRP", nome: "Cururupu",        municipio: "Cururupu",        situacao: "atencao",    mapX: 36.5, mapY: 17.5 },
  { id: "HRO-TUT", nome: "Tutóia",          municipio: "Tutóia",          situacao: "preservado", mapX: 62.0, mapY: 23.0 },
  // === Baixada / vale do Itapecuru ===
  { id: "HRO-PNH", nome: "Pinheiro",        municipio: "Pinheiro",        situacao: "atencao",    mapX: 38.5, mapY: 22.0 },
  { id: "HRO-ROS", nome: "Rosário",         municipio: "Rosário",         situacao: "preservado", mapX: 53.0, mapY: 26.0 },
  { id: "HRO-ITP", nome: "Itapecuru-Mirim", municipio: "Itapecuru-Mirim", situacao: "atencao",    mapX: 51.0, mapY: 29.0 },
  // === Centro-leste ===
  { id: "HRO-BCB", nome: "Bacabal",         municipio: "Bacabal",         situacao: "preservado", mapX: 44.0, mapY: 33.5 },
  { id: "HRO-COD", nome: "Codó",            municipio: "Codó",            situacao: "atencao",    mapX: 54.5, mapY: 33.5 },
  { id: "HRO-CXS", nome: "Caxias",          municipio: "Caxias",          situacao: "restaurado", mapX: 59.0, mapY: 38.5 },
  { id: "HRO-TMN", nome: "Timon",           municipio: "Timon",           situacao: "semvist",    mapX: 63.0, mapY: 41.0 },
  { id: "HRO-PDT", nome: "Presidente Dutra",municipio: "Presidente Dutra",situacao: "atencao",    mapX: 51.0, mapY: 45.0 },
  // === Sertão central / Barra ===
  { id: "HRO-BCR", nome: "Barra do Corda",  municipio: "Barra do Corda",  situacao: "risco",      mapX: 43.0, mapY: 46.5 },
  // === Oeste ===
  { id: "HRO-ACL", nome: "Açailândia",      municipio: "Açailândia",      situacao: "preservado", mapX: 30.0, mapY: 53.0 },
  { id: "HRO-IMP", nome: "Imperatriz",      municipio: "Imperatriz",      situacao: "preservado", mapX: 30.5, mapY: 59.0 },
  // === Sul / cerrado ===
  { id: "HRO-BAL", nome: "Balsas",          municipio: "Balsas",          situacao: "risco",      mapX: 44.0, mapY: 62.0 },
  { id: "HRO-RCH", nome: "Riachão",         municipio: "Riachão",         situacao: "restaurado", mapX: 34.5, mapY: 76.0 },
  { id: "HRO-CRL", nome: "Carolina",        municipio: "Carolina",        situacao: "atencao",    mapX: 35.0, mapY: 80.0 },
];

/* Mini pin medallion for hero legend cards */
function PinMiniIcon({ situacao, size = 36 }) {
  const c = PIN_COLORS[situacao] || "#2A2418";
  const p = PIN_PARCHMENT;
  return (
    <svg width={size} height={size} viewBox="-2 -2 4 4" style={{ flexShrink: 0 }}>
      <circle cx="0" cy="0" r="1.70" fill={p} stroke={c} strokeWidth="0.22"/>
      <circle cx="0" cy="0" r="1.42" fill="none" stroke={c} strokeWidth="0.08" opacity="0.55"/>
      {situacao === "preservado" && (
        <g fill={c} stroke={c} strokeWidth="0.10" strokeLinejoin="round">
          <line x1="0" y1="-1.15" x2="0" y2="-0.60" strokeWidth="0.14" strokeLinecap="round"/>
          <line x1="-0.18" y1="-0.92" x2="0.18" y2="-0.92" strokeWidth="0.14" strokeLinecap="round"/>
          <path d="M -0.72,-0.55 L 0,-0.92 L 0.72,-0.55 Z"/>
          <rect x="-0.72" y="-0.55" width="1.44" height="1.05"/>
          <path d="M -0.20,0.50 L -0.20,0.10 A 0.20,0.20 0 0 1 0.20,0.10 L 0.20,0.50 Z" fill={p} stroke={c} strokeWidth="0.08"/>
        </g>
      )}
      {situacao === "atencao" && (
        <g fill={c} stroke={c} strokeWidth="0.10" strokeLinejoin="round">
          <path d="M -0.95,-0.20 L 0,-0.85 L 0.95,-0.20 L 0.78,-0.20 L 0.78,-0.05 L -0.78,-0.05 L -0.78,-0.20 Z"/>
          <rect x="-0.78" y="-0.05" width="1.56" height="0.78"/>
          <rect x="-0.50" y="0.05" width="0.22" height="0.30" fill={p} stroke={c} strokeWidth="0.07"/>
          <rect x="0.28" y="0.05" width="0.22" height="0.30" fill={p} stroke={c} strokeWidth="0.07"/>
          <rect x="-0.13" y="0.30" width="0.26" height="0.43" fill={p} stroke={c} strokeWidth="0.07"/>
        </g>
      )}
      {situacao === "risco" && (
        <g stroke={c} strokeWidth="0.16" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d="M -0.85,0.62 L -0.85,-0.20 A 0.45,0.45 0 0 1 -0.40,-0.65"/>
          <path d="M 0.85,0.62 L 0.85,0.05"/>
          <path d="M 0.85,0.05 L 0.55,-0.40" strokeDasharray="0.16 0.14" strokeWidth="0.14"/>
          <rect x="-1.05" y="0.55" width="2.10" height="0.22" fill={c} stroke={c} strokeWidth="0.05"/>
          <line x1="-0.30" y1="0.20" x2="-0.05" y2="0.30" strokeWidth="0.09"/>
          <line x1="0.18" y1="0.38" x2="0.42" y2="0.50" strokeWidth="0.09"/>
        </g>
      )}
      {situacao === "restaurado" && (
        <g fill={c} stroke={c} strokeWidth="0.08" strokeLinejoin="round">
          <path d="M -0.90,0.45 L -0.90,-0.10 L -0.45,0.18 L 0,-0.75 L 0.45,0.18 L 0.90,-0.10 L 0.90,0.45 Z"/>
          <line x1="-0.95" y1="0.45" x2="0.95" y2="0.45" strokeWidth="0.25" strokeLinecap="round"/>
          <circle cx="-0.90" cy="-0.18" r="0.11" fill={c}/>
          <circle cx="0" cy="-0.82" r="0.13" fill={c}/>
          <circle cx="0.90" cy="-0.18" r="0.11" fill={c}/>
        </g>
      )}
      {situacao === "semvist" && (
        <g stroke={c} strokeWidth="0.12" fill={p} strokeLinejoin="round" strokeLinecap="round">
          <path d="M -0.78,-0.62 L 0.78,-0.62 Q 0.94,-0.40 0.78,-0.18 L -0.78,-0.18 Q -0.94,-0.40 -0.78,-0.62 Z"/>
          <line x1="-0.78" y1="-0.40" x2="0.78" y2="-0.40" strokeWidth="0.07" opacity="0.7"/>
          <path d="M -0.78,-0.18 L 0.78,-0.18 L 0.78,0.50 Q 0.94,0.72 0.78,0.86 L -0.78,0.86 Q -0.94,0.72 -0.78,0.50 Z"/>
          <line x1="-0.45" y1="0.08" x2="0.45" y2="0.08" strokeWidth="0.07"/>
          <line x1="-0.45" y1="0.30" x2="0.30" y2="0.30" strokeWidth="0.07"/>
        </g>
      )}
    </svg>
  );
}

const HERO_LEGEND = [
  { situacao: "preservado", label: "Preservado", desc: "Bem tombado em bom estado de conservação" },
  { situacao: "atencao",    label: "Em atenção",  desc: "Requer acompanhamento ou intervenção técnica" },
  { situacao: "risco",      label: "Em risco",    desc: "Situação estrutural crítica — risco de perda" },
];

const HERO_PIN_FALLBACKS = {
  preservado: {
    tipo: "Conjunto protegido",
    img: () => window.IMG.slz_centro,
    resumo: "Ponto de referência do acervo com bens preservados e registros públicos vinculados ao território.",
  },
  atencao: {
    tipo: "Monitoramento técnico",
    img: () => window.IMG.slz_nazare,
    resumo: "Área com bens que exigem acompanhamento, vistorias periódicas ou planejamento de conservação.",
  },
  risco: {
    tipo: "Prioridade de risco",
    img: () => window.IMG.alc_ruinas,
    resumo: "Registro territorial com indicação de risco, perda material ou necessidade de ação preventiva.",
  },
  restaurado: {
    tipo: "Bem restaurado",
    img: () => window.IMG.alc_museu_ma,
    resumo: "Ponto associado a bens recuperados, obras concluídas ou acervos com intervenção recente.",
  },
  semvist: {
    tipo: "Vistoria pendente",
    img: () => window.IMG.alc_museu_fach,
    resumo: "Localidade com registros ainda sem vistoria recente consolidada na base pública.",
  },
};

function buildHeroPinPreview(pin) {
  const source = (window.IMOVEIS || []).find(im => im.municipio === pin.municipio && im.situacao === pin.situacao)
    || (window.IMOVEIS || []).find(im => im.municipio === pin.municipio);
  const fallback = HERO_PIN_FALLBACKS[pin.situacao] || HERO_PIN_FALLBACKS.preservado;
  return {
    id: pin.id,
    nome: source?.nome || pin.nome,
    municipio: pin.municipio,
    situacao: pin.situacao,
    tipo: source?.tipo || fallback.tipo,
    bairro: source?.bairro || "Referência territorial",
    img: source?.img || pin.nome,
    imgUrl: source?.imgUrl || fallback.img(),
    resumo: source?.resumo || fallback.resumo,
    esfera: source?.esfera || "Acervo SIP-MA",
    vistoria: source?.vistoria || "Prévia pública",
    publico: source?.publico,
    tipologia: source?.tipologia,
    construcao: source?.construcao,
    orgao: source?.orgao,
    judicial: source?.judicial,
    source,
  };
}

function HeroMapStats({ className = "" }) {
  return (
    <div className={`home-hero-stats ${className}`.trim()}>
      {[["94", "municípios", false], ["212", "tombados", false], ["47", "em risco", true]].map(([v, k, risk], i) => (
        <div key={i} style={{ textAlign: "right" }}>
          <div className="hero-emphasis" style={{ fontSize: 50, lineHeight: 0.9, color: risk ? "var(--clay-soft)" : "var(--gold-soft)" }}>{v}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.18em", color: risk ? "var(--clay-soft)" : "#E8D9AF", textTransform: "uppercase", marginTop: 8 }}>{k}</div>
        </div>
      ))}
    </div>
  );
}

function HeroMapLegend({ className = "" }) {
  return (
    <div className={`home-hero-legend ${className}`.trim()}>
      <div className="between home-hero-legend-head">
        <span className="caps">Legenda</span>
      </div>
      {Object.entries(STATUS_META).map(([k, v]) => (
        <div key={k} className="home-hero-legend-row">
          <PinMiniIcon situacao={k} size={24}/>
          <span>{v.label}</span>
        </div>
      ))}
    </div>
  );
}

function HeroMapShowcase({
  go,
  className = "",
  pins = HERO_PINS,
  interactive = false,
  showMapLabels = true,
  showCities = true,
}) {
  const [hoveredHeroPin, setHoveredHeroPin] = useState(null);

  return (
    <div className={`home-hero-map ${className}`.trim()}>
      <div className="home-hero-map-stage">
        <MapBase
          bare
          interactive={interactive}
          showChrome={interactive}
          showCompass={false}
          showScale={false}
          hideAttrib
          showNeighbors={false}
          showLabels={showMapLabels}
          showCities={showCities}
        >
          {pins.map(it => (
            <MapPin
              key={it.id}
              item={it}
              active={hoveredHeroPin?.id === it.id}
              onClick={(e) => {
                e.stopPropagation();
                const preview = buildHeroPinPreview(it);
                preview.source ? go("ficha", preview.source) : go("map");
              }}
              onMouseEnter={() => setHoveredHeroPin(buildHeroPinPreview(it))}
              onMouseLeave={() => setHoveredHeroPin(null)}
              onFocus={() => setHoveredHeroPin(buildHeroPinPreview(it))}
              onBlur={() => setHoveredHeroPin(null)}
              size={1.08}
            />
          ))}
        </MapBase>
      </div>
      {hoveredHeroPin && (
        <div className="home-pin-preview fade-in">
          <div className={`home-pin-preview-photo ${hoveredHeroPin.imgUrl ? "has-photo" : ""}`} data-label={hoveredHeroPin.img}>
            {hoveredHeroPin.imgUrl && <img src={hoveredHeroPin.imgUrl} alt={hoveredHeroPin.nome} loading="lazy"/>}
          </div>
          <div className="home-pin-preview-body">
            <div className="home-pin-preview-badges">
              <StatusBadge status={hoveredHeroPin.situacao}/>
              <span className="badge"><span className="dot"/>{hoveredHeroPin.tipo}</span>
            </div>
            <h3 className="display">{hoveredHeroPin.nome}</h3>
            <div className="home-pin-preview-place">
              <Icon name="pin" size={12}/>{hoveredHeroPin.municipio} · {hoveredHeroPin.bairro}
            </div>
            <p>{hoveredHeroPin.resumo}</p>
            <div className="home-pin-preview-meta">
              <span>{hoveredHeroPin.esfera}</span>
              <span>{hoveredHeroPin.vistoria}</span>
            </div>
          </div>
        </div>
      )}
      <HeroMapStats/>
    </div>
  );
}

/* ---------- HOME ---------- */
function HomeScreen({ go }) {
  const cats = [
    { k: "Casarões", n: "184", desc: "Residências históricas urbanas", img: "Casarão azulejado · Praia Grande", code: "CAS", imgUrl: window.IMG.slz_afonso_pena },
    { k: "Sobrados", n: "97", desc: "Edificações de dois ou mais pavimentos", img: "Sobrado eclético · Desterro", code: "SOB", imgUrl: window.IMG.slz_nazare },
    { k: "Sítios Arqueológicos", n: "62", desc: "Vestígios pré-coloniais e históricos", img: "Ruínas de São Matias · Alcântara", code: "ARQ", imgUrl: window.IMG.alc_sao_matias },
    { k: "Patrimônio Imaterial", n: "38", desc: "Manifestações, saberes e festas", img: "Tambor de Crioula · São Luís", code: "IMA", imgUrl: window.IMG.tc_feirinha },
    { k: "Imóveis em Risco", n: "47", desc: "Bens com risco estrutural elevado", img: "Ruínas de Alcântara", code: "RIS", imgUrl: window.IMG.alc_ruinas },
    { k: "Bens Tombados", n: "212", desc: "Protegidos por IPHAN ou municípios", img: "Museu Casa Histórica · Alcântara", code: "TOM", imgUrl: window.IMG.alc_museu_ma },
  ];

  return (
    <div>
      {/* HERO — split layout: copy + live map preview. Fits within the
          initial viewport with room for the header and the next strip. */}
      <section className="home-hero">
        {/* Background photo — Casarões de São Luís, blurred */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-40px",
            backgroundImage: "url('assets/hero-casaroes.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "blur(28px) saturate(1.05) brightness(0.85)",
            transform: "scale(1.06)",
          }}
        />
        {/* Light wash for legibility — slight darkening so the cream type
            holds against the blurred photo. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,19,20,0.30) 0%, rgba(15,19,20,0.42) 100%)",
          }}
        />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1 className="display home-hero-title">
              Um sistema integrado para<br/>
              <em className="hero-emphasis">mapear, consultar e gerir</em><br/>
              o patrimônio do Maranhão.
            </h1>
            <p className="home-hero-lead">
              Acervo público georreferenciado de casarões históricos, sítios arqueológicos e manifestações culturais distribuídos pelos 217 municípios do estado.
            </p>
            <div className="home-hero-actions">
              <button className="btn lg gold" onClick={() => go("map")}>
                Explorar mapa <Icon name="arrow" size={14}/>
              </button>
              <button className="btn lg outline-hero" onClick={() => go("acervo")} style={{ borderColor: "rgba(236,230,212,0.40)", color: "#ECE6D4" }}>
                Consultar acervo
              </button>
            </div>
            <div className="home-hero-partners">
              {[
                ["IPHAN-MA", "Cooperação técnica"],
                ["Gov. Maranhão", "Coordenação institucional"],
                ["UFMA", "Parceria acadêmica"],
              ].map(([l, s], i) => (
                <div key={i}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gold)", letterSpacing: "0.08em" }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: "#B5AE97", marginTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          <HeroMapShowcase go={go}/>
        </div>
        <HeroMapLegend/>
      </section>

      {/* INDICATOR STRIP */}
      <section style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
            {[
              ["Imóveis cadastrados", "1.284", "+12 últimos 30d"],
              ["Municípios contemplados", "94 / 217", "43% do estado"],
              ["Bens tombados", "212", "16,5% do acervo"],
              ["Imóveis em risco", "47", "3 críticos", true],
              ["Sítios arqueológicos", "62", "12 restritos"],
            ].map(([k, v, d, risk], i) => (
              <div key={i} style={{ padding: "26px 24px", borderRight: i < 4 ? "1px solid var(--line-soft)" : 0 }}>
                <div className="caps">{k}</div>
                <div className="display" style={{ fontSize: 36, marginTop: 6, color: risk ? "var(--clay)" : "var(--ink)" }}>{v}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 4, letterSpacing: "0.04em" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTIVO */}
      <section>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "80px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.6fr", gap: 80 }}>
            <div>
              <div className="caps">§ 01 — Objetivo</div>
              <h2 className="display" style={{ fontSize: 44, margin: "14px 0 0", lineHeight: 1.1 }}>Integrar o que existe disperso.</h2>
            </div>
            <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--ink-2)" }}>
              <p style={{ marginTop: 0 }}>
                Por décadas, o patrimônio cultural maranhense foi documentado em arquivos físicos, planilhas isoladas, processos administrativos e acervos institucionais que raramente conversam entre si. O <strong>Acervo Patrimonial do Maranhão</strong> reúne essas fontes em uma plataforma única, georreferenciada e auditável.
              </p>
              <p>
                O sistema é mantido pela <strong>Secretaria de Estado da Cultura</strong> em cooperação com o IPHAN-MA, universidades e municípios. A consulta é pública e gratuita; a gestão é realizada por técnicos credenciados.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 32, paddingTop: 28, borderTop: "1px solid var(--line-soft)" }}>
                {[
                  ["Consulta pública", "Mapa e fichas técnicas abertos a qualquer cidadão.", "01"],
                  ["Gestão técnica", "Cadastro, vistoria e acompanhamento por equipes credenciadas.", "02"],
                  ["Dados auditáveis", "Histórico de alterações, fontes documentais e referências cruzadas.", "03"],
                ].map(([t, d, n], i) => (
                  <div key={i} className="card" style={{ padding: 20 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--gold)", marginBottom: 8 }}>§ {n}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 6, lineHeight: 1.15 }}>{t}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{ background: "var(--paper-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "80px 32px" }}>
          <div className="between" style={{ alignItems: "end", marginBottom: 36 }}>
            <div>
              <div className="caps">§ 02 — Categorias do acervo</div>
              <h2 className="display" style={{ fontSize: 44, margin: "12px 0 0", lineHeight: 1.1 }}>O que está catalogado.</h2>
            </div>
            <button className="btn" onClick={() => go("acervo")}>
              Ver todos os bens <Icon name="arrow" size={13}/>
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {cats.map((c, i) => (
              <div key={i} className="card hover cat-card" onClick={() => go("acervo")} style={{ overflow: "hidden", padding: 0, border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#1a1a1a", borderBottom: "1px solid var(--line)" }}>
                  <img src={c.imgUrl} alt={c.k} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
                </div>
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                    <span>{c.code}</span>
                    <span>{c.n} bens</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div className="display" style={{ fontSize: 28, lineHeight: 1.1, color: "var(--ink)" }}>{c.k}</div>
                    <Icon name="arrow" size={16} style={{ color: "var(--ink-2)", flex: "none" }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP CTA */}
      <section>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "80px 32px", display: "grid", gridTemplateColumns: "1fr 1.2fr", alignItems: "stretch", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="caps">§ 03 — Mapa interativo</div>
            <h2 className="display" style={{ fontSize: 50, margin: "14px 0 18px", lineHeight: 1.05 }}>Navegue pelo território.</h2>
            <p style={{ fontSize: 15.5, color: "var(--ink-2)", lineHeight: 1.7, maxWidth: 480 }}>
              Visualize todos os bens georreferenciados sobre o mapa do Maranhão. Filtre por município, tipologia, situação de conservação ou esfera de tombamento. Clique em qualquer marcador para abrir a ficha técnica.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button className="btn primary lg" onClick={() => go("map")}>
                Abrir mapa <Icon name="arrow" size={14}/>
              </button>
            </div>
            <div style={{ marginTop: 36, padding: 16, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--radius)", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 10, background: `var(--st-${k})` }}/>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", lineHeight: 1.3 }}>{v.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow-md)", aspectRatio: "5/4" }}>
            <MapBase bare showChrome={false} showNeighbors={false}>
              {HERO_PINS.map(it => <MapPin key={it.id} item={it}/>)}
            </MapBase>
          </div>
        </div>
      </section>

      {/* DESTAQUE */}
      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "80px 32px" }}>
          <div className="caps" style={{ marginBottom: 14 }}>§ 04 — Destaque do acervo</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "stretch" }}>
            <div className="ph-img has-photo" style={{ aspectRatio: "4/3", borderRadius: "var(--radius)" }} data-label="Casarão Colonial da Praia Grande · Centro Histórico de São Luís">
              <img className="ph-photo" src={window.IMG.slz_afonso_pena} alt="Casarão Colonial da Praia Grande" loading="lazy"/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                <StatusBadge status="preservado"/>
                <span className="badge tombado"><span className="dot"/>Tombado · IPHAN</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--ink-3)" }}>APM-0142 · São Luís — Praia Grande</div>
              <h3 className="display" style={{ fontSize: 46, margin: "8px 0 16px", lineHeight: 1.05 }}>Casarão Colonial da Praia Grande</h3>
              <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7 }}>
                Edificação representativa do ciclo do algodão maranhense, ergueu-se entre 1815 e 1822 nas proximidades do antigo porto da Praia Grande. Cinco janelas em arco abatido por pavimento, revestimento integral em azulejos portugueses biscoito.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button className="btn primary" onClick={() => go("ficha", IMOVEIS[0])}>
                  Consultar ficha <Icon name="arrow" size={13}/>
                </button>
                <button className="btn ghost">
                  Ver no mapa
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- MAP SCREEN ---------- */
function MapScreen({ go }) {
  const statusKeys = Object.keys(STATUS_META);
  const [visibleStatuses, setVisibleStatuses] = useState(statusKeys);
  const [layers, setLayers] = useState({ labels: true, cities: true });
  const visiblePins = useMemo(
    () => HERO_PINS.filter(pin => visibleStatuses.includes(pin.situacao)),
    [visibleStatuses]
  );

  const toggleStatus = (key) => {
    setVisibleStatuses(current => {
      if (current.includes(key)) return current.filter(k => k !== key);
      return [...current, key];
    });
  };

  return (
    <section className="map-page-hero">
      <div className="map-filter-panel">
        <div className="map-scope-toggle" role="tablist" aria-label="Escala do mapa">
          <button className="active" role="tab" aria-selected="true">Maranhão</button>
          <button role="tab" aria-selected="false" onClick={() => go("saoluis")}>
            São Luís
          </button>
        </div>
        <div className="map-filter-head">
          <span className="caps">Filtros do mapa</span>
          <button className="btn ghost sm" onClick={() => setVisibleStatuses(statusKeys)}>
            Todos
          </button>
        </div>
        <div className="map-filter-list">
          {statusKeys.map(key => (
            <button
              key={key}
              className={`map-filter-row ${visibleStatuses.includes(key) ? "active" : ""}`}
              onClick={() => toggleStatus(key)}
            >
              <PinMiniIcon situacao={key} size={24}/>
              <span>{STATUS_META[key].label}</span>
              <Icon name={visibleStatuses.includes(key) ? "eye" : "x"} size={13}/>
            </button>
          ))}
        </div>
        <div className="map-filter-layers">
          <label>
            <input
              type="checkbox"
              checked={layers.labels}
              onChange={e => setLayers(l => ({ ...l, labels: e.target.checked }))}
            />
            <span>Nomes no mapa</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={layers.cities}
              onChange={e => setLayers(l => ({ ...l, cities: e.target.checked }))}
            />
            <span>Referências municipais</span>
          </label>
        </div>
      </div>
      <HeroMapShowcase
        go={go}
        className="map-page-map"
        pins={visiblePins}
        interactive
        showMapLabels={layers.labels}
        showCities={layers.cities}
      />
      <HeroMapLegend className="map-page-legend"/>
    </section>
  );
}

function LegacyMapScreen({ go }) {
  const [selected, setSelected] = useState(null);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [filters, setFilters] = useState({
    municipio: "Todos", tipo: "Todos", situacao: "Todos", esfera: "Todos",
    publico: "Todos", risco: false, judicial: false, periodo: "Todos",
    natureza: ["material"],
  });
  const [quickStatus, setQuickStatus] = useState(null);
  const [layerOpen, setLayerOpen] = useState(false);
  const [layers, setLayers] = useState({ base: "Cartografia", limites: true, satelite: false, hidrografia: true });

  const filtered = useMemo(() => IMOVEIS.filter(im => {
    if (filters.municipio !== "Todos" && im.municipio !== filters.municipio) return false;
    if (filters.tipo !== "Todos" && im.tipo !== filters.tipo) return false;
    if (quickStatus && im.situacao !== quickStatus) return false;
    if (filters.situacao !== "Todos" && im.situacao !== filters.situacao) return false;
    if (filters.publico !== "Todos" && im.publico !== filters.publico) return false;
    if (filters.risco && !["risco", "atencao"].includes(im.situacao)) return false;
    if (filters.judicial && !im.judicial) return false;
    return true;
  }), [filters, quickStatus]);

  const mapPins = HERO_PINS;
  const activeCount = mapPins.length;
  const statusCounts = useMemo(() => {
    const counts = {};
    Object.keys(STATUS_META).forEach(k => counts[k] = 0);
    HERO_PINS.forEach(pin => counts[pin.situacao] = (counts[pin.situacao] || 0) + 1);
    return counts;
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: "calc(100vh - 109px)" }}>
      {/* SIDEBAR */}
      <aside style={{ background: "var(--paper)", borderRight: "1px solid var(--line)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--line)" }}>
          <div className="between">
            <div className="caps">Mapa interativo</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gold)", letterSpacing: "0.06em" }}>
              {activeCount}/{HERO_PINS.length}
            </span>
          </div>
          <div className="display" style={{ fontSize: 22, marginTop: 4, lineHeight: 1.15 }}>Filtros do acervo</div>
        </div>

        <div style={{ padding: "14px 20px 0" }}>
          <div className="search" style={{ marginBottom: 16 }}>
            <Icon name="search" size={14} style={{ color: "var(--ink-3)" }}/>
            <input placeholder="Buscar nome, ID, município..."/>
          </div>
        </div>

        {/* Quick status filter row */}
        <div style={{ padding: "0 20px 14px", borderBottom: "1px solid var(--line-soft)" }}>
          <div className="caps" style={{ marginBottom: 10 }}>Situação</div>
          <div style={{ display: "grid", gap: 3 }}>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <button key={k} onClick={() => setQuickStatus(quickStatus === k ? null : k)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "7px 10px",
                  background: quickStatus === k ? "var(--paper-2)" : "transparent",
                  border: "1px solid " + (quickStatus === k ? "var(--line-2)" : "transparent"),
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13, color: "var(--ink-2)",
                  cursor: "pointer",
                  transition: "background var(--t)",
                  textAlign: "left",
                }}>
                <span style={{ width: 9, height: 9, borderRadius: 9, background: `var(--st-${k})`, flexShrink: 0 }}/>
                <span style={{ flex: 1 }}>{v.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{statusCounts[k]}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 20px" }}>
          <FilterGroup title="Natureza do patrimônio">
            {["material", "imaterial", "arqueologico"].map(k => (
              <Check key={k} label={k === "material" ? "Material edificado" : k === "imaterial" ? "Imaterial" : "Arqueológico"}
                checked={filters.natureza.includes(k)}
                onChange={v => setFilters(f => ({ ...f, natureza: v ? [...f.natureza, k] : f.natureza.filter(x => x !== k) }))}/>
            ))}
          </FilterGroup>

          <FilterGroup title="Município">
            <select className="select" value={filters.municipio} onChange={e => setFilters(f => ({ ...f, municipio: e.target.value }))}>
              <option>Todos</option>
              {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
            </select>
          </FilterGroup>

          <FilterGroup title="Tipo de imóvel">
            <select className="select" value={filters.tipo} onChange={e => setFilters(f => ({ ...f, tipo: e.target.value }))}>
              <option>Todos</option>
              <option>Casarão</option><option>Sobrado</option><option>Solar</option>
              <option>Casa térrea</option><option>Edifício religioso</option>
              <option>Edifício público</option><option>Conjunto rural</option>
            </select>
          </FilterGroup>

          <FilterGroup title="Tipologia arquitetônica" open={false}>
            <select className="select" defaultValue="Todas">
              <option>Todas</option>
              <option>Sobrado luso-brasileiro azulejado</option>
              <option>Sobrado eclético</option>
              <option>Solar setecentista</option>
              <option>Casa térrea oitocentista</option>
              <option>Câmara colonial</option>
            </select>
          </FilterGroup>

          <FilterGroup title="Esfera de tombamento" open={false}>
            <select className="select" value={filters.esfera} onChange={e => setFilters(f => ({ ...f, esfera: e.target.value }))}>
              <option>Todos</option><option>Federal</option><option>Estadual</option>
              <option>Municipal</option><option>Federal e estadual</option><option>Em processo</option>
            </select>
          </FilterGroup>

          <FilterGroup title="Período histórico" open={false}>
            <select className="select" value={filters.periodo} onChange={e => setFilters(f => ({ ...f, periodo: e.target.value }))}>
              <option>Todos</option><option>Séc. XVII</option><option>Séc. XVIII — Colônia</option>
              <option>Séc. XIX — Império</option><option>Séc. XX</option>
            </select>
          </FilterGroup>

          <FilterGroup title="Domínio">
            <Radio name="publico" value={filters.publico} onChange={v => setFilters(f => ({ ...f, publico: v }))}
              options={["Todos", "Público", "Privado"]}/>
          </FilterGroup>

          <FilterGroup title="Outras condições">
            <Check label="Apenas em risco ou atenção" checked={filters.risco} onChange={v => setFilters(f => ({ ...f, risco: v }))}/>
            <Check label="Com ação judicial em curso" checked={filters.judicial} onChange={v => setFilters(f => ({ ...f, judicial: v }))}/>
            <Check label="Vistoria pendente ou vencida" checked={false} onChange={() => {}}/>
          </FilterGroup>
        </div>

        <div style={{ marginTop: "auto", padding: "12px 18px", borderTop: "1px solid var(--line)", display: "flex", gap: 8, background: "var(--paper-2)" }}>
          <button className="btn ghost sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setQuickStatus(null); setFilters({ municipio: "Todos", tipo: "Todos", situacao: "Todos", esfera: "Todos", publico: "Todos", risco: false, judicial: false, periodo: "Todos", natureza: ["material"] }); }}>
            <Icon name="x" size={12}/>Limpar
          </button>
          <button className="btn primary sm" style={{ flex: 1, justifyContent: "center" }}>
            <Icon name="check" size={12}/>Aplicar
          </button>
        </div>
      </aside>

      {/* MAP */}
      <div className="map-screen-canvas">
        <div className="map-screen-stage">
        <MapBase bare showChrome={false} showNeighbors={false}>
          {mapPins.map(it => (
            <MapPin
              key={it.id}
              item={it}
              active={selectedPinId === it.id}
              onClick={() => {
                const preview = buildHeroPinPreview(it);
                setSelectedPinId(it.id);
                setSelected(preview);
              }}
              size={1.08}
            />
          ))}
        </MapBase>
        </div>
        <div className="home-hero-legend map-screen-legend">
          <div className="between home-hero-legend-head">
            <span className="caps">Legenda</span>
          </div>
          {Object.entries(STATUS_META).map(([k, v]) => (
            <div key={k} className="home-hero-legend-row">
              <PinMiniIcon situacao={k} size={24}/>
              <span>{v.label}</span>
            </div>
          ))}
        </div>
        <div className="home-hero-stats map-screen-stats">
          {[["94", "municípios", false], ["212", "tombados", false], ["47", "em risco", true]].map(([v, k, risk], i) => (
            <div key={i} style={{ textAlign: "right" }}>
              <div className="hero-emphasis" style={{ fontSize: 50, lineHeight: 0.9, color: risk ? "var(--clay-soft)" : "var(--gold-soft)" }}>{v}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.18em", color: risk ? "var(--clay-soft)" : "#E8D9AF", textTransform: "uppercase", marginTop: 8 }}>{k}</div>
            </div>
          ))}
        </div>

        {/* TOP LEFT — legend */}
        <div className="gis-panel" style={{ position: "absolute", top: 14, left: 14, padding: "12px 14px", minWidth: 240 }}>
          <div className="between" style={{ marginBottom: 10 }}>
            <span className="caps">Legenda</span>
          </div>
          {Object.entries(STATUS_META).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: 12, color: "var(--ink-2)" }}>
              <PinMiniIcon situacao={k} size={24}/>
              <span style={{ flex: 1 }}>{v.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)" }}>{statusCounts[k]}</span>
            </div>
          ))}
        </div>

        {/* TOP RIGHT — layer & export */}
        <div className="map-screen-toolbar" style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 8 }}>
          <button className="btn sm" style={{ background: "rgba(251,248,240,0.92)", backdropFilter: "blur(8px)" }} onClick={() => setLayerOpen(!layerOpen)}>
            <Icon name="layers" size={13}/>Camadas
          </button>
          <button className="btn sm" style={{ background: "rgba(251,248,240,0.92)", backdropFilter: "blur(8px)" }}>
            <Icon name="down2" size={13}/>Exportar
          </button>
        </div>

        {/* LAYER PANEL */}
        {layerOpen && (
          <div className="gis-panel slide-in" style={{ position: "absolute", top: 60, right: 14, width: 260, padding: 16 }}>
            <div className="between" style={{ marginBottom: 12 }}>
              <span className="caps">Camadas do mapa</span>
              <button className="icon-btn" style={{ width: 24, height: 24, border: 0, boxShadow: "none" }} onClick={() => setLayerOpen(false)}><Icon name="x" size={11}/></button>
            </div>
            <div className="caps" style={{ marginBottom: 8, fontSize: 9.5 }}>Cartografia base</div>
            <Radio name="base" value={layers.base} onChange={v => setLayers(l => ({ ...l, base: v }))} options={["Cartografia", "Satélite", "Topográfico"]}/>
            <div className="caps" style={{ marginTop: 14, marginBottom: 8, fontSize: 9.5 }}>Sobreposições</div>
            <Check label="Limites municipais" checked={layers.limites} onChange={v => setLayers(l => ({ ...l, limites: v }))}/>
            <Check label="Hidrografia" checked={layers.hidrografia} onChange={v => setLayers(l => ({ ...l, hidrografia: v }))}/>
            <Check label="Áreas de proteção" checked={false} onChange={() => {}}/>
            <Check label="Centros históricos" checked={true} onChange={() => {}}/>
          </div>
        )}

        {/* BOTTOM LEFT — coords readout */}
        <div className="gis-panel" style={{ position: "absolute", bottom: 14, left: 14, padding: "8px 14px", display: "flex", gap: 14, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.04em" }}>
          <span><span style={{ color: "var(--ink-3)" }}>LAT</span> {selected?.latitude != null ? selected.latitude.toFixed(4) : "—"}</span>
          <span style={{ width: 1, height: 10, background: "var(--line-2)" }}/>
          <span><span style={{ color: "var(--ink-3)" }}>LON</span> {selected?.longitude != null ? selected.longitude.toFixed(4) : "—"}</span>
          <span style={{ width: 1, height: 10, background: "var(--line-2)" }}/>
          <span><span style={{ color: "var(--ink-3)" }}>MUN</span> {selected?.municipio || "—"}</span>
          <span style={{ width: 1, height: 10, background: "var(--line-2)" }}/>
          <span style={{ color: "var(--ink-3)" }}>SIRGAS 2000</span>
        </div>

        {/* ZOOM CONTROLS — handled by MapBase (interactive) */}

        {/* EMPTY STATE */}
        {mapPins.length === 0 && (
          <div className="map-screen-empty" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", padding: "32px 36px", background: "rgba(251,248,240,0.96)", border: "1px solid var(--line)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)", maxWidth: 340 }}>
            <Icon name="search" size={26} style={{ color: "var(--ink-3)" }}/>
            <div className="display" style={{ fontSize: 22, marginTop: 12, lineHeight: 1.15 }}>Nenhum bem corresponde</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.6 }}>
              Os filtros aplicados excluíram todos os registros. Tente remover algumas condições.
            </div>
            <button className="btn ghost sm" style={{ marginTop: 14 }} onClick={() => { setQuickStatus(null); setFilters(f => ({ ...f, risco: false, judicial: false })); }}>Limpar filtros</button>
          </div>
        )}

        {/* DETAIL PANEL — refined popover */}
        {selected && (
          <div className="map-detail-panel slide-in" style={{ position: "absolute", top: 12, right: 12, bottom: 12, width: 380, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column" }}>
            <button
              onClick={() => { setSelected(null); setSelectedPinId(null); }}
              className="icon-btn"
              title="Fechar preview"
              aria-label="Fechar preview"
              style={{ position: "absolute", top: 10, right: 10, zIndex: 5, background: "rgba(251,248,240,0.96)", borderColor: "rgba(21,25,26,0.18)", backdropFilter: "blur(6px)" }}>
              <Icon name="x" size={13}/>
            </button>
            <div style={{ position: "relative" }}>
              <div className={`ph-img ${selected.imgUrl ? "has-photo" : ""}`} style={{ aspectRatio: "16/10", border: 0, borderRadius: 0 }} data-label={selected.img}>
                {selected.imgUrl && <img className="ph-photo" src={selected.imgUrl} alt={selected.nome} loading="lazy"/>}
              </div>
            </div>
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                <StatusBadge status={selected.situacao}/>
                {selected.esfera && <span className="badge tombado"><span className="dot"/>{selected.esfera}</span>}
                {selected.publico && <span className="badge"><span className="dot"/>{selected.publico}</span>}
              </div>
              <h3 className="display" style={{ fontSize: 26, margin: "0 0 6px", lineHeight: 1.12 }}>{selected.nome}</h3>
              <div style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="pin" size={13} style={{ color: "var(--ink-3)" }}/>{selected.municipio} · {selected.bairro}
              </div>
              <hr className="hr-soft" style={{ margin: "16px 0" }}/>
              <Meta k="Tipo" v={selected.tipo}/>
              {selected.tipologia && <Meta k="Tipologia" v={selected.tipologia}/>}
              {selected.construcao && <Meta k="Construção" v={selected.construcao}/>}
              {selected.orgao && <Meta k="Órgão" v={selected.orgao}/>}
              <Meta k="Última vistoria" v={selected.vistoria}/>
              {selected.judicial && (
                <div style={{ marginTop: 14, padding: "8px 12px", background: "var(--clay-tint)", border: "1px solid rgba(147,67,42,0.3)", borderRadius: "var(--radius-sm)", display: "flex", gap: 8, alignItems: "center", fontSize: 11.5, color: "var(--clay)" }}>
                  <Icon name="gavel" size={12}/>
                  <strong>Ação judicial em curso</strong>
                </div>
              )}
            </div>
            <div style={{ padding: 14, borderTop: "1px solid var(--line)", background: "var(--paper-2)", display: "flex", gap: 8 }}>
              <button className="btn primary sm" style={{ flex: 1, justifyContent: "center" }} disabled={!selected.source} onClick={() => selected.source && go("ficha", selected.source)}>
                Consultar ficha <Icon name="arrow" size={12}/>
              </button>
              <button className="icon-btn" title="Compartilhar"><Icon name="external" size={13}/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function FilterGroup({ title, children, open = true }) {
  const [o, setO] = useState(open);
  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => setO(!o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: 0, padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
        <span className="caps">{title}</span>
        <Icon name={o ? "down" : "chev"} size={12} style={{ color: "var(--ink-3)" }}/>
      </button>
      {o && <div style={{ paddingTop: 10, display: "grid", gap: 6 }}>{children}</div>}
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--ink-2)", cursor: "pointer", padding: "3px 0" }}>
      <span style={{ width: 14, height: 14, border: `1px solid ${checked ? "var(--petroleum)" : "var(--line-2)"}`, background: checked ? "var(--petroleum)" : "var(--paper)", display: "grid", placeItems: "center" }}>
        {checked && <Icon name="check" size={10} stroke={2.5} style={{ color: "#FBF7EC" }}/>}
      </span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: "none" }}/>
      {label}
    </label>
  );
}

function Radio({ name, value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          style={{
            padding: "5px 12px",
            border: "1px solid " + (value === o ? "var(--petroleum)" : "var(--line-2)"),
            background: value === o ? "var(--petroleum)" : "var(--paper)",
            color: value === o ? "#FBF7EC" : "var(--ink-2)",
            fontSize: 12,
          }}>{o}</button>
      ))}
    </div>
  );
}

function Meta({ k, v, mono }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 14, padding: "6px 0", borderBottom: "1px dotted var(--line-soft)" }}>
      <div className="label">{k}</div>
      <div style={{ fontSize: 13.5, color: "var(--ink)", fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{v}</div>
    </div>
  );
}

/* ---------- ACERVO LIST ---------- */
function AcervoScreen({ go }) {
  const [view, setView] = useState("grid");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("nome");

  const list = IMOVEIS.filter(im => !q || im.nome.toLowerCase().includes(q.toLowerCase()) || im.municipio.toLowerCase().includes(q.toLowerCase()) || im.id.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "44px 32px 80px" }}>
      <div className="between" style={{ alignItems: "end", marginBottom: 28 }}>
        <div>
          <div className="caps">Acervo público · {list.length} bens cadastrados</div>
          <h1 className="display" style={{ fontSize: 56, margin: "10px 0 0" }}>Bens materiais edificados</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="caps">Visualizar</div>
          <div style={{ display: "flex", border: "1px solid var(--line-2)" }}>
            <button onClick={() => setView("grid")} className="icon-btn" style={{ border: 0, background: view === "grid" ? "var(--ink)" : "var(--paper)", color: view === "grid" ? "#FBF7EC" : "var(--ink-2)" }}><Icon name="grid" size={14}/></button>
            <button onClick={() => setView("list")} className="icon-btn" style={{ border: 0, borderLeft: "1px solid var(--line-2)", background: view === "list" ? "var(--ink)" : "var(--paper)", color: view === "list" ? "#FBF7EC" : "var(--ink-2)" }}><Icon name="list" size={14}/></button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr auto", gap: 12, marginBottom: 24, alignItems: "end" }}>
        <div className="search">
          <Icon name="search" size={14} style={{ color: "var(--ink-3)" }}/>
          <input placeholder="Buscar por nome, município, ID, endereço ou palavra-chave..." value={q} onChange={e => setQ(e.target.value)}/>
        </div>
        <Select label="Município" options={["Todos", ...MUNICIPIOS]}/>
        <Select label="Tipo" options={["Todos", "Casarão", "Sobrado", "Solar", "Casa térrea", "Edifício religioso", "Conjunto rural"]}/>
        <Select label="Situação" options={["Todas", "Preservado", "Em atenção", "Em risco", "Restaurado", "Sem vistoria"]}/>
        <Select label="Ordenar por" value={sort} onChange={setSort} options={[["nome","Nome"], ["municipio","Município"], ["situacao","Situação"], ["data","Última atualização"], ["risco","Risco"]]}/>
        <button className="btn"><Icon name="filter" size={14}/> Mais filtros</button>
      </div>

      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
          {list.map(im => (
            <div key={im.id} className="card" style={{ border: 0, background: "var(--paper)", cursor: "pointer" }} onClick={() => go("ficha", im)}>
              <div className={`ph-img ${im.imgUrl ? "has-photo" : ""}`} style={{ aspectRatio: "4/3", border: 0, borderBottom: "1px solid var(--line)" }} data-label={im.img}>
                {im.imgUrl && <img className="ph-photo" src={im.imgUrl} alt={im.nome} loading="lazy"/>}
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  <StatusBadge status={im.situacao}/>
                  {im.judicial && <span className="badge"><Icon name="gavel" size={10}/>Ação judicial</span>}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", color: "var(--ink-3)" }}>
                  {im.id} · {im.tipo.toUpperCase()}
                </div>
                <div className="display" style={{ fontSize: 24, margin: "4px 0 8px", lineHeight: 1.1 }}>{im.nome}</div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="pin" size={12} style={{ color: "var(--ink-3)" }}/>{im.municipio}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px dotted var(--line-soft)" }}>
                  <div>
                    <div className="label">Tombamento</div>
                    <div style={{ fontSize: 12.5, marginTop: 2 }}>{im.esfera === "—" ? "—" : im.esfera}</div>
                  </div>
                  <div>
                    <div className="label">Risco</div>
                    <div style={{ fontSize: 12.5, marginTop: 2 }}>{im.risco}</div>
                  </div>
                  <div style={{ display: "grid", placeItems: "center" }}>
                    <Icon name="arrow" size={16} style={{ color: "var(--ink-2)" }}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr>
              <th>Imóvel</th><th>Município</th><th>Tipo</th><th>Situação</th><th>Tombamento</th><th>Risco</th><th></th>
            </tr></thead>
            <tbody>
              {list.map(im => (
                <tr key={im.id} onClick={() => go("ficha", im)} style={{ cursor: "pointer" }}>
                  <td style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div className="row-thumb"/>
                    <div>
                      <div className="name">{im.nome}</div>
                      <div className="sub">{im.id} · {im.bairro}</div>
                    </div>
                  </td>
                  <td>{im.municipio}</td>
                  <td>{im.tipo}</td>
                  <td><StatusBadge status={im.situacao}/></td>
                  <td>{im.esfera === "—" ? "—" : im.esfera}</td>
                  <td>{im.risco}</td>
                  <td><Icon name="chev" size={14}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="between" style={{ marginTop: 28, fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
        <span>EXIBINDO 1—{list.length} DE 1.284 REGISTROS</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn sm">← Anterior</button>
          <button className="btn sm primary">1</button>
          <button className="btn sm">2</button>
          <button className="btn sm">3</button>
          <span style={{ alignSelf: "center" }}>... 143</span>
          <button className="btn sm">Próxima →</button>
        </div>
      </div>
    </div>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="select" value={value} onChange={e => onChange && onChange(e.target.value)}>
        {options.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, MapScreen, LegacyMapScreen, HeroMapShowcase, HeroMapLegend, HeroMapStats,
  AcervoScreen, FilterGroup, Check, Radio, Meta, Select,
});
