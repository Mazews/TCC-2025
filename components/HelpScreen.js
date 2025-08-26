import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

const getHelpBg = (theme) => theme.helpImage || (theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png'));

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
  const { theme } = useTheme();
  return (
    <ImageBackground
      source={getHelpBg(theme)}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={[styles.container]}> 
        <AppText style={[styles.title, { color: theme.textSecondary }]}>
          Contatos úteis para Saúde Mental
        </AppText>
        {CONTACTS.map((contact, idx) => (
          <View style={[styles.contactBox, { backgroundColor: theme.card }]} key={idx}>
            <View>
              <AppText style={[styles.contactName, { color: theme.text }]}>{contact.name}</AppText>
              <AppText style={[styles.contactDesc, { color: theme.textSecondary }]}>{contact.description}</AppText>
              {contact.phone ? (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                  <AppText style={[styles.contactPhone, { color: theme.textSecondary }]}>Ligar: {contact.phone}</AppText>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.switchThumb2 }]} onPress={() => navigation.goBack()}>
          <AppText style={[styles.buttonText, { color: theme.text }]}>Voltar</AppText>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
    
  },
  title: {
    fontSize: 26,
    marginBottom: 25,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  contactBox: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    shadowColor: 'rgba(88, 90, 110, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 2,
   
  },
  contactName: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  contactTitle: {
    fontSize: 16,
    marginBottom: 10,
    marginBottom: 6,
  },
  contactDesc: {
    fontSize: 15,
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textDecorationLine: 'underline',
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center',

  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});