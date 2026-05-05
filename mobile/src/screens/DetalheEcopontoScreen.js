import { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEcoponto, deletarEcoponto } from '../services/api';

export default function DetalheEcopontoScreen({ route, navigation }) {
  const { id } = route.params;
  const [ecoponto, setEcoponto] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getEcoponto(id)
        .then(setEcoponto)
        .catch(() => Alert.alert('Erro', 'Nao foi possivel carregar o ecoponto.'))
        .finally(() => setLoading(false));
    }, [id])
  );

  const handleDeletar = () => {
    Alert.alert(
      'Confirmar exclusao',
      `Deseja realmente excluir "${ecoponto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarEcoponto(id);
              navigation.goBack();
            } catch {
              Alert.alert('Erro', 'Nao foi possivel excluir.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!ecoponto) {
    return (
      <View style={styles.center}>
        <Text>Ecoponto nao encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{ecoponto.nome}</Text>

      <View style={styles.infoCard}>
        <InfoRow label="Endereco" value={ecoponto.endereco} />
        <InfoRow label="Cidade" value={ecoponto.cidade} />
        <InfoRow label="Estado" value={ecoponto.estado} />
        {ecoponto.latitude != null && (
          <InfoRow label="Latitude" value={String(ecoponto.latitude)} />
        )}
        {ecoponto.longitude != null && (
          <InfoRow label="Longitude" value={String(ecoponto.longitude)} />
        )}
        {ecoponto.tipos_residuo && (
          <InfoRow label="Tipos de Residuo" value={ecoponto.tipos_residuo} />
        )}
        {ecoponto.descricao && (
          <InfoRow label="Descricao" value={ecoponto.descricao} />
        )}
        {ecoponto.criado_em && (
          <InfoRow
            label="Criado em"
            value={new Date(ecoponto.criado_em).toLocaleDateString('pt-BR')}
          />
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#1565C0' }]}
          onPress={() => navigation.navigate('EditarEcoponto', { id })}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#C62828' }]}
          onPress={handleDeletar}
        >
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: { fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 16, color: '#333' },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
