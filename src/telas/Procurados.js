import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { s, cor, Chips, Foto } from "../estilos";
import { OPCOES_CASA, OPCOES_PERIGO, SEM_CASA } from "../tipos";
import { fotoDoRegistro } from "../fotos";

const numeroRegistro = (n) => String(n || 0).padStart(4, "0");

// Cartaz de procurado (visual de pergaminho)
function Cartaz({ r }) {
  return (
    <View style={[s.cartaz, { width: "48.5%", padding: 6, marginBottom: 14 }]}>
      <View style={[s.cartazMoldura, { padding: 6 }]}>
        <Text style={[s.cartazTitulo, { fontSize: 20, letterSpacing: 1 }]}>PROCURADO</Text>
        <Text style={[s.cartazTexto, { fontWeight: "bold", fontSize: 16 }]}>Nº {numeroRegistro(r.numero)}</Text>

        {/* Proporção 3:4 (em pé): a foto não é cortada nem esticada */}
        <Foto
          uri={r.imagem}
          local={fotoDoRegistro(r)}
          nome={r.nome}
          estilo={{
            width: "100%",
            aspectRatio: 3 / 4,
            marginVertical: 6,
            borderWidth: 3,
            borderColor: cor.tinta,
            backgroundColor: "#b9a878",
            justifyContent: "center",
            alignItems: "center",
          }}
          corLetra={cor.tinta}
        />

        <Text style={[s.cartazNome, { fontSize: 15 }]}>{r.nome}</Text>
        {r.casa ? <Text style={[s.cartazTexto, { fontSize: 12 }]}>Casa: {r.casa}</Text> : null}
        <Text style={[s.cartazTexto, { fontWeight: "bold", fontSize: 12 }]}>SITUAÇÃO: FUGITIVO</Text>
        <Text style={[s.cartazTexto, { fontWeight: "bold", fontSize: 12, color: cor.sangue }]}>
          PERIGO: {(r.perigo || "").toUpperCase()}
        </Text>

        <Text style={[s.cartazTexto, { fontSize: 11, marginTop: 6 }]}>RECOMPENSA</Text>
        <Text style={[s.cartazRecompensa, { fontSize: 15, marginTop: 2, paddingVertical: 4 }]}>
          {r.recompensa > 0 ? `${r.recompensa.toLocaleString("pt-BR")} GALEÕES` : "A DEFINIR"}
        </Text>

        {r.motivo ? <Text style={[s.cartazTexto, { fontSize: 11, marginTop: 6 }]}>Procurado por: {r.motivo}</Text> : null}
        <Text style={[s.cartazTexto, { fontSize: 11, marginTop: 6 }]}>
          Qualquer informação deve ser comunicada de imediato ao Ministério da Magia. Não tente a captura.
        </Text>
        <Text style={[s.cartazSelo, { fontSize: 10 }]}>Emitido pelo Ministério da Magia</Text>
      </View>
    </View>
  );
}

export function Procurados({ registros = [] }) {
  const [casa, setCasa] = useState("");
  const [perigo, setPerigo] = useState("");
  const [maiorPrimeiro, setMaiorPrimeiro] = useState(true);

  // Só fugitivos ativos: quem é recapturado deixa de ser "fugitivo" e some daqui.
  let lista = registros
    .filter((r) => r.situacao === "fugitivo")
    .filter((r) => !casa || (casa === SEM_CASA ? !r.casa : r.casa === casa))
    .filter((r) => !perigo || r.perigo === perigo);
  if (maiorPrimeiro) lista = [...lista].sort((a, b) => (b.recompensa || 0) - (a.recompensa || 0));

  const totalFugitivos = registros.filter((r) => r.situacao === "fugitivo").length;

  return (
    <ScrollView contentContainerStyle={s.conteudo}>
      <Text style={s.titulo}>Procurados</Text>

      <Text style={s.rotulo}>Casa</Text>
      <Chips opcoes={OPCOES_CASA} valor={casa} onChange={setCasa} />
      <Text style={s.rotulo}>Perigo</Text>
      <Chips opcoes={OPCOES_PERIGO} valor={perigo} onChange={setPerigo} />
      <Text style={s.rotulo}>Ordem</Text>
      <Chips
        opcoes={[[true, "Maior recompensa"], [false, "Ordem de registro"]]}
        valor={maiorPrimeiro}
        onChange={setMaiorPrimeiro}
      />

      {casa || perigo ? (
        <Pressable style={[s.botao, s.botaoSec]} onPress={() => { setCasa(""); setPerigo(""); }}>
          <Text style={[s.botaoTexto, s.botaoSecTexto]}>Limpar filtros</Text>
        </Pressable>
      ) : null}

      <Text style={[s.nota, { marginTop: 12 }]}>
        Mostrando {lista.length} de {totalFugitivos} fugitivo(s).
      </Text>

      {totalFugitivos === 0 ? (
        <Text style={s.texto}>Nenhum fugitivo no momento. Azkaban está em ordem.</Text>
      ) : lista.length === 0 ? (
        <Text style={s.texto}>Nenhum fugitivo encontrado com esses filtros.</Text>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {lista.map((r) => (
            <Cartaz key={r.id} r={r} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}