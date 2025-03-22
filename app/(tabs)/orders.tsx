import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  cafeName: string;
  cafeImage: string;
  items: OrderItem[];
  total: number;
  status: 'preparing' | 'ready' | 'completed' | 'cancelled';
  date: string;
  pickupTime: string;
}

// Mock data as fallback
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    cafeName: 'The Coffee House',
    cafeImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500',
    items: [
      {
        id: '1',
        name: 'Espresso',
        quantity: 2,
        price: 3.50,
      },
      {
        id: '3',
        name: 'Croissant',
        quantity: 1,
        price: 4.50,
      },
    ],
    total: 11.50,
    status: 'preparing',
    date: '2024-03-20',
    pickupTime: '15:30',
  },
  {
    id: '2',
    cafeName: 'Bakery Delight',
    cafeImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
    items: [
      {
        id: '5',
        name: 'Sourdough Bread',
        quantity: 1,
        price: 6.50,
      },
    ],
    total: 6.50,
    status: 'completed',
    date: '2024-03-19',
    pickupTime: '14:15',
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [selectedTab, setSelectedTab] = useState<'current' | 'past'>('current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load orders from AsyncStorage when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        setLoading(true);
        try {
          const storedOrders = await AsyncStorage.getItem('orders');
          if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
          } else {
            // Use mock data if no stored orders found
            setOrders(MOCK_ORDERS);
          }
        } catch (error) {
          console.error('Error loading orders:', error);
          // Fallback to mock data if there's an error
          setOrders(MOCK_ORDERS);
        } finally {
          setLoading(false);
        }
      };

      loadOrders();
    }, [])
  );

  const currentOrders = orders.filter(order => order.status !== 'completed');
  const pastOrders = orders.filter(order => order.status === 'completed');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return '#FFA500';
      case 'ready':
        return '#4CAF50';
      case 'completed':
        return '#666';
      case 'cancelled':
        return '#FF0000';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
    }
  };

  const renderOrder = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      style={[styles.orderCard, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff' }]}
      onPress={() => router.push(`/order/${order.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <Image
          source={{ uri: order.cafeImage }}
          style={styles.cafeImage}
        />
        <View style={styles.orderInfo}>
          <Text style={[styles.cafeName, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            {order.cafeName}
          </Text>
          <Text style={styles.orderDate}>
            {new Date(order.date).toLocaleDateString()} at {order.pickupTime}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={[styles.itemName, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              {item.name} x{item.quantity}
            </Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
      </View>

      <View style={styles.viewDetailsContainer}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <FontAwesome name="chevron-right" size={14} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Orders
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'current' && styles.tabSelected,
          ]}
          onPress={() => setSelectedTab('current')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'current' && styles.tabTextSelected,
          ]}>
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'past' && styles.tabSelected,
          ]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'past' && styles.tabTextSelected,
          ]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'current' ? (
          currentOrders.length > 0 ? (
            currentOrders.map(renderOrder)
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="coffee" size={48} color="#666" />
              <Text style={[styles.emptyStateText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                No current orders
              </Text>
            </View>
          )
        ) : (
          pastOrders.length > 0 ? (
            pastOrders.map(renderOrder)
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="history" size={48} color="#666" />
              <Text style={[styles.emptyStateText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                No past orders
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabSelected: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  orderCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cafeImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  viewDetailsText: {
    color: '#007AFF',
    fontSize: 14,
    marginRight: 4,
  },
}); 