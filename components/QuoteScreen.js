import React, { useMemo } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

const { width, height } = Dimensions.get('window');

const getQuoteBg = (theme) => theme.quoteImage || (theme.mode === 'dark' ? require('../assets/quotebgdark.png') : require('../assets/quotebg.png'));

// Frases retiradas de https://www.ibnd.com.br/blog/frases-motivacionais-curtas-para-se-inspirar.html
const QUOTES = [
  'Acredite que você pode, e você já está no meio do caminho.',
  'Cada conquista começa com a decisão de tentar.',
  'Faça o que tem que ser feito, até que você possa fazer o que quer fazer.',
  'O sucesso é a soma de pequenos esforços repetidos diariamente.',
  'Você é mais forte do que imagina.',
  'O único lugar onde o sucesso vem antes do trabalho é no dicionário.',
  'Não espere por oportunidades, crie-as.',
  'Desafios são o combustível da vitória.',
  'A jornada de mil milhas começa com um único passo.',
  'O fracasso é apenas a oportunidade de começar de novo, com mais experiência.',
  'Se você pode sonhar, você pode realizar.',
  'A vida é 10% o que acontece com você e 90% como você reage.',
  'Nunca é tarde demais para ser o que você poderia ter sido.',
  'Você é o autor da sua própria história.',
  'Mantenha seus sonhos vivos, independentemente das adversidades.',
  'A persistência é o caminho do êxito.',
  'Não tenha medo de desistir do bom para perseguir o ótimo.',
  'O único limite para o nosso amanhã será nossas dúvidas de hoje.',
  'Transforme seus erros em lições e seus medos em coragem.',
  'O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.',
  'Não pare quando estiver cansado. Pare quando tiver terminado.',
  'O futuro pertence àqueles que acreditam na beleza de seus sonhos.',
  'Acredite no seu potencial, porque você é capaz de grandes coisas.',
  'Siga em frente, mesmo quando for difícil.',
  'A ação é a chave para todo o sucesso.',
  'Você é capaz de superar qualquer obstáculo.',
  'Acredite que o melhor ainda está por vir.',
  'Seja a mudança que você deseja ver no mundo.',
  'Cada dia é uma nova oportunidade para recomeçar.',
  'Você nunca sabe o quão forte é até que ser forte seja sua única escolha.',
  'Não deixe que o medo de errar impeça você de tentar.',
  'O sucesso é a habilidade de ir de fracasso em fracasso sem perder o entusiasmo.',
  'Não importa o quão devagar você vá, desde que não pare.',
  'Os desafios fazem a vida interessante; superá-los faz a vida ter sentido.',
  'Tudo o que você precisa para começar é a decisão de continuar.',
  'O poder da mente é ilimitado quando você acredita em si mesmo.',
  'Os sonhos não têm prazo de validade.',
  'Você é o único responsável pelo seu sucesso.',
  'Grandes realizações exigem tempo e esforço.',
  'Siga em frente, porque a sua história ainda está sendo escrita.',
  'Você é capaz de alcançar coisas extraordinárias.',
  'O sucesso não está na chegada, mas no caminho percorrido.',
  'Onde há vontade, há um caminho.',
  'Não espere por uma oportunidade, crie uma.',
  'Acredite em você e tudo será possível.',
  'O melhor momento para começar foi ontem; o segundo melhor é agora.',
  'Seu único limite é você mesmo.',
  'Levante-se, sacuda a poeira e tente novamente.',
  'Não importa o quão difícil seja a jornada, o importante é não desistir.',
  'Você é capaz de coisas incríveis; acredite nisso!',
  'Carpe diem.',
  'Memento Vivere.'
];

function getDailyIndex(length) {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  let x = Math.sin(seed) * 10000;
  return Math.abs(Math.floor(x) % length);
}

export default function QuoteScreen({ navigation }) {
  const { theme } = useTheme();
  const dailyQuote = useMemo(() => {
    const idx = getDailyIndex(QUOTES.length);
    return QUOTES[idx];
  }, []);

  return (
    <ImageBackground
  source={getQuoteBg(theme)}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={38} color={theme.text} />
      </TouchableOpacity>
      <View style={styles.content}>
        <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>frase do dia</AppText>
        <AppText style={[styles.quoteText, { color: theme.text }]}>{dailyQuote}</AppText>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 18,
    zIndex: 2,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 32,
  fontStyle: 'italic',
    marginBottom: 18,
    textAlign: 'center',
    textTransform: 'lowercase',
    opacity: 0.9,
  },
  quoteText: {
    fontSize: 48,
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 56,
    opacity: 0.98,
  },
}); 

