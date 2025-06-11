
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notification Permission Denied',
        'Push notifications are disabled. You can enable them in your device settings.',
        [{ text: 'OK' }]
      );
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '1159e5f5-debb-4a88-8a39-26d13f109a3c',
    });
    const token = tokenData.data;
    console.log('Expo push token:', token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error retrieving push token:', error);
    return null;
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function MainAppContent() {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [expoToken, setExpoToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [refreshDeliveryData, setRefreshDeliveryData] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Pulse animation for connection status
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    );
    pulseAnimation.start();

    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        setExpoPushToken(token);
        try {
          const response = await axios.post('https://notifications-jade-two.vercel.app/register-token', {
            token: token
          });
          console.log('Push Token received in app:', token);
          console.log('response.data:', response.data);
          setIsConnected(true);
          await AsyncStorage.setItem('notification-token', token);
        } catch (error) {
          console.error('Error storing push token in AsyncStorage:', error);
          setIsConnected(false);
        }
      }
      setIsLoading(false);
    });

    // Foreground notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log('Notification received while app is foreground:', notification);
      const title = notification.request.content.title;
      const body = notification.request.content.body;
      const dataFromBackend = notification.request.content.data;
      
      // Add notification to local state
      setNotifications(prev => [
        {
          id: Date.now(),
          title,
          body,
          time: new Date().toLocaleTimeString(),
          data: dataFromBackend
        },
        ...prev.slice(0, 9) // Keep only last 10 notifications
      ]);

     
    });

    // Background/closed app notification response listener
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (notification) => {
      console.log('Notification received while app is background:', notification);
      const title = notification.request.content.title;
      const body = notification.request.content.body;
      const dataFromBackend = notification.request.content.data;
      console.log("Data from backend:", dataFromBackend);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const getToken = async () => {
    console.log("Getting token...");
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '1159e5f5-debb-4a88-8a39-26d13f109a3c',
      });
      const tokenOutput = tokenData.data;
      if (tokenOutput) {
        setExpoToken(tokenOutput);
        console.log("Token:", tokenOutput);
      } else {
        console.log("No Token found");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  }

  useEffect(() => {
    getToken();
    sendTokenToBackend();
  }, []);

  const sendTokenToBackend = async () => {
    console.log("token: ", expoToken);

    if (!expoToken) {
      console.log("No token found");
      return;
    }

    try {
      const response = await axios.post('https://notifications-jade-two.vercel.app/register-token', {
        token: expoToken
      });
      console.log('Token sent to backend:', response.data);
    } catch (error) {
      console.error('Error sending token:', error.message);
    }
  };

  const testNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification 🎉",
          body: "This is a test notification from your app!",
          data: { test: true },
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error('Error scheduling test notification:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Setting up notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Push Notifications</Text>
            <Text style={styles.headerSubtitle}>Real-time updates for your app</Text>
          </View>
          <Animated.View 
            style={[
              styles.connectionStatus,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]} />
            <Text style={styles.statusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </Animated.View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Connection Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>🔗 Connection Status</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Backend Status:</Text>
                <View style={[styles.badge, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]}>
                  <Text style={styles.badgeText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Device Type:</Text>
                <Text style={styles.infoValue}>{Device.isDevice ? 'Physical Device' : 'Simulator'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Platform:</Text>
                <Text style={styles.infoValue}>{Platform.OS}</Text>
              </View>
            </View>
          </View>

          {/* Token Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>🎫 Expo Push Token</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.tokenText} numberOfLines={3}>
                {expoToken || expoPushToken || 'No token available'}
              </Text>
            </View>
          </View>

          {/* Test Button */}
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testNotification}
            activeOpacity={0.8}
          >
            <Text style={styles.testButtonText}>🧪 Send Test Notification</Text>
          </TouchableOpacity>

          {/* Recent Notifications */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>📱 Recent Notifications</Text>
              <Text style={styles.notificationCount}>{notifications.length}</Text>
            </View>
            <View style={styles.cardContent}>
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>🔔</Text>
                  <Text style={styles.emptyStateTitle}>No notifications yet</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Notifications will appear here when received
                  </Text>
                </View>
              ) : (
                notifications.map((notif, index) => (
                  <View key={notif.id} style={[styles.notificationItem, index === 0 && styles.latestNotification]}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{notif.title}</Text>
                      <Text style={styles.notificationTime}>{notif.time}</Text>
                    </View>
                    <Text style={styles.notificationBody}>{notif.body}</Text>
                    {index === 0 && <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>}
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Stats Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>📊 Statistics</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{notifications.length}</Text>
                  <Text style={styles.statLabel}>Total Received</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{notifications.filter(n => n.time.includes(new Date().toLocaleDateString())).length}</Text>
                  <Text style={styles.statLabel}>Today</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{isConnected ? '100%' : '0%'}</Text>
                  <Text style={styles.statLabel}>Uptime</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainAppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F23',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '500',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    opacity: 0.9,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#1F1F37',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 20,
    paddingTop: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tokenText: {
    fontSize: 12,
    color: '#9CA3AF',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 16,
  },
  testButton: {
    backgroundColor: '#6366F1',
    marginHorizontal: 0,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notificationCount: {
    backgroundColor: '#6366F1',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.5)',
  },
  latestNotification: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  notificationBody: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});