import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { s } from "../estilos";
import { ADMIN } from "../tipos";

export function Login({ onEntrar }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function entrar() {
    if (!usuario.trim() || !senha) {
      setErro("Informe o usuário e a senha.");
      return;
    }
    if (usuario.trim() === ADMIN.usuario && senha === ADMIN.senha) {
      setErro("");
      onEntrar(); // avisa o App que o administrador entrou
    } else {
      setErro("Usuário ou senha incorretos.");
      setSenha("");
    }
  }

  return (
    <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={s.titulo}>Acesso restrito</Text>

      <View style={s.card}>
        <View style={s.cardCorpo}>
          <Text style={s.nota}>Área reservada à administração do Ministério da Magia.</Text>

          <Text style={s.rotulo}>Usuário</Text>
          <TextInput
            style={s.input}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Usuário"
            placeholderTextColor="#7a6e58"
          />

          <Text style={s.rotulo}>Senha</Text>
          <TextInput
            style={s.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Senha"
            placeholderTextColor="#7a6e58"
            onSubmitEditing={entrar}
          />

          {erro ? <Text style={s.erro}>{erro}</Text> : null}

          <Pressable style={s.botao} onPress={entrar}>
            <Text style={s.botaoTexto}>Entrar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}