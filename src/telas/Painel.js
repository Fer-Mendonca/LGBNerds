import { ScrollView, Text, View } from "react-native";
import { s, corPerigo } from "../estilos";

const galeoes = (n) => `${(n || 0).toLocaleString("pt-BR")}`;

function Indicador({ numero, rotulo, nota }) {
  return (
    <View style={[s.indicador, { width: "48.5%", padding: 12 }]}>
      <Text style={s.indNumero}>{numero}</Text>
      <Text style={[s.texto, { textAlign: "center", fontSize: 13 }]}>{rotulo}</Text>
      {nota ? <Text style={s.nota}>{nota}</Text> : null}
    </View>
  );
}

export function Painel({ registros = [] }) {
  // Tudo é calculado a partir dos registros; nenhum número fixo.
  const fugitivos = registros.filter((r) => r.situacao === "fugitivo");
  const presos = registros.filter((r) => r.situacao === "preso" || r.situacao === "recapturado");
  const recapturados = registros.filter((r) => r.situacao === "recapturado");
  const recompensas = fugitivos.reduce((total, r) => total + (r.recompensa || 0), 0);

  const maisProcurados = [...fugitivos].sort((a, b) => (b.recompensa || 0) - (a.recompensa || 0)).slice(0, 3);
  const perigosos = presos.filter((r) => r.perigo === "Extremo").slice(0, 3);

  return (
    <ScrollView contentContainerStyle={s.conteudo}>
      <Text style={s.titulo}>Painel</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Indicador numero={registros.length} rotulo="Registrados em Azkaban" />
        <Indicador numero={presos.length} rotulo="Atualmente presos" nota="Inclui recapturados." />
        <Indicador numero={fugitivos.length} rotulo="Fugitivos" />
        <Indicador numero={recapturados.length} rotulo="Recapturados" />
      </View>
      <Indicador numero={galeoes(recompensas)} rotulo="Galeões em recompensas abertas" />

      <Text style={s.subtitulo2}>Fugitivos mais procurados</Text>
      {maisProcurados.length === 0 ? (
        <Text style={s.nota}>Nenhum fugitivo no momento.</Text>
      ) : (
        maisProcurados.map((r) => (
          <Text key={r.id} style={s.texto}>
            {r.nome} — {galeoes(r.recompensa)} galeões ·{" "}
            <Text style={{ color: corPerigo[r.perigo] }}>{r.perigo}</Text>
          </Text>
        ))
      )}

      <Text style={s.subtitulo2}>Prisioneiros de perigo extremo</Text>
      {perigosos.length === 0 ? (
        <Text style={s.nota}>Nenhum prisioneiro de perigo extremo.</Text>
      ) : (
        perigosos.map((r) => (
          <Text key={r.id} style={s.texto}>
            {r.nome} — cela {r.cela || "—"}
          </Text>
        ))
      )}

      <Text style={[s.nota, { marginTop: 16 }]}>
        Os registros iniciais são de demonstração: graus de perigo, celas e recompensas são fictícios, definidos para
        o projeto. Os dados ficam salvos só neste aparelho, sem sincronização com servidor.
      </Text>
    </ScrollView>
  );
}