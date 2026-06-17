import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { checkHealth } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [apiStatus, setApiStatus] = useState('verificando');

  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const statusColor = apiStatus === 'online' ? '#4CAF50' : apiStatus === 'offline' ? '#F44336' : '#FF9800';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoFilter</Text>
      <Text style={styles.subtitle}>Gestao de Residuos Inteligente</Text>

      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        {apiStatus === 'verificando' ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.statusText}>
            API {apiStatus === 'online' ? 'Conectada' : 'Desconectada'}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Ecopontos')}
      >
        <Text style={styles.buttonText}>Ecopontos</Text>
        <Text style={styles.buttonDesc}>Gerenciar pontos de coleta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => navigation.navigate('NovaClassificacao')}
      >
        <Text style={styles.buttonText}>Classificar Residuo</Text>
        <Text style={styles.buttonDesc}>Tirar foto e identificar o tipo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => navigation.navigate('Classificacoes')}
      >
        <Text style={styles.buttonText}>Historico</Text>
        <Text style={styles.buttonDesc}>Ver classificacoes anteriores</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 40,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2E7D32',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSpacing: {
    marginTop: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonDesc: {
    color: '#C8E6C9',
    fontSize: 13,
    marginTop: 4,
  },
});
