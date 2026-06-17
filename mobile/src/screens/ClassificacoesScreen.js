import { useCallback, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getClassificacoes, deletarClassificacao, urlImagemClassificacao,
} from '../services/api';

export default function ClassificacoesScreen({ navigation }) {
  const [itens, setItens] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await getClassificacoes(filtro);
      setItens(dados);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel carregar o historico.');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarRemover(id) {
    Alert.alert('Remover', 'Remover esta classificacao do historico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarClassificacao(id);
            carregar();
          } catch {
            Alert.alert('Erro', 'Nao foi possivel remover.');
          }
        },
      },
    ]);
  }

  function formatarData(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: urlImagemClassificacao(item.id) }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.tipo}>{item.tipo_residuo}</Text>
        <Text style={styles.conf}>Confianca: {Math.round((item.confianca || 0) * 100)}%</Text>
        <Text style={styles.orient} numberOfLines={2}>{item.orientacao}</Text>
        <Text style={styles.data}>{formatarData(item.data_classificacao)}</Text>
      </View>
      <TouchableOpacity style={styles.del} onPress={() => confirmarRemover(item.id)}>
        <Text style={styles.delText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar por tipo de residuo..."
          value={filtro}
          onChangeText={setFiltro}
          onSubmitEditing={carregar}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={carregar}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 40 }} />
      ) : itens.length === 0 ? (
        <Text style={styles.empty}>Nenhuma classificacao no historico.</Text>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovaClassificacao')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterRow: { flexDirection: 'row', padding: 12, gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
  info: { flex: 1, marginLeft: 12 },
  tipo: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  conf: { fontSize: 12, color: '#888', marginTop: 2 },
  orient: { fontSize: 13, color: '#444', marginTop: 4 },
  data: { fontSize: 11, color: '#aaa', marginTop: 4 },
  del: { padding: 8 },
  delText: { color: '#C62828', fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 15 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
