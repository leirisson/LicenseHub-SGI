import { useState } from "react";

const hierarquia = {
  niveis: [
    {
      id: "SUPER", label: "Super Admin", icon: "👑", cor: "#FFD93D", badge: "Plataforma",
      desc: "Equipe LicenseHub — acesso total à plataforma, todos os tenants",
      poderes: [
        "Criar / suspender empresas (tenants)",
        "Acessar qualquer empresa para suporte",
        "Configurar planos e limites por empresa",
        "Ver métricas globais da plataforma",
        "Gerenciar integrações globais e SSO",
      ],
    },
    {
      id: "OWNER", label: "Dono da Empresa", icon: "🏢", cor: "#00E5FF", badge: "Empresa",
      desc: "Primeiro cadastro da empresa — responsável legal e técnico pela conta",
      poderes: [
        "Configurar dados da empresa e plano contratado",
        "Promover / revogar Admin Geral",
        "Ver todas as licenças e relatórios",
        "Aprovar despesas acima do limite definido",
        "Receber notificações críticas independente de delegação",
        "Exportar dados e encerrar conta",
      ],
    },
    {
      id: "ADMIN", label: "Admin Geral (TI / Compras)", icon: "🛡️", cor: "#B388FF", badge: "Empresa",
      desc: "Indicado pelo Dono — gerencia toda a operação de licenças da empresa",
      poderes: [
        "Cadastrar e editar qualquer licença",
        "Criar / convidar usuários e definir papéis",
        "Nomear Gestores de Área",
        "Configurar alertas, workflows e integrações",
        "Acessar todos os relatórios e dashboards",
        "Aprovar renovações dentro do limite definido",
      ],
    },
    {
      id: "MANAGER", label: "Gestor de Área", icon: "📋", cor: "#69FF47", badge: "Departamento",
      desc: "Responsável por um departamento — vê e gerencia licenças da sua área",
      poderes: [
        "Visualizar licenças do seu departamento",
        "Solicitar novas licenças (requer aprovação do Admin)",
        "Nomear Custodiantes para licenças da sua área",
        "Receber alertas de vencimento das suas licenças",
        "Aprovar acessos de colaboradores do seu time",
        "Ver relatórios de uso do departamento",
      ],
    },
    {
      id: "CUSTODIAN", label: "Custodiante da Licença", icon: "🔑", cor: "#FF9A3C", badge: "Licença",
      desc: "Pessoa responsável pelo dia-a-dia de uma ou mais licenças específicas",
      poderes: [
        "Atualizar status e informações da licença",
        "Gerenciar lista de usuários/seats da licença",
        "Receber e responder alertas de vencimento",
        "Fazer upload de contratos e comprovantes",
        "Registrar renovações e histórico",
        "Solicitar transferência de custódia",
      ],
    },
    {
      id: "VIEWER", label: "Usuário / Colaborador", icon: "👤", cor: "#9CA3AF", badge: "Pessoal",
      desc: "Colaborador com acesso à licença — visibilidade limitada às suas licenças",
      poderes: [
        "Ver licenças atribuídas a si",
        "Solicitar acesso a novas licenças",
        "Ver data de vencimento das suas ferramentas",
        "Receber notificações pessoais",
      ],
    },
  ],
  regras: [
    { icone: "🔁", titulo: "Delegação em Cascata", desc: "Cada nível só pode nomear papéis abaixo dele. O Dono nomeia Admins, o Admin nomeia Gestores, o Gestor nomeia Custodiantes." },
    { icone: "👥", titulo: "Multi-papel", desc: "Um usuário pode ser Admin Geral E Custodiante de uma licença ao mesmo tempo — os papéis se acumulam." },
    { icone: "📧", titulo: "Notificações por Papel", desc: "Cada papel recebe apenas os alertas relevantes. Custodiante recebe vencimento; Dono recebe alertas críticos." },
    { icone: "🔒", titulo: "Substituição Automática", desc: "Se o Custodiante sair da empresa, o sistema escala o alerta automaticamente ao Gestor da área." },
    { icone: "📝", titulo: "Aceite de Responsabilidade", desc: "Ao ser nomeado Custodiante, o usuário recebe e-mail de confirmação e deve aceitar formalmente a responsabilidade." },
    { icone: "⏰", titulo: "Expiração de Papéis", desc: "Admin pode definir papéis com validade — ex: Custodiante temporário durante férias do responsável original." },
  ],
};

const data = {
  poc: [
    {
      id: "P1", fase: "MVP Core + Governança Base", prazo: "Semanas 1–4", cor: "#00E5FF",
      itens: [
        "Cadastro de empresa com Dono como primeiro usuário (Owner automático)",
        "Hierarquia de 5 papéis: Owner → Admin → Gestor → Custodiante → Viewer",
        "Convite de usuários com papel pré-definido por e-mail",
        "Cadastro universal de licenças com campo 'Custodiante Responsável'",
        "Dashboard personalizado por papel (cada nível vê o que é seu)",
        "Alertas de vencimento roteados pelo papel (30 / 15 / 7 dias)",
        "Notificações in-app e e-mail segmentadas por responsabilidade",
        "Upload de contrato / arquivo da licença pelo Custodiante",
      ],
    },
    {
      id: "P2", fase: "Controle, Delegação & Visibilidade", prazo: "Semanas 5–8", cor: "#B388FF",
      itens: [
        "Fluxo de nomeação: Admin nomeia Gestor → Gestor nomeia Custodiante",
        "Aceite formal de responsabilidade por e-mail ao ser nomeado Custodiante",
        "Transferência de custódia — substituição com histórico de responsáveis",
        "Escalada automática se Custodiante estiver inativo ou desligado",
        "Papéis com validade (ex: Custodiante temporário durante férias)",
        "Categorização por departamento vinculada ao Gestor de Área",
        "Controle de seats: Custodiante gerencia quem usa a licença",
        "Relatórios: quem é responsável por cada licença e há quanto tempo",
        "Histórico de renovações com responsável registrado em cada ação",
        "Filtros avançados por responsável, departamento, status e papel",
      ],
    },
    {
      id: "P3", fase: "Integrações, Automações & API", prazo: "Semanas 9–12", cor: "#69FF47",
      itens: [
        "SSO (Google / Microsoft / SAML) com mapeamento automático de papéis",
        "Sincronização com diretório LDAP/AD → papéis por grupo do AD",
        "Offboarding integrado: ao desligar colaborador, licenças são redistribuídas",
        "API REST com escopos por papel (Admin token vs Viewer token)",
        "Webhook: eventos de mudança de custódia e vencimentos por responsável",
        "Integração Slack/Teams: notificações direcionadas ao Custodiante certo",
        "Importação em massa CSV com coluna de responsável por licença",
        "Log de auditoria imutável — toda ação registrada com papel do executor",
      ],
    },
  ],
  features: [
    {
      categoria: "🤖 IA Preditiva", cor: "#00E5FF",
      items: [
        { nome: "Renovação Inteligente", desc: "IA analisa histórico e sugere melhor momento e condição de renovação" },
        { nome: "Detecção de Licenças Ociosas", desc: "Identifica licenças pagas sem uso real nos últimos 60/90 dias" },
        { nome: "Previsão de Custos", desc: "Projeção automática de gastos com licenças para os próximos 12 meses" },
        { nome: "Score de Risco por Custodiante", desc: "IA identifica Custodiantes sobrecarregados e sugere redistribuição de responsabilidades" },
      ],
    },
    {
      categoria: "💬 Assistente Conversacional", cor: "#B388FF",
      items: [
        { nome: "Chat com seu portfólio", desc: '"Quais licenças vencem em março e quem é o responsável?" — resposta instantânea em linguagem natural' },
        { nome: "Resumo Executivo Automático", desc: "IA gera relatório narrativo semanal para o Dono e Admins com status por área" },
        { nome: "Análise de Contratos", desc: "Upload do PDF — IA extrai datas, valores e sugere Custodiante ideal com base no cargo" },
        { nome: "Recomendação de Responsáveis", desc: "IA sugere o melhor Custodiante baseado em histórico, cargo e carga atual de responsabilidades" },
      ],
    },
    {
      categoria: "📊 Analytics Avançado", cor: "#69FF47",
      items: [
        { nome: "Benchmark de Mercado", desc: "Compara seus custos com médias do setor (dados anonimizados)" },
        { nome: "Mapa de Duplicidade", desc: "Detecta licenças com funções sobrepostas (ex: dois CRMs ativos)" },
        { nome: "ROI por Licença e por Área", desc: "Cruza dados de uso com custo por departamento e Gestor responsável" },
        { nome: "Heatmap de Responsabilidade", desc: "Visualiza distribuição de licenças por Custodiante — identifica sobrecarga e gargalos" },
      ],
    },
    {
      categoria: "🔒 Compliance & Auditoria", cor: "#FF6B6B",
      items: [
        { nome: "Auditoria com Papel do Executor", desc: "Log imutável: quem fez, qual papel tinha, quando e o que mudou" },
        { nome: "Compliance Automático", desc: "Verifica conformidade LGPD, SOC2, ISO 27001 por responsável de licença" },
        { nome: "Alertas de Over/Under-licensing", desc: "Avisa Custodiante quando está usando mais seats do que contratou" },
        { nome: "Cadeia de Responsabilidade", desc: "Exporta para auditores externo todo o histórico de custódias de cada licença" },
      ],
    },
    {
      categoria: "⚡ Automações", cor: "#FFD93D",
      items: [
        { nome: "Workflow de Aprovação por Nível", desc: "Gestor solicita → Admin aprova → Owner ratifica acima do limite financeiro definido" },
        { nome: "Onboarding/Offboarding Inteligente", desc: "Colaborador novo herda licenças do papel; saída redistribui custódias automaticamente" },
        { nome: "Substituição de Custodiante", desc: "Férias, licença ou desligamento → sistema nomeia substituto e notifica cadeia de responsabilidade" },
        { nome: "Playbooks por Papel", desc: "Regras automáticas: 'se Custodiante não responder em 48h, escalar ao Gestor da área'" },
      ],
    },
    {
      categoria: "🌐 Ecossistema", cor: "#FF9A3C",
      items: [
        { nome: "Marketplace de Licenças", desc: "Compre, venda ou transfira licenças excedentes entre empresas com rastreio de responsabilidade" },
        { nome: "Integração com ERPs", desc: "Sincroniza com SAP, TOTVS, Oracle para aprovações financeiras por nível hierárquico" },
        { nome: "API para MSPs (White-label)", desc: "Empresas de TI gerenciam múltiplos clientes com hierarquia própria por tenant" },
        { nome: "Mobile App", desc: "Custodiantes recebem alertas e aprovam ações direto no celular" },
      ],
    },
  ],
  diferenciais: [
    { icon: "🧠", titulo: "IA Nativa", desc: "Não é plugin — é core do produto" },
    { icon: "🌍", titulo: "Universal", desc: "Qualquer tipo de licença, qualquer fornecedor" },
    { icon: "🔑", titulo: "Governança Real", desc: "Hierarquia de responsabilidade com auditoria em cada ação" },
    { icon: "💰", titulo: "ROI Visível", desc: "Mostra quanto economizou em licenças ociosas" },
    { icon: "🔗", titulo: "Open API", desc: "Integra com qualquer stack corporativo" },
    { icon: "🛡️", titulo: "Compliance First", desc: "Auditoria e LGPD com cadeia completa de responsabilidade" },
  ],
};

function HierarquiaView() {
  const [selected, setSelected] = useState("OWNER");
  const nivel = hierarquia.niveis.find(n => n.id === selected);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>Modelo de Governança & Permissões</h2>
        <p style={{ color: "#6B7280", margin: 0, fontSize: 15 }}>
          Hierarquia de 5 papéis com delegação em cascata — cada responsabilidade é rastreada e auditada. Clique em um papel para ver os detalhes.
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Pirâmide */}
        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {hierarquia.niveis.map((n, i) => {
            const widths = [180, 230, 280, 330, 380, 420];
            const isSelected = selected === n.id;
            return (
              <div key={n.id} onClick={() => setSelected(n.id)} style={{
                width: widths[i], background: isSelected ? `linear-gradient(90deg, ${n.cor}30, ${n.cor}15)` : "#0F1118",
                border: `1.5px solid ${isSelected ? n.cor : n.cor + "30"}`, borderRadius: 12,
                padding: "10px 18px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
                transform: isSelected ? "scale(1.03)" : "scale(1)",
              }}>
                <span style={{ fontSize: 18 }}>{n.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: isSelected ? n.cor : "#E8EAF0", whiteSpace: "nowrap" }}>{n.label}</div>
                </div>
                <div style={{
                  background: `${n.cor}20`, border: `1px solid ${n.cor}40`, borderRadius: 6,
                  padding: "1px 7px", fontSize: 9, color: n.cor, fontWeight: 700, whiteSpace: "nowrap",
                }}>{n.badge}</div>
              </div>
            );
          })}
          <div style={{ marginTop: 8, fontSize: 11, color: "#4B5563", textAlign: "center" }}>↑ mais acesso · menos acesso ↓</div>
        </div>

        {/* Detalhe */}
        {nivel && (
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{
              background: `linear-gradient(135deg, ${nivel.cor}12 0%, #0F1118 70%)`,
              border: `1px solid ${nivel.cor}30`, borderRadius: 20, padding: "24px", height: "100%",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>{nivel.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: nivel.cor }}>{nivel.label}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{nivel.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {nivel.poderes.map((p, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    background: "#0A0C12", borderRadius: 10, padding: "10px 14px",
                    border: `1px solid ${nivel.cor}15`,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: nivel.cor, marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#C8CDD8", lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fluxo */}
      <div style={{ marginTop: 32, background: "#0F1118", border: "1px solid #1E2535", borderRadius: 20, padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>🔄 Fluxo de Delegação em Cascata</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
          {hierarquia.niveis.slice(0, 5).map((n, i) => (
            <div key={n.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div style={{ textAlign: "center", padding: "10px 14px", background: `${n.cor}15`, border: `1px solid ${n.cor}35`, borderRadius: 12 }}>
                <div style={{ fontSize: 16 }}>{n.icon}</div>
                <div style={{ fontSize: 10, color: n.cor, fontWeight: 700, marginTop: 4, whiteSpace: "nowrap" }}>{n.label.split(" ")[0]}</div>
              </div>
              {i < 4 && <div style={{ padding: "0 8px", color: "#374151", fontSize: 16, flexShrink: 0 }}>→</div>}
            </div>
          ))}
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "#6B7280" }}>
          Nenhum usuário pode se auto-promover. Cada nível nomeia apenas o nível imediatamente abaixo.
        </p>
      </div>

      {/* Regras */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>📐 Regras de Governança</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {hierarquia.regras.map((r, i) => (
            <div key={i} style={{ background: "#0F1118", border: "1px solid #1E2535", borderRadius: 14, padding: "18px", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icone}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{r.titulo}</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exemplo real */}
      <div style={{ marginTop: 24, background: "linear-gradient(135deg, #00E5FF10 0%, #7B2FFF10 100%)", border: "1px solid #00E5FF25", borderRadius: 20, padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>📖 Exemplo Real: Acme Corp com 3 Departamentos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {[
            { titulo: "🏢 Acme Corp", cor: "#00E5FF", linhas: ["Owner: João (CEO)", "Admin: Maria (TI)", "Admin: Pedro (Compras)"] },
            { titulo: "📋 Marketing (Gestor: Ana)", cor: "#B388FF", linhas: ["Custodiante: Carlos → Adobe CC", "Custodiante: Bia → HubSpot", "8 Viewers (equipe)"] },
            { titulo: "💻 Engenharia (Gestor: Felipe)", cor: "#69FF47", linhas: ["Custodiante: Rafael → GitHub Ent.", "Custodiante: Lucas → AWS Support", "15 Viewers (devs)"] },
          ].map((c, i) => (
            <div key={i} style={{ background: "#0A0C12", border: `1px solid ${c.cor}25`, borderRadius: 14, padding: "14px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: c.cor, marginBottom: 10 }}>{c.titulo}</div>
              {c.linhas.map((l, li) => (
                <div key={li} style={{ fontSize: 12, color: "#9CA3AF", padding: "4px 0", borderTop: li > 0 ? "1px solid #1A1D2A" : "none" }}>↳ {l}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SGIPOCPlan() {
  const [activeTab, setActiveTab] = useState("governanca");
  const [activeFeature, setActiveFeature] = useState(null);

  const tabs = [
    { id: "governanca", label: "🔑 Governança" },
    { id: "poc", label: "📋 Plano POC" },
    { id: "features", label: "🚀 Features Futuras" },
    { id: "diferenciais", label: "⚡ Diferenciais" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#08090D", minHeight: "100vh", color: "#E8EAF0" }}>
      <div style={{
        background: "linear-gradient(135deg, #0D0F1A 0%, #111827 100%)",
        borderBottom: "1px solid #1E2535", padding: "28px 40px 0",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #00E5FF, #7B2FFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚙</div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#00E5FF", textTransform: "uppercase", fontWeight: 600 }}>Planejamento Estratégico</div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>LicenseHub <span style={{ color: "#00E5FF" }}>SGI</span></h1>
            </div>
            <div style={{ marginLeft: "auto", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 20, padding: "3px 12px", fontSize: 11, color: "#00E5FF", fontWeight: 600 }}>POC · 12 semanas</div>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 20 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "9px 20px", border: "none", background: "transparent",
                color: activeTab === tab.id ? "#00E5FF" : "#6B7280",
                borderBottom: activeTab === tab.id ? "2px solid #00E5FF" : "2px solid transparent",
                cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400,
                transition: "all 0.2s", fontFamily: "inherit",
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 40px" }}>

        {activeTab === "governanca" && <HierarquiaView />}

        {activeTab === "poc" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Plano de POC — 12 Semanas</h2>
              <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>3 fases progressivas com modelo de governança integrado desde o Dia 1.</p>
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              {data.poc.map((fase) => (
                <div key={fase.id} style={{ background: "#0F1118", border: `1px solid ${fase.cor}30`, borderRadius: 18, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px", borderBottom: `1px solid ${fase.cor}20`, background: `linear-gradient(90deg, ${fase.cor}12 0%, transparent 100%)` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${fase.cor}20`, border: `1.5px solid ${fase.cor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: fase.cor, fontSize: 13 }}>{fase.id}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{fase.fase}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{fase.prazo}</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: `${fase.cor}15`, border: `1px solid ${fase.cor}30`, borderRadius: 10, padding: "3px 10px", fontSize: 11, color: fase.cor, fontWeight: 600 }}>{fase.itens.length} entregas</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, background: "#1A1D2A" }}>
                    {fase.itens.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 20px", background: "#0F1118" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: `${fase.cor}20`, border: `1.5px solid ${fase.cor}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          <div style={{ width: 5, height: 5, borderRadius: 1, background: fase.cor }} />
                        </div>
                        <span style={{ fontSize: 13, color: "#C8CDD8", lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { label: "Clientes Piloto", valor: "3–5", sub: "empresas beta" },
                { label: "Meta de Licenças", valor: "500+", sub: "cadastradas no POC" },
                { label: "Papéis Suportados", valor: "5", sub: "níveis de acesso" },
                { label: "Time Inicial", valor: "2–3", sub: "devs + 1 PM" },
              ].map((k, i) => (
                <div key={i} style={{ background: "#0F1118", border: "1px solid #1E2535", borderRadius: 14, padding: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#00E5FF" }}>{k.valor}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, margin: "4px 0 2px" }}>{k.label}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{k.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "features" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Features Futuras com IA</h2>
              <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>Inteligência artificial como core — não como add-on.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 20 }}>
              {data.features.map((cat, ci) => (
                <div key={ci} style={{ background: "#0F1118", border: `1px solid ${cat.cor}25`, borderRadius: 18, overflow: "hidden" }}>
                  <div style={{ padding: "16px 22px", borderBottom: `1px solid ${cat.cor}20`, background: `linear-gradient(90deg, ${cat.cor}10 0%, transparent 100%)`, fontSize: 14, fontWeight: 700, color: cat.cor }}>{cat.categoria}</div>
                  <div style={{ padding: "6px 0" }}>
                    {cat.items.map((item, ii) => (
                      <div key={ii} onClick={() => setActiveFeature(activeFeature === `${ci}-${ii}` ? null : `${ci}-${ii}`)} style={{ padding: "13px 22px", cursor: "pointer", borderBottom: ii < cat.items.length - 1 ? "1px solid #1A1D2A" : "none", background: activeFeature === `${ci}-${ii}` ? `${cat.cor}08` : "transparent", transition: "background 0.15s" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{item.nome}</span>
                          <span style={{ color: "#4B5563", fontSize: 11 }}>{activeFeature === `${ci}-${ii}` ? "▲" : "▼"}</span>
                        </div>
                        {activeFeature === `${ci}-${ii}` && <p style={{ margin: "7px 0 0", fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>{item.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, background: "#0F1118", border: "1px solid #1E2535", borderRadius: 18, padding: "24px" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>🗺️ Roadmap de Lançamento</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {[
                  { fase: "V1.0", label: "POC", cor: "#00E5FF", items: ["Hierarquia 5 papéis", "Alertas por papel", "Dashboard por nível"] },
                  { fase: "V1.5", label: "Inteligência", cor: "#B388FF", items: ["IA de ociosidade", "Chat assistente", "Score de risco"] },
                  { fase: "V2.0", label: "Enterprise", cor: "#69FF47", items: ["Workflows avançados", "SSO + LDAP", "White-label API"] },
                  { fase: "V3.0", label: "Ecossistema", cor: "#FFD93D", items: ["Marketplace", "Benchmark IA", "Mobile app"] },
                ].map((r, i) => (
                  <div key={i} style={{ background: "#0D0F18", border: `1px solid ${r.cor}30`, borderRadius: 14, padding: "18px" }}>
                    <div style={{ fontSize: 10, color: r.cor, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>{r.fase}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>{r.label}</div>
                    {r.items.map((item, ii) => <div key={ii} style={{ fontSize: 11, color: "#9CA3AF", padding: "4px 0", borderTop: ii > 0 ? "1px solid #1E2535" : "none" }}>• {item}</div>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "diferenciais" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Por que LicenseHub vai ganhar</h2>
              <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>Concorrentes entregam tabelas. Nós entregamos inteligência com responsabilidade.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 32 }}>
              {data.diferenciais.map((d, i) => (
                <div key={i} style={{ background: "linear-gradient(135deg, #0F1118 0%, #111827 100%)", border: "1px solid #1E2535", borderRadius: 18, padding: "24px", transition: "transform 0.2s, border-color 0.2s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#00E5FF40"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#1E2535"; }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{d.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{d.titulo}</div>
                  <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>{d.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0F1118", border: "1px solid #1E2535", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #1E2535" }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>📊 LicenseHub vs. Mercado Tradicional</h3>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0D0F18" }}>
                      {["Funcionalidade", "Concorrente Típico", "LicenseHub SGI"].map((h, i) => (
                        <th key={i} style={{ padding: "12px 22px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: i === 2 ? "#00E5FF" : "#6B7280", textTransform: "uppercase", borderBottom: "1px solid #1E2535" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Responsável por licença", "❌ Campo de texto livre", "✅ Papel formal com aceite + auditoria"],
                      ["Hierarquia de acesso", "⚠️ Admin / User apenas", "✅ 5 níveis com delegação em cascata"],
                      ["Alertas de vencimento", "✅ Básico — vai para todos", "✅ Roteado ao Custodiante certo por papel"],
                      ["Substituição em ausências", "❌ Manual", "✅ Escalada automática ao Gestor"],
                      ["Análise de uso com IA", "❌ Não tem", "✅ Heatmap + detecção de ociosidade"],
                      ["Chat em linguagem natural", "❌ Não tem", "✅ 'Quem cuida do GitHub?' — resposta imediata"],
                      ["Log de auditoria", "⚠️ Log básico sem contexto", "✅ Papel do executor registrado em cada ação"],
                      ["Marketplace de licenças", "❌ Não existe", "✅ Transferência com rastreio de responsabilidade"],
                    ].map(([feat, old, novo], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#0F1118" : "#0B0D14", borderBottom: "1px solid #1A1D2A" }}>
                        <td style={{ padding: "12px 22px", fontSize: 13, fontWeight: 500 }}>{feat}</td>
                        <td style={{ padding: "12px 22px", fontSize: 12, color: "#6B7280" }}>{old}</td>
                        <td style={{ padding: "12px 22px", fontSize: 12, color: "#00E5FF", fontWeight: 600 }}>{novo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ marginTop: 28, background: "linear-gradient(135deg, #00E5FF15 0%, #7B2FFF15 100%)", border: "1px solid #00E5FF30", borderRadius: 18, padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🚀</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>Proposta de Valor em Uma Frase</h3>
              <p style={{ fontSize: 16, color: "#9CA3AF", maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>
                <span style={{ color: "#00E5FF", fontWeight: 700 }}>LicenseHub SGI</span> é o único sistema que combina{" "}
                <span style={{ color: "#FFD93D", fontWeight: 700 }}>governança hierárquica real</span> com{" "}
                <span style={{ color: "#B388FF", fontWeight: 700 }}>inteligência artificial nativa</span> — cada licença tem um dono, cada alerta chega na pessoa certa.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}