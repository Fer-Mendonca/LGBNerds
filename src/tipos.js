export const TELAS = {
  PAINEL: 'Painel',
  REGISTROS: 'Registros',
  PROCURADOS: 'Procurados',
  CADASTRO: 'Cadastro',
};

export const CASAS = ["Grifinória", "Sonserina", "Corvinal", "Lufa-Lufa"];
export const SEM_CASA = "__sem_casa__";
export const PERIGOS = ["Baixo", "Moderado", "Alto", "Extremo"];
export const SITUACOES = ["preso", "fugitivo", "recapturado"];
export const ROTULO_SITUACAO = { preso: "Preso", fugitivo: "Fugitivo", recapturado: "Recapturado" };

// Opções dos filtros: [valor, texto]. Valor "" significa "sem filtro".
export const OPCOES_CASA = [["", "Todas"], ...CASAS.map((c) => [c, c]), [SEM_CASA, "Sem casa"]];
export const OPCOES_SITUACAO = [["", "Todas"], ...SITUACOES.map((x) => [x, ROTULO_SITUACAO[x]])];
export const OPCOES_PERIGO = [["", "Todos"], ...PERIGOS.map((p) => [p, p])];

// Acesso do administrador (protótipo: fica no código, não é segurança real)
export const ADMIN = { usuario: "admin", senha: "azkaban123" };

// Registros de exemplo (dados do projeto, não oficiais). Nome e foto vêm da API.
// A casa vem desta lista; sem "casa" aqui, o registro usa a casa da API (se houver) ou fica sem casa.
export const REGISTROS_EXEMPLO = [
  { slug: "sirius-black", nome: "Sirius Black", casa: "Grifinória", cela: "A-07", situacao: "fugitivo", perigo: "Extremo", recompensa: 10000,
    motivo: "Condenado sem julgamento e fugitivo de Azkaban", dataPrisao: "14/08/2025", dataFuga: "02/09/2026", dataRecaptura: null,
    historico: ["14/08/2025: preso e levado à cela A-07", "02/09/2026: fuga da cela A-07"] },
  { slug: "bellatrix-lestrange", nome: "Bellatrix Lestrange", casa: "Sonserina", cela: "B-12", situacao: "fugitivo", perigo: "Extremo", recompensa: 15000,
    motivo: "Maldições Imperdoáveis e ligação com os Comensais da Morte", dataPrisao: "03/02/2025", dataFuga: "20/10/2026", dataRecaptura: null,
    historico: ["03/02/2025: preso e levado à cela B-12", "20/10/2026: fuga da cela B-12"] },
  { slug: "peter-pettigrew", nome: "Peter Pettigrew", casa: "Grifinória", cela: "C-03", situacao: "fugitivo", perigo: "Alto", recompensa: 5000,
    motivo: "Traição e ligação com os Comensais da Morte", dataPrisao: "11/05/2025", dataFuga: "15/09/2026", dataRecaptura: null,
    historico: ["11/05/2025: preso e levado à cela C-03", "15/09/2026: fuga da cela C-03"] },
  { slug: "fenrir-greyback", nome: "Fenrir Greyback", cela: "C-21", situacao: "fugitivo", perigo: "Alto", recompensa: 3500,
    motivo: "Ataques a bruxos e trouxas", dataPrisao: "22/06/2025", dataFuga: "08/10/2026", dataRecaptura: null,
    historico: ["22/06/2025: preso e levado à cela C-21", "08/10/2026: fuga da cela C-21"] },

  { slug: "lucius-malfoy", nome: "Lucius Malfoy", casa: "Sonserina", cela: "D-31", situacao: "preso", perigo: "Alto", recompensa: 0,
    motivo: "Ligação com os Comensais da Morte", dataPrisao: "30/07/2025", dataFuga: null, dataRecaptura: null,
    historico: ["30/07/2025: preso e levado à cela D-31"] },
  { slug: "antonin-dolohov", nome: "Antonin Dolohov", cela: "D-18", situacao: "preso", perigo: "Alto", recompensa: 0,
    motivo: "Ligação com os Comensais da Morte", dataPrisao: "19/04/2025", dataFuga: null, dataRecaptura: null,
    historico: ["19/04/2025: preso e levado à cela D-18"] },
  { slug: "walden-macnair", nome: "Walden Macnair", cela: "E-25", situacao: "preso", perigo: "Moderado", recompensa: 0,
    motivo: "Ligação com os Comensais da Morte", dataPrisao: "09/09/2025", dataFuga: null, dataRecaptura: null,
    historico: ["09/09/2025: preso e levado à cela E-25"] },

  { slug: "rodolphus-lestrange", nome: "Rodolphus Lestrange", casa: "Sonserina", cela: "B-13", situacao: "recapturado", perigo: "Alto", recompensa: 0,
    motivo: "Maldições Imperdoáveis e ligação com os Comensais da Morte", dataPrisao: "03/02/2025", dataFuga: "12/03/2026", dataRecaptura: "01/05/2026",
    historico: ["03/02/2025: preso e levado à cela B-13", "12/03/2026: fuga da cela B-13", "01/05/2026: recapturado e levado à cela B-13"] },
  { slug: "augustus-rookwood", nome: "Augustus Rookwood", cela: "E-09", situacao: "recapturado", perigo: "Alto", recompensa: 0,
    motivo: "Espionagem a serviço dos Comensais da Morte", dataPrisao: "17/01/2025", dataFuga: "25/04/2026", dataRecaptura: "30/06/2026",
    historico: ["17/01/2025: preso e levado à cela E-09", "25/04/2026: fuga da cela E-09", "30/06/2026: recapturado e levado à cela E-09"] },
  { slug: "stan-shunpike", nome: "Stan Shunpike", cela: "F-44", situacao: "recapturado", perigo: "Baixo", recompensa: 0,
    motivo: "Detido por suspeita de ligação com os Comensais da Morte", dataPrisao: "05/11/2025", dataFuga: "18/05/2026", dataRecaptura: "02/07/2026",
    historico: ["05/11/2025: preso e levado à cela F-39", "18/05/2026: fuga da cela F-39", "02/07/2026: recapturado e levado à cela F-44"] },
];