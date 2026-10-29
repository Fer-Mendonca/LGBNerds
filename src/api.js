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

function pegar(obj, chaves) {
  for (const k of chaves) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return null;
}

function normalizar(item) {
  return {
    id: String(pegar(item, MAPA.id) ?? pegar(item, MAPA.nome)),
    nome: pegar(item, MAPA.nome) || "Nome desconhecido",
    imagem: pegar(item, MAPA.imagem),
    casa: pegar(item, MAPA.casa),
    especie: pegar(item, MAPA.especie),
  };
}

export async function buscarPagina(pagina) {
  const resp = await fetch(`${API_URL}?page=${pagina}&page_size=${TAMANHO_PAGINA}`);
  if (!resp.ok) throw new Error(`Resposta HTTP ${resp.status}`);
  const dados = await resp.json();
  const lista = Array.isArray(dados) ? dados : MAPA.lista.map((k) => dados[k]).find(Array.isArray);
  if (!lista) throw new Error("Formato inesperado: ajuste MAPA.lista em api.js");
  if (pagina === 1) console.log("Primeiro item bruto da API:", lista[0]);
  return lista.map(normalizar);
}