import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { s, cor, corSituacao, corPerigo, Chips, Foto } from "../estilos";
import { OPCOES_CASA, OPCOES_SITUACAO, OPCOES_PERIGO, ROTULO_SITUACAO, SEM_CASA } from "../tipos";
import { fotoDoRegistro } from "../fotos";

const galeoes = (n) => `${(n || 0).toLocaleString("pt-BR")} galeões`;
const numeroRegistro = (n) => String(n || 0).padStart(4, "0");

function Etiqueta({ texto, corBorda }) {
  return (
    <View style={[s.etiqueta, { borderColor: corBorda }]}>
      <Text style={[s.etiquetaTexto, { color: corBorda }]}>{texto}</Text>
    </View>
  );
}

// Um card de prisioneiro. Os botões só aparecem para o administrador.
// "onPedirAcao" avisa a tela qual ação foi pedida (fuga, recaptura ou excluir) e para quem.
function CardRegistro({ r, admin, onEditar, onPedirAcao }) {
  const [verHistorico, setVerHistorico] = useState(false);
  const fugitivo = r.situacao === "fugitivo";

  return (
    // width 48.5% + container em linha = dois cards lado a lado
    <View style={[s.card, { width: "48.5%" }]}>
      {/* Proporção 3:4 (em pé): a foto não é cortada nem esticada */}
      <Foto
        local={fotoDoRegistro(r)}
        uri={r.imagem}
        nome={r.nome}
        estilo={{ width: "100%", aspectRatio: 3 / 4, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}
        comTom
      />

      <View style={s.cardCorpo}>
        <Text style={[s.cardNome, { fontSize: 15 }]}>{r.nome}</Text>
        <Text style={s.linhaDado}>Registro nº {numeroRegistro(r.numero)}</Text>
        <Text style={s.linhaDado}>Casa: {r.casa || "Não informada"}</Text>
        <Text style={s.linhaDado}>Cela: {r.cela || "—"}</Text>
        {r.recompensa > 0 ? <Text style={s.linhaDado}>Recompensa: {galeoes(r.recompensa)}</Text> : null}
        {r.motivo ? <Text style={[s.nota, { fontSize: 12 }]}>{r.motivo}</Text> : null}

        <View style={[s.etiquetas, { flexWrap: "wrap" }]}>
          <Etiqueta texto={ROTULO_SITUACAO[r.situacao] || r.situacao} corBorda={corSituacao[r.situacao] || cor.texto} />
          <Etiqueta texto={`Perigo ${r.perigo}`} corBorda={corPerigo[r.perigo] || cor.texto} />
        </View>

        <Pressable onPress={() => setVerHistorico(!verHistorico)}>
          <Text style={[s.nota, { marginTop: 8 }]}>
            {verHistorico ? "Ocultar histórico" : `Ver histórico (${r.historico.length})`}
          </Text>
        </Pressable>
        {verHistorico &&
          (r.historico.length === 0 ? (
            <Text style={s.linhaDado}>Sem ocorrências.</Text>
          ) : (
            r.historico.map((h, i) => (
              <Text key={i} style={[s.linhaDado, { fontSize: 12 }]}>• {h}</Text>
            ))
          ))}
      </View>

      {admin && (
        <View style={[s.acoes, { flexDirection: "column" }]}>
          <Pressable style={s.acao} onPress={() => onEditar(r.id)}>
            <Text style={s.acaoTexto}>Editar</Text>
          </Pressable>
          {fugitivo ? (
            <Pressable style={[s.acao, s.acaoDestaque]} onPress={() => onPedirAcao("recaptura", r)}>
              <Text style={[s.acaoTexto, { color: "#1a1208" }]}>Recapturar</Text>
            </Pressable>
          ) : (
            <Pressable style={s.acao} onPress={() => onPedirAcao("fuga", r)}>
              <Text style={s.acaoTexto}>Registrar fuga</Text>
            </Pressable>
          )}
          <Pressable style={s.acao} onPress={() => onPedirAcao("excluir", r)}>
            <Text style={s.acaoTexto}>Excluir</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function Registros({ registros = [], admin, onEditar, onFuga, onRecaptura, onExcluir }) {
  // --- Filtros ---
  const [busca, setBusca] = useState("");
  const [cela, setCela] = useState("");
  const [casa, setCasa] = useState("");
  const [situacao, setSituacao] = useState("");
  const [perigo, setPerigo] = useState("");
  const [porRecompensa, setPorRecompensa] = useState(false);

  // --- Janela de confirmação: { tipo: "fuga" | "recaptura" | "excluir", registro } ---
  const [acao, setAcao] = useState(null);
  const [novaCela, setNovaCela] = useState("");
  const [erroModal, setErroModal] = useState("");

  const temFiltro = busca || cela || casa || situacao || perigo || porRecompensa;

  function limparFiltros() {
    setBusca(""); setCela(""); setCasa(""); setSituacao(""); setPerigo(""); setPorRecompensa(false);
  }

  // Os filtros se combinam: cada .filter() trabalha sobre o resultado do anterior.
  let lista = registros
    .filter((r) => !busca || r.nome.toLowerCase().includes(busca.toLowerCase()))
    .filter((r) => !cela || String(r.cela || "").toLowerCase().includes(cela.toLowerCase()))
    .filter((r) => !casa || (casa === SEM_CASA ? !r.casa : r.casa === casa))
    .filter((r) => !situacao || r.situacao === situacao)
    .filter((r) => !perigo || r.perigo === perigo);
  if (porRecompensa) lista = [...lista].sort((a, b) => (b.recompensa || 0) - (a.recompensa || 0));

  function pedirAcao(tipo, registro) {
    setNovaCela("");
    setErroModal("");
    setAcao({ tipo, registro });
  }

  function fecharModal() {
    setAcao(null);
    setNovaCela("");
    setErroModal("");
  }

  function confirmar() {
    const { tipo, registro } = acao;
    if (tipo === "recaptura") {
      if (!novaCela.trim()) {
        setErroModal("Informe a cela para onde o prisioneiro será levado.");
        return;
      }
      onRecaptura(registro.id, novaCela.trim());
    } else if (tipo === "fuga") {
      onFuga(registro.id);
    } else if (tipo === "excluir") {
      onExcluir(registro.id);
    }
    fecharModal();
  }

  // Textos da janela, conforme a ação pedida
  const textos = {
    fuga: { titulo: "Registrar fuga", botao: "Confirmar fuga", msg: `Confirmar a fuga de ${acao?.registro.nome}?` },
    recaptura: { titulo: "Registrar recaptura", botao: "Confirmar recaptura", msg: acao?.registro.nome },
    excluir: {
      titulo: "Excluir registro",
      botao: "Excluir",
      msg: `Remover ${acao?.registro.nome} dos registros de Azkaban? O histórico será perdido.`,
    },
  };
  const t = acao ? textos[acao.tipo] : null;

  return (
    <>
      <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={s.titulo}>Registros</Text>

        <TextInput style={s.input} placeholder="Buscar pelo nome" placeholderTextColor="#7a6e58" value={busca} onChangeText={setBusca} />
        <TextInput style={s.input} placeholder="Buscar pela cela" placeholderTextColor="#7a6e58" value={cela} onChangeText={setCela} />

        <Text style={s.rotulo}>Casa</Text>
        <Chips opcoes={OPCOES_CASA} valor={casa} onChange={setCasa} />
        <Text style={s.rotulo}>Situação</Text>
        <Chips opcoes={OPCOES_SITUACAO} valor={situacao} onChange={setSituacao} />
        <Text style={s.rotulo}>Perigo</Text>
        <Chips opcoes={OPCOES_PERIGO} valor={perigo} onChange={setPerigo} />
        <Text style={s.rotulo}>Ordem</Text>
        <Chips
          opcoes={[[false, "Ordem de registro"], [true, "Maior recompensa"]]}
          valor={porRecompensa}
          onChange={setPorRecompensa}
        />

        {temFiltro ? (
          <Pressable style={[s.botao, s.botaoSec]} onPress={limparFiltros}>
            <Text style={[s.botaoTexto, s.botaoSecTexto]}>Limpar filtros</Text>
          </Pressable>
        ) : null}

        <Text style={[s.nota, { marginTop: 12 }]}>
          Mostrando {lista.length} de {registros.length} registro(s).
        </Text>

        {registros.length === 0 ? (
          <Text style={s.texto}>Nenhum prisioneiro registrado. O administrador pode cadastrar pela aba Admin.</Text>
        ) : lista.length === 0 ? (
          <Text style={s.texto}>Nenhum registro encontrado com esses filtros.</Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {lista.map((r) => (
              <CardRegistro key={r.id} r={r} admin={admin} onEditar={onEditar} onPedirAcao={pedirAcao} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Janela de confirmação (funciona no celular e no navegador) */}
      <Modal visible={!!acao} transparent animationType="fade" onRequestClose={fecharModal}>
        <View style={s.fundoModal}>
          <View style={s.modal}>
            {acao && (
              <>
                <Text style={s.subtitulo2}>{t.titulo}</Text>
                <Text style={s.texto}>{t.msg}</Text>

                {acao.tipo === "recaptura" && (
                  <>
                    <Text style={s.rotulo}>Nova cela</Text>
                    <TextInput
                      style={s.input}
                      placeholder="Ex.: B-12"
                      placeholderTextColor="#7a6e58"
                      value={novaCela}
                      onChangeText={setNovaCela}
                    />
                  </>
                )}

                {erroModal ? <Text style={s.erro}>{erroModal}</Text> : null}

                <Pressable style={s.botao} onPress={confirmar}>
                  <Text style={s.botaoTexto}>{t.botao}</Text>
                </Pressable>
                <Pressable style={[s.botao, s.botaoSec]} onPress={fecharModal}>
                  <Text style={[s.botaoTexto, s.botaoSecTexto]}>Cancelar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}