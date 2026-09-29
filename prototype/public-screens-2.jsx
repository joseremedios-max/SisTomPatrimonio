/* ============ FICHA + IMATERIAL + ARQUEOLOGICO + LOGIN ============ */

function FichaScreen({ go, item }) {
  const im = item || IMOVEIS[0];
  const [galIdx, setGalIdx] = useState(0);
  const gallerySource = (im.gallery && im.gallery.length)
    ? im.gallery
    : (im.imgUrl ? [{ url: im.imgUrl, label: im.img }] : []);
  const galleries = gallerySource.length
    ? gallerySource
    : [
        { url: null, label: im.img },
        { url: null, label: "Detalhe · azulejo português biscoito" },
        { url: null, label: "Pátio interno · jardim de inverno" },
      ];
  const current = galleries[galIdx] || galleries[0];

  const timeline = [
    { y: im.construcao, t: "Construção estimada", d: "Edificação ergue-se no ciclo do algodão maranhense.", icon: "house" },
    { y: "1923", t: "Conversão em armazém", d: "Família Ribeiro Pinto vende o imóvel; passa a abrigar comércio de fumo.", icon: "scroll" },
    { y: im.tombamento_ano, t: "Tombamento federal", d: "Inscrição nos Livros do Tombo Histórico e Belas Artes — IPHAN.", icon: "shield" },
    { y: "2008–2011", t: "Restauração", d: "Programa Monumenta executa restauro de fachadas, esquadrias e cobertura.", icon: "compass" },
    { y: "2019", t: "Reabertura ao público", d: "Convertido em espaço expositivo permanente.", icon: "eye" },
    { y: im.vistoria, t: "Última vistoria técnica", d: "Verificação anual da estrutura e azulejaria do térreo. Sem ocorrências.", icon: "check" },
  ];

  return (
    <div style={{ background: "var(--paper-2)" }}>
      {/* hero gallery */}
      <div style={{ position: "relative", background: "var(--ink)" }}>
        <div className={`ph-img dark ${current.url ? "has-photo" : ""}`} style={{ height: 520, border: 0 }} data-label={current.label}>
          {current.url && <img className="ph-photo" src={current.url} alt={current.label} loading="lazy" style={{ filter: "brightness(0.85)" }}/>}
        </div>
        <div style={{ position: "absolute", top: 20, left: 24, display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn ghost sm" style={{ background: "rgba(251,247,236,0.92)", border: "1px solid rgba(251,247,236,0.92)" }} onClick={() => go("acervo")}>
            ← Voltar ao acervo
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 18, right: 24, display: "flex", gap: 6 }}>
          {galleries.map((_, i) => (
            <button key={i} onClick={() => setGalIdx(i)} style={{ width: 56, height: 4, background: i === galIdx ? "var(--gold)" : "rgba(251,247,236,0.35)", border: 0, padding: 0 }}/>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 18, left: 24, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "rgba(251,247,236,0.85)", textTransform: "uppercase", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
          {galIdx + 1} / {galleries.length} · {current.label}
        </div>
      </div>

      {/* Header */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px 28px" }}>
          <div className="between" style={{ alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <StatusBadge status={im.situacao}/>
                {im.tombamento_ano !== "Em processo" && <span className="badge tombado"><span className="dot"/>Tombado · {im.esfera}</span>}
                <span className="badge"><span className="dot"/>{im.publico}</span>
                {im.judicial && <span className="badge risco"><Icon name="gavel" size={10}/>Ação judicial em curso</span>}
                {im.vistoria === "Pendente" || im.vistoria.startsWith("Pendente") ? <span className="badge atencao"><span className="dot"/>Vistoria pendente</span> : <span className="badge"><Icon name="check" size={10}/>Vistoria em dia</span>}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", color: "var(--ink-3)" }}>
                ACERVO SIP · MARANHÃO · {im.id}
              </div>
              <h1 className="display" style={{ fontSize: 72, margin: "6px 0 14px", lineHeight: 1.1, maxWidth: 900 }}>{im.nome}</h1>
              <div style={{ display: "flex", gap: 24, fontSize: 14, color: "var(--ink-2)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="pin" size={14}/>{im.municipio} · {im.bairro}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="house" size={14}/>{im.tipo}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="history" size={14}/>{im.construcao}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn primary"><Icon name="down2" size={13}/>Baixar ficha (PDF)</button>
              <button className="btn"><Icon name="external" size={13}/>Compartilhar</button>
              <button className="btn ghost sm" style={{ alignSelf: "end" }}>Reportar inconsistência</button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 80px", display: "grid", gridTemplateColumns: "240px 1fr 320px", gap: 48 }}>
        {/* TOC */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <div className="caps" style={{ marginBottom: 14 }}>Conteúdo</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 4 }}>
            {[
              ["ident", "01 · Identificação"],
              ["protec", "02 · Proteção e situação jurídica"],
              ["conserv", "03 · Conservação"],
              ["hist", "04 · Histórico"],
              ["loc", "05 · Localização"],
              ["docs", "06 · Documentos e referências"],
              ["timeline", "07 · Linha do tempo"],
            ].map(([k, l], i) => (
              <li key={k}><a style={{ display: "block", fontSize: 13, color: i === 0 ? "var(--ink)" : "var(--ink-3)", padding: "6px 10px", borderLeft: `2px solid ${i === 0 ? "var(--petroleum)" : "var(--line-soft)"}`, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>{l}</a></li>
            ))}
          </ul>
        </aside>

        {/* MAIN */}
        <main style={{ display: "grid", gap: 56 }}>
          {/* IDENTIFICAÇÃO */}
          <Section num="01" title="Identificação">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
              <Meta k="Número de identificação" v={im.id} mono/>
              <Meta k="Matrícula" v={im.matricula} mono/>
              <Meta k="Tipo de imóvel" v={im.tipo}/>
              <Meta k="Tipologia arquitetônica" v={im.tipologia}/>
              <Meta k="Número de pavimentos" v={im.pavimentos}/>
              <Meta k="Quantidade de cômodos" v={im.comodos}/>
              <Meta k="Uso original" v={im.uso_orig}/>
              <Meta k="Uso atual" v={im.uso_atual}/>
            </div>
          </Section>

          {/* PROTEÇÃO */}
          <Section num="02" title="Proteção e situação jurídica">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
              <Meta k="Órgão responsável" v={im.orgao}/>
              <Meta k="Esfera de tombamento" v={im.esfera}/>
              <Meta k="Ano de tombamento" v={im.tombamento_ano}/>
              <Meta k="Processo IPHAN" v={im.iphan_link} mono/>
              <Meta k="Domínio" v={im.publico}/>
              <Meta k="Restrições de acesso" v={im.uso_atual === "Vago" ? "Acesso interno restrito" : "Acesso público"}/>
              <Meta k="Ação judicial" v={im.judicial ? "Sim — em curso" : "Não consta"}/>
              <Meta k="Embargos" v="Não constam"/>
            </div>
            {im.judicial && (
              <div style={{ marginTop: 22, padding: "14px 18px", background: "var(--clay-soft)", border: "1px solid var(--clay)", display: "flex", gap: 12, alignItems: "start" }}>
                <Icon name="gavel" size={16} style={{ color: "var(--clay)", marginTop: 2 }}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--clay)" }}>Ação judicial registrada</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.55 }}>
                    Processo nº 0034521-22.2024.4.01.3700 · Vara Federal de São Luís · Em fase de instrução. Mantenedor notificado em 14/02/2025.
                  </div>
                </div>
              </div>
            )}
          </Section>

          {/* CONSERVAÇÃO */}
          <Section num="03" title="Conservação">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
              <Indicator label="Situação atual" value={STATUS_META[im.situacao].label} color={`var(--st-${im.situacao})`}/>
              <Indicator label="Grau de risco" value={im.risco} color={im.risco === "Alto" || im.risco === "Crítico" ? "var(--clay)" : im.risco === "Médio" ? "var(--ochre)" : "var(--moss)"}/>
              <Indicator label="Última vistoria" value={im.vistoria}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
              <Meta k="Vistorias realizadas" v="14 (desde 1998)"/>
              <Meta k="Última intervenção" v="Restauro · 2011"/>
              <Meta k="Patologias registradas" v="Nenhuma ativa"/>
              <Meta k="Próxima vistoria" v="12 Mar 2027"/>
            </div>
            <div style={{ marginTop: 22 }}>
              <div className="label" style={{ marginBottom: 8 }}>Observações técnicas</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-2)", margin: 0 }}>
                Estrutura em alvenaria de pedra e tijolo maciço com sobrados em madeira de lei (peroba e angelim). Inspeção termográfica realizada em janeiro de 2026 não identificou pontos críticos de umidade. Recomenda-se monitoramento contínuo dos azulejos do térreo nos meses chuvosos.
              </p>
            </div>
          </Section>

          {/* HISTÓRICO */}
          <Section num="04" title="Histórico">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 1.4, color: "var(--ink)", margin: "0 0 16px", letterSpacing: "-0.005em" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 64, float: "left", lineHeight: 0.85, marginRight: 10, color: "var(--gold)" }}>E</span>
              {im.historico.substring(1)}
            </p>
          </Section>

          {/* LOCALIZAÇÃO */}
          <Section num="05" title="Localização">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <Meta k="Endereço" v={im.endereco}/>
                <Meta k="Bairro / Localidade" v={im.bairro}/>
                <Meta k="Município" v={im.municipio}/>
                <Meta k="Coordenadas" v={im.latitude != null ? `${im.latitude.toFixed(4)}, ${im.longitude.toFixed(4)}` : "—"} mono/>
                <Meta k="Datum" v="SIRGAS 2000" mono/>
                <Meta k="Zona urbana" v="Sim — Centro Histórico"/>
              </div>
              <div style={{ height: 280, border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                <MapBase bare showChrome={false} showNeighbors={false}>
                  <MapPin item={im} active/>
                </MapBase>
              </div>
            </div>
          </Section>

          {/* DOCUMENTOS */}
          <Section num="06" title="Documentos e referências">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Processo de tombamento", "PDF · 2.4 MB", "1955"],
                ["Laudo técnico de restauro", "PDF · 5.1 MB", "2011"],
                ["Fotografias históricas (acervo IPHAN)", "ZIP · 18 imagens", "1920–1960"],
                ["Relatório de vistoria 2026", "PDF · 1.2 MB", "Mar 2026"],
                ["Estudo arquitetônico (UFMA)", "PDF · 12.8 MB", "2018"],
                ["Inscrição azulejaria — biscoito português", "Documento técnico", "2014"],
              ].map(([t, m, y], i) => (
                <div key={i} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <Icon name="doc" size={20} style={{ color: "var(--gold)" }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.06em", color: "var(--ink-3)", marginTop: 2 }}>{m} · {y}</div>
                  </div>
                  <Icon name="down2" size={14} style={{ color: "var(--ink-3)" }}/>
                </div>
              ))}
            </div>
          </Section>

          {/* TIMELINE */}
          <Section num="07" title="Linha do tempo">
            <div style={{ display: "grid", gap: 0, position: "relative", paddingLeft: 30 }}>
              <div style={{ position: "absolute", left: 9, top: 14, bottom: 14, width: 1, background: "var(--line-2)" }}/>
              {timeline.map((e, i) => (
                <div key={i} style={{ position: "relative", padding: "14px 0", display: "grid", gridTemplateColumns: "140px 1fr", gap: 24 }}>
                  <div style={{ position: "absolute", left: -30, top: 18, width: 18, height: 18, borderRadius: "50%", background: "var(--paper-2)", border: "1.5px solid var(--gold)", display: "grid", placeItems: "center", color: "var(--gold)" }}>
                    <Icon name={e.icon} size={9} stroke={2}/>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", color: "var(--gold)", textTransform: "uppercase", paddingTop: 4 }}>{e.y}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.2 }}>{e.t}</div>
                    <div style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.6 }}>{e.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </main>

        {/* RIGHT RAIL */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start", display: "grid", gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="caps" style={{ marginBottom: 14 }}>Resumo rápido</div>
            <div style={{ display: "grid", gap: 0 }}>
              {[
                ["ID", im.id, true],
                ["Município", im.municipio],
                ["Tipo", im.tipo],
                ["Construção", im.construcao],
                ["Tombamento", im.tombamento_ano],
                ["Domínio", im.publico],
                ["Risco", im.risco],
              ].map(([k, v, mono], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dotted var(--line-soft)", fontSize: 12.5 }}>
                  <span className="label">{k}</span>
                  <span style={{ fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20, background: "var(--ink)", color: "#F2EDE0", border: 0 }}>
            <div className="caps" style={{ color: "var(--gold)", marginBottom: 10 }}>Bens relacionados</div>
            {IMOVEIS.filter(x => x.id !== im.id && x.municipio === im.municipio).slice(0, 3).map(x => (
              <div key={x.id} onClick={() => go("ficha", x)} style={{ padding: "12px 0", borderTop: "1px solid #2A2F2C", cursor: "pointer" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "#98998C" }}>{x.id}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, marginTop: 2 }}>{x.nome}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18, background: "var(--paper-2)" }}>
            <div style={{ display: "flex", alignItems: "start", gap: 10 }}>
              <Icon name="info" size={18} style={{ color: "var(--petroleum)", marginTop: 1 }}/>
              <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
                Última atualização: <strong>14 Abr 2026</strong> por <strong>Arq. Helena Borba</strong>. Os dados são revisados continuamente pela equipe técnica.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ num, title, children, action }) {
  return (
    <section className="card" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "16px 24px", borderBottom: "1px solid var(--line)", background: "var(--paper-2)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--gold)" }}>§ {num}</div>
          <h2 className="display" style={{ fontSize: 22, margin: 0, lineHeight: 1.15 }}>{title}</h2>
        </div>
        {action}
      </div>
      <div style={{ padding: "22px 24px" }}>
        {children}
      </div>
    </section>
  );
}

function Indicator({ label, value, color }) {
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "14px 16px", borderLeft: `3px solid ${color || "var(--ink-3)"}` }}>
      <div className="label">{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.1, marginTop: 4, color: color || "var(--ink)" }}>{value}</div>
    </div>
  );
}

/* ---------- IMATERIAL ---------- */
function ImaterialScreen({ go }) {
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "44px 32px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="caps">Patrimônio imaterial · 38 manifestações registradas</div>
        <h1 className="display" style={{ fontSize: 72, margin: "10px 0 14px", lineHeight: 1.1 }}>
          Saberes, festas e <em style={{ fontStyle: "italic", color: "var(--clay)" }}>modos de fazer</em>.
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 760, lineHeight: 1.6 }}>
          Manifestações culturais que dão identidade ao Maranhão — do Bumba-meu-boi ao Tambor de Crioula, das festas do Divino aos saberes tradicionais quilombolas.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
        <Select label="Município" options={["Todos", "São Luís", "Alcântara", "Cururupu", "Estadual"]}/>
        <Select label="Categoria" options={["Todas", "Festa popular", "Dança e canto", "Manifestação religiosa", "Saber tradicional", "Música urbana"]}/>
        <Select label="Reconhecimento" options={["Todos", "Reconhecido — UNESCO", "Reconhecido — IPHAN", "Reconhecido — Estado", "Em registro", "Em estudo"]}/>
        <Select label="Região" options={["Todas", "Capital", "Litoral", "Quilombola", "Sertão"]}/>
        <Select label="Ordenar por" options={["Nome", "Reconhecimento", "Região"]}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
        {IMATERIAL.map((m, i) => (
          <div key={m.id} className="card" style={{ border: 0, gridColumn: i === 0 ? "span 1" : "auto", gridRow: i === 0 ? "span 2" : "auto" }}>
            <div className={`ph-img ${m.imgUrl ? "has-photo" : ""}`} style={{ aspectRatio: i === 0 ? "1/1" : "16/10", border: 0, borderBottom: "1px solid var(--line)" }} data-label={m.img}>
              {m.imgUrl && <img className="ph-photo" src={m.imgUrl} alt={m.nome} loading="lazy"/>}
            </div>
            <div style={{ padding: i === 0 ? "28px 32px" : "20px 22px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", color: "var(--ink-3)" }}>{m.id} · {m.categoria.toUpperCase()}</div>
              <div className="display" style={{ fontSize: i === 0 ? 40 : 22, margin: "6px 0 10px", lineHeight: 1.12 }}>{m.nome}</div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="pin" size={12}/>{m.municipio}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="shield" size={12}/>{m.regiao}</span>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>{m.resumo}</p>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dotted var(--line-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge" style={{ borderColor: m.status.includes("UNESCO") ? "var(--gold)" : m.status.includes("Em") ? "var(--ochre)" : "var(--petroleum)", color: m.status.includes("UNESCO") ? "var(--gold)" : m.status.includes("Em") ? "var(--ochre)" : "var(--petroleum)", background: m.status.includes("UNESCO") ? "var(--gold-soft)" : m.status.includes("Em") ? "var(--ochre-soft)" : "var(--petroleum-soft)" }}>
                  <span className="dot"/>{m.status}
                </span>
                <Icon name="arrow" size={14}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- ARQUEOLOGICOS ---------- */
function ArqueoScreen({ go }) {
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "44px 32px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="caps">Sítios arqueológicos · 62 registros</div>
        <h1 className="display" style={{ fontSize: 72, margin: "10px 0 14px", lineHeight: 1.1 }}>
          Patrimônio arqueológico do Maranhão.
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 760, lineHeight: 1.6 }}>
          Sambaquis, sítios rupestres, engenhos coloniais e remanescentes quilombolas. Por razões de preservação e segurança, certas coordenadas são parcialmente ocultas ou disponibilizadas apenas mediante credenciamento.
        </p>
      </div>

      <div className="card" style={{ padding: "14px 18px", marginBottom: 28, background: "var(--ochre-soft)", borderColor: "var(--ochre)", display: "flex", gap: 12, alignItems: "start" }}>
        <Icon name="lock" size={18} style={{ color: "var(--ochre)", marginTop: 2 }}/>
        <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
          <strong style={{ color: "var(--ink)" }}>Acesso parcial</strong> · Para proteção dos sítios, parte das informações de localização e dados sensíveis está restrita a usuários credenciados. Pesquisadores podem solicitar acesso pelo formulário institucional.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        <div style={{ display: "grid", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
          {ARQUEOLOGICOS.map(s => (
            <div key={s.id} className="card" style={{ border: 0, padding: "22px 24px", display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {s.restrito ? <span className="badge atencao"><Icon name="lock" size={10}/>Acesso restrito</span> : <span className="badge preservado"><span className="dot"/>Acesso público</span>}
                  <span className="badge"><span className="dot"/>{s.tipo}</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", color: "var(--ink-3)" }}>{s.id}</div>
                <div className="display" style={{ fontSize: 28, margin: "4px 0 6px", lineHeight: 1.1 }}>{s.nome}</div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Icon name="pin" size={12}/>{s.municipio}
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-2)", margin: 0, lineHeight: 1.6, maxWidth: 560 }}>{s.resumo}</p>
                <div style={{ marginTop: 14, display: "flex", gap: 18, fontSize: 12 }}>
                  <span><span className="label">Proteção</span> · <strong>{s.protecao}</strong></span>
                  <span><span className="label">Acesso</span> · <strong>{s.acesso}</strong></span>
                </div>
              </div>
              {s.restrito ? (
                <div className="ph-img" style={{ width: 140, height: 110, position: "relative" }} data-label="">
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(26,31,28,0.55)", color: "#FBF7EC", flexDirection: "column" }}>
                    <Icon name="lock" size={20}/>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", marginTop: 6 }}>RESTRITO</div>
                  </div>
                </div>
              ) : (
                <div className={`ph-img ${s.imgUrl ? "has-photo" : ""}`} style={{ width: 140, height: 110 }} data-label={s.nome.split(" ").slice(0, 2).join(" ")}>
                  {s.imgUrl && <img className="ph-photo" src={s.imgUrl} alt={s.nome} loading="lazy"/>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ position: "sticky", top: 24, alignSelf: "start", height: 540, border: "1px solid var(--line)" }}>
          <MapBase bare showChrome={false} showNeighbors={false}>
            {ARQUEOLOGICOS.map(s => (
              <MapPin key={s.id} item={{ ...s, situacao: s.restrito ? "atencao" : "preservado" }} restricted={s.restrito}/>
            ))}
          </MapBase>
          <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(251,247,236,0.95)", border: "1px solid var(--line)", padding: "10px 14px", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }}>
            <div className="caps">Sítios arqueológicos</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 6, display: "grid", gap: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 9, background: "var(--moss)" }}/>
                Acesso público
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 9, background: "var(--ochre)", boxShadow: "0 0 0 2px rgba(168,112,24,0.18)" }}/>
                Localização aproximada
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- LOGIN ---------- */
function LoginScreen({ go }) {
  const [email, setEmail] = useState("helena.borba@iphan.gov.br");
  const [pwd, setPwd] = useState("••••••••••••");

  return (
    <div style={{ minHeight: "calc(100vh - 110px)", display: "grid", gridTemplateColumns: "1fr 1.2fr" }}>
      <div style={{ padding: "60px 56px", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--paper)", borderRight: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 380, width: "100%" }}>
          <div className="caps">Acesso restrito</div>
          <h1 className="display" style={{ fontSize: 48, margin: "8px 0 8px", lineHeight: 1.1 }}>Entrar no sistema</h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, marginBottom: 32 }}>
            Plataforma de gestão do SIP — Sistema Integrado de Informações Patrimoniais. O acesso é exclusivo para servidores e técnicos credenciados.
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            <div className="field">
              <label>E-mail institucional</label>
              <input className="input" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="field">
              <label>Senha</label>
              <input className="input" type="password" value={pwd} onChange={e => setPwd(e.target.value)}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--ink-2)" }}>
                <input type="checkbox" defaultChecked/> Manter sessão ativa
              </label>
              <a style={{ color: "var(--petroleum)", borderBottom: "1px solid var(--petroleum)", paddingBottom: 1, cursor: "pointer" }}>Recuperar senha</a>
            </div>
            <button className="btn primary lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => go("dash")}>
              Acessar sistema <Icon name="arrow" size={14}/>
            </button>
            <button className="btn" style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="shield" size={14}/> Entrar com Gov.br
            </button>
          </div>

          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--line-soft)", display: "flex", gap: 10, alignItems: "start", fontSize: 12, color: "var(--ink-3)" }}>
            <Icon name="lock" size={14} style={{ marginTop: 2, color: "var(--ink-3)" }}/>
            <div>
              Acesso monitorado e auditado. Tentativas de acesso indevido são registradas e podem ser comunicadas à autoridade competente.
            </div>
          </div>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid var(--line-soft)" }}>
            <div className="caps" style={{ marginBottom: 12 }}>Coordenação institucional</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ background: "#FBF8F0", padding: "6px 10px", borderRadius: 4, border: "1px solid var(--line-soft)", height: 44, display: "flex", alignItems: "center" }}>
                <img src="assets/logo-gov-ma.png" alt="Governo do Maranhão" style={{ height: 28, width: "auto", display: "block" }}/>
              </div>
              <div style={{ background: "#FBF8F0", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--line-soft)", height: 44, display: "flex", alignItems: "center" }}>
                <img src="assets/logo-iphan.png" alt="IPHAN" style={{ height: 32, width: "auto", display: "block" }}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--ink)", position: "relative", overflow: "hidden" }}>
        <div className="ph-img dark has-photo" style={{ position: "absolute", inset: 0, border: 0 }} data-label="Vista do Centro Histórico de São Luís ao entardecer · Praia Grande">
          <img className="ph-photo" src={window.IMG.slz_centro} alt="Centro Histórico de São Luís" loading="lazy" style={{ filter: "brightness(0.55)" }}/>
        </div>
        <div style={{ position: "absolute", inset: 0, padding: 56, display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#F2EDE0" }}>
          <div className="caps" style={{ color: "var(--gold)" }}>Sobre o sistema</div>
          <h2 className="display" style={{ fontSize: 52, margin: "12px 0 16px", color: "#FBF7EC", maxWidth: 560, lineHeight: 1.1 }}>
            “Documentar para preservar; preservar para transmitir.”
          </h2>
          <p style={{ fontSize: 14, color: "#D8D2BF", maxWidth: 480, lineHeight: 1.6 }}>
            A área administrativa permite a inserção, edição e validação de bens do acervo. Cada alteração é registrada e auditável.
          </p>
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #3A3F3C", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, maxWidth: 480 }}>
            {[["1.284", "Bens"], ["94", "Municípios"], ["18", "Órgãos parceiros"]].map(([v, k], i) => (
              <div key={i}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--gold)" }}>{v}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#98998C" }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FichaScreen, ImaterialScreen, ArqueoScreen, LoginScreen, Section, Indicator });
