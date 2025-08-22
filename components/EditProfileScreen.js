import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';

const { width } = Dimensions.get('window');

function EditProfileScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [profilePic, setProfilePic] = useState(null);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSave = () => {
    alert('Perfil salvo! (integração futura com API)');
  };

  const handlePickImage = () => {
    alert('Funcionalidade de editar foto de perfil em breve!');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={theme.mode === 'dark' ? require('../assets/registrobgdark.png') : require('../assets/plainbg.png')}
        style={[styles.background, { backgroundColor: theme.background }]}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, { backgroundColor: theme.card }]}> 
            <TouchableOpacity style={styles.profilePicContainer} onPress={handlePickImage}>
              <Image
                source={profilePic ? { uri: profilePic } : require('../assets/profile.png')}
                style={styles.profilePic}
              />
              <AppText style={styles.editPhotoText}>editar foto de perfil</AppText>
            </TouchableOpacity>

            {/* Campos de formulário */}
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="nome"
              placeholderTextColor={theme.textSecondary}
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="sobrenome"
              placeholderTextColor={theme.textSecondary}
              value={sobrenome}
              onChangeText={setSobrenome}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="senha"
              placeholderTextColor={theme.textSecondary}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="nome de usuário"
              placeholderTextColor={theme.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            {/* Botões */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.button }]} onPress={handleSave}>
              <AppText style={[styles.saveButtonText, { color: theme.buttonText }]}>salvar</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.button }]} onPress={() => navigation.goBack()}>
              <AppText style={[styles.backButtonText, { color: theme.buttonText }]}>voltar</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  card: {
    width: width * 0.9,    
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  profilePic: {
    width: width * 0.3,    
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 3,
    borderColor: '#2d304d',
    marginBottom: 8,
    resizeMode: 'contain',
  },
  editPhotoText: {
    color: '#5c6082',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
    fontFamily: 'Poppins',
  },
  saveButton: {
    width: '90%',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  backButton: {
    width: '90%',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
});
