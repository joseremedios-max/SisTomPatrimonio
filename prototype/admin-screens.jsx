/* ============ ADMIN SCREENS ============ */

/* ---------- ADMIN SHELL ---------- */
function AdminShell({ route, go, children, crumbs, actions }) {
  const items = [
    { group: "Acervo", links: [
      { k: "dash",      label: "Visão geral",        icon: "dash"     },
      { k: "imoveis",   label: "Imóveis históricos", icon: "house",    badge: "1.284" },
      { k: "geo",       label: "Mapa e georref.",    icon: "map"      },
      { k: "vistorias", label: "Vistorias",          icon: "compass",  badge: "12" },
      { k: "risco",     label: "Imóveis em risco",   icon: "alert",    badge: "47", urgent: true },
      { k: "judicial",  label: "Ações judiciais",    icon: "gavel"    },
      { k: "arqueo-a",  label: "Sítios arqueológicos", icon: "shield" },
      { k: "imaterial-a", label: "Patrimônio imaterial", icon: "scroll" },
    ]},
    { group: "Sistema", links: [
      { k: "docs",      label: "Documentos",         icon: "doc"      },
      { k: "users",     label: "Usuários e permissões", icon: "users" },
      { k: "rel",       label: "Relatórios",         icon: "chart"    },
      { k: "config",    label: "Configurações",      icon: "settings" },
    ]},
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <div className="crest" style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em" }}>SIP</div>
          <div>
            <div className="name">Sistema Integrado</div>
            <div className="sub">Painel administrativo</div>
          </div>
        </div>
        {items.map((grp, gi) => (
          <div key={gi} className="group">
            <div className="group-title">{grp.group}</div>
            {grp.links.map(it => (
              <div key={it.k} className={`nav-item ${route === it.k ? "active" : ""}`} onClick={() => go(it.k)}>
                <Icon name={it.icon} size={15} stroke={1.4}/>
                <span>{it.label}</span>
                {it.badge && <span className="badge-num" style={it.urgent ? { background: "var(--clay)", color: "#FBF7EC" } : null}>{it.badge}</span>}
              </div>
            ))}
          </div>
        ))}
        <div className="user">
          <div className="avatar">H</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#FBF7EC", fontWeight: 500 }}>Helena Borba</div>
            <div style={{ color: "#6A6F66", fontSize: 11 }}>Administrador geral</div>
          </div>
          <Icon name="logout" size={14} style={{ color: "#98998C", cursor: "pointer" }} onClick={() => go("home")}/>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-top">
          <div className="crumbs">{crumbs}</div>
          <div className="tools">
            <div className="search" style={{ width: 320 }}>
              <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
              <input placeholder="Buscar bens, vistorias, documentos..."/>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", border: "1px solid var(--line-2)", padding: "2px 6px" }}>⌘ K</span>
            </div>
            <button className="icon-btn"><Icon name="bell" size={14}/></button>
            <button className="icon-btn"><Icon name="settings" size={14}/></button>
            {actions}
            <button className="btn ghost sm" onClick={() => go("home")}><Icon name="external" size={12}/>Ver site público</button>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

/* ---------- DASHBOARD ---------- */
function DashScreen({ go }) {
  return (
    <AdminShell route="dash" go={go} crumbs={<><b>Visão geral</b> · 14 Mai 2026 · 09:21</>}
      actions={<button className="btn primary sm"><Icon name="plus" size={12}/>Cadastrar imóvel</button>}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div className="caps">Painel · 14 Mai 2026</div>
          <h1 className="display" style={{ fontSize: 36, margin: "8px 0 4px", lineHeight: 1.1 }}>Boa manhã, Helena.</h1>
          <div style={{ fontSize: 13.5, color: "var(--ink-3)" }}>
            <span style={{ color: "var(--clay)", fontWeight: 500 }}>● 3 críticos</span> · 12 vistorias pendentes · 8 ações judiciais ativas
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn"><Icon name="calendar" size={13}/>Este mês</button>
          <button className="btn"><Icon name="down2" size={13}/>Exportar painel</button>
        </div>
      </div>

      {/* INDICATORS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
        <StatBox k="Total de imóveis" v="1.284" d="Acervo cadastrado" trend="+12 em 30d" spark={[1240,1248,1253,1261,1268,1272,1278,1284]} accent/>
        <StatBox k="Imóveis tombados" v="212" d="16,5% do acervo" trend="+4 em 30d" spark={[202,204,205,207,208,210,211,212]}/>
        <StatBox k="Imóveis em risco" v="47" d="3 críticos · 12 alto" trend="+2 em 30d" spark={[42,43,44,44,45,46,47,47]} riskAccent/>
        <StatBox k="Vistorias pendentes" v="12" d="5 vencerão neste mês" trend="−3 em 30d" spark={[18,17,16,15,14,13,12,12]}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        <StatBox k="Ações judiciais ativas" v="8" d="2 novas em 2026"/>
        <StatBox k="Imóveis públicos" v="612" d="47,7% do acervo"/>
        <StatBox k="Imóveis privados" v="672" d="52,3% do acervo"/>
        <StatBox k="Municípios contemplados" v="94 / 217" d="43% do estado"/>
      </div>

      {/* CHARTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, marginBottom: 28 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="between" style={{ marginBottom: 18 }}>
            <div>
              <div className="caps">Distribuição por situação de conservação</div>
              <div className="display" style={{ fontSize: 22, marginTop: 4 }}>1.284 imóveis classificados</div>
            </div>
            <Select label="Período" options={["Últimos 12 meses", "Este ano", "Histórico"]}/>
          </div>
          <SituationBar data={[
            { label: "Preservado", n: 624, color: "var(--moss)" },
            { label: "Restaurado", n: 218, color: "var(--petroleum)" },
            { label: "Em atenção", n: 282, color: "var(--ochre)" },
            { label: "Em risco", n: 47, color: "var(--clay)" },
            { label: "Sem vistoria recente", n: 113, color: "var(--st-semvist)" },
          ]}/>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="caps">Distribuição por município (top 8)</div>
          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            {[
              ["São Luís", 412],
              ["Alcântara", 168],
              ["Caxias", 142],
              ["Viana", 84],
              ["Codó", 72],
              ["Cururupu", 56],
              ["Carolina", 48],
              ["Pinheiro", 38],
            ].map(([m, n]) => (
              <div key={m} style={{ display: "grid", gridTemplateColumns: "100px 1fr 40px", gap: 12, alignItems: "center", fontSize: 12.5 }}>
                <span style={{ color: "var(--ink-2)" }}>{m}</span>
                <div style={{ height: 8, background: "var(--bg-deep)", border: "1px solid var(--line)" }}>
                  <div style={{ height: "100%", background: "var(--petroleum)", width: `${n / 412 * 100}%` }}/>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", textAlign: "right", color: "var(--ink-3)" }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)" }}>
            <div className="between">
              <div>
                <div className="caps">Últimos imóveis cadastrados</div>
                <div className="display" style={{ fontSize: 18, marginTop: 4 }}>Atividade recente</div>
              </div>
              <a style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", color: "var(--petroleum)", borderBottom: "1px solid var(--petroleum)", cursor: "pointer" }} onClick={() => go("imoveis")}>VER TODOS →</a>
            </div>
          </div>
          {IMOVEIS.slice(0, 5).map(im => (
            <div key={im.id} style={{ padding: "14px 22px", borderBottom: "1px solid var(--line-soft)", display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }} onClick={() => go("imoveis", im)}>
              <div className="row-thumb" style={{ width: 36, height: 36 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.1 }}>{im.nome}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{im.id} · {im.municipio}</div>
              </div>
              <StatusBadge status={im.situacao}/>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)" }}>
            <div className="caps">Vistorias recentes</div>
            <div className="display" style={{ fontSize: 18, marginTop: 4 }}>Atividade de campo</div>
          </div>
          {VISTORIAS.slice(0, 5).map(v => (
            <div key={v.id} style={{ padding: "14px 22px", borderBottom: "1px solid var(--line-soft)", display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{v.id} · {v.data}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.15, marginTop: 2 }}>{v.imovelNome}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{v.responsavel} · {v.orgao}</div>
              </div>
              <VistoriaBadge status={v.status}/>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, background: "var(--ink)", color: "#F2EDE0", border: 0 }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #2A2F2C" }}>
            <div className="caps" style={{ color: "var(--gold)" }}>Alertas críticos</div>
            <div className="display" style={{ fontSize: 18, marginTop: 4, color: "#FBF7EC" }}>4 itens requerem ação</div>
          </div>
          {ALERTAS.map((a, i) => (
            <div key={i} style={{ padding: "14px 22px", borderBottom: "1px solid #2A2F2C", display: "grid", gridTemplateColumns: "20px 1fr", gap: 12 }}>
              <div style={{ paddingTop: 2 }}>
                <Icon name={a.tipo === "risco" ? "alert" : a.tipo === "judicial" ? "gavel" : a.tipo === "vistoria" ? "compass" : "shield"} size={16} style={{ color: a.tipo === "risco" ? "var(--clay)" : "var(--gold)" }}/>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#FBF7EC", lineHeight: 1.35 }}>{a.titulo}</div>
                <div style={{ fontSize: 11.5, color: "#98998C", marginTop: 3 }}>{a.sub}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#6A6F66", marginTop: 4, letterSpacing: "0.06em" }}>{a.data.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

function StatBox({ k, v, d, accent, riskAccent, trend, spark }) {
  return (
    <div className={`stat ${accent ? "accent" : ""} ${riskAccent ? "risk" : ""}`}>
      <div className="k">{k}</div>
      {spark && <Sparkline data={spark} color={accent ? "#F5EFDB" : riskAccent ? "var(--clay)" : "var(--petroleum)"}/>}
      <div className="v">{v}</div>
      {d && <div className="d">{d}</div>}
      {trend && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: trend.startsWith("+") ? (accent ? "rgba(245,239,219,0.85)" : "var(--moss)") : "var(--clay)", letterSpacing: "0.04em", marginTop: 2 }}>
          {trend}
        </div>
      )}
    </div>
  );
}

function Sparkline({ data, color = "var(--petroleum)" }) {
  const w = 60, h = 22;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  const lastIdx = data.length - 1;
  const lastX = (lastIdx / (data.length - 1)) * w;
  const lastY = h - ((data[lastIdx] - min) / (max - min || 1)) * h;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={lastX} cy={lastY} r="1.6" fill={color}/>
    </svg>
  );
}

function SituationBar({ data }) {
  const total = data.reduce((s, d) => s + d.n, 0);
  return (
    <div>
      <div style={{ display: "flex", height: 26, marginBottom: 18, border: "1px solid var(--line)" }}>
        {data.map((d, i) => (
          <div key={i} style={{ width: `${d.n / total * 100}%`, background: d.color }} title={d.label}/>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {data.map((d, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, background: d.color }}/>
              <span className="label">{d.label}</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, marginTop: 4, lineHeight: 1.1 }}>{d.n}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{(d.n / total * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VistoriaBadge({ status }) {
  const map = {
    "Realizada": "preservado",
    "Pendente":  "atencao",
    "Em análise": "restaurado",
    "Vencida":   "risco",
  };
  return <span className={`badge ${map[status] || ""}`}><span className="dot"/>{status}</span>;
}

/* ---------- IMÓVEIS LIST ---------- */
function ImoveisAdminScreen({ go }) {
  const [selected, setSelected] = useState([]);
  const all = [...IMOVEIS, ...IMOVEIS.slice(0, 5).map(x => ({ ...x, id: x.id + "-b" }))];

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === all.length ? [] : all.map(x => x.id));

  return (
    <AdminShell route="imoveis" go={go} crumbs={<>Acervo · <b>Imóveis históricos</b></>}
      actions={<button className="btn primary sm" onClick={() => go("form")}><Icon name="plus" size={12}/>Cadastrar imóvel</button>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 24 }}>
        <div>
          <div className="caps">{all.length} bens cadastrados</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Imóveis históricos</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn sm"><Icon name="down2" size={12}/>Exportar</button>
          <button className="btn sm"><Icon name="upload" size={12}/>Importar lote</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr auto", gap: 10 }}>
          <div className="search">
            <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
            <input placeholder="Buscar nome, ID, matrícula, endereço..."/>
          </div>
          <select className="select"><option>Todos os municípios</option>{MUNICIPIOS.map(m => <option key={m}>{m}</option>)}</select>
          <select className="select"><option>Todos os tipos</option><option>Casarão</option><option>Sobrado</option><option>Solar</option></select>
          <select className="select"><option>Todas as situações</option><option>Preservado</option><option>Em risco</option></select>
          <select className="select"><option>Todas as esferas</option><option>Federal</option><option>Estadual</option></select>
          <button className="btn"><Icon name="filter" size={13}/></button>
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--line-soft)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span className="caps" style={{ marginRight: 6 }}>Filtros ativos</span>
          <Chip label="Município: São Luís"/>
          <Chip label="Esfera: Federal"/>
          <Chip label="Risco: ≥ Médio"/>
          <button style={{ background: "none", border: 0, fontSize: 11.5, color: "var(--petroleum)", cursor: "pointer", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>+ adicionar filtro</button>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{all.length} resultados</span>
        </div>
      </div>

      {selected.length > 0 && (
        <div style={{ background: "var(--ink)", color: "#F2EDE0", padding: "10px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 12, fontSize: 13 }}>
          <strong>{selected.length}</strong> selecionados
          <span style={{ width: 1, height: 14, background: "#3A3F3C" }}/>
          <button className="btn ghost sm" style={{ background: "transparent", color: "#F2EDE0", border: "1px solid #4A4F47" }}>Exportar</button>
          <button className="btn ghost sm" style={{ background: "transparent", color: "#F2EDE0", border: "1px solid #4A4F47" }}>Mudar situação</button>
          <button className="btn ghost sm" style={{ background: "transparent", color: "#F2EDE0", border: "1px solid #4A4F47" }}>Atribuir vistoria</button>
          <button style={{ background: "none", color: "var(--clay-soft)", border: 0, fontSize: 12, marginLeft: "auto", cursor: "pointer" }} onClick={() => setSelected([])}>Limpar seleção</button>
        </div>
      )}

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" checked={selected.length === all.length} onChange={toggleAll}/>
              </th>
              <th>Nome / ID</th>
              <th>Município</th>
              <th>Tipo</th>
              <th>Situação</th>
              <th>Tombamento</th>
              <th>Domínio</th>
              <th>Risco</th>
              <th>Última atualização</th>
              <th style={{ width: 90, textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {all.map(im => (
              <tr key={im.id}>
                <td><input type="checkbox" checked={selected.includes(im.id)} onChange={() => toggle(im.id)}/></td>
                <td style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="row-thumb"/>
                  <div>
                    <div className="name">{im.nome}</div>
                    <div className="sub">{im.id} · {im.matricula}</div>
                  </div>
                </td>
                <td>{im.municipio}</td>
                <td>{im.tipo}</td>
                <td><StatusBadge status={im.situacao}/></td>
                <td>
                  {im.tombamento_ano === "Em processo" ? <span className="badge atencao"><span className="dot"/>Em processo</span> :
                    <div>
                      <div style={{ fontSize: 13 }}>{im.esfera}</div>
                      <div className="sub" style={{ marginTop: 2 }}>desde {im.tombamento_ano}</div>
                    </div>
                  }
                </td>
                <td>{im.publico}</td>
                <td>
                  <span style={{ color: im.risco === "Alto" || im.risco === "Crítico" ? "var(--clay)" : im.risco === "Médio" ? "var(--ochre)" : "var(--moss)", fontWeight: 500 }}>● </span>
                  {im.risco}
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>14 Abr 2026<br/><span style={{ color: "var(--ink-4)" }}>por H. Borba</span></td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 4 }}>
                    <button className="icon-btn" title="Ver" onClick={() => go("ficha", im)}><Icon name="eye" size={13}/></button>
                    <button className="icon-btn" title="Editar" onClick={() => go("form", im)}><Icon name="edit" size={13}/></button>
                    <button className="icon-btn" title="Mais"><Icon name="more" size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "14px 18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--ink-3)" }}>
          <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>1 — {all.length} DE 1.284</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn sm">← Anterior</button>
            <button className="btn sm primary">1</button>
            <button className="btn sm">2</button>
            <button className="btn sm">3</button>
            <button className="btn sm">Próxima →</button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Chip({ label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px 3px 10px", background: "var(--paper-2)", border: "1px solid var(--line-2)", fontSize: 11.5, fontFamily: "var(--font-mono)", letterSpacing: "0.03em" }}>
      {label}
      <Icon name="x" size={11} style={{ cursor: "pointer", color: "var(--ink-3)" }}/>
    </span>
  );
}

Object.assign(window, { AdminShell, DashScreen, StatBox, Sparkline, SituationBar, VistoriaBadge, ImoveisAdminScreen, Chip });
