import { CASAS, REGISTROS_EXEMPLO } from "./tipos";

export const API_URL = "https://hogwarts-api.com/api/characters";
export const TAMANHO_PAGINA = 20;

export const MAPA = {
  lista: ["results", "data", "characters"],
  id: ["id", "_id", "slug"],
  nome: ["name", "nome", "fullName"],
  imagem: ["image", "image_url", "img", "photo"],
  casa: ["house", "casa"],
  especie: ["species", "especie"],
};

const CASAS_EN = { gryffindor: "Grifinória", slytherin: "Sonserina", ravenclaw: "Corvinal", hufflepuff: "Lufa-Lufa" };

function pegar(obj, chaves) {
  for (const k of chaves) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return null;
}

function traduzirCasa(casa) {
  const bruto = casa && typeof casa === "object" ? pegar(casa, ["name", "nome"]) : casa;
  if (!bruto) return null;
  const texto = String(bruto).trim();
  const chave = texto.toLowerCase();
  if (CASAS_EN[chave]) return CASAS_EN[chave];
  return CASAS.find((c) => c.toLowerCase() === chave) || texto;
}

function limparImagem(valor) {
  return typeof valor === "string" && valor.startsWith("http") ? valor : null;
}

function normalizar(item) {
  return {
    id: String(pegar(item, MAPA.id) ?? pegar(item, MAPA.nome)),
    nome: pegar(item, MAPA.nome) || "Nome desconhecido",
    imagem: limparImagem(pegar(item, MAPA.imagem)),
    casa: traduzirCasa(pegar(item, MAPA.casa)),
    especie: pegar(item, MAPA.especie),
  };
}

export async function buscarPagina(pagina) {
  const resp = await fetch(`${API_URL}?page=${pagina}&page_size=${TAMANHO_PAGINA}`);
  if (!resp.ok) throw new Error(`Resposta HTTP ${resp.status}`);
  const dados = await resp.json();
  const lista = Array.isArray(dados) ? dados : MAPA.lista.map((k) => dados[k]).find(Array.isArray);
  if (!lista) throw new Error("Formato inesperado: ajuste MAPA.lista em api.js");

  if (pagina === 1) {
    console.log("Chaves do JSON:", Array.isArray(dados) ? "(a resposta é um array)" : Object.keys(dados));
    console.log("Primeiro item bruto:", JSON.stringify(lista[0], null, 2));
  }
  return lista.map(normalizar);
}

// ---------- Registros de exemplo ----------

// Se a resposta vier embrulhada em { data: {...} }, pega o objeto de dentro.
function extrairObjeto(dados) {
  if (dados && !Array.isArray(dados) && dados.data && typeof dados.data === "object" && !Array.isArray(dados.data)) {
    return dados.data;
  }
  return dados;
}

// Busca UM personagem pelo identificador (slug), com limite de 6 segundos.
// Se falhar ou demorar, devolve null (o registro é criado sem foto da API).
async function buscarPorSlug(slug) {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 6000);
  try {
    const resp = await fetch(`${API_URL}/${slug}`, { signal: controle.signal });
    if (!resp.ok) return null;
    const obj = extrairObjeto(await resp.json());
    if (!obj || !pegar(obj, MAPA.nome)) return null;
    return normalizar(obj);
  } catch (e) {
    return null;
  } finally {
    clearTimeout(limite);
  }
}

// Monta os registros: dados do personagem (API) + dados administrativos (REGISTROS_EXEMPLO).
// A casa da lista de exemplos tem prioridade; sem ela, usa a da API; sem nenhuma, fica sem casa.
export async function montarRegistrosExemplo() {
  const personagens = await Promise.all(REGISTROS_EXEMPLO.map((e) => buscarPorSlug(e.slug)));

  const naoEncontrados = REGISTROS_EXEMPLO.filter((e, i) => !personagens[i]).map((e) => e.slug);
  if (naoEncontrados.length > 0) console.log("Não encontrados na API (sem foto da API):", naoEncontrados);

  return REGISTROS_EXEMPLO.map((e, i) => {
    const p = personagens[i];
    const { slug, nome, casa, ...administrativo } = e;
    return {
      id: p ? p.id : slug,
      nome: p ? p.nome : nome,
      imagem: p ? p.imagem : null,
      casa: casa ?? (p ? p.casa : null),
      especie: p ? p.especie : null,
      ...administrativo,
    };
  });
}

// Migração (roda uma vez): completa a casa dos exemplos já salvos no aparelho que ainda estão sem casa.
export function completarCasasExemplo(lista) {
  return lista.map((r) => {
    if (r.casa) return r;
    const exemplo = REGISTROS_EXEMPLO.find(
      (e) => e.casa && (e.slug === r.id || e.nome.toLowerCase() === String(r.nome).toLowerCase())
    );
    return exemplo ? { ...r, casa: exemplo.casa } : r;
  });
}