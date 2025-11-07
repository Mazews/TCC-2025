import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions, 
  ActivityIndicator,
  Animated,
  RefreshControl,
  StatusBar,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Platform,
  Modal,
  Linking // ✅ ADICIONADO
} from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');
const getTasksBg = theme => theme.tasksImage || (theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png'));

export default function TasksScreen({ navigation }) {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);
  
  // Estados do modal de resposta
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [responseTitle, setResponseTitle] = useState('');
  const [responseSummary, setResponseSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const tasksAnimatedValues = useRef({}).current;

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const API_BASE_URL = 'https://backend-fellsystem.vercel.app';

  useEffect(() => {
    // Animação de fade in inicial
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animação flutuante contínua
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      // ✅ CORRIGIDO - Token no header Authorization
      const response = await fetch(`${API_BASE_URL}/tasks/pending`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // ✅ Token no header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }

      const data = await response.json();
      
      // Usar a resposta conforme o formato do backend
      const tasksList = data.pendingTasks || [];
      const total = data.total || tasksList.length;
      
      setTasks(tasksList);
      setTotalTasks(total);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
  };

  // Solicitar permissões
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera e galeria.');
        return false;
      }
    }
    return true;
  };

  // Validar tamanho do arquivo
  const validateFileSize = (size) => {
    if (size > MAX_FILE_SIZE) {
      Alert.alert('Arquivo muito grande', 'O arquivo deve ter no máximo 50 MB.');
      return false;
    }
    return true;
  };

  // Selecionar imagem
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.fileSize && !validateFileSize(asset.fileSize)) return;

      setSelectedFile({
        uri: asset.uri,
        type: 'image',
        mimeType: asset.mimeType || 'image/jpeg',
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: asset.fileSize
      });
      setFilePreview(asset.uri);
    }
  };

  // Tirar foto
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.fileSize && !validateFileSize(asset.fileSize)) return;

      setSelectedFile({
        uri: asset.uri,
        type: 'image',
        mimeType: 'image/jpeg',
        name: `photo_${Date.now()}.jpg`,
        size: asset.fileSize
      });
      setFilePreview(asset.uri);
    }
  };

  // Selecionar vídeo
  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.fileSize && !validateFileSize(asset.fileSize)) return;

      setSelectedFile({
        uri: asset.uri,
        type: 'video',
        mimeType: asset.mimeType || 'video/mp4',
        name: asset.fileName || `video_${Date.now()}.mp4`,
        size: asset.fileSize
      });
      setFilePreview(asset.uri);
    }
  };

  // Selecionar PDF
  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success' || !result.canceled) {
        const file = result.assets ? result.assets[0] : result;
        if (file.size && !validateFileSize(file.size)) return;

        setSelectedFile({
          uri: file.uri,
          type: 'pdf',
          mimeType: 'application/pdf',
          name: file.name,
          size: file.size
        });
        setFilePreview(null);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
      console.error(err);
    }
  };

  // Remover arquivo
  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Mostrar opções de upload
  const showUploadOptions = () => {
    Alert.alert(
      'Selecionar arquivo',
      'Escolha uma opção',
      [
        { text: 'Tirar Foto', onPress: takePhoto },
        { text: 'Galeria de Fotos', onPress: pickImage },
        { text: 'Galeria de Vídeos', onPress: pickVideo },
        { text: 'Documento PDF', onPress: pickPDF },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Abrir modal de resposta
  const openResponseModal = (task) => {
    setSelectedTask(task);
    setResponseModalVisible(true);
  };

  // Fechar modal de resposta
  const closeResponseModal = () => {
    setResponseModalVisible(false);
    setSelectedTask(null);
    setResponseTitle('');
    setResponseSummary('');
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Enviar resposta da tarefa
  const submitTaskResponse = async () => {
    if (!responseTitle.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva um título para sua resposta.');
      return;
    }

    if (!responseSummary.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva um resumo da sua resposta.');
      return;
    }

    setUploading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      
      // ✅ Adicionar dados básicos conforme esperado pelo backend
      const taskId = selectedTask._id || selectedTask.id;
      formData.append('taskId', taskId);
      formData.append('title', responseTitle);
      formData.append('description', responseSummary);
 // ✅ Adicionar token no formData conforme backend espera  

      // ✅ Adicionar arquivo se existir (campo 'archive' - nome esperado pelo multer)
      if (selectedFile) {
        const fileToUpload = {
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
          name: selectedFile.name,
        };
        formData.append('archive', fileToUpload);
      }

      const RESPONSE_ENDPOINT = `${API_BASE_URL}/tasks/response`;

      const response = await fetch(RESPONSE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // ✅ CORRIGIDO - Token no header
          'Accept': 'application/json',
          // Não definir Content-Type - FormData define automaticamente como multipart/form-data
        },    
        body: formData,

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar resposta');
      }

      // ✅ Verificar se é um vídeo em processamento
      const isVideoProcessing = data.videoProcessing === true;
      
      const successMessage = isVideoProcessing 
        ? 'Resposta enviada! O vídeo estará disponível em instantes. ⏳'
        : 'Resposta enviada com sucesso! ✅';

      Alert.alert(
        'Sucesso!',
        successMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              closeResponseModal();
              fetchTasks(); // Atualizar lista de tarefas
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      
      let errorMessage = 'Não foi possível enviar a resposta. Tente novamente.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Renderizar steps
  const renderSteps = (steps) => {
    if (!steps || !steps.list || steps.list.length === 0) return null;

    const isOrdered = steps.style === 'ordered';

    return (
      <View style={styles.stepsContainer}>
        <AppText style={styles.stepsTitle}>Passos:</AppText>
        {steps.list.map((step, index) => (
          <AppText key={index} style={styles.stepItem}>
            {isOrdered ? `${index + 1}. ${step}` : `• ${step}`}
          </AppText>
        ))}
      </View>
    );
  };

  // Renderizar arquivo anexado pelo psicólogo
  const renderAttachedFile = (archive) => {
    if (!archive || !archive.url) return null;

    const archiveType = archive.archive_type;
    const isProcessing = archive.processing === true;
    
    return (
      <View style={styles.psychologistFileContainer}>
        <View style={styles.psychologistFileHeader}>
          <Icon name="paperclip" size={16} color="#667eea" />
          <AppText style={styles.psychologistFileTitle}>Material do Psicólogo</AppText>
        </View>
        
        {/* Renderizar Imagem */}
        {archiveType === 'image' && (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => {
              Alert.alert(
                'Imagem Anexada',
                'Visualize a imagem enviada pelo psicólogo',
                [{ text: 'OK' }]
              );
            }}
          >
            <Image 
              source={{ uri: archive.url }} 
              style={styles.psychologistImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Renderizar Vídeo */}
        {archiveType === 'video' && (
          <View style={styles.psychologistVideoContainer}>
            {isProcessing ? (
              <View style={styles.videoProcessingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <AppText style={styles.videoProcessingText}>
                  ⏳ Vídeo processando...
                </AppText>
                <AppText style={styles.videoProcessingSubtext}>
                  Estará disponível em instantes
                </AppText>
              </View>
            ) : (
              <Video
                source={{ uri: archive.url }}
                style={styles.psychologistVideo}
                useNativeControls
                resizeMode="contain"
                shouldPlay={false}
              />
            )}
          </View>
        )}

        {/* Renderizar PDF */}
        {archiveType === 'pdf' && (
          <TouchableOpacity 
            style={styles.psychologistPdfCard}
            onPress={() => {
              Alert.alert(
                'Documento PDF',
                'Deseja abrir o documento em outra aba?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Abrir PDF', 
                    onPress: () => {
                      Linking.openURL(archive.url); // ✅ CORRIGIDO
                    }
                  }
                ]
              );
            }}
          >
            <View style={styles.psychologistPdfIcon}>
              <Icon name="file-text" size={40} color="#667eea" />
            </View>
            <View style={styles.psychologistPdfInfo}>
              <AppText style={styles.psychologistPdfTitle}>📄 Documento PDF</AppText>
              <AppText style={styles.psychologistPdfSubtitle}>Toque para abrir</AppText>
            </View>
            <Icon name="external-link" size={20} color="#667eea" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Estatísticas das tarefas
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => 
      task.status === 'complete'
    ).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const getTaskAnimation = (taskId) => {
    if (!tasksAnimatedValues[taskId]) {
      tasksAnimatedValues[taskId] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
      };
    }
    return tasksAnimatedValues[taskId];
  };

  const FloatingShape = ({ style }) => {
    const translateY = floatingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -30],
    });

    const rotate = floatingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          styles.floatingShape,
          style,
          { 
            transform: [
              { translateY },
              { rotate }
            ] 
          }
        ]}
      />
    );
  };

  const StatCard = ({ number, label, delay = 0 }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }).start();
    }, [number]);

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
        <BlurView intensity={20} tint="dark" style={styles.statCard}>
          <AppText style={styles.statNumber}>{number}</AppText>
          <AppText style={styles.statLabel}>{label}</AppText>
        </BlurView>
      </Animated.View>
    );
  };

  function renderTask({ item, index }) {
    const taskId = item._id || item.id;
    const title = item.title || 'Tarefa';
    const description = item.description || '';
    const completionDate = item.completionDate;
    const status = item.status || 'pending';
    const done = status === 'complete';
    const steps = item.steps;
    const hasArchive = item.archive && item.archive.url;

    const animation = getTaskAnimation(taskId);

    const handleTaskPress = () => {
      if (!done) {
        Animated.sequence([
          Animated.timing(animation.scale, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animation.scale, {
            toValue: 1.05,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animation.scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        openResponseModal(item);
      }
    };

    return (
      <Animated.View
        style={[
          styles.taskContainer,
          {
            transform: [{ scale: animation.scale }],
            opacity: done ? 0.7 : 1,
          }
        ]}
      >
        <BlurView intensity={15} tint="dark" style={styles.taskBlur}>
          <TouchableOpacity 
            onPress={handleTaskPress} 
            activeOpacity={0.8}
            disabled={done}
          >
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <View
                  style={[
                    styles.checkbox,
                    done && styles.checkboxCompleted
                  ]}
                >
                  {done && <Icon name="check" size={16} color="#fff" />}
                </View>
                
                <View style={styles.taskInfo}>
                  <AppText
                    style={[
                      styles.taskTitle,
                      { color: theme.text },
                      done && styles.taskTitleCompleted
                    ]}
                  >
                    {title}
                  </AppText>
                  {description ? (
                    <AppText style={[styles.taskDescription, { color: theme.textSecondary }]}>
                      {description}
                    </AppText>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    done 
                      ? { backgroundColor: 'rgba(74, 222, 128, 0.2)', borderColor: 'rgba(74, 222, 128, 0.3)' }
                      : { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.3)' }
                  ]}
                >
                  <AppText style={[styles.statusText, { color: done ? '#4ade80' : '#fbbf24' }]}>
                    {done ? 'CONCLUÍDA' : 'PENDENTE'}
                  </AppText>
                </View>
              </View>

              {renderSteps(steps)}

              {item.archive && renderAttachedFile(item.archive)}

              <View style={[styles.taskMeta, { borderTopColor: theme.textSecondary + '20' }]}>
                <AppText style={[styles.taskTime, { color: theme.textSecondary }]}>
                  {done ? '✅ Concluída' : `⏰ Prazo: ${formatDate(completionDate)}`}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    );
  }

  const stats = getStats();
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ImageBackground
        source={getTasksBg(theme)}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <FloatingShape style={styles.shape1} />
        <FloatingShape style={styles.shape2} />
        <FloatingShape style={styles.shape3} />

        <Animated.View 
          style={[
            styles.modernCard, 
            { backgroundColor: theme.card + 'E6' },
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.notch} />
            <AppText style={[styles.date, { color: theme.textSecondary }]}>
              {currentDate}
            </AppText>
            
            <AppText style={[styles.modernTitle, {color:theme.text }]}>Suas Tarefas</AppText>

            <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>
              {stats.pending} {stats.pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
            </AppText>
          </View>

          {tasks.length > 0 && (
            <View style={styles.statsContainer}>
              <StatCard number={stats.total} label="Total" delay={0} />
              <StatCard number={stats.completed} label="Concluídas" delay={100} />
              <StatCard number={stats.pending} label="Pendentes" delay={200} />
            </View>
          )}

          <View style={styles.sectionHeader}>
            <AppText style={[styles.sectionTitle, { color: theme.text }]}>
              {tasks.length > 0 ? 'Lista de Tarefas' : ''}
            </AppText>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.switchThumb2} />
              <AppText style={[styles.loadingText, { color: theme.textSecondary }]}>
                Carregando suas tarefas...
              </AppText>
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="check-circle" size={60} color={theme.textSecondary} />
              <AppText style={[styles.emptyText, { color: theme.textSecondary }]}>
                Nenhuma tarefa pendente no momento! 🎉
              </AppText>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item, idx) => (item._id || item.id || idx).toString()}
              renderItem={renderTask}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[theme.switchThumb2]}
                  tintColor={theme.switchThumb2}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksContainer}
            />
          )}

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={[theme.switchThumb2, theme.switchThumb2 + '80']}
              style={styles.backButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="arrow-left" size={20} color="#fff" style={{ marginRight: 8 }} />
              <AppText style={styles.backButtonText}>Voltar</AppText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>

      {/* Modal de Resposta da Tarefa */}
      <Modal
        visible={responseModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeResponseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={closeResponseModal}
          />
          <View style={styles.modalContainer}>
            <BlurView intensity={90} tint="dark" style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header do Modal */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalNotch} />
                  <AppText style={styles.modalTitle}>Responder Tarefa</AppText>
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={closeResponseModal}
                    disabled={uploading}
                  >
                    <Icon name="x" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Informações da Tarefa */}
                {selectedTask && (
                  <>
                    <View style={styles.taskInfoModal}>
                      <AppText style={styles.taskTitleModal}>
                        {selectedTask.title || 'Tarefa'}
                      </AppText>
                      {selectedTask.description && (
                        <AppText style={styles.taskDescriptionModal}>
                          {selectedTask.description}
                        </AppText>
                      )}
                      {selectedTask.completionDate && (
                        <AppText style={styles.taskDateModal}>
                          ⏰ Prazo: {formatDate(selectedTask.completionDate)}
                        </AppText>
                      )}
                    </View>

                    {/* Mostrar Steps no Modal */}
                    {selectedTask.steps && selectedTask.steps.list && selectedTask.steps.list.length > 0 && (
                      <View style={styles.modalStepsContainer}>
                        <AppText style={styles.modalStepsTitle}>Passos da Atividade:</AppText>
                        {selectedTask.steps.list.map((step, index) => (
                          <AppText key={index} style={styles.modalStepItem}>
                            {selectedTask.steps.style === 'ordered' 
                              ? `${index + 1}. ${step}` 
                              : `• ${step}`}
                          </AppText>
                        ))}
                      </View>
                    )}

                    {/* Mostrar Arquivo Anexado pelo Psicólogo no Modal */}
                    {selectedTask.archive && selectedTask.archive.url && (
                      <View style={styles.modalAttachedFileContainer}>
                        <AppText style={styles.modalAttachedFileTitle}>
                          📎 Material de Apoio do Psicólogo
                        </AppText>

                        {/* Imagem */}
                        {selectedTask.archive.archive_type === 'image' && (
                          <TouchableOpacity activeOpacity={0.9}>
                            <Image 
                              source={{ uri: selectedTask.archive.url }} 
                              style={styles.modalAttachedImage}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )}

                        {/* Vídeo */}
                        {selectedTask.archive.archive_type === 'video' && (
                          <View style={styles.modalAttachedVideoContainer}>
                            <Video
                              source={{ uri: selectedTask.archive.url }}
                              style={styles.modalAttachedVideo}
                              useNativeControls
                              resizeMode="contain"
                              shouldPlay={false}
                            />
                          </View>
                        )}

                        {/* PDF */}
                        {selectedTask.archive.archive_type === 'pdf' && (
                          <TouchableOpacity 
                            style={styles.modalAttachedPdfCard}
                            onPress={() => {
                              Alert.alert(
                                'Documento PDF',
                                'Deseja abrir o documento?',
                                [
                                  { text: 'Cancelar', style: 'cancel' },
                                  { 
                                    text: 'Abrir PDF', 
                                    onPress: () => {
                                      Linking.openURL(selectedTask.archive.url); // ✅ CORRIGIDO
                                    }
                                  }
                                ]
                              );
                            }}
                          >
                            <View style={styles.modalAttachedPdfIcon}>
                              <Icon name="file-text" size={48} color="#667eea" />
                            </View>
                            <View style={styles.modalAttachedPdfInfo}>
                              <AppText style={styles.modalAttachedPdfTitle}>📄 Documento PDF</AppText>
                              <AppText style={styles.modalAttachedPdfSubtitle}>
                                Toque para abrir o documento
                              </AppText>
                            </View>
                            <Icon name="external-link" size={24} color="#667eea" />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </>
                )}

                {/* Campo de Título */}
                <View style={styles.inputContainer}>
                  <AppText style={styles.inputLabel}>Título da Resposta *</AppText>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o título da sua resposta"
                    placeholderTextColor="#999"
                    value={responseTitle}
                    onChangeText={setResponseTitle}
                    editable={!uploading}
                  />
                </View>

                {/* Campo de Resumo */}
                <View style={styles.inputContainer}>
                  <AppText style={styles.inputLabel}>Resumo *</AppText>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Descreva como você completou a tarefa..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    value={responseSummary}
                    onChangeText={setResponseSummary}
                    textAlignVertical="top"
                    editable={!uploading}
                  />
                </View>

                {/* Botão de Anexar */}
                <TouchableOpacity
                  style={styles.attachButton}
                  onPress={showUploadOptions}
                  disabled={uploading}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.attachButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="paperclip" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <AppText style={styles.attachButtonText}>
                      {selectedFile ? 'Alterar Arquivo' : 'Anexar Arquivo (Opcional)'}
                    </AppText>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Preview do Arquivo */}
                {selectedFile && (
                  <View style={styles.filePreviewContainer}>
                    <View style={styles.fileInfo}>
                      <Icon 
                        name={selectedFile.type === 'image' ? 'image' : selectedFile.type === 'video' ? 'video' : 'file-text'} 
                        size={20} 
                        color="#4ade80" 
                      />
                      <View style={styles.fileDetails}>
                        <AppText style={styles.fileName} numberOfLines={1}>
                          {selectedFile.name}
                        </AppText>
                        <AppText style={styles.fileSize}>
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </AppText>
                      </View>
                      <TouchableOpacity
                        onPress={removeFile}
                        disabled={uploading}
                        style={styles.removeFileButton}
                      >
                        <Icon name="trash-2" size={18} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>

                    {selectedFile.type === 'image' && filePreview && (
                      <Image source={{ uri: filePreview }} style={styles.imagePreview} />
                    )}

                    {selectedFile.type === 'video' && filePreview && (
                      <Video
                        source={{ uri: filePreview }}
                        style={styles.videoPreview}
                        useNativeControls
                        resizeMode="contain"
                      />
                    )}

                    {selectedFile.type === 'pdf' && (
                      <View style={styles.pdfPreview}>
                        <Icon name="file-text" size={48} color="#4ade80" />
                        <AppText style={styles.pdfText}>PDF Anexado</AppText>
                      </View>
                    )}
                  </View>
                )}

                {/* Botão de Envio */}
                <TouchableOpacity
                  style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
                  onPress={submitTaskResponse}
                  disabled={uploading}
                >
                  <LinearGradient
                    colors={uploading ? ['#a0a0a0', '#808080'] : ['#34C759', '#28a745']}
                    style={styles.submitButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {uploading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Icon name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <AppText style={styles.submitButtonText}>Enviar Resposta</AppText>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </BlurView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernCard: {
    width: width > 500 ? 420 : width * 0.9,
    maxHeight: height * 0.85,
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: 'rgba(0, 0, 0, 0)',
    elevation: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  notch: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 15,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  modernTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 12,
  },
  statCard: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#4ade80',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  tasksContainer: {
    paddingBottom: 20,
  },
  taskContainer: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  taskBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  taskContent: {
    padding: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  checkboxCompleted: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  taskInfo: {
    flex: 1,
    marginRight: 15,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
    lineHeight: 22,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: 'Poppins',
    lineHeight: 20,
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  stepsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  stepItem: {
    fontSize: 13,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    lineHeight: 20,
  },
  archiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 8,
  },
  archiveText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    color: '#4ade80',
    marginLeft: 6,
  },
  psychologistFileContainer: {
    marginBottom: 15,
  },
  psychologistFileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  psychologistFileTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#667eea',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  psychologistImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  psychologistVideoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  psychologistVideo: {
    width: '100%',
    height: 220,
  },
  videoProcessingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  videoProcessingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#667eea',
    marginTop: 15,
  },
  videoProcessingSubtext: {
    fontSize: 13,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 5,
  },
  psychologistPdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    padding: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  psychologistPdfIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  psychologistPdfInfo: {
    flex: 1,
  },
  psychologistPdfTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  psychologistPdfSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  taskMeta: {
    paddingTop: 15,
    borderTopWidth: 1,
  },
  taskTime: {
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 26,
  },
  backButton: {
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  floatingShape: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  shape1: {
    top: 50,
    left: 30,
  },
  shape2: {
    top: 200,
    right: 40,
    width: 80,
    height: 80,
  },
  shape3: {
    bottom: 100,
    left: 50,
    width: 60,
    height: 60,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    height: height * 0.9,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    padding: 25,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  modalNotch: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    right: 0,
    top: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskInfoModal: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  taskTitleModal: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  taskDescriptionModal: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    marginBottom: 8,
  },
  taskDateModal: {
    fontSize: 13,
    fontFamily: 'Poppins',
    color: '#4ade80',
  },
  modalStepsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalStepsTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 12,
  },
  modalStepItem: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
    lineHeight: 22,
  },
  modalAttachedFileContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  modalAttachedFileTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#667eea',
    marginBottom: 14,
  },
  modalAttachedImage: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalAttachedVideoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalAttachedVideo: {
    width: '100%',
    height: 240,
  },
  modalAttachedPdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  modalAttachedPdfIcon: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalAttachedPdfInfo: {
    flex: 1,
  },
  modalAttachedPdfTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 6,
  },
  modalAttachedPdfSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  attachButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  attachButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  attachButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  filePreviewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  fileDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  removeFileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  pdfPreview: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 15,
  },
  pdfText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#4ade80',
    marginTop: 10,
  },
  submitButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
});