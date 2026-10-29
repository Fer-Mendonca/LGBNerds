import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buscarPagina } from "./api";
import { Painel, Registros, Procurados, Cadastro } from "./telas";
import { s } from "./estilos";

const CHAVE = "azkaban_registros_v1";
const ABAS = [["painel", "Painel"], ["registros", "Registros"], ["procurados", "Procurados"], ["cadastro", "Cadastro"]];
const hoje = () => new Date().toLocaleDateString("pt-BR");

export default function App() {
  const [aba, setAba] = useState("painel");
  const [registros, setRegistros] = useState([]);
  const [carregou, setCarregou] = useState(false); 
  const [editando, setEditando] = useState(null);

 
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

  
  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((txt) => txt && setRegistros(JSON.parse(txt)))
      .catch(() => {})
      .finally(() => setCarregou(true));
    carregarMais();
  }, []);

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

  return (
    <View style={s.tela}>
      <StatusBar barStyle="light-content" />
      <View style={s.cabecalho}>
        <Text style={s.logo}>AZKABAN</Text>
        <Text style={s.subtitulo}>Ministério da Magia — Registro de Prisioneiros</Text>
      </View>

      <View style={{ flex: 1 }}>
        {aba === "painel" && <Painel registros={registros} />}
        {aba === "registros" && <Registros registros={registros} onEditar={editar} onFuga={fuga} onRecaptura={recaptura} onExcluir={excluir} />}
        {aba === "procurados" && <Procurados registros={registros} />}
        {aba === "cadastro" && (
          <Cadastro
            key={editando?.id || "novo"}
            registros={registros}
            api={{ lista: personagens, status, erro: erroApi, carregarMais }}
            editando={editando}
            onSalvar={salvar}
            onCancelar={() => setEditando(null)}
          />
        )}
      </View>

      <View style={s.abas}>
        {ABAS.map(([id, nome]) => (
          <Pressable key={id} style={[s.aba, aba === id && s.abaAtiva]} onPress={() => { if (id !== "cadastro") setEditando(null); setAba(id); }}>
            <Text style={[s.abaTexto, aba === id && s.abaTextoAtivo]}>{nome}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}