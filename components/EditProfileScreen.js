import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 370;

export default function EditProfileScreen({ navigation }) {
  // Estados dos campos
  const [profilePic, setProfilePic] = useState(null); // Placeholder
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  // Placeholder para integração futura
  const handleSave = () => {
    // Aqui você pode chamar a API futuramente
    // Exemplo: updateProfile({ nome, sobrenome, senha, email, username, profilePic })
    alert('Perfil salvo! (integração futura com API)');
  };

  const handlePickImage = () => {
    // Placeholder para selecionar imagem
    alert('Funcionalidade de editar foto de perfil em breve!');
  };

  return (
    
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../assets/plainbg.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={[styles.card, isSmallScreen && styles.cardSmall]}>
          <TouchableOpacity style={styles.profilePicContainer} onPress={handlePickImage}>
            <Image
              source={profilePic ? { uri: profilePic } : require('../assets/profile.png')}
              style={styles.profilePic}
            />
            <Text style={styles.editPhotoText}>editar foto de perfil</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.input}
              placeholder="nome"
              placeholderTextColor="#5c6082"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="sobrenome"
              placeholderTextColor="#5c6082"
              value={sobrenome}
              onChangeText={setSobrenome}
            />
            <TextInput
              style={styles.input}
              placeholder="senha"
              placeholderTextColor="#5c6082"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor="#5c6082"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="nome de usuário"
              placeholderTextColor="#5c6082"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>voltar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(180deg, #5C6082 0%, #B6E0EA 100%)', // gradiente (pode ser ajustado)
  },
  card: {
    width: width > 500 ? 420 : width * 0.92,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 36,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    maxWidth: 480,
  },
  cardSmall: {
    width: width * 0.98,
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 6,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#2d304d',
    marginBottom: 8,
    resizeMode: 'contain',
  },
  editPhotoText: {
    color: '#5c6082',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  form: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 18,
    color: '#2d304d',
    marginBottom: 18,
    borderWidth: 0,
    fontFamily: 'Poppins',
  },
  saveButton: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 20,
    color: '#2d304d',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  backButton: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
    alignSelf: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#2d304d',
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
}); 