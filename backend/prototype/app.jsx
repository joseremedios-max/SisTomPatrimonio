/* ============ MAIN APP — ROUTER ============ */
const { useState: useStateApp } = React;

function App() {
  const [route, setRoute] = useStateApp("home");
  const [params, setParams] = useStateApp(null);

  const go = (r, p) => {
    setRoute(r);
    setParams(p || null);
    window.scrollTo(0, 0);
  };

  const isPublicChrome = !["dash", "imoveis", "form", "vistorias", "rel", "users", "geo", "risco", "judicial", "arqueo-a", "imaterial-a", "docs", "config"].includes(route) && route !== "login";

  let screen = null;
  switch (route) {
    case "home":      screen = <HomeScreen      go={go}/>; break;
    case "map":       screen = <MapScreen       go={go}/>; break;
    case "saoluis":   screen = <SaoLuisScreen   go={go}/>; break;
    case "acervo":    screen = <AcervoScreen    go={go}/>; break;
    case "ficha":     screen = <FichaScreen     go={go} item={params}/>; break;
    case "imaterial": screen = <ImaterialScreen go={go}/>; break;
    case "arqueo":    screen = <ArqueoScreen    go={go}/>; break;
    case "sobre":     screen = <SobreScreen     go={go}/>; break;
    case "login":     screen = <LoginScreen     go={go}/>; break;
    case "dash":      screen = <DashScreen      go={go}/>; break;
    case "imoveis":   screen = <ImoveisAdminScreen go={go}/>; break;
    case "form":      screen = <FormScreen      go={go} item={params}/>; break;
    case "vistorias": screen = <VistoriasScreen go={go}/>; break;
    case "rel":       screen = <RelatoriosScreen go={go}/>; break;
    case "users":     screen = <UsersScreen     go={go}/>; break;
    case "geo":       screen = <GeoScreen go={go}/>; break;
    case "risco":     screen = <RiscoScreen go={go}/>; break;
    case "judicial":  screen = <JudicialScreen go={go}/>; break;
    case "arqueo-a":  screen = <ArqueoAdminScreen go={go}/>; break;
    case "imaterial-a": screen = <ImaterialAdminScreen go={go}/>; break;
    case "docs":      screen = <DocsScreen go={go}/>; break;
    case "config":    screen = <ConfigScreen go={go}/>; break;
    default: screen = <HomeScreen go={go}/>;
  }

  return (
    <div className="app-root" data-screen-label={"Screen — " + route}>
      {isPublicChrome && <PublicHeader route={route} go={go}/>}
      {screen}
      {isPublicChrome && route !== "map" && route !== "saoluis" && <PublicFooter/>}
    </div>
  );
}

/* ---------- SOBRE ---------- */
function SobreScreen({ go }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 32px 80px" }}>
      <div className="caps">Sobre o sistema</div>
      <h1 className="display" style={{ fontSize: 84, margin: "16px 0 24px", lineHeight: 0.98 }}>
        Um acervo digital,<br/><em style={{ fontStyle: "italic", color: "var(--gold)" }}>público e auditável</em>.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: 760 }}>
        O <strong>SIP — Sistema Integrado de Informações Patrimoniais</strong> é uma plataforma institucional dedicada à documentação, visualização e gestão do patrimônio cultural do Maranhão. Resulta da cooperação técnica entre o Governo do Estado, o IPHAN-MA, universidades e municípios.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, marginTop: 56 }}>
        {[
          ["Missão", "Reunir, padronizar e disponibilizar informações sobre o patrimônio cultural maranhense em uma única plataforma pública, gratuita e auditável."],
          ["Princípios", "Transparência ativa, dados abertos por padrão, proteção de informações sensíveis, rastreabilidade e responsabilidade técnica em cada registro."],
          ["Governança", "Coordenado pelo Governo do Estado do Maranhão em cooperação com o IPHAN-MA, universidades e municípios. Conselho consultivo composto por academia, sociedade civil e órgãos de controle."],
          ["Metodologia", "Cadastros baseados em ficha técnica padronizada, com validação cruzada por dois técnicos e revisão periódica."],
        ].map(([t, d], i) => (
          <div key={i}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--gold)" }}>§ 0{i + 1}</div>
            <div className="display" style={{ fontSize: 32, margin: "8px 0 8px" }}>{t}</div>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.7, margin: 0 }}>{d}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 56, padding: "32px 36px", background: "var(--ink)", color: "#F2EDE0", border: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
          <div>
            <div className="caps" style={{ color: "var(--gold)" }}>Contribua</div>
            <div className="display" style={{ fontSize: 36, margin: "8px 0 12px", color: "#FBF7EC" }}>É um pesquisador, técnico ou cidadão com informações sobre o patrimônio maranhense?</div>
            <p style={{ fontSize: 14.5, color: "#D8D2BF", margin: 0, maxWidth: 600 }}>
              Submeta novos registros, fotografias históricas ou inconsistências encontradas. Todas as contribuições passam por avaliação técnica.
            </p>
          </div>
          <button className="btn" style={{ background: "var(--gold)", color: "var(--ink)", border: "1px solid var(--gold)" }}>
            Enviar contribuição <Icon name="arrow" size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- RISCO ---------- */
function RiscoScreen({ go }) {
  const risco = IMOVEIS.filter(im => im.situacao === "risco" || im.risco === "Crítico" || im.risco === "Alto");
  return (
    <AdminShell route="risco" go={go} crumbs={<>Acervo · <b>Imóveis em risco</b></>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 24 }}>
        <div>
          <div className="caps" style={{ color: "var(--clay)" }}>● 47 bens monitorados · 3 críticos</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Imóveis em risco</h1>
        </div>
        <button className="btn"><Icon name="down2" size={13}/>Exportar relatório de risco</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatBox k="Risco crítico" v="3" d="Ação imediata" riskAccent/>
        <StatBox k="Risco alto" v="12" d="Acompanhamento mensal"/>
        <StatBox k="Risco médio" v="32" d="Vistoria semestral"/>
        <StatBox k="Sem vistoria recente" v="113" d="A reavaliar"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="caps">Bens prioritários</div>
              <div className="display" style={{ fontSize: 18, marginTop: 2 }}>Lista de monitoramento</div>
            </div>
            <select className="select" style={{ width: 200 }}><option>Ordenar por risco</option><option>Por município</option><option>Por última vistoria</option></select>
          </div>
          {risco.map(im => (
            <div key={im.id} style={{ padding: "16px 22px", borderBottom: "1px solid var(--line-soft)", display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: 16, alignItems: "center" }}>
              <div className="row-thumb" style={{ width: 60, height: 60 }}/>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>{im.nome}</div>
                <div className="sub" style={{ marginTop: 2 }}>{im.id} · {im.municipio} · Última vistoria: {im.vistoria}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <StatusBadge status={im.situacao}/>
                  <span className="badge" style={{ color: im.risco === "Crítico" ? "var(--clay)" : "var(--ochre)", borderColor: im.risco === "Crítico" ? "var(--clay)" : "var(--ochre)", background: im.risco === "Crítico" ? "var(--clay-soft)" : "var(--ochre-soft)" }}>
                    <span className="dot"/>Risco {im.risco}
                  </span>
                  {im.judicial && <span className="badge"><Icon name="gavel" size={10}/>Ação judicial</span>}
                </div>
              </div>
              <div>
                <div className="label">Próx. ação</div>
                <div style={{ fontSize: 12.5, marginTop: 2 }}>Vistoria urgente</div>
              </div>
              <button className="btn primary sm" onClick={() => go("ficha", im)}>Abrir ficha</button>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, height: 480, position: "sticky", top: 24 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
            <div className="caps">Mapa de risco</div>
            <div className="display" style={{ fontSize: 18, marginTop: 2 }}>Distribuição territorial</div>
          </div>
          <div style={{ height: "calc(100% - 64px)", position: "relative" }}>
            <MapBase bare showChrome={false} showNeighbors={false}>
              {risco.map(im => <MapPin key={im.id} item={im}/>)}
            </MapBase>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* ---------- PLACEHOLDER ---------- */
function PlaceholderAdmin({ go, route, title, sub }) {
  return (
    <AdminShell route={route} go={go} crumbs={<><b>{title}</b></>}>
      <div className="caps">{sub}</div>
      <h1 className="display" style={{ fontSize: 40, margin: "10px 0 24px" }}>{title}</h1>
      <div className="card" style={{ padding: 64, textAlign: "center", border: "1px dashed var(--line-2)", background: "var(--paper-2)" }}>
        <div style={{ display: "inline-grid", placeItems: "center", width: 56, height: 56, border: "1px solid var(--line-2)", background: "var(--paper)", marginBottom: 18 }}>
          <Icon name="layers" size={24} style={{ color: "var(--ink-3)" }}/>
        </div>
        <div className="display" style={{ fontSize: 28, marginBottom: 8 }}>Módulo em construção</div>
        <p style={{ fontSize: 14, color: "var(--ink-3)", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
          Esta seção do painel administrativo está prevista para a próxima fase do projeto. As principais telas do protótipo estão acessíveis pelo menu lateral.
        </p>
      </div>
    </AdminShell>
  );
}

/* ---------- MOUNT ---------- */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
