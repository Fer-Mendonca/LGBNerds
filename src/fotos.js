// O React Native precisa de um require() para CADA imagem local, com o nome exato do arquivo.
export const FOTOS = {
  1: require("../assets/fotos/foto1.jpeg"),
  2: require("../assets/fotos/foto2.jpeg"),
  3: require("../assets/fotos/foto3.jpeg"),
  4: require("../assets/fotos/foto4.jpeg"),
  5: require("../assets/fotos/foto5.jpeg"),
  6: require("../assets/fotos/foto6.jpeg"),
  7: require("../assets/fotos/foto7.jpeg"),
  8: require("../assets/fotos/foto8.jpeg"),
  9: require("../assets/fotos/foto9.jpeg"),
  10: require("../assets/fotos/foto10.jpeg"),
};

// Devolve a foto local do registro (pelo número dele) ou null se não houver.
export function fotoDoRegistro(registro) {
  return (registro && FOTOS[registro.numero]) || null;
}