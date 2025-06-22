import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';

const menuItems = [
  { label: 'perfil', icon: require('../assets/profile.png'), key: 'Profile' },
  { label: 'tarefas', icon: require('../assets/pencil.png'), key: 'Tasks' },
  { label: 'atividade', icon: require('../assets/bell.png'), key: 'Activity' },
  { label: 'config.', icon: require('../assets/gear.png'), key: 'Config' },
  { label: 'guia', icon: require('../assets/book.png'), key: 'Guide' },
  { label: 'ajuda', icon: require('../assets/warning.png'), key: 'Help' },
  { label: 'termos', icon: require('../assets/book2.png'), key: 'Terms' },
  { label: 'logout', icon: require('../assets/logout.png'), key: 'Logout' },
];

export default function SideMenu({ visible, onClose, onNavigate, navigation }) {
  // navigation prop opcional para reset no logout
  const handleNavigate = (key) => {
    onClose();
    switch (key) {
      case 'Profile':
        onNavigate ? onNavigate('Profile') : navigation.navigate('Profile');
        break;
      case 'Tasks':
        onNavigate ? onNavigate('Tasks') : navigation.navigate('Tasks');
        break;
      case 'Activity':
        onNavigate ? onNavigate('Activity') : navigation.navigate('Activity');
        break;
      case 'Config':
        onNavigate ? onNavigate('Config') : navigation.navigate('Config');
        break;
      case 'Guide':
        onNavigate ? onNavigate('Guide') : navigation.navigate('Guide');
        break;
      case 'Help':
        onNavigate ? onNavigate('Help') : navigation.navigate('Help');
        break;
      case 'Terms':
        onNavigate ? onNavigate('Terms') : navigation.navigate('Terms');
        break;
      case 'Logout':
        if (navigation) {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        } else if (onNavigate) {
          onNavigate('Logout');
        }
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.menuContainer}>
        <View style={styles.profileCircle}>
          <Image source={require('../assets/profile.png')} style={styles.profileIcon} />
        </View>
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.key)}
            >
              <Image source={item.icon} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bottomLogoBox}>
          <Image source={require('../assets/nwa logo b.png')} style={styles.bottomLogo} />
        </View>
      </View>
    </Modal>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 46, 69, 0.7)',
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: height,
    backgroundColor: '#fffefb',
    borderTopRightRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 24,
    paddingHorizontal: 10,
    zIndex: 2,
    justifyContent: 'flex-start',
  },
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#2d304d',
    alignSelf: 'center',
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    tintColor: '#2d304d',
  },
  menuList: {
    flex: 1,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  menuIcon: {
    width: 28,
    height: 28,
    marginRight: 16,
    resizeMode: 'contain',
    tintColor: '#2d304d',
  },
  menuLabel: {
    fontSize: 22,
    color: '#2d304d',
    fontWeight: '400',
  },
  bottomLogoBox: {
    backgroundColor: 'rgba(180, 210, 220, 0.5)',
    borderRadius: 28,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  bottomLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    opacity: 0.8,
  },
}); 