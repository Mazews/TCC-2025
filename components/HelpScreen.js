import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Linking } from 'react-native';

const CONTACTS = [
  {
    name: 'CVV (Centro de Valorização da Vida)',
    phone: '188',
    description: 'Atendimento 24h para apoio emocional e prevenção do suicídio.'
  },
  {
    name: 'CAPS (Centro de Atenção Psicossocial)',
    phone: '',
    description: 'Procure o CAPS mais próximo para atendimento psicológico gratuito.'
  },
  {
    name: 'SAMU',
    phone: '192',
    description: 'Serviço de Atendimento Móvel de Urgência.'
  },
  {
    name: 'Emergência Policial',
    phone: '190',
    description: 'Em caso de risco iminente.'
  },
  {
    name: 'Disque Saúde',
    phone: '136',
    description: 'Informações e orientações sobre saúde.'
  },
];

export default function HelpScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/loginbg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Contatos Úteis para Saúde Mental</Text>
        {CONTACTS.map((contact, idx) => (
          <View style={styles.contactBox} key={idx}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactDesc}>{contact.description}</Text>
            {contact.phone ? (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                <Text style={styles.contactPhone}>Ligar: {contact.phone}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    color: '#2d3150',
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 20,
    textAlign: 'center',
  },
  contactBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3150',
    marginBottom: 6,
  },
  contactDesc: {
    fontSize: 15,
    color: '#2d3150',
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 16,
    color: '#5c6082',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#5c6082',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 