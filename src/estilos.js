import { StyleSheet, Platform } from "react-native";

export const cor = {
  fundo: "#0d0b09", painel: "#1b1612", marrom: "#2e241b", ouro: "#a98a45",
  ouroClaro: "#c9ab63", texto: "#d8cdb6", pergaminho: "#dccba0", tinta: "#2a1d10", sangue: "#7d1d17",
};
export const corSituacao = { preso: "#9bb3a0", fugitivo: "#e08a80", recapturado: "#d6b36a" };
export const corPerigo = { Baixo: "#8fb996", Moderado: "#d6c26a", Alto: "#e0975a", Extremo: "#e0675a" };
export const serif = Platform.select({ ios: "Georgia", android: "serif", default: "serif" });

export const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cor.fundo },
  cabecalho: { backgroundColor: "#090705", paddingTop: 48, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 3, borderColor: cor.ouro },
  logo: { fontFamily: serif, fontSize: 28, letterSpacing: 8, color: cor.ouroClaro, fontWeight: "bold" },
  subtitulo: { fontFamily: serif, fontStyle: "italic", color: cor.texto, fontSize: 13 },
  abas: { flexDirection: "row", backgroundColor: "#090705", borderTopWidth: 1, borderColor: cor.ouro },
  aba: { flex: 1, paddingVertical: 14, alignItems: "center" },
  abaAtiva: { backgroundColor: cor.painel, borderTopWidth: 2, borderColor: cor.ouroClaro },
  abaTexto: { fontFamily: serif, color: cor.texto, fontSize: 13 },
  abaTextoAtivo: { color: cor.ouroClaro, fontWeight: "bold" },
  conteudo: { padding: 16, paddingBottom: 40 },
  titulo: { fontFamily: serif, fontSize: 22, color: cor.ouroClaro, fontWeight: "bold", borderBottomWidth: 1, borderColor: cor.ouro, paddingBottom: 6, marginBottom: 14 },
  subtitulo2: { fontFamily: serif, fontSize: 16, color: cor.ouroClaro, marginTop: 10, marginBottom: 6, fontWeight: "bold" },
  texto: { fontFamily: serif, color: cor.texto, fontSize: 15 },
  nota: { fontFamily: serif, color: cor.texto, opacity: 0.75, fontStyle: "italic", fontSize: 13, marginVertical: 6 },
  erro: { fontFamily: serif, color: "#e08a80", marginVertical: 6 },
  aviso: { backgroundColor: cor.marrom, borderWidth: 1, borderColor: cor.sangue, padding: 10, marginBottom: 10 },

  indicador: { backgroundColor: cor.painel, borderWidth: 1, borderColor: cor.ouro, padding: 16, alignItems: "center", marginBottom: 12 },
  indNumero: { fontFamily: serif, fontSize: 36, color: cor.ouroClaro },

  input: { fontFamily: serif, color: cor.texto, backgroundColor: cor.painel, borderWidth: 1, borderColor: "#5a4a2e", padding: 10, marginBottom: 8 },
  rotulo: { fontFamily: serif, color: cor.texto, marginBottom: 3, marginTop: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  chip: { borderWidth: 1, borderColor: "#5a4a2e", paddingVertical: 6, paddingHorizontal: 10 },
  chipAtivo: { backgroundColor: cor.ouro, borderColor: cor.ouroClaro },
  chipTexto: { fontFamily: serif, color: cor.texto, fontSize: 13 },
  chipTextoAtivo: { color: "#1a1208", fontWeight: "bold" },
  botao: { backgroundColor: cor.ouro, borderWidth: 1, borderColor: cor.ouroClaro, padding: 12, alignItems: "center", marginTop: 8 },
  botaoTexto: { fontFamily: serif, color: "#1a1208", fontWeight: "bold" },
  botaoSec: { backgroundColor: "transparent" },
  botaoSecTexto: { color: cor.ouroClaro },
  caixaApi: { maxHeight: 190, borderWidth: 1, borderColor: "#5a4a2e", backgroundColor: cor.painel, marginBottom: 6 },
  itemApi: { padding: 10, borderBottomWidth: 1, borderColor: "#3c3020" },
  itemApiAtivo: { backgroundColor: cor.marrom },

  card: { backgroundColor: cor.painel, borderWidth: 1, borderColor: cor.ouro, marginBottom: 16 },
  foto: { width: "100%", height: 220, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  fotoTom: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(90,60,20,0.35)" },
  fotoVazia: { fontSize: 56, color: cor.ouro, fontFamily: serif },
  cardCorpo: { padding: 12 },
  cardNome: { fontFamily: serif, fontSize: 18, color: cor.ouroClaro, fontWeight: "bold", marginBottom: 4 },
  linhaDado: { fontFamily: serif, color: cor.texto, fontSize: 14, marginBottom: 2 },
  etiquetas: { flexDirection: "row", gap: 6, marginTop: 8 },
  etiqueta: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  etiquetaTexto: { fontFamily: serif, fontSize: 12 },
  acoes: { flexDirection: "row", gap: 6, padding: 10, borderTopWidth: 1, borderColor: "#3c3020" },
  acao: { flex: 1, borderWidth: 1, borderColor: cor.ouro, padding: 8, alignItems: "center" },
  acaoDestaque: { backgroundColor: cor.ouro },
  acaoTexto: { fontFamily: serif, color: cor.ouroClaro, fontSize: 12 },

  cartaz: { backgroundColor: cor.pergaminho, borderWidth: 4, borderColor: "#8c6f3a", padding: 16, alignItems: "center", marginBottom: 24, elevation: 6, shadowColor: "#000", shadowOpacity: 0.6, shadowRadius: 8 },
  cartazMoldura: { borderWidth: 1, borderColor: cor.tinta, padding: 12, alignItems: "center", width: "100%" },
  cartazTitulo: { fontFamily: serif, fontSize: 38, letterSpacing: 4, color: cor.sangue, fontWeight: "bold" },
  cartazFoto: { width: "100%", height: 240, marginVertical: 10, borderWidth: 3, borderColor: cor.tinta },
  cartazNome: { fontFamily: serif, fontSize: 22, fontWeight: "bold", color: cor.tinta, textAlign: "center" },
  cartazTexto: { fontFamily: serif, color: cor.tinta, fontSize: 14, marginTop: 4, textAlign: "center" },
  cartazRecompensa: { fontFamily: serif, fontSize: 26, fontWeight: "bold", color: cor.tinta, marginTop: 10, paddingVertical: 6, borderTopWidth: 2, borderBottomWidth: 2, borderColor: cor.tinta, width: "100%", textAlign: "center" },
  cartazSelo: { fontFamily: serif, fontSize: 11, fontStyle: "italic", color: cor.tinta, marginTop: 12, textAlign: "center" },

  fundoModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", padding: 24 },
  modal: { backgroundColor: cor.painel, borderWidth: 1, borderColor: cor.ouro, padding: 16 },
});