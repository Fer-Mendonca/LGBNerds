import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { s, Chips, Foto } from "../estilos";
import { CASAS, OPCOES_CASA, PERIGOS, ROTULO_SITUACAO, SEM_CASA } from "../tipos";
import { fotoDoRegistro } from "../fotos";

const hoje = () => new Date().toLocaleDateString("pt-BR");

// Opções de casa do formulário (sem o "Todas", que só existe nos filtros)
const OPCOES_CASA_FORM = [...CASAS.map((c) => [c, c]), [SEM_CASA, "Sem casa"]];

export function Cadastro({ registros = [], api, editando, onSalvar, onCancelar }) {
  // --- Arquivo de Personagens (catálogo da API) ---
  const [busca, setBusca] = useState("");
  const [casaFiltro, setCasaFiltro] = useState("");
  const [avisoLista, setAvisoLista] = useState("");

  // --- Formulário. Se estiver editando, já começa preenchido. ---
  const [selecionado, setSelecionado] = useState(
    editando
      ? { id: editando.id, imagem: editando.imagem, especie: editando.especie }
      : null
  );
  const [nomeForm, setNomeForm] = useState(editando?.nome || "");
  const [casaForm, setCasaForm] = useState(editando?.casa || SEM_CASA);
  const [cela, setCela] = useState(editando?.cela || "");
  const [perigo, setPerigo] = useState(editando?.perigo || "Moderado");
  const [situacao, setSituacao] = useState(editando?.situacao || "preso");
  const [recompensa, setRecompensa] = useState(editando?.recompensa ? String(editando.recompensa) : "");
  const [motivo, setMotivo] = useState(editando?.motivo || "");
  const [avisoForm, setAvisoForm] = useState("");

  const opcoesSituacao = (editando ? ["preso", "fugitivo", "recapturado"] : ["preso", "fugitivo"]).map((x) => [x, ROTULO_SITUACAO[x]]);

  const filtrados = (api?.lista || [])
    .filter((p) => !busca || p.nome.toLowerCase().includes(busca.toLowerCase()))
    .filter((p) => !casaFiltro || (casaFiltro === SEM_CASA ? !p.casa : p.casa === casaFiltro));
  const visiveis = filtrados.slice(0, 100);

  const jaRegistrado = (id) => registros.some((r) => r.id === id);

  function selecionar(p) {
    if (jaRegistrado(p.id)) {
      setAvisoLista(`${p.nome} já consta nos registros de Azkaban. Para alterar, use Editar na aba Registros.`);
      return;
    }
    setAvisoLista("");
    setAvisoForm("");
    setSelecionado({ id: p.id, imagem: p.imagem, especie: p.especie });
    setNomeForm(p.nome);
    setCasaForm(p.casa || SEM_CASA);
  }

  function cadastroManual() {
    setAvisoLista("");
    setAvisoForm("");
    setSelecionado({ id: `manual-${Date.now()}`, imagem: null, especie: null });
    setNomeForm("");
    setCasaForm(SEM_CASA);
  }

  function limpar() {
    setSelecionado(null);
    setNomeForm(""); setCasaForm(SEM_CASA); setCela(""); setPerigo("Moderado");
    setSituacao("preso"); setRecompensa(""); setMotivo("");
    setAvisoForm(""); setAvisoLista("");
  }

  function cancelar() {
    limpar();
    onCancelar();
  }

  function salvar() {
    const nome = nomeForm.trim();
    if (!selecionado) return setAvisoForm("Selecione um personagem do arquivo ou use o cadastro manual.");
    if (!nome) return setAvisoForm("Informe o nome do personagem.");

    // Aceita "10000", "10.000" ou "10000,5": tira os pontos de milhar e troca a vírgula por ponto.
    const valor = recompensa.trim() === "" ? 0 : Number(recompensa.replace(/\./g, "").replace(",", "."));
    if (Number.isNaN(valor) || valor < 0) {
      return setAvisoForm("Recompensa inválida: use um número igual ou maior que zero.");
    }
    if (situacao !== "fugitivo" && !cela.trim()) {
      return setAvisoForm("Todo prisioneiro preso precisa de uma cela identificada.");
    }

    // Duplicidade: mesmo id (só ao cadastrar) ou mesmo nome em OUTRO registro.
    const duplicado =
      (!editando && registros.some((r) => r.id === selecionado.id)) ||
      registros.some((r) => r.id !== selecionado.id && r.nome.toLowerCase() === nome.toLowerCase());
    if (duplicado) return setAvisoForm(`${nome} já está registrado em Azkaban.`);

    const dados = {
      id: selecionado.id,
      nome,
      imagem: selecionado.imagem,
      casa: casaForm === SEM_CASA ? null : casaForm,
      especie: selecionado.especie,
      cela: cela.trim(),
      situacao,
      perigo,
      recompensa: valor,
      motivo: motivo.trim(),
    };
    if (!editando) dados.dataPrisao = hoje();

    setAvisoForm("");
    onSalvar(dados); // o App salva e leva para a aba Registros
    Alert.alert("Registro salvo", `${nome} foi ${editando ? "atualizado" : "registrado"} em Azkaban.`);
  }

  return (
    <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={s.titulo}>{editando ? "Editar registro" : "Cadastro"}</Text>

      {/* ---------- Arquivo de Personagens (só ao cadastrar) ---------- */}
      {!editando && (
        <>
          <Text style={s.subtitulo2}>Arquivo de Personagens</Text>
          <TextInput style={s.input} placeholder="Buscar pelo nome" placeholderTextColor="#7a6e58" value={busca} onChangeText={setBusca} />
          <Chips opcoes={OPCOES_CASA} valor={casaFiltro} onChange={setCasaFiltro} />

          <Text style={api?.erro ? s.erro : s.nota}>{api?.status}</Text>

          <ScrollView style={s.caixaApi} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {visiveis.length === 0 ? (
              <Text style={[s.nota, { padding: 10 }]}>
                Nenhum personagem encontrado entre os carregados. Tente carregar mais.
              </Text>
            ) : (
              visiveis.map((p) => (
                <Pressable
                  key={p.id}
                  style={[s.itemApi, selecionado?.id === p.id && s.itemApiAtivo]}
                  onPress={() => selecionar(p)}
                >
                  <Text style={s.texto}>{p.nome}</Text>
                  <Text style={s.nota}>
                    {[p.casa, p.especie].filter(Boolean).join(" · ") || "Sem informações"}
                    {jaRegistrado(p.id) ? " · já registrado" : ""}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
          <Text style={s.nota}>
            {filtrados.length} personagem(ns) carregado(s) correspondem à busca
            {filtrados.length > visiveis.length ? ` (mostrando ${visiveis.length})` : ""}.
          </Text>
          {avisoLista ? <Text style={s.erro}>{avisoLista}</Text> : null}

          <Pressable style={[s.botao, s.botaoSec]} onPress={() => api?.carregarMais()}>
            <Text style={[s.botaoTexto, s.botaoSecTexto]}>Carregar mais personagens</Text>
          </Pressable>
          <Pressable style={[s.botao, s.botaoSec]} onPress={cadastroManual}>
            <Text style={[s.botaoTexto, s.botaoSecTexto]}>Cadastro manual (sem a API)</Text>
          </Pressable>
        </>
      )}

      {/* ---------- Formulário ---------- */}
      {selecionado ? (
        <>
          <Text style={s.subtitulo2}>Dados do prisioneiro</Text>

          {/* Foto com proporção fixa (3:4), para não cortar nem esticar */}
          <Foto
            local={editando ? fotoDoRegistro(editando) : null}
            uri={selecionado.imagem}
            nome={nomeForm}
            estilo={{ width: "50%", aspectRatio: 3 / 4, alignSelf: "center", backgroundColor: "#000", justifyContent: "center", alignItems: "center", marginBottom: 8 }}
            comTom
          />

          <Text style={s.rotulo}>Nome</Text>
          <TextInput style={s.input} placeholder="Nome do personagem" placeholderTextColor="#7a6e58" value={nomeForm} onChangeText={setNomeForm} />

          <Text style={s.rotulo}>Casa de Hogwarts</Text>
          <Chips opcoes={OPCOES_CASA_FORM} valor={casaForm} onChange={setCasaForm} />

          <Text style={s.rotulo}>Cela {situacao === "fugitivo" ? "(opcional para fugitivo)" : ""}</Text>
          <TextInput style={s.input} placeholder="Ex.: 42-B" placeholderTextColor="#7a6e58" value={cela} onChangeText={setCela} />

          <Text style={s.rotulo}>Grau de perigo</Text>
          <Chips opcoes={PERIGOS.map((p) => [p, p])} valor={perigo} onChange={setPerigo} />

          <Text style={s.rotulo}>Situação</Text>
          <Chips opcoes={opcoesSituacao} valor={situacao} onChange={setSituacao} />

          <Text style={s.rotulo}>Recompensa em galeões (opcional)</Text>
          <TextInput style={s.input} placeholder="0" placeholderTextColor="#7a6e58" keyboardType="numeric" value={recompensa} onChangeText={setRecompensa} />

          <Text style={s.rotulo}>Motivo da prisão</Text>
          <TextInput
            style={[s.input, { minHeight: 70, textAlignVertical: "top" }]}
            placeholder="Descrição dos crimes"
            placeholderTextColor="#7a6e58"
            multiline
            value={motivo}
            onChangeText={setMotivo}
          />

          {avisoForm ? <Text style={s.erro}>{avisoForm}</Text> : null}

          <Pressable style={s.botao} onPress={salvar}>
            <Text style={s.botaoTexto}>{editando ? "Salvar alterações" : "Registrar em Azkaban"}</Text>
          </Pressable>
          <Pressable style={[s.botao, s.botaoSec]} onPress={cancelar}>
            <Text style={[s.botaoTexto, s.botaoSecTexto]}>Cancelar</Text>
          </Pressable>
        </>
      ) : (
        !editando && <Text style={[s.nota, { marginTop: 10 }]}>Toque em um personagem acima para preencher o registro.</Text>
      )}
    </ScrollView>
  );
}