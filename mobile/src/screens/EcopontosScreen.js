import { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEcopontos } from '../services/api';

export default function EcopontosScreen({ navigation }) {
  const [ecopontos, setEcopontos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await getEcopontos(filtro);
      setEcopontos(dados);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel carregar os ecopontos.');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalheEcoponto', { id: item.id })}
    >
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardSub}>{item.endereco} - {item.cidade}/{item.estado}</Text>
      {item.tipos_residuo ? (
        <View style={styles.tagsRow}>
          {item.tipos_residuo.split(',').map((t, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{t.trim()}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
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
      ) : ecopontos.length === 0 ? (
        <Text style={styles.empty}>Nenhum ecoponto encontrado.</Text>
      ) : (
        <FlatList
          data={ecopontos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovoEcoponto')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
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
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 13, color: '#777', marginTop: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 12, color: '#2E7D32' },
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
