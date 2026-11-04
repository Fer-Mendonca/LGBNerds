import { Component, useState, useEffect, useRef } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { buscarPagina, montarRegistrosExemplo, completarCasasExemplo } from "./src/api";
import { s, cor } from "./src/estilos";
import { Painel } from "./src/telas/Painel";
import { Registros } from "./src/telas/Registros";
import { Procurados } from "./src/telas/Procurados";
import { Cadastro } from "./src/telas/Cadastro";
import { Login } from "./src/telas/Login";

const CHAVE = "azkaban_registros_v1";
const CHAVE_EXEMPLOS = "azkaban_exemplos_v1"; // marca que os exemplos já foram criados uma vez
const CHAVE_CASAS = "azkaban_casas_v1"; // marca que as casas dos exemplos já foram completadas
const ABAS = [["painel", "Painel"], ["registros", "Registros"], ["procurados", "Procurados"], ["cadastro", "Cadastro"]];
const hoje = () => new Date().toLocaleDateString("pt-BR");

// Se uma tela quebrar, mostra o erro na tela em vez de ficar tudo em branco.
class CapturaErro extends Component {
  state = { erro: null };
  static getDerivedStateFromError(erro) {
    return { erro };
  }
  render() {
    if (this.state.erro) {
      return (
        <ScrollView contentContainerStyle={s.conteudo}>
          <Text style={s.titulo}>Erro na tela</Text>
          <Text style={s.erro}>{String(this.state.erro.message)}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [aba, setAba] = useState("painel");
  const [registros, setRegistros] = useState([]);
  const [carregou, setCarregou] = useState(false);
  const [editando, setEditando] = useState(null);
  const [admin, setAdmin] = useState(false); // true = administrador logado (só vale enquanto o app está aberto)

  const [personagens, setPersonagens] = useState([]);
  const [status, setStatus] = useState("Carregando personagens...");
  const [erroApi, setErroApi] = useState(false);
  const pagina = useRef(0);
  const ocupado = useRef(false);

  async function carregarMais() {
    if (ocupado.current) return;
    ocupado.current = true;
    setStatus("Carregando personagens...");
    try {
      const novos = await buscarPagina(pagina.current + 1);
      pagina.current += 1;
      setPersonagens((antigos) => [...antigos, ...novos.filter((n) => !antigos.some((a) => a.id === n.id))]);
      setErroApi(false);
      setStatus("Personagens carregados. Toque em um para preencher o formulário.");
    } catch (e) {
      setErroApi(true);
      setStatus(`Falha ao consultar a API (${e.message}). Você ainda pode preencher o nome manualmente.`);
    } finally {
      ocupado.current = false;
    }
  }

  // Ao abrir: lê os registros salvos. Na PRIMEIRA vez, cria os 10 registros de exemplo.
  useEffect(() => {
    async function iniciar() {
      try {
        const txt = await AsyncStorage.getItem(CHAVE);
        let salvos = txt ? JSON.parse(txt) : [];
        const jaCriouExemplos = await AsyncStorage.getItem(CHAVE_EXEMPLOS);
        const jaAjustouCasas = await AsyncStorage.getItem(CHAVE_CASAS);

        // Migração (uma vez): completa a casa dos exemplos que já estavam salvos sem casa.
        if (!jaAjustouCasas) {
          salvos = completarCasasExemplo(salvos);
          await AsyncStorage.setItem(CHAVE_CASAS, "sim");
        }

        if (salvos.length > 0) setRegistros(salvos);

        if (!jaCriouExemplos) {
          if (salvos.length === 0) {
            const exemplos = await montarRegistrosExemplo();
            setRegistros((lista) => {
              const novos = exemplos.filter((e) => !lista.some((r) => r.id === e.id));
              let numero = lista.reduce((m, r) => Math.max(m, r.numero || 0), 0);
              return [...lista, ...novos.map((e) => ({ ...e, numero: ++numero }))];
            });
          }
          await AsyncStorage.setItem(CHAVE_EXEMPLOS, "sim");
        }
      } catch (e) {
        // Se algo falhar, o app abre vazio e continua funcionando.
      } finally {
        setCarregou(true);
      }
    }
    iniciar();
    carregarMais();
  }, []);

  // Salva sempre que os registros mudarem (só depois da carga inicial).
  useEffect(() => {
    if (carregou) AsyncStorage.setItem(CHAVE, JSON.stringify(registros)).catch(() => {});
  }, [registros, carregou]);

  const alterar = (id, fn) => setRegistros((lista) => lista.map((r) => (r.id === id ? fn({ ...r, historico: [...r.historico] }) : r)));

  function salvar(dados) {
    setRegistros((lista) => {
      const existente = lista.find((r) => r.id === dados.id);
      if (!existente) {
        const numero = lista.reduce((m, r) => Math.max(m, r.numero || 0), 0) + 1;
        const novo = { ...dados, numero, dataFuga: null, dataRecaptura: null, historico: [] };
        if (dados.situacao === "fugitivo") { novo.dataFuga = hoje(); novo.historico.push(`${hoje()}: fuga registrada`); }
        return [...lista, novo];
      }
      return lista.map((r) => {
        if (r.id !== dados.id) return r;
        const n = { ...r, ...dados, historico: [...r.historico] };
        if (dados.situacao === "fugitivo" && r.situacao !== "fugitivo") { n.dataFuga = hoje(); n.historico.push(`${hoje()}: fuga registrada`); }
        if (dados.situacao === "recapturado" && r.situacao === "fugitivo") { n.dataRecaptura = hoje(); n.historico.push(`${hoje()}: recaptura registrada`); }
        return n;
      });
    });
    setEditando(null);
    setAba("registros");
  }

  const fuga = (id) => alterar(id, (r) => ({ ...r, situacao: "fugitivo", dataFuga: hoje(), dataRecaptura: null, historico: [...r.historico, `${hoje()}: fuga da cela ${r.cela || "—"}`] }));
  const recaptura = (id, cela) => alterar(id, (r) => ({ ...r, situacao: "recapturado", cela, dataRecaptura: hoje(), historico: [...r.historico, `${hoje()}: recapturado e levado à cela ${cela}`] }));
  const excluir = (id) => setRegistros((lista) => lista.filter((r) => r.id !== id));
  const editar = (id) => { setEditando(registros.find((r) => r.id === id)); setAba("cadastro"); };

  // Encerra a sessão do administrador e volta ao Painel.
  function sair() {
    setAdmin(false);
    setEditando(null);
    setAba("painel");
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#090705" }}>
        <StatusBar style="light" />

        <View style={[s.tela, { width: "100%", maxWidth: 480, alignSelf: "center" }]}>
          <View style={s.cabecalho}>
            <Text style={s.logo}>AZKABAN</Text>
            <Text style={s.subtitulo}>Ministério da Magia — Registro de Prisioneiros</Text>
          </View>

          {/* Faixa visível só para o administrador */}
          {admin && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: cor.marrom, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: cor.ouro }}>
              <Text style={[s.texto, { fontSize: 13 }]}>Modo administrador</Text>
              <Pressable onPress={sair}>
                <Text style={[s.acaoTexto, { fontSize: 14 }]}>Sair</Text>
              </Pressable>
            </View>
          )}

          <View style={{ flex: 1 }}>
            {!carregou ? (
              <Text style={[s.nota, { padding: 16 }]}>Abrindo os arquivos de Azkaban...</Text>
            ) : (
              <CapturaErro key={aba}>
                {aba === "painel" && <Painel registros={registros} />}
                {aba === "registros" && <Registros registros={registros} admin={admin} onEditar={editar} onFuga={fuga} onRecaptura={recaptura} onExcluir={excluir} />}
                {aba === "procurados" && <Procurados registros={registros} />}
                {aba === "cadastro" && !admin && <Login onEntrar={() => setAdmin(true)} />}
                {aba === "cadastro" && admin && (
                  <Cadastro
                    key={editando?.id || "novo"}
                    registros={registros}
                    api={{ lista: personagens, status, erro: erroApi, carregarMais }}
                    editando={editando}
                    onSalvar={salvar}
                    onCancelar={() => setEditando(null)}
                  />
                )}
              </CapturaErro>
            )}
          </View>

          <View style={s.abas}>
            {ABAS.map(([id, nome]) => (
              <Pressable key={id} style={[s.aba, aba === id && s.abaAtiva]} onPress={() => { if (id !== "cadastro") setEditando(null); setAba(id); }}>
                <Text style={[s.abaTexto, aba === id && s.abaTextoAtivo]}>
                  {id === "cadastro" && !admin ? "Admin" : nome}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}