/* ============ ADMIN SCREENS 2: FORM, VISTORIAS, RELATORIOS, USUARIOS ============ */

/* ---------- FORM (cadastro/edição) ---------- */
function FormScreen({ go, item }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Identificação", "Localização", "Características arquitetônicas",
    "Proteção e tombamento", "Situação jurídica", "Conservação e risco",
    "Vistorias", "Imagens e documentos", "Observações e histórico", "Revisão final"
  ];

  return (
    <AdminShell route="imoveis" go={go} crumbs={<>Acervo · Imóveis · <b>{item ? "Editar — " + item.id : "Novo cadastro"}</b></>}
      actions={<><button className="btn sm">Cancelar</button><button className="btn primary sm">Salvar rascunho</button></>}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 320px", gap: 24 }}>

        {/* STEPS NAV */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <div className="caps" style={{ marginBottom: 14 }}>Etapas do cadastro</div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 2 }}>
            {steps.map((s, i) => {
              const isActive = i === step, isDone = i < step;
              return (
                <li key={s} onClick={() => setStep(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: isActive ? "var(--paper)" : "transparent", border: "1px solid " + (isActive ? "var(--line)" : "transparent"), cursor: "pointer" }}>
                  <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", border: "1.5px solid " + (isActive ? "var(--petroleum)" : isDone ? "var(--moss)" : "var(--line-2)"), background: isActive ? "var(--petroleum)" : isDone ? "var(--moss)" : "transparent", color: isActive || isDone ? "#FBF7EC" : "var(--ink-3)", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}>
                    {isDone ? <Icon name="check" size={11} stroke={2.5}/> : (i + 1).toString().padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 13, color: isActive ? "var(--ink)" : isDone ? "var(--ink-2)" : "var(--ink-3)", fontWeight: isActive ? 500 : 400 }}>{s}</span>
                </li>
              );
            })}
          </ol>

          <div style={{ marginTop: 24, padding: 16, background: "var(--paper-2)", border: "1px dashed var(--line-2)" }}>
            <div className="caps">Progresso</div>
            <div style={{ marginTop: 8, height: 4, background: "var(--bg-deep)" }}>
              <div style={{ height: "100%", background: "var(--gold)", width: `${(step + 1) / steps.length * 100}%` }}/>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 8 }}>
              Etapa {step + 1} de {steps.length} · {Math.round((step + 1) / steps.length * 100)}% concluído
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "22px 32px 18px", borderBottom: "1px solid var(--line)" }}>
            <div className="caps">Etapa {step + 1} de {steps.length}</div>
            <h2 className="display" style={{ fontSize: 32, margin: "6px 0 0" }}>{steps[step]}</h2>
          </div>

          <div style={{ padding: "28px 32px" }}>
            {step === 0 && <StepIdentificacao item={item}/>}
            {step === 1 && <StepLocalizacao/>}
            {step === 2 && <StepArquitetura/>}
            {step === 3 && <StepProtecao/>}
            {step === 4 && <StepJuridica/>}
            {step === 5 && <StepConservacao/>}
            {step === 6 && <StepVistorias/>}
            {step === 7 && <StepUploads/>}
            {step === 8 && <StepObservacoes/>}
            {step === 9 && <StepRevisao/>}
          </div>

          <div style={{ padding: "18px 32px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--paper-2)" }}>
            <button className="btn" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))} style={step === 0 ? { opacity: 0.4 } : null}>
              ← Etapa anterior
            </button>
            <span style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
              Salvamento automático às 09:23
            </span>
            <button className="btn primary" onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
              {step === steps.length - 1 ? "Publicar imóvel" : "Próxima etapa"} <Icon name="arrow" size={13}/>
            </button>
          </div>
        </div>

        {/* HELP RAIL */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start", display: "grid", gap: 12 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="caps" style={{ marginBottom: 8 }}>Diretrizes</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
              Preencha todos os campos obrigatórios. Dados sensíveis devem ser revisados por dois técnicos antes da publicação.
            </div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div className="caps" style={{ marginBottom: 10 }}>Referências cruzadas</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8, fontSize: 13 }}>
              <li style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon name="doc" size={13} style={{ color: "var(--gold)" }}/>Manual de classificação tipológica</li>
              <li style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon name="doc" size={13} style={{ color: "var(--gold)" }}/>Normativa IPHAN 04/2015</li>
              <li style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon name="doc" size={13} style={{ color: "var(--gold)" }}/>Manual de uso do sistema</li>
            </ul>
          </div>
          {item && (
            <div className="card" style={{ padding: 18, background: "var(--paper-2)" }}>
              <div className="caps" style={{ marginBottom: 6 }}>Editando</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.2 }}>{item.nome}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", marginTop: 4 }}>{item.id}</div>
            </div>
          )}
        </aside>

      </div>
    </AdminShell>
  );
}

/* ---- FORM STEPS ---- */
function StepIdentificacao({ item }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Row>
        <Field label="Nome do imóvel" required><input className="input" defaultValue={item?.nome || ""} placeholder="Ex. Casarão Colonial da Praia Grande"/></Field>
      </Row>
      <Row cols={3}>
        <Field label="Número de identificação" hint="Gerado automaticamente"><input className="input mono" defaultValue={item?.id || "APM-—"} readOnly style={{ background: "var(--bg-deep)" }}/></Field>
        <Field label="Tipo de imóvel" required>
          <select className="select" defaultValue={item?.tipo || ""}>
            <option value="">Selecione...</option>
            <option>Casarão</option><option>Sobrado</option><option>Solar</option>
            <option>Casa térrea</option><option>Edifício religioso</option><option>Conjunto rural</option>
          </select>
        </Field>
        <Field label="Tipologia arquitetônica"><input className="input" defaultValue={item?.tipologia || ""} placeholder="Ex. Sobrado luso-brasileiro azulejado"/></Field>
      </Row>
      <Row cols={3}>
        <Field label="Matrícula no Registro de Imóveis"><input className="input mono" defaultValue={item?.matricula || ""}/></Field>
        <Field label="Cartório / Comarca"><input className="input" defaultValue="1ª CRI — São Luís"/></Field>
        <Field label="Data de cadastro" hint="Automática"><input className="input mono" defaultValue="14/05/2026" readOnly style={{ background: "var(--bg-deep)" }}/></Field>
      </Row>
      <Row cols={2}>
        <Field label="Uso original"><input className="input" defaultValue={item?.uso_orig || ""}/></Field>
        <Field label="Uso atual"><input className="input" defaultValue={item?.uso_atual || ""}/></Field>
      </Row>
    </div>
  );
}

function StepLocalizacao() {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Row cols={3}>
        <Field label="Município" required>
          <select className="select" defaultValue="São Luís">{MUNICIPIOS.map(m => <option key={m}>{m}</option>)}</select>
        </Field>
        <Field label="Distrito / Localidade"><input className="input" defaultValue="Centro"/></Field>
        <Field label="Bairro"><input className="input" defaultValue="Praia Grande"/></Field>
      </Row>
      <Row>
        <Field label="Endereço (logradouro, número e complemento)"><input className="input" defaultValue="Rua Portugal, 187"/></Field>
      </Row>
      <Row cols={4}>
        <Field label="Latitude" hint="WGS84 / SIRGAS 2000"><input className="input mono" defaultValue="−2.5301"/></Field>
        <Field label="Longitude"><input className="input mono" defaultValue="−44.3024"/></Field>
        <Field label="CEP"><input className="input mono" defaultValue="65010-460"/></Field>
        <Field label="Zona"><select className="select"><option>Urbana</option><option>Rural</option></select></Field>
      </Row>
      <div style={{ height: 240, border: "1px solid var(--line)", position: "relative" }}>
        <MapBase bare showChrome={false} showNeighbors={false}>
          <MapPin item={{ nome: "Localização atual", lat: 44, lng: 13.5, situacao: "preservado" }} active/>
        </MapBase>
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(251,247,236,0.95)", padding: "8px 12px", border: "1px solid var(--line)", display: "flex", gap: 10, alignItems: "center", fontSize: 12 }}>
          <Icon name="pin" size={13} style={{ color: "var(--petroleum)" }}/>
          Clique no mapa para refinar a posição
        </div>
      </div>
    </div>
  );
}

function StepArquitetura() {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Row cols={4}>
        <Field label="Pavimentos"><input className="input" defaultValue="3"/></Field>
        <Field label="Cômodos"><input className="input" defaultValue="14"/></Field>
        <Field label="Área construída (m²)"><input className="input mono" defaultValue="640"/></Field>
        <Field label="Área do terreno (m²)"><input className="input mono" defaultValue="284"/></Field>
      </Row>
      <Row cols={3}>
        <Field label="Estrutura"><select className="select"><option>Alvenaria de pedra e tijolo</option><option>Alvenaria de tijolo</option><option>Madeira</option><option>Taipa</option></select></Field>
        <Field label="Cobertura"><select className="select"><option>Telha cerâmica capa-canal</option><option>Telha francesa</option><option>Outro</option></select></Field>
        <Field label="Esquadrias"><select className="select"><option>Madeira maciça</option><option>Ferro fundido</option><option>Mistas</option></select></Field>
      </Row>
      <Row>
        <Field label="Elementos decorativos relevantes" hint="Azulejaria, cantarias, gradis, sacadas, pinturas murais...">
          <textarea className="textarea" rows={3} defaultValue="Azulejaria portuguesa biscoito em fachada e térreo interno. Gradil de ferro fundido nas sacadas. Cantarias de lioz português nas vergas e umbrais."/>
        </Field>
      </Row>
    </div>
  );
}

function StepProtecao() {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Row cols={3}>
        <Field label="Órgão de tombamento" required>
          <select className="select"><option>IPHAN — Inst. do Patrimônio</option><option>Gov. Maranhão</option><option>Município</option></select>
        </Field>
        <Field label="Esfera"><select className="select"><option>Federal</option><option>Estadual</option><option>Municipal</option><option>Federal e estadual</option></select></Field>
        <Field label="Ano de tombamento"><input className="input mono" defaultValue="1955"/></Field>
      </Row>
      <Row cols={2}>
        <Field label="Número do processo IPHAN"><input className="input mono" defaultValue="12487/1955"/></Field>
        <Field label="Link processo IPHAN"><input className="input mono" defaultValue="iphan.gov.br/processos/12487"/></Field>
      </Row>
      <Row cols={3}>
        <Field label="Livro do Tombo"><select className="select"><option>Histórico</option><option>Belas Artes</option><option>Arqueológico</option><option>Etnográfico</option></select></Field>
        <Field label="Inscrição nº"><input className="input mono" defaultValue="284-A"/></Field>
        <Field label="Domínio"><select className="select"><option>Público</option><option>Privado</option><option>Misto</option></select></Field>
      </Row>
    </div>
  );
}

function StepJuridica() {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Row cols={2}>
        <Field label="Existe ação judicial em curso?">
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn sm" style={{ background: "var(--paper)" }}>Não consta</button>
            <button className="btn primary sm">Sim — registrar</button>
          </div>
        </Field>
        <Field label="Restrições de acesso">
          <select className="select"><option>Acesso público integral</option><option>Acesso parcial</option><option>Acesso restrito</option></select>
        </Field>
      </Row>
      <div style={{ padding: 18, border: "1px solid var(--clay)", background: "var(--clay-soft)" }}>
        <div className="caps" style={{ color: "var(--clay)", marginBottom: 12 }}>Detalhes da ação judicial</div>
        <Row cols={3}>
          <Field label="Número do processo"><input className="input mono" defaultValue="0034521-22.2024.4.01.3700"/></Field>
          <Field label="Vara / Comarca"><input className="input" defaultValue="Vara Federal de São Luís"/></Field>
          <Field label="Fase atual"><select className="select"><option>Instrução</option><option>Sentença</option><option>Execução</option></select></Field>
        </Row>
        <Row>
          <Field label="Resumo da demanda"><textarea className="textarea" rows={2} defaultValue="Discussão sobre obrigações de conservação do mantenedor."/></Field>
        </Row>
      </div>
    </div>
  );
}

function StepConservacao() {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Row cols={2}>
        <Field label="Situação atual" required>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <button key={k} className="btn sm" style={{ borderColor: `var(--st-${k})`, color: `var(--st-${k})`, background: "var(--paper)" }}>
                <span style={{ width: 8, height: 8, background: `var(--st-${k})`, borderRadius: 8 }}/>{v.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Grau de risco">
          <select className="select"><option>Baixo</option><option>Médio</option><option>Alto</option><option>Crítico</option></select>
        </Field>
      </Row>
      <Row cols={3}>
        <Field label="Patologias identificadas">
          <select className="select" multiple style={{ minHeight: 90 }}>
            <option>Infiltração</option><option>Fissuras estruturais</option><option>Cupins</option>
            <option>Desprendimento de revestimento</option><option>Recalque</option><option>Oxidação</option>
          </select>
        </Field>
        <Field label="Última intervenção"><input className="input" defaultValue="Restauro · 2011"/></Field>
        <Field label="Próxima vistoria sugerida"><input className="input mono" defaultValue="12/03/2027"/></Field>
      </Row>
      <Row>
        <Field label="Observações técnicas">
          <textarea className="textarea" rows={4} defaultValue="Estrutura em alvenaria de pedra e tijolo maciço com sobrados em madeira de lei (peroba e angelim). Inspeção termográfica realizada em janeiro de 2026 não identificou pontos críticos de umidade."/>
        </Field>
      </Row>
    </div>
  );
}

function StepVistorias() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="between">
        <div>
          <div className="caps">Histórico de vistorias</div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>14 vistorias registradas desde 1998</div>
        </div>
        <button className="btn primary sm"><Icon name="plus" size={12}/>Nova vistoria</button>
      </div>
      <table className="tbl">
        <thead><tr><th>Data</th><th>Responsável</th><th>Órgão</th><th>Status</th><th>Risco</th><th>Resumo</th><th></th></tr></thead>
        <tbody>
          {VISTORIAS.slice(0, 4).map(v => (
            <tr key={v.id}>
              <td className="mono" style={{ fontSize: 12.5 }}>{v.data || "Pendente"}</td>
              <td>{v.responsavel}</td>
              <td>{v.orgao}</td>
              <td><VistoriaBadge status={v.status}/></td>
              <td>{v.risco}</td>
              <td style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{v.resumo}</td>
              <td><Icon name="eye" size={14}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepUploads() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <div className="caps" style={{ marginBottom: 12 }}>Imagens do imóvel</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[0,1,2].map(i => {
            const _imgs = [window.IMG.slz_afonso_pena, window.IMG.slz_nazare, window.IMG.slz_saude];
            return (
            <div key={i} style={{ position: "relative" }}>
              <div className="ph-img has-photo" style={{ aspectRatio: "4/3" }} data-label={["Fachada principal", "Vista lateral", "Detalhe azulejaria"][i]}>
                <img className="ph-photo" src={_imgs[i]} alt={["Fachada principal", "Vista lateral", "Detalhe azulejaria"][i]} loading="lazy"/>
                <div className="ph-caption">{["Fachada principal · 12 Mar 2026", "Vista lateral · 12 Mar 2026", "Detalhe azulejaria · 12 Mar 2026"][i]}</div>
              </div>
              <button className="icon-btn" style={{ position: "absolute", top: 6, right: 6, background: "rgba(251,247,236,0.95)", zIndex: 4 }}><Icon name="x" size={12}/></button>
            </div>
          );})}
          <div style={{ aspectRatio: "4/3", border: "1.5px dashed var(--line-2)", display: "grid", placeItems: "center", textAlign: "center", color: "var(--ink-3)", padding: 20, cursor: "pointer" }}>
            <div>
              <Icon name="upload" size={22} style={{ color: "var(--ink-3)" }}/>
              <div style={{ fontSize: 12, marginTop: 8, fontWeight: 500, color: "var(--ink-2)" }}>Adicionar imagens</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 4 }}>JPG, PNG, TIFF até 20MB</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="caps" style={{ marginBottom: 12 }}>Documentos técnicos</div>
        <div style={{ border: "1.5px dashed var(--line-2)", padding: 32, textAlign: "center", color: "var(--ink-3)" }}>
          <Icon name="upload" size={26}/>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)", marginTop: 8 }}>Arraste arquivos ou clique para enviar</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>PDF, DOC, DWG, ZIP até 50MB · suporta múltiplos arquivos</div>
        </div>
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {[
            ["Processo de tombamento", "PDF · 2.4 MB", 100],
            ["Laudo técnico de restauro", "PDF · 5.1 MB", 100],
            ["Relatório fotográfico 2026", "ZIP · 18.3 MB", 64],
          ].map(([name, meta, pct], i) => (
            <div key={i} style={{ padding: "10px 14px", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14 }}>
              <Icon name="doc" size={18} style={{ color: "var(--gold)" }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>{meta}</div>
                {pct < 100 && (
                  <div style={{ height: 3, background: "var(--bg-deep)", marginTop: 6 }}>
                    <div style={{ height: "100%", background: "var(--petroleum)", width: pct + "%" }}/>
                  </div>
                )}
              </div>
              <div className="caps" style={{ color: pct === 100 ? "var(--moss)" : "var(--ink-3)" }}>{pct === 100 ? "Pronto" : pct + "%"}</div>
              <Icon name="x" size={13} style={{ color: "var(--ink-3)", cursor: "pointer" }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepObservacoes() {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <Field label="Descrição histórica" hint="Texto descritivo sobre origem, contexto histórico e relevância arquitetônica">
        <textarea className="textarea" rows={8} defaultValue="Edificação representativa do ciclo do algodão maranhense, ergueu-se entre 1815 e 1822 nas proximidades do antigo porto da Praia Grande. Apresenta cinco janelas em arco abatido por pavimento e revestimento integral em azulejos portugueses biscoito, dispostos em padrão de damas. Serviu como residência da família Ribeiro Pinto até 1923, quando foi convertido em armazém de fumo."/>
      </Field>
      <Row cols={2}>
        <Field label="Personagens relevantes"><input className="input" defaultValue="Família Ribeiro Pinto"/></Field>
        <Field label="Eventos históricos associados"><input className="input" defaultValue="Ciclo do algodão maranhense (1812—1860)"/></Field>
      </Row>
      <Field label="Observações livres">
        <textarea className="textarea" rows={3} placeholder="Notas internas, considerações técnicas adicionais..."/>
      </Field>
    </div>
  );
}

function StepRevisao() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ padding: 18, border: "1px solid var(--moss)", background: "var(--moss-soft)", display: "flex", gap: 14, alignItems: "start" }}>
        <Icon name="check" size={20} style={{ color: "var(--moss)", marginTop: 2 }} stroke={2.5}/>
        <div>
          <div style={{ fontWeight: 600, color: "var(--moss)" }}>Cadastro pronto para revisão</div>
          <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>Todos os campos obrigatórios foram preenchidos. O imóvel ficará em rascunho até a validação por um segundo técnico.</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)" }}>
          <div className="caps">Resumo do cadastro</div>
        </div>
        <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
          {[
            ["Nome", "Casarão Colonial da Praia Grande"],
            ["ID", "APM-0142"],
            ["Município", "São Luís — Praia Grande"],
            ["Tipo / Tipologia", "Casarão · Sobrado azulejado"],
            ["Tombamento", "IPHAN — Federal · 1955"],
            ["Situação", "Preservado · Risco baixo"],
            ["Domínio", "Público"],
            ["Última vistoria", "12 Mar 2026"],
            ["Imagens", "8 anexadas"],
            ["Documentos", "3 anexados"],
          ].map(([k, v], i) => <Meta key={i} k={k} v={v}/>)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn" style={{ flex: 1, justifyContent: "center" }}>Salvar como rascunho</button>
        <button className="btn dark" style={{ flex: 1, justifyContent: "center" }}>Enviar para revisão</button>
        <button className="btn primary" style={{ flex: 1, justifyContent: "center" }}>Publicar imóvel</button>
      </div>
    </div>
  );
}

function Row({ children, cols = 1 }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>{children}</div>;
}

function Field({ label, hint, required, children }) {
  return (
    <div className="field">
      <label>
        {label} {required && <span style={{ color: "var(--clay)", marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

/* ---------- VISTORIAS ---------- */
function VistoriasScreen({ go }) {
  return (
    <AdminShell route="vistorias" go={go} crumbs={<>Acervo · <b>Vistorias</b></>}
      actions={<button className="btn primary sm"><Icon name="plus" size={12}/>Cadastrar vistoria</button>}>
      <div className="between" style={{ marginBottom: 24, alignItems: "end" }}>
        <div>
          <div className="caps">Gestão de vistorias técnicas</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Vistorias</h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatBox k="Vistorias em 2026" v="48" d={<><span style={{ color: "var(--moss)" }}>+12%</span> vs 2025</>}/>
        <StatBox k="Pendentes" v="12" d="5 vencerão neste mês" riskAccent/>
        <StatBox k="Vencidas" v="3" d="Risco crítico"/>
        <StatBox k="Equipes em campo" v="6" d="Hoje, 14 Mai"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <div className="card">
          <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto", gap: 10 }}>
            <div className="search">
              <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
              <input placeholder="Buscar por imóvel, ID, responsável..."/>
            </div>
            <select className="select"><option>Todos os status</option><option>Realizada</option><option>Pendente</option><option>Vencida</option><option>Em análise</option></select>
            <select className="select"><option>Todos os órgãos</option><option>IPHAN-MA</option><option>Gov. Maranhão</option></select>
            <select className="select"><option>Todos os responsáveis</option><option>Helena Borba</option><option>Marina Lobato</option></select>
            <button className="btn"><Icon name="calendar" size={13}/></button>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Imóvel</th><th>Data</th><th>Responsável</th><th>Órgão</th><th>Status</th><th>Risco</th><th></th></tr></thead>
            <tbody>
              {VISTORIAS.map(v => (
                <tr key={v.id}>
                  <td className="mono" style={{ fontSize: 12 }}>{v.id}</td>
                  <td>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>{v.imovelNome}</div>
                    <div className="sub">{v.imovel}</div>
                  </td>
                  <td className="mono" style={{ fontSize: 12.5 }}>{v.data || "—"}</td>
                  <td>{v.responsavel}</td>
                  <td>{v.orgao}</td>
                  <td><VistoriaBadge status={v.status}/></td>
                  <td>
                    <span style={{ color: v.risco === "Alto" || v.risco === "Crítico" ? "var(--clay)" : v.risco === "Médio" ? "var(--ochre)" : "var(--moss)" }}>● </span>
                    {v.risco}
                  </td>
                  <td><Icon name="eye" size={14}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
            <div className="caps">Detalhe da vistoria</div>
            <div className="display" style={{ fontSize: 18, marginTop: 4 }}>V-2026-118</div>
          </div>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 1.1 }}>Casarão Colonial da Praia Grande</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>APM-0142 · São Luís</div>

            <div style={{ margin: "18px 0", display: "flex", gap: 8 }}>
              <VistoriaBadge status="Realizada"/>
              <span className="badge preservado"><span className="dot"/>Risco baixo</span>
            </div>

            <Meta k="Data" v="12 Mar 2026 · 14:30" mono/>
            <Meta k="Responsável" v="Arq. Helena Borba"/>
            <Meta k="Órgão" v="IPHAN-MA"/>
            <Meta k="Equipe" v="3 pessoas"/>
            <Meta k="Duração" v="2h 40min"/>

            <hr className="hr-soft" style={{ margin: "16px 0" }}/>

            <div className="label" style={{ marginBottom: 6 }}>Resumo</div>
            <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
              Verificação anual da estrutura e da azulejaria do térreo. Nenhuma patologia ativa identificada. Recomenda-se nova inspeção em 12 meses.
            </p>

            <div className="label" style={{ marginTop: 16, marginBottom: 8 }}>Anexos · 4</div>
            {["Relatório técnico V-2026-118.pdf", "Fotografias fachada (12).zip", "Termografia infravermelha.pdf", "Ficha de campo assinada.pdf"].map((f, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "1px dotted var(--line-soft)", display: "flex", gap: 10, alignItems: "center", fontSize: 12.5 }}>
                <Icon name="doc" size={14} style={{ color: "var(--gold)" }}/>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f}</span>
                <Icon name="down2" size={12} style={{ color: "var(--ink-3)" }}/>
              </div>
            ))}

            <button className="btn primary" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
              Ver vistoria completa <Icon name="arrow" size={13}/>
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* ---------- RELATORIOS ---------- */
function RelatoriosScreen({ go }) {
  const relatorios = [
    { t: "Distribuição por situação", d: "Imóveis classificados por estado de conservação", icon: "chart" },
    { t: "Imóveis em risco — síntese 2026", d: "Bens com risco médio ou superior, agrupados por município", icon: "alert" },
    { t: "Inventário por município", d: "Total de bens, tombamentos, vistorias e ações judiciais por município", icon: "pin" },
    { t: "Vistorias técnicas — trimestre", d: "Inspeções realizadas no último trimestre por órgão e responsável", icon: "compass" },
    { t: "Patrimônio imaterial · reconhecimento", d: "Manifestações por status de reconhecimento (UNESCO, IPHAN, Estado)", icon: "scroll" },
    { t: "Ações judiciais — relatório anual", d: "Processos ativos, encerrados e em fase de instrução", icon: "gavel" },
    { t: "Tombamentos federais · IPHAN", d: "Bens com tombamento na esfera federal e seu status de processo", icon: "shield" },
    { t: "Sítios arqueológicos · acesso restrito", d: "Relatório controlado de sítios com proteção total ou parcial", icon: "lock" },
  ];

  return (
    <AdminShell route="rel" go={go} crumbs={<>Sistema · <b>Relatórios</b></>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 28 }}>
        <div>
          <div className="caps">Geração de relatórios</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Relatórios administrativos</h1>
          <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 4 }}>Configure parâmetros e exporte em PDF, Excel ou CSV</div>
        </div>
        <button className="btn primary"><Icon name="plus" size={13}/>Relatório personalizado</button>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        <Select label="Município" options={["Todos", ...MUNICIPIOS]}/>
        <Select label="Situação" options={["Todas", "Preservado", "Em atenção", "Em risco", "Restaurado"]}/>
        <Select label="Esfera tombamento" options={["Todas", "Federal", "Estadual", "Municipal"]}/>
        <Select label="Domínio" options={["Todos", "Público", "Privado"]}/>
        <Select label="Período" options={["2026", "2025", "2024", "Todos"]}/>
        <Select label="Órgão" options={["Todos", "IPHAN-MA", "Gov. Maranhão", "Municípios"]}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {relatorios.map((r, i) => (
          <div key={i} className="card" style={{ padding: 0, display: "grid", gridTemplateColumns: "200px 1fr", overflow: "hidden" }}>
            <div className="ph-img" style={{ borderRight: "1px solid var(--line)", height: "100%" }} data-label={r.t}>
              {/* mini preview */}
              <div style={{ position: "absolute", inset: 0, padding: 16, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ height: 36, background: "rgba(26,31,28,0.15)", marginBottom: 4 }}/>
                <div style={{ height: 16, background: "rgba(26,31,28,0.15)", marginBottom: 4, width: "70%" }}/>
                <div style={{ height: 16, background: "rgba(26,31,28,0.15)", width: "50%" }}/>
              </div>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Icon name={r.icon} size={16} style={{ color: "var(--petroleum)" }}/>
                <div className="caps">Modelo</div>
              </div>
              <div className="display" style={{ fontSize: 20, lineHeight: 1.15, marginBottom: 6 }}>{r.t}</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0, lineHeight: 1.55 }}>{r.d}</p>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dotted var(--line-soft)", display: "flex", gap: 8 }}>
                <button className="btn sm"><Icon name="doc" size={12}/>PDF</button>
                <button className="btn sm"><Icon name="doc" size={12}/>Excel</button>
                <button className="btn sm"><Icon name="doc" size={12}/>CSV</button>
                <button className="btn ghost sm" style={{ marginLeft: "auto" }}>Pré-visualizar →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

/* ---------- USERS ---------- */
function UsersScreen({ go }) {
  const perfis = [
    { nome: "Administrador geral", desc: "Acesso completo · pode gerenciar usuários e permissões", n: 3, perms: ["CRUD imóveis", "Validação", "Usuários", "Configurações"] },
    { nome: "Técnico patrimonial", desc: "Cadastro, edição e vistoria de bens", n: 18, perms: ["CRUD imóveis", "Vistorias", "Anexos"] },
    { nome: "Consultor", desc: "Acesso de leitura ampla · pode exportar relatórios", n: 9, perms: ["Leitura", "Relatórios", "Exportação"] },
    { nome: "Leitor institucional", desc: "Apenas leitura · acesso a fichas e dashboards", n: 32, perms: ["Leitura"] },
  ];

  return (
    <AdminShell route="users" go={go} crumbs={<>Sistema · <b>Usuários e permissões</b></>}
      actions={<button className="btn primary sm"><Icon name="plus" size={12}/>Convidar usuário</button>}>
      <div className="between" style={{ alignItems: "end", marginBottom: 24 }}>
        <div>
          <div className="caps">62 usuários · 4 perfis</div>
          <h1 className="display" style={{ fontSize: 36, margin: "6px 0 0" }}>Usuários e permissões</h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {perfis.map(p => (
          <div key={p.nome} className="card" style={{ padding: 18 }}>
            <div className="between" style={{ alignItems: "start" }}>
              <div className="caps">Perfil</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold)" }}>{p.n} ativos</div>
            </div>
            <div className="display" style={{ fontSize: 22, marginTop: 4, marginBottom: 6, lineHeight: 1.1 }}>{p.nome}</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {p.perms.map(perm => <span key={perm} className="badge" style={{ fontSize: 9.5, padding: "2px 6px" }}>{perm}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto", gap: 10 }}>
          <div className="search">
            <Icon name="search" size={13} style={{ color: "var(--ink-3)" }}/>
            <input placeholder="Buscar por nome, e-mail, órgão..."/>
          </div>
          <select className="select"><option>Todos os perfis</option><option>Administrador geral</option><option>Técnico patrimonial</option><option>Consultor</option><option>Leitor</option></select>
          <select className="select"><option>Todos os órgãos</option><option>IPHAN-MA</option><option>Gov. Maranhão</option><option>UFMA</option></select>
          <select className="select"><option>Todos os status</option><option>Ativo</option><option>Inativo</option><option>Pendente</option></select>
          <button className="btn"><Icon name="filter" size={13}/></button>
        </div>
        <table className="tbl">
          <thead><tr><th>Usuário</th><th>E-mail</th><th>Perfil</th><th>Órgão</th><th>Status</th><th>Último acesso</th><th></th></tr></thead>
          <tbody>
            {USUARIOS.map(u => (
              <tr key={u.email}>
                <td style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: "var(--petroleum)", color: "var(--gold)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 14 }}>
                    {u.nome[0]}
                  </div>
                  <span style={{ fontWeight: 500 }}>{u.nome}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>{u.email}</td>
                <td><span className="badge" style={u.perfil.includes("geral") ? { color: "var(--gold)", borderColor: "var(--gold)", background: "var(--gold-soft)" } : null}>{u.perfil}</span></td>
                <td>{u.orgao}</td>
                <td>
                  <span style={{ color: u.status === "Ativo" ? "var(--moss)" : "var(--ink-3)", fontWeight: 500 }}>● </span>
                  {u.status}
                </td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{u.ult}</td>
                <td>
                  <div style={{ display: "inline-flex", gap: 4 }}>
                    <button className="icon-btn"><Icon name="edit" size={13}/></button>
                    <button className="icon-btn"><Icon name="more" size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { FormScreen, VistoriasScreen, RelatoriosScreen, UsersScreen, Field, Row });
