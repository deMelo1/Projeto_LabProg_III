import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { getEcoponto, atualizarEcoponto } from '../services/api';

export default function EditarEcopontoScreen({ route, navigation }) {
  const { id } = route.params;
  const [form, setForm] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getEcoponto(id)
      .then((data) => {
        setForm({
          nome: data.nome || '',
          endereco: data.endereco || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          latitude: data.latitude != null ? String(data.latitude) : '',
          longitude: data.longitude != null ? String(data.longitude) : '',
          tipos_residuo: data.tipos_residuo || '',
          descricao: data.descricao || '',
        });
      })
      .catch(() => Alert.alert('Erro', 'Nao foi possivel carregar os dados.'));
  }, [id]);

  if (!form) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSalvar = async () => {
    if (!form.nome || !form.endereco || !form.cidade) {
      Alert.alert('Campos obrigatorios', 'Preencha nome, endereco e cidade.');
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        nome: form.nome,
        endereco: form.endereco,
        cidade: form.cidade,
        estado: form.estado || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        tipos_residuo: form.tipos_residuo || null,
        descricao: form.descricao || null,
      };
      await atualizarEcoponto(id, dados);
      Alert.alert('Sucesso', 'Ecoponto atualizado!');
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel atualizar.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Campo label="Nome *" value={form.nome} onChange={(v) => handleChange('nome', v)} />
      <Campo label="Endereco *" value={form.endereco} onChange={(v) => handleChange('endereco', v)} />
      <Campo label="Cidade *" value={form.cidade} onChange={(v) => handleChange('cidade', v)} />
      <Campo label="Estado (UF)" value={form.estado} onChange={(v) => handleChange('estado', v)} maxLength={2} autoCapitalize="characters" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Campo label="Latitude" value={form.latitude} onChange={(v) => handleChange('latitude', v)} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Campo label="Longitude" value={form.longitude} onChange={(v) => handleChange('longitude', v)} keyboardType="numeric" />
        </View>
      </View>

      <Campo
        label="Tipos de Residuo"
        value={form.tipos_residuo}
        onChange={(v) => handleChange('tipos_residuo', v)}
        placeholder="Ex: plastico, metal, vidro"
      />
      <Campo
        label="Descricao"
        value={form.descricao}
        onChange={(v) => handleChange('descricao', v)}
        multiline
      />

      <TouchableOpacity
        style={[styles.saveBtn, salvando && { opacity: 0.6 }]}
        onPress={handleSalvar}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Salvar Alteracoes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function Campo({ label, value, onChange, multiline, placeholder, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: '#666', marginBottom: 4, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: { flexDirection: 'row', gap: 12 },
  saveBtn: {
    backgroundColor: '#1565C0',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
