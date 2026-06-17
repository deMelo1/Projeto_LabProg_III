import { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { classificarImagem } from '../services/api';

export default function NovaClassificacaoScreen({ navigation }) {
  const [imagem, setImagem] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function tirarFoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissao negada', 'Precisamos da camera para tirar a foto do residuo.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!res.canceled) {
      setImagem(res.assets[0].uri);
      setResultado(null);
    }
  }

  async function escolherDaGaleria() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissao negada', 'Precisamos de acesso as fotos para escolher uma imagem.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!res.canceled) {
      setImagem(res.assets[0].uri);
      setResultado(null);
    }
  }

  async function enviar() {
    if (!imagem) return;
    setEnviando(true);
    setResultado(null);
    try {
      const dados = await classificarImagem(imagem);
      setResultado(dados);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Nao foi possivel classificar a imagem.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.titulo}>Classificar residuo</Text>
      <Text style={styles.sub}>
        Tire uma foto do objeto e o sistema identifica o tipo de residuo e a orientacao de descarte.
      </Text>

      {imagem ? (
        <Image source={{ uri: imagem }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
        </View>
      )}

      <View style={styles.botoesRow}>
        <TouchableOpacity style={[styles.btn, styles.btnSec]} onPress={tirarFoto}>
          <Text style={styles.btnSecText}>Tirar foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSec]} onPress={escolherDaGaleria}>
          <Text style={styles.btnSecText}>Galeria</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary, (!imagem || enviando) && styles.btnDisabled]}
        onPress={enviar}
        disabled={!imagem || enviando}
      >
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnPrimaryText}>Classificar</Text>
        )}
      </TouchableOpacity>

      {resultado && (
        <View style={styles.card}>
          <Text style={styles.cardTipo}>{resultado.tipo_residuo}</Text>
          <Text style={styles.cardConf}>
            Confianca: {Math.round((resultado.confianca || 0) * 100)}%
          </Text>
          <Text style={styles.cardOrient}>{resultado.orientacao}</Text>
          <TouchableOpacity
            style={styles.linkHist}
            onPress={() => navigation.navigate('Classificacoes')}
          >
            <Text style={styles.linkHistText}>Ver no historico →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32' },
  sub: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 16 },
  preview: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  placeholder: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: { color: '#999', fontSize: 15 },
  botoesRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSec: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  btnSecText: { color: '#2E7D32', fontWeight: 'bold' },
  btnPrimary: { backgroundColor: '#2E7D32', marginTop: 10 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnDisabled: { opacity: 0.5 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#2E7D32',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTipo: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32' },
  cardConf: { fontSize: 13, color: '#777', marginTop: 4 },
  cardOrient: { fontSize: 15, color: '#333', marginTop: 10, lineHeight: 21 },
  linkHist: { marginTop: 14 },
  linkHistText: { color: '#2E7D32', fontWeight: 'bold' },
});
