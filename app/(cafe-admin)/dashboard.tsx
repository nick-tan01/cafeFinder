import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type FontAwesomeIconName = 'shopping-cart' | 'coffee' | 'star' | 'money';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: FontAwesomeIconName;
  color: string;
  onPress: () => void;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'review' | 'menu';
  title: string;
  description: string;
  time: string;
  status?: string;
}

export default function AdminDashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Today\'s Orders',
      value: '12',
      icon: 'shopping-cart',
      color: '#007AFF',
      onPress: () => router.push('/orders'),
    },
    {
      title: 'Menu Items',
      value: '24',
      icon: 'coffee',
      color: '#34C759',
      onPress: () => router.push('/menu'),
    },
    {
      title: 'New Reviews',
      value: '5',
      icon: 'star',
      color: '#FF9500',
      onPress: () => router.push('/reviews'),
    },
    {
      title: 'Today\'s Revenue',
      value: '$1,234',
      icon: 'money',
      color: '#5856D6',
      onPress: () => router.push('/analytics'),
    },
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'order',
      title: 'New Order #123',
      description: '2 Espressos, 1 Latte',
      time: '5 min ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'review',
      title: 'New Review',
      description: 'Great coffee and service!',
      time: '15 min ago',
    },
    {
      id: '3',
      type: 'menu',
      title: 'Menu Update',
      description: 'Added new seasonal drinks',
      time: '1 hour ago',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'completed':
        return '#34C759';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return { name: 'shopping-cart', color: '#007AFF' };
      case 'review':
        return { name: 'star', color: '#FF9500' };
      case 'menu':
        return { name: 'coffee', color: '#34C759' };
      default:
        return { name: 'circle', color: '#8E8E93' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f8f8' }]}>
      <Stack.Screen
        options={{
          headerTitle: "Dashboard",
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#f8f8f8',
          },
          headerTintColor: isDark ? '#fff' : '#000',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <FontAwesome 
                name="cog" 
                size={24} 
                color={isDark ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          {dashboardCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.statCard,
                { 
                  backgroundColor: isDark ? '#1c1c1e' : '#fff',
                  shadowColor: isDark ? '#000' : '#000',
                }
              ]}
              onPress={card.onPress}
            >
              <LinearGradient
                colors={[card.color, card.color + '80']}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome name={card.icon} size={24} color="#fff" />
              </LinearGradient>
              <Text style={[styles.statValue, { color: isDark ? '#fff' : '#000' }]}>
                {card.value}
              </Text>
              <Text style={[styles.statTitle, { color: isDark ? '#999' : '#666' }]}>
                {card.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Recent Activity
          </Text>
          {recentActivity.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityCard,
                { 
                  backgroundColor: isDark ? '#1c1c1e' : '#fff',
                  shadowColor: isDark ? '#000' : '#000',
                }
              ]}
              onPress={() => {
                switch (activity.type) {
                  case 'order':
                    router.push('/orders');
                    break;
                  case 'review':
                    router.push('/reviews');
                    break;
                  case 'menu':
                    router.push('/menu');
                    break;
                }
              }}
            >
              <View style={[
                styles.activityIcon,
                { backgroundColor: getActivityIcon(activity.type).color + '20' }
              ]}>
                <FontAwesome
                  name={getActivityIcon(activity.type).name as any}
                  size={20}
                  color={getActivityIcon(activity.type).color}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: isDark ? '#fff' : '#000' }]}>
                  {activity.title}
                </Text>
                <Text style={[styles.activityDesc, { color: isDark ? '#999' : '#666' }]}>
                  {activity.description}
                </Text>
              </View>
              <View style={styles.activityMeta}>
                <Text style={[styles.activityTime, { color: isDark ? '#999' : '#666' }]}>
                  {activity.time}
                </Text>
                {activity.status && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(activity.status) + '20' }
                    ]}
                  >
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(activity.status) }
                    ]}>
                      {activity.status}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  settingsButton: {
    padding: 8,
    marginRight: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: cardWidth,
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 14,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  activityTime: {
    fontSize: 13,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 