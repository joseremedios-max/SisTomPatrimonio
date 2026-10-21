/* ============ ADMIN SCREENS 3 — módulos antes em construção ============ */
/* GeoScreen · JudicialScreen · ArqueoAdminScreen · ImaterialAdminScreen ·
   DocsScreen · ConfigScreen — reaproveitam AdminShell, StatBox, MapBase,
   MapPin, StatusBadge, Meta, Field, Row, Select, Chip e os dados de data.js. */

/* ---------- helpers locais ---------- */
function Toggle({ on, onChange }) {
  const [v, setV] = useState(!!on);
  const val = onChange ? on : v;
  const flip = () => { onChange ? onChange(!on) : setV(x => !x); };
  return (
    <button onClick={flip} aria-pressed={val} style={{
      width: 40, height: 22, padding: 2, border: "1px solid " + (val ? "var(--petroleum)" : "var(--line-2)"),
      background: val ? "var(--petroleum)" : "var(--paper-2)", borderRadius: 22, cursor: "pointer",
      display: "flex", justifyContent: val ? "flex-end" : "flex-start", alignItems: "center", transition: "all .15s ease",
    }}>
      <span style={{ width: 16, height: 16, borderRadius: 16, background: val ? "var(--gold)" : "var(--ink-3)", transition: "all .15s ease" }}/>
    </button>
  );
}

function SettingRow({ title, desc, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center", padding: "16px 0", borderBottom: "1px dotted var(--line-soft)" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{title}</div>
        {desc && <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.5, maxWidth: 520 }}>{desc}</div>}
      </div>
      <div style={{ justifySelf: "end" }}>{children}</div>
    </div>
  );
}

function SectionTitle({ n, t, s }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="caps" style={{ color: "var(--gold)" }}>§ {n}</div>
      <div className="display" style={{ fontSize: 24, marginTop: 4 }}>{t}</div>
      {s && <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{s}</div>}
    </div>
  );
}

/* =====================================================================
   1 · MAPA E GEORREFERENCIAMENTO
   ===================================================================== */
function GeoScreen({ go }) {
  const [layers, setLayers] = useState({ imoveis: true, arqueo: true, risco: true, rios: true, municipios: true });
  const [basemap, setBasemap] = useState("Cartográfico");
  const toggle = k => setLayers(l => ({ ...l, [k]: !l[k] }));

  const visImoveis = layers.imoveis ? IMOVEIS : [];
  const visArqueo = layers.arqueo ? ARQUEOLOGICOS : [];

  const cobertura = [
    ["São Luís", 412, 412, "± 1,2 m", "SIRGAS 2000"],
    ["Alcântara", 168, 161, "± 2,4 m", "SIRGAS 2000"],
    ["Caxias", 142, 134, "± 3,1 m", "SIRGAS 2000"],
    ["Viana", 84, 71, "± 4,0 m", "SAD-69 → conversão"],
    ["Cururupu", 56, 48, "± 5,2 m", "SIRGAS 2000"],
    ["Carolina", 48, 39, "± 6,8 m", "GPS de navegação"],
  ];

  return (
    <AdminShell route="geo" go={go} crumbs={<>Acervo · <b>Mapa e georreferenciamento</b></>}
      actions={<>
        <button className="btn sm"><Icon name="upload" size={12}/>Importar shapefile</button>
        <button className="btn primary sm"><Icon name="down2" size={12}/>Exportar GeoJSON</button>
      </>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="caps">Sistema de informação geográfica · SIG-Patrimônio</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Mapa e georreferenciamento</h1>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", textAlign: "right" }}>
          Datum oficial · SIRGAS 2000<br/>EPSG:4674 · base IBGE 1:1.000.000
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        <StatBox k="Bens georreferenciados" v="1.211" d="94,3% do acervo" trend="+38 em 30d" accent/>
        <StatBox k="Precisão média" v="± 2,7 m" d="Coleta GNSS / RTK"/>
        <StatBox k="Camadas ativas" v={String(Object.values(layers).filter(Boolean).length) + " / 5"} d="Vetoriais e temáticas"/>
        <StatBox k="Municípios mapeados" v="94 / 217" d="43% do estado"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden", height: 560, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 6, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(180deg, rgba(247,243,233,0.96), rgba(247,243,233,0))" }}>
            <div>
              <div className="caps">Visão geral do estado</div>
              <div className="display" style={{ fontSize: 18, marginTop: 2 }}>{visImoveis.length + visArqueo.length} feições visíveis</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Cartográfico", "Relevo", "Satélite"].map(b => (
                <button key={b} onClick={() => setBasemap(b)} className="btn sm" style={basemap === b ? { background: "var(--petroleum)", color: "#FBF7EC", borderColor: "var(--petroleum)" } : null}>{b}</button>
              ))}
            </div>
          </div>
          <MapBase interactive showChrome hideAttrib={false}>
            {visImoveis.map(im => <MapPin key={im.id} item={im} showLabel={false}/>)}
            {visArqueo.map(s => <MapPin key={s.id} item={{ ...s, situacao: "atencao" }} approx={s.restrito} restricted={s.restrito}/>)}
          </MapBase>
        </div>

        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="caps" style={{ marginBottom: 12 }}>Camadas</div>
            <div style={{ display: "grid", gap: 2 }}>
              {[
                ["imoveis", "Imóveis históricos", "house", "var(--petroleum)", "1.284"],
                ["arqueo", "Sítios arqueológicos", "shield", "var(--ochre)", "52"],
                ["risco", "Áreas de risco", "alert", "var(--clay)", "47"],
                ["rios", "Hidrografia", "map", "var(--petroleum)", null],
                ["municipios", "Limites municipais", "layers", "var(--ink-3)", "217"],
              ].map(([k, label, icon, color, n]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderBottom: "1px dotted var(--line-soft)" }}>
                  <Icon name={icon} size={15} style={{ color }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--ink)" }}>{label}</div>
                    {n && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{n} feições</div>}
                  </div>
                  <Toggle on={layers[k]} onChange={() => toggle(k)}/>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="caps" style={{ marginBottom: 12 }}>Legenda — situação</div>
            <div style={{ display: "grid", gap: 8 }}>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--ink-2)" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 12, background: `var(--st-${k})` }}/>{v.label}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--ink-2)", marginTop: 4, paddingTop: 8, borderTop: "1px dotted var(--line-soft)" }}>
                <Icon name="lock" size={12} style={{ color: "var(--ink-3)" }}/>Sítio de acesso restrito
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 18, background: "var(--paper-2)" }}>
            <div className="caps" style={{ marginBottom: 8 }}>Ferramentas</div>
            <div style={{ display: "grid", gap: 6 }}>
              {[["compass", "Medir distância"], ["grid", "Desenhar polígono"], ["pin", "Adicionar ponto"], ["down2", "Exportar área visível"]].map(([ic, t]) => (
                <button key={t} className="btn sm" style={{ justifyContent: "flex-start", width: "100%" }}><Icon name={ic} size={12}/>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="caps">Cobertura de georreferenciamento</div>
            <div className="display" style={{ fontSize: 18, marginTop: 2 }}>Qualidade por município</div>
          </div>
          <button className="btn sm"><Icon name="down2" size={12}/>Relatório de precisão</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Município</th><th>Bens cadastrados</th><th>Georreferenciados</th><th>Cobertura</th><th>Precisão média</th><th>Datum de origem</th></tr></thead>
          <tbody>
            {cobertura.map(([mun, tot, geo, prec, datum]) => {
              const pct = Math.round(geo / tot * 100);
              return (
                <tr key={mun}>
                  <td style={{ fontWeight: 500 }}>{mun}</td>
                  <td className="mono">{tot}</td>
                  <td className="mono">{geo}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, maxWidth: 120, height: 6, background: "var(--bg-deep)", border: "1px solid var(--line)" }}>
                        <div style={{ height: "100%", width: pct + "%", background: pct >= 95 ? "var(--moss)" : pct >= 80 ? "var(--ochre)" : "var(--clay)" }}/>
                      </div>
                      <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{pct}%</span>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: 12.5 }}>{prec}</td>
                  <td style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{datum}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

/* =====================================================================
   2 · AÇÕES JUDICIAIS
   ===================================================================== */
const PROCESSOS = [
  { id: "0034521-22.2024.4.01.3700", bem: "Sobrado Histórico do Centro", bemId: "APM-0287", vara: "Vara Federal de São Luís", tipo: "Ação Civil Pública", fase: "Instrução", faseCls: "atencao", autor: "Ministério Público Federal", reu: "Proprietário particular", objeto: "Obrigação de fazer — conservação e restauro de bem tombado em risco de descaracterização.", valor: "R$ 480.000", inicio: "12 Mar 2024", ult: "28 Abr 2026", risco: "Médio" },
  { id: "0098114-65.2019.8.10.0001", bem: "Antigo Engenho de Viana", bemId: "APM-0512", vara: "1ª Vara Cível de Viana", tipo: "Ação de Tombamento", fase: "Sentença", faseCls: "restaurado", autor: "Estado do Maranhão", reu: "Espólio de Viana & Cia.", objeto: "Pedido de tombamento compulsório de conjunto rural de valor histórico em situação de abandono.", valor: "—", inicio: "03 Set 2019", ult: "15 Mai 2026", risco: "Crítico" },
  { id: "0011207-48.2025.4.01.3700", bem: "Solar Antigo de Alcântara", bemId: "APM-0319", vara: "Vara Federal de São Luís", tipo: "Ação de Desapropriação", fase: "Instrução", faseCls: "atencao", autor: "IPHAN / União", reu: "Particular", objeto: "Desapropriação por interesse cultural de imóvel setecentista para fins de preservação pública.", valor: "R$ 1.250.000", inicio: "21 Jan 2025", ult: "30 Abr 2026", risco: "Alto" },
  { id: "0006677-90.2023.8.10.0040", bem: "Igreja Matriz de Cururupu", bemId: "APM-0822", vara: "Vara Única de Cururupu", tipo: "Ação Civil Pública", fase: "Execução", faseCls: "preservado", autor: "Ministério Público Estadual", reu: "Município de Cururupu", objeto: "Execução de obrigação de custeio de obras emergenciais na cobertura do bem.", valor: "R$ 95.000", inicio: "08 Jun 2023", ult: "11 Fev 2026", risco: "Médio" },
  { id: "0042310-17.2022.4.01.3700", bem: "Casarão Colonial da Praia Grande", bemId: "APM-0142", vara: "Vara Federal de São Luís", tipo: "Embargos de Obra", fase: "Encerrado", faseCls: "preservado", autor: "IPHAN-MA", reu: "Construtora lindeira", objeto: "Embargo de obra irregular em área de entorno de bem tombado. Acordo homologado.", valor: "—", inicio: "14 Out 2022", ult: "02 Dez 2025", risco: "Baixo" },
];

function JudicialScreen({ go }) {
  const [sel, setSel] = useState(PROCESSOS[0]);
  return (
    <AdminShell route="judicial" go={go} crumbs={<>Acervo · <b>Ações judiciais</b></>}
      actions={<button className="btn primary sm"><Icon name="plus" size={12}/>Registrar processo</button>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="caps">Acompanhamento processual · jurídico patrimonial</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Ações judiciais</h1>
        </div>
        <button className="btn"><Icon name="down2" size={13}/>Relatório jurídico anual</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatBox k="Processos ativos" v="8" d="2 abertos em 2026" accent/>
        <StatBox k="Em fase de instrução" v="3" d="Aguardando perícia"/>
        <StatBox k="Bens sob litígio" v="6" d="0,5% do acervo" riskAccent/>
        <StatBox k="Valor em discussão" v="R$ 2,3 mi" d="Obrigações e desapropriações"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 16 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr auto", gap: 10 }}>
            <div className="search">
              <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
              <input placeholder="Buscar por nº, bem ou comarca..."/>
            </div>
            <select className="select"><option>Todas as fases</option><option>Instrução</option><option>Sentença</option><option>Execução</option><option>Encerrado</option></select>
            <select className="select"><option>Todos os tipos</option><option>Ação Civil Pública</option><option>Tombamento</option><option>Desapropriação</option></select>
            <button className="btn"><Icon name="filter" size={13}/></button>
          </div>
          <table className="tbl">
            <thead><tr><th>Processo</th><th>Bem vinculado</th><th>Tipo</th><th>Fase</th><th>Atualização</th></tr></thead>
            <tbody>
              {PROCESSOS.map(p => (
                <tr key={p.id} onClick={() => setSel(p)} style={{ cursor: "pointer", background: sel.id === p.id ? "var(--paper-2)" : undefined }}>
                  <td className="mono" style={{ fontSize: 11.5 }}>{p.id}</td>
                  <td>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14.5, lineHeight: 1.15 }}>{p.bem}</div>
                    <div className="sub">{p.bemId} · {p.vara}</div>
                  </td>
                  <td style={{ fontSize: 12.5 }}>{p.tipo}</td>
                  <td><span className={`badge ${p.faseCls}`}><span className="dot"/>{p.fase}</span></td>
                  <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{p.ult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 0, position: "sticky", top: 24, alignSelf: "start" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
            <div className="caps">Detalhe do processo</div>
            <div className="display mono" style={{ fontSize: 15, marginTop: 4 }}>{sel.id}</div>
          </div>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.15 }}>{sel.bem}</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>{sel.bemId}</div>

            <div style={{ margin: "16px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className={`badge ${sel.faseCls}`}><span className="dot"/>{sel.fase}</span>
              <span className="badge" style={{ color: sel.risco === "Crítico" || sel.risco === "Alto" ? "var(--clay)" : "var(--ochre)", borderColor: "currentColor" }}><span className="dot"/>Risco {sel.risco}</span>
            </div>

            <Meta k="Tipo de ação" v={sel.tipo}/>
            <Meta k="Vara / Comarca" v={sel.vara}/>
            <Meta k="Autor" v={sel.autor}/>
            <Meta k="Réu" v={sel.reu}/>
            <Meta k="Valor da causa" v={sel.valor} mono/>
            <Meta k="Distribuído em" v={sel.inicio} mono/>
            <Meta k="Última movimentação" v={sel.ult} mono/>

            <hr className="hr-soft" style={{ margin: "16px 0" }}/>
            <div className="label" style={{ marginBottom: 6 }}>Objeto</div>
            <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{sel.objeto}</p>

            <div className="label" style={{ marginTop: 16, marginBottom: 8 }}>Peças processuais · 3</div>
            {["Petição inicial.pdf", "Parecer técnico IPHAN.pdf", "Última decisão.pdf"].map(f => (
              <div key={f} style={{ padding: "8px 0", borderBottom: "1px dotted var(--line-soft)", display: "flex", gap: 10, alignItems: "center", fontSize: 12.5 }}>
                <Icon name="doc" size={14} style={{ color: "var(--gold)" }}/>
                <span style={{ flex: 1, minWidth: 0 }}>{f}</span>
                <Icon name="down2" size={12} style={{ color: "var(--ink-3)" }}/>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button className="btn primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => go("ficha", IMOVEIS.find(i => i.id === sel.bemId))}>Abrir ficha do bem</button>
              <button className="btn" title="Acompanhar"><Icon name="bell" size={13}/></button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* =====================================================================
   3 · SÍTIOS ARQUEOLÓGICOS (admin)
   ===================================================================== */
function ArqueoAdminScreen({ go }) {
  const [sel, setSel] = useState(ARQUEOLOGICOS[0]);
  const visiveis = ARQUEOLOGICOS.filter(s => !s.restrito);
  return (
    <AdminShell route="arqueo-a" go={go} crumbs={<>Acervo · <b>Sítios arqueológicos</b></>}
      actions={<button className="btn primary sm"><Icon name="plus" size={12}/>Cadastrar sítio</button>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="caps" style={{ color: "var(--ochre)" }}>Gestão de sítios protegidos · dados sensíveis</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Sítios arqueológicos</h1>
        </div>
        <button className="btn"><Icon name="lock" size={13}/>Política de acesso restrito</button>
      </div>

      <div style={{ padding: "12px 18px", border: "1px solid var(--ochre)", background: "var(--ochre-soft)", display: "flex", gap: 12, alignItems: "center", marginBottom: 22, fontSize: 13, color: "var(--ink-2)" }}>
        <Icon name="shield" size={18} style={{ color: "var(--ochre)" }}/>
        <span>Coordenadas de sítios <strong>restritos</strong> são ocultadas no mapa e nas exportações públicas, conforme a Lei 3.924/1961 e a Portaria IPHAN 196/2016.</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatBox k="Sítios cadastrados" v="52" d="Em 23 municípios" accent/>
        <StatBox k="Acesso restrito" v="31" d="Coordenadas protegidas" riskAccent/>
        <StatBox k="Pré-coloniais" v="34" d="Sambaquis e rupestres"/>
        <StatBox k="Em monitoramento" v="9" d="Risco de pilhagem"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr auto", gap: 10 }}>
            <div className="search">
              <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
              <input placeholder="Buscar por nome, ID ou município..."/>
            </div>
            <select className="select"><option>Todos os tipos</option><option>Pré-colonial</option><option>Histórico</option></select>
            <select className="select"><option>Todas as proteções</option><option>Restrito</option><option>Aberto</option></select>
            <button className="btn"><Icon name="filter" size={13}/></button>
          </div>
          <table className="tbl">
            <thead><tr><th>Sítio</th><th>Município</th><th>Tipo</th><th>Proteção</th><th>Acesso</th></tr></thead>
            <tbody>
              {ARQUEOLOGICOS.map(s => (
                <tr key={s.id} onClick={() => setSel(s)} style={{ cursor: "pointer", background: sel.id === s.id ? "var(--paper-2)" : undefined }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {s.restrito && <Icon name="lock" size={13} style={{ color: "var(--clay)" }}/>}
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 14.5, lineHeight: 1.15 }}>{s.nome}</div>
                        <div className="sub">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{s.municipio}</td>
                  <td style={{ fontSize: 12.5 }}>{s.tipo}</td>
                  <td>
                    {s.restrito
                      ? <span className="badge risco"><span className="dot"/>Restrito</span>
                      : <span className="badge preservado"><span className="dot"/>Aberto</span>}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--ink-3)" }}>{s.acesso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <div className="caps">Detalhe do sítio</div>
              <div className="display" style={{ fontSize: 18, marginTop: 2 }}>{sel.id}</div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 21, lineHeight: 1.15 }}>{sel.nome}</div>
              <div style={{ margin: "14px 0", display: "flex", gap: 8 }}>
                {sel.restrito
                  ? <span className="badge risco"><Icon name="lock" size={10}/>Acesso restrito</span>
                  : <span className="badge preservado"><span className="dot"/>Acesso aberto</span>}
              </div>
              <Meta k="Município" v={sel.municipio}/>
              <Meta k="Tipo" v={sel.tipo}/>
              <Meta k="Proteção" v={sel.protecao}/>
              <Meta k="Regime de acesso" v={sel.acesso}/>
              <Meta k="Coordenadas" v={sel.restrito ? "Protegidas — § restrito" : `${sel.latitude?.toFixed(4)}, ${sel.longitude?.toFixed(4)}`} mono/>
              <hr className="hr-soft" style={{ margin: "14px 0" }}/>
              <div className="label" style={{ marginBottom: 6 }}>Descrição</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{sel.resumo}</p>
            </div>
          </div>

          <div className="card" style={{ padding: 0, height: 240, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 10, left: 12, zIndex: 6, background: "rgba(247,243,233,0.92)", padding: "5px 10px", border: "1px solid var(--line)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
              {visiveis.length} de {ARQUEOLOGICOS.length} sítios plotáveis
            </div>
            <MapBase bare showChrome={false} showNeighbors={false}>
              {visiveis.map(s => <MapPin key={s.id} item={{ ...s, situacao: "atencao" }}/>)}
            </MapBase>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* =====================================================================
   4 · PATRIMÔNIO IMATERIAL (admin)
   ===================================================================== */
const RECON_META = {
  "UNESCO": { cls: "restaurado", short: "UNESCO" },
  "IPHAN":  { cls: "preservado", short: "IPHAN" },
  "Estado": { cls: "preservado", short: "Estado" },
  "registro": { cls: "atencao", short: "Em registro" },
  "estudo": { cls: "semvist", short: "Em estudo" },
};
function reconKey(status) {
  if (status.includes("UNESCO")) return "UNESCO";
  if (status.includes("IPHAN")) return "IPHAN";
  if (status.includes("Estado")) return "Estado";
  if (status.includes("registro")) return "registro";
  return "estudo";
}

function ImaterialAdminScreen({ go }) {
  return (
    <AdminShell route="imaterial-a" go={go} crumbs={<>Acervo · <b>Patrimônio imaterial</b></>}
      actions={<button className="btn primary sm"><Icon name="plus" size={12}/>Registrar manifestação</button>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="caps">Gestão de bens imateriais · salvaguarda</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Patrimônio imaterial</h1>
        </div>
        <button className="btn"><Icon name="down2" size={13}/>Inventário de referências culturais</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatBox k="Manifestações" v="38" d="Em todo o estado" accent/>
        <StatBox k="Reconhecidas — IPHAN" v="11" d="Registro federal"/>
        <StatBox k="Planos de salvaguarda" v="7" d="Ativos em 2026"/>
        <StatBox k="Em registro / estudo" v="9" d="Processos em curso" riskAccent/>
      </div>

      <div className="card" style={{ padding: 0, marginBottom: 16 }}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr auto", gap: 10 }}>
          <div className="search">
            <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
            <input placeholder="Buscar manifestação, categoria, comunidade..."/>
          </div>
          <select className="select"><option>Todas as categorias</option><option>Festa popular</option><option>Dança e canto</option><option>Saber tradicional</option></select>
          <select className="select"><option>Todas as regiões</option><option>Capital</option><option>Litoral</option><option>Quilombola</option></select>
          <select className="select"><option>Todos os status</option><option>UNESCO</option><option>IPHAN</option><option>Em registro</option></select>
          <button className="btn"><Icon name="filter" size={13}/></button>
        </div>
        <table className="tbl">
          <thead><tr><th>Manifestação</th><th>Categoria</th><th>Abrangência</th><th>Reconhecimento</th><th>Salvaguarda</th><th style={{ textAlign: "right" }}>Ações</th></tr></thead>
          <tbody>
            {IMATERIAL.map(m => {
              const rk = reconKey(m.status);
              const meta = RECON_META[rk];
              const temPlano = rk === "UNESCO" || rk === "IPHAN";
              return (
                <tr key={m.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {m.imgUrl
                      ? <img src={m.imgUrl} alt="" loading="lazy" style={{ width: 44, height: 44, objectFit: "cover", border: "1px solid var(--line)" }}/>
                      : <div className="row-thumb" style={{ width: 44, height: 44 }}/>}
                    <div>
                      <div className="name">{m.nome}</div>
                      <div className="sub">{m.id} · {m.municipio}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{m.categoria}</td>
                  <td style={{ fontSize: 13, color: "var(--ink-2)" }}>{m.regiao}</td>
                  <td><span className={`badge ${meta.cls}`}><span className="dot"/>{m.status}</span></td>
                  <td>
                    {temPlano
                      ? <span style={{ fontSize: 12.5, color: "var(--moss)" }}><Icon name="check" size={11} stroke={2.5}/> Plano ativo</span>
                      : <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>— em elaboração</span>}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      <button className="icon-btn" title="Ver" onClick={() => go("imaterial")}><Icon name="eye" size={13}/></button>
                      <button className="icon-btn" title="Editar"><Icon name="edit" size={13}/></button>
                      <button className="icon-btn" title="Mais"><Icon name="more" size={13}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="caps" style={{ marginBottom: 16 }}>Distribuição por reconhecimento</div>
          {[
            ["UNESCO — Patrimônio da Humanidade", 1, "var(--petroleum)"],
            ["Registro IPHAN (federal)", 11, "var(--moss)"],
            ["Reconhecimento estadual", 6, "var(--gold)"],
            ["Em processo de registro", 5, "var(--ochre)"],
            ["Em estudo / inventário", 15, "var(--st-semvist)"],
          ].map(([label, n, color]) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr 44px", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 4 }}>{label}</div>
                <div style={{ height: 8, background: "var(--bg-deep)", border: "1px solid var(--line)" }}>
                  <div style={{ height: "100%", width: `${n / 38 * 100}%`, background: color }}/>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, textAlign: "right" }}>{n}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, background: "var(--ink)", color: "#F2EDE0", border: 0 }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #2A2F2C" }}>
            <div className="caps" style={{ color: "var(--gold)" }}>Agenda de salvaguarda</div>
            <div className="display" style={{ fontSize: 18, marginTop: 4, color: "#FBF7EC" }}>Próximas ações</div>
          </div>
          {[
            ["Inventário do Cacuriá — fase de campo", "Conclui em Jul 2026", "scroll"],
            ["Plano de salvaguarda do Tambor de Crioula", "Revisão quinquenal", "calendar"],
            ["Dossiê de registro — Cerâmica de Itamatatiua", "Em redação técnica", "doc"],
            ["Mestres e detentores — atualização do cadastro", "12 novos registros", "users"],
          ].map(([t, s, ic], i) => (
            <div key={i} style={{ padding: "14px 22px", borderBottom: "1px solid #2A2F2C", display: "grid", gridTemplateColumns: "22px 1fr", gap: 12 }}>
              <Icon name={ic} size={16} style={{ color: "var(--gold)", marginTop: 1 }}/>
              <div>
                <div style={{ fontSize: 13, color: "#FBF7EC", lineHeight: 1.35 }}>{t}</div>
                <div style={{ fontSize: 11.5, color: "#98998C", marginTop: 3 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

/* =====================================================================
   5 · DOCUMENTOS
   ===================================================================== */
const DOC_PASTAS = [
  { k: "tomb", label: "Processos de tombamento", icon: "shield", n: 312 },
  { k: "laudo", label: "Laudos técnicos", icon: "doc", n: 489 },
  { k: "vist", label: "Relatórios de vistoria", icon: "compass", n: 1204 },
  { k: "jur", label: "Peças jurídicas", icon: "gavel", n: 156 },
  { k: "carto", label: "Cartografia e plantas", icon: "map", n: 274 },
  { k: "foto", label: "Acervo fotográfico", icon: "grid", n: 3810 },
];
const DOCUMENTOS = [
  { nome: "Processo de tombamento — Casarão da Praia Grande", tipo: "PDF", tam: "2,4 MB", bem: "APM-0142", autor: "IPHAN-MA", data: "12 Mar 2026", icon: "shield" },
  { nome: "Laudo de restauro estrutural — Solar de Alcântara", tipo: "PDF", tam: "5,1 MB", bem: "APM-0319", autor: "Eng. C. Pinheiro", data: "04 Mar 2026", icon: "doc" },
  { nome: "Relatório fotográfico 2026 — Centro Histórico", tipo: "ZIP", tam: "18,3 MB", bem: "APM-0142", autor: "H. Borba", data: "28 Fev 2026", icon: "grid" },
  { nome: "Planta cadastral — Engenho de Viana", tipo: "DWG", tam: "3,7 MB", bem: "APM-0512", autor: "Setor de cartografia", data: "21 Fev 2026", icon: "map" },
  { nome: "Parecer jurídico — ACP 0034521-22", tipo: "PDF", tam: "880 KB", bem: "APM-0287", autor: "Procuradoria", data: "15 Fev 2026", icon: "gavel" },
  { nome: "Ficha de vistoria assinada — V-2026-118", tipo: "PDF", tam: "1,2 MB", bem: "APM-0142", autor: "H. Borba", data: "12 Mar 2026", icon: "compass" },
  { nome: "Dossiê de registro — Tambor de Crioula", tipo: "PDF", tam: "9,6 MB", bem: "IMT-002", autor: "Setor imaterial", data: "08 Jan 2026", icon: "scroll" },
  { nome: "Termografia infravermelha — Sobrado dos Azulejos", tipo: "PDF", tam: "4,4 MB", bem: "APM-0701", autor: "Lab. UFMA", data: "19 Dez 2025", icon: "doc" },
];
const TIPO_CLR = { PDF: "var(--clay)", ZIP: "var(--ochre)", DWG: "var(--petroleum)", DOC: "var(--moss)" };

function DocsScreen({ go }) {
  const [pasta, setPasta] = useState("todas");
  return (
    <AdminShell route="docs" go={go} crumbs={<>Sistema · <b>Documentos</b></>}
      actions={<>
        <button className="btn sm"><Icon name="plus" size={12}/>Nova pasta</button>
        <button className="btn primary sm"><Icon name="upload" size={12}/>Enviar documento</button>
      </>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="caps">Repositório central · gestão documental</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Documentos</h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatBox k="Total de documentos" v="6.245" d="Vinculados a bens" accent/>
        <StatBox k="Armazenamento" v="42,8 GB" d="de 200 GB · 21%"/>
        <StatBox k="Adicionados em 30d" v="218" d="+12% vs mês anterior"/>
        <StatBox k="Aguardando validação" v="14" d="Fila de revisão" riskAccent/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        <aside style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <div className="card" style={{ padding: 12 }}>
            <div className="caps" style={{ padding: "6px 8px 10px" }}>Pastas</div>
            <div style={{ display: "grid", gap: 1 }}>
              <button onClick={() => setPasta("todas")} className="nav-flat" style={navFlat(pasta === "todas")}>
                <Icon name="layers" size={15}/><span style={{ flex: 1, textAlign: "left" }}>Todos os documentos</span>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>6.245</span>
              </button>
              {DOC_PASTAS.map(p => (
                <button key={p.k} onClick={() => setPasta(p.k)} className="nav-flat" style={navFlat(pasta === p.k)}>
                  <Icon name={p.icon} size={15}/><span style={{ flex: 1, textAlign: "left" }}>{p.label}</span>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{p.n}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 16, background: "var(--paper-2)" }}>
            <div className="caps" style={{ marginBottom: 8 }}>Uso do armazenamento</div>
            <div style={{ height: 8, background: "var(--bg-deep)", border: "1px solid var(--line)", marginBottom: 8 }}>
              <div style={{ height: "100%", width: "21%", background: "var(--petroleum)" }}/>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>42,8 GB de 200 GB</div>
          </div>
        </aside>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr auto", gap: 10 }}>
            <div className="search">
              <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
              <input placeholder="Buscar por nome, bem vinculado, autor..."/>
            </div>
            <select className="select"><option>Todos os tipos</option><option>PDF</option><option>ZIP</option><option>DWG</option></select>
            <select className="select"><option>Mais recentes</option><option>Maior tamanho</option><option>A — Z</option></select>
            <button className="btn"><Icon name="filter" size={13}/></button>
          </div>
          <table className="tbl">
            <thead><tr><th>Documento</th><th>Tipo</th><th>Tamanho</th><th>Bem vinculado</th><th>Autor</th><th>Data</th><th style={{ textAlign: "right" }}>Ações</th></tr></thead>
            <tbody>
              {DOCUMENTOS.map((d, i) => (
                <tr key={i}>
                  <td style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: "1px solid var(--line)", background: "var(--paper-2)" }}>
                      <Icon name={d.icon} size={15} style={{ color: TIPO_CLR[d.tipo] || "var(--ink-3)" }}/>
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{d.nome}</span>
                  </td>
                  <td><span className="badge" style={{ color: TIPO_CLR[d.tipo], borderColor: "currentColor", fontSize: 10 }}>{d.tipo}</span></td>
                  <td className="mono" style={{ fontSize: 12 }}>{d.tam}</td>
                  <td className="mono" style={{ fontSize: 12, color: "var(--petroleum)" }}>{d.bem}</td>
                  <td style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{d.autor}</td>
                  <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{d.data}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      <button className="icon-btn" title="Visualizar"><Icon name="eye" size={13}/></button>
                      <button className="icon-btn" title="Baixar"><Icon name="down2" size={13}/></button>
                      <button className="icon-btn" title="Mais"><Icon name="more" size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--ink-3)" }}>
            <span className="mono" style={{ letterSpacing: "0.06em" }}>1 — 8 DE 6.245</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn sm">← Anterior</button>
              <button className="btn sm primary">1</button>
              <button className="btn sm">2</button>
              <button className="btn sm">3</button>
              <button className="btn sm">Próxima →</button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
function navFlat(active) {
  return {
    display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", width: "100%",
    border: 0, background: active ? "var(--petroleum)" : "transparent",
    color: active ? "#FBF7EC" : "var(--ink-2)", cursor: "pointer", fontSize: 13,
    fontFamily: "inherit",
  };
}

/* =====================================================================
   6 · CONFIGURAÇÕES
   ===================================================================== */
function ConfigScreen({ go }) {
  const [secao, setSecao] = useState("inst");
  const secoes = [
    { k: "inst", label: "Instituição", icon: "house" },
    { k: "pref", label: "Preferências", icon: "settings" },
    { k: "notif", label: "Notificações", icon: "bell" },
    { k: "seg", label: "Segurança e acesso", icon: "lock" },
    { k: "integ", label: "Integrações", icon: "layers" },
    { k: "apar", label: "Aparência e idioma", icon: "eye" },
  ];

  return (
    <AdminShell route="config" go={go} crumbs={<>Sistema · <b>Configurações</b></>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 28 }}>
        <div>
          <div className="caps">Preferências do sistema</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Configurações</h1>
        </div>
        <button className="btn primary"><Icon name="check" size={13}/>Salvar alterações</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 24 }}>
        <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <div style={{ display: "grid", gap: 1 }}>
            {secoes.map(s => (
              <button key={s.k} onClick={() => setSecao(s.k)} className="nav-flat" style={navFlat(secao === s.k)}>
                <Icon name={s.icon} size={15}/><span style={{ flex: 1, textAlign: "left" }}>{s.label}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 16, border: "1px dashed var(--line-2)", background: "var(--paper-2)" }}>
            <div className="caps" style={{ marginBottom: 6 }}>Versão</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>SIP · v2.4.0</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", marginTop: 4 }}>Atualizado em 14 Mai 2026</div>
          </div>
        </aside>

        <div style={{ display: "grid", gap: 16 }}>
          {secao === "inst" && (
            <div className="card" style={{ padding: 28 }}>
              <SectionTitle n="01" t="Identificação institucional" s="Dados exibidos em relatórios e exportações oficiais."/>
              <Row cols={2}>
                <Field label="Nome do órgão gestor"><input className="input" defaultValue="Secretaria de Estado da Cultura — SECMA"/></Field>
                <Field label="Órgão técnico parceiro"><input className="input" defaultValue="IPHAN — Superintendência do Maranhão"/></Field>
              </Row>
              <div style={{ height: 16 }}/>
              <Row cols={3}>
                <Field label="Sigla do sistema"><input className="input mono" defaultValue="SIP-MA"/></Field>
                <Field label="E-mail institucional"><input className="input" defaultValue="patrimonio@cultura.ma.gov.br"/></Field>
                <Field label="Telefone"><input className="input mono" defaultValue="(98) 3000-0000"/></Field>
              </Row>
              <div style={{ height: 16 }}/>
              <Field label="Endereço da sede"><input className="input" defaultValue="Av. dos Holandeses, s/nº — São Luís / MA"/></Field>
            </div>
          )}

          {secao === "pref" && (
            <div className="card" style={{ padding: 28 }}>
              <SectionTitle n="02" t="Preferências do sistema" s="Comportamento padrão de cadastros e listagens."/>
              <SettingRow title="Numeração automática de bens" desc="Gera o identificador (APM-····) automaticamente ao criar um novo cadastro.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Validação por dois técnicos" desc="Exige aprovação de um segundo revisor antes de publicar um bem.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Salvamento automático de rascunhos" desc="Salva o formulário de cadastro a cada 30 segundos.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Itens por página nas listagens">
                <select className="select" style={{ width: 110 }} defaultValue="25"><option>10</option><option>25</option><option>50</option><option>100</option></select>
              </SettingRow>
              <SettingRow title="Datum geográfico padrão">
                <select className="select" style={{ width: 180 }}><option>SIRGAS 2000 (EPSG:4674)</option><option>WGS 84 (EPSG:4326)</option></select>
              </SettingRow>
            </div>
          )}

          {secao === "notif" && (
            <div className="card" style={{ padding: 28 }}>
              <SectionTitle n="03" t="Notificações" s="Quais alertas você deseja receber e por qual canal."/>
              <SettingRow title="Vistorias a vencer" desc="Avisa 30 dias antes do vencimento de uma vistoria programada.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Novos riscos críticos" desc="Notifica imediatamente quando um bem é classificado como risco crítico.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Movimentações judiciais" desc="Acompanha mudanças de fase em processos vinculados a bens.">
                <Toggle on={false}/>
              </SettingRow>
              <SettingRow title="Resumo semanal por e-mail" desc="Boletim com indicadores e pendências, toda segunda-feira.">
                <Toggle on={true}/>
              </SettingRow>
            </div>
          )}

          {secao === "seg" && (
            <div className="card" style={{ padding: 28 }}>
              <SectionTitle n="04" t="Segurança e acesso" s="Políticas de autenticação e proteção de dados sensíveis."/>
              <SettingRow title="Autenticação em dois fatores (2FA)" desc="Exige um segundo fator no login de todos os administradores.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Mascarar coordenadas de sítios restritos" desc="Oculta a localização exata de sítios arqueológicos protegidos.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Registro de auditoria" desc="Mantém log imutável de todas as edições e exclusões.">
                <Toggle on={true}/>
              </SettingRow>
              <SettingRow title="Expiração de sessão">
                <select className="select" style={{ width: 140 }}><option>30 minutos</option><option>1 hora</option><option>4 horas</option><option>8 horas</option></select>
              </SettingRow>
              <SettingRow title="Tempo de retenção do log de auditoria">
                <select className="select" style={{ width: 140 }}><option>1 ano</option><option>5 anos</option><option>Permanente</option></select>
              </SettingRow>
            </div>
          )}

          {secao === "integ" && (
            <div className="card" style={{ padding: 28 }}>
              <SectionTitle n="05" t="Integrações" s="Serviços externos conectados ao sistema."/>
              {[
                ["SICG — IPHAN", "Sistema Integrado de Conhecimento e Gestão", true, "shield"],
                ["Portal de Dados Abertos do MA", "Publicação automática do acervo público", true, "external"],
                ["Geoportal IBGE", "Camadas de base cartográfica oficiais", true, "map"],
                ["Diário Oficial do Estado", "Consulta automática de atos de tombamento", false, "doc"],
                ["Processo Judicial Eletrônico (PJe)", "Acompanhamento de ações judiciais", false, "gavel"],
              ].map(([t, d, on, ic]) => (
                <SettingRow key={t} title={<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Icon name={ic} size={15} style={{ color: "var(--petroleum)" }}/>{t}</span>} desc={d}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="caps" style={{ color: on ? "var(--moss)" : "var(--ink-3)" }}>{on ? "Conectado" : "Desconectado"}</span>
                    <Toggle on={on}/>
                  </div>
                </SettingRow>
              ))}
            </div>
          )}

          {secao === "apar" && (
            <div className="card" style={{ padding: 28 }}>
              <SectionTitle n="06" t="Aparência e idioma" s="Personalização da interface."/>
              <SettingRow title="Idioma da interface">
                <select className="select" style={{ width: 180 }}><option>Português (Brasil)</option><option>English</option><option>Español</option></select>
              </SettingRow>
              <SettingRow title="Densidade das tabelas">
                <select className="select" style={{ width: 140 }}><option>Confortável</option><option>Compacta</option></select>
              </SettingRow>
              <SettingRow title="Formato de data">
                <select className="select" style={{ width: 160 }}><option>DD/MM/AAAA</option><option>DD Mês AAAA</option><option>AAAA-MM-DD</option></select>
              </SettingRow>
              <SettingRow title="Animações de transição" desc="Reduz movimento para acessibilidade.">
                <Toggle on={true}/>
              </SettingRow>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { GeoScreen, JudicialScreen, ArqueoAdminScreen, ImaterialAdminScreen, DocsScreen, ConfigScreen, Toggle });
