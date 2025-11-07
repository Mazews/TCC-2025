import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

const getGuideBg = (theme) => theme.guideImage || (theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png'));

export default function GuideScreen({ navigation }) {
  const { theme } = useTheme();
  return (
    <ImageBackground
      source={getGuideBg(theme)}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={[styles.container]}> 
        <AppText style={[styles.title, { color: theme.textSecondary }]}>Guia do Usuário</AppText>
        
        <View style={[styles.guideBox, { backgroundColor: theme.card }]}> 
          <AppText style={[styles.guideTitle, { color: theme.text }]}>1. Registrar e Acompanhar seu Humor</AppText>
          <AppText style={[styles.guideText, { color: theme.textSecondary }]}>
            • Na tela inicial, toque em "Mood Tracker"{'\n'}
            • Use "REGISTRE SEU HUMOR" para adicionar uma entrada{'\n'}
            • Selecione as emoções que melhor descrevem como você está{'\n'}
            • Opcional: adicione uma nota sobre seu dia{'\n'}
            • Visualize seu histórico no "DIÁRIO DE HUMOR"{'\n'}
            • Acompanhe tendências nos gráficos semanais e mensais
          </AppText>
        </View>

        <View style={[styles.guideBox, { backgroundColor: theme.card }]}> 
          <AppText style={[styles.guideTitle, { color: theme.text }]}>2. Gerenciar Tarefas e Rotinas</AppText>
          <AppText style={[styles.guideText, { color: theme.textSecondary }]}>
            • Acesse "Tarefas" no menu principal{'\n'}
            • Crie novas tarefas com o botão "+"{'\n'}
            • Defina título, descrição, data e prioridade{'\n'}
            • Organize por categorias para melhor visualização{'\n'}
            • Marque tarefas concluídas{'\n'}
            • Use o calendário para planejamento futuro
          </AppText>
        </View>

        <View style={[styles.guideBox, { backgroundColor: theme.card }]}> 
          <AppText style={[styles.guideTitle, { color: theme.text }]}>3. Personalizar sua Experiência</AppText>
          <AppText style={[styles.guideText, { color: theme.textSecondary }]}>
            • Acesse seu perfil para editar informações{'\n'}
            • Configure notificações nas configurações{'\n'}
            • Alterne entre tema claro e escuro{'\n'}
            • Personalize seu avatar e nome de usuário{'\n'}
            • Ajuste lembretes e alertas conforme sua rotina
          </AppText>
        </View>

        <View style={[styles.guideBox, { backgroundColor: theme.card }]}> 
          <AppText style={[styles.guideTitle, { color: theme.text }]}>4. Recursos Adicionais</AppText>
          <AppText style={[styles.guideText, { color: theme.textSecondary }]}>
            • Encontre frases inspiradoras na seção "Quotes"{'\n'}
            • Use o calendário para visualizar compromissos{'\n'}
            • Acesse dicas de bem-estar na seção "Ajuda"{'\n'}
            • Exporte seus dados de progresso se necessário{'\n'}
            • Entre em contato pelo suporte se precisar de ajuda
          </AppText>
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]} onPress={() => navigation.goBack()}>
          <AppText style={[styles.buttonText, { color: theme.text }]}>Voltar</AppText>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    marginBottom: 25,
    marginTop: 50,
    textAlign: 'center',
  },
  guideBox: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    shadowColor: 'rgba(30, 32, 50, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 2,
  },
  guideTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
  },
  guideText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    lineHeight: 22,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
}); 