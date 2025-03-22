import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  customizations?: {
    name: string;
    option: string;
  }[];
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timeElapsed: string;
  note?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    customerName: 'John Smith',
    items: [
      {
        id: '1',
        name: 'Cappuccino',
        quantity: 2,
        customizations: [
          { name: 'Size', option: 'Large' },
          { name: 'Milk', option: 'Oat Milk' }
        ],
        price: 5.00
      },
      {
        id: '2',
        name: 'Croissant',
        quantity: 1,
        price: 3.50
      }
    ],
    total: 13.50,
    status: 'new',
    timeElapsed: '2m',
    note: 'Extra hot please'
  },
  {
    id: '2',
    customerName: 'Emma Wilson',
    items: [
      {
        id: '3',
        name: 'Iced Latte',
        quantity: 1,
        customizations: [
          { name: 'Size', option: 'Regular' },
          { name: 'Milk', option: 'Almond Milk' }
        ],
        price: 4.50
      }
    ],
    total: 4.50,
    status: 'preparing',
    timeElapsed: '8m'
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    items: [
      {
        id: '4',
        name: 'Espresso',
        quantity: 2,
        price: 3.00
      },
      {
        id: '5',
        name: 'Blueberry Muffin',
        quantity: 1,
        price: 3.50
      }
    ],
    total: 9.50,
    status: 'ready',
    timeElapsed: '15m'
  }
];

const FILTER_STATUSES = [
  { id: 'all', label: 'All', icon: 'th-large' },
  { id: 'new', label: 'New', icon: 'clock-o' },
  { id: 'preparing', label: 'Preparing', icon: 'coffee' },
  { id: 'ready', label: 'Ready', icon: 'check-circle' },
  { id: 'completed', label: 'Completed', icon: 'check' },
  { id: 'cancelled', label: 'Cancelled', icon: 'times' },
];

export default function OrdersManagement() {
  const colorScheme = useColorScheme();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = isDark ? '#000' : '#fff';
  const cardBgColor = isDark ? '#1c1c1e' : '#f2f2f7';

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const orderExists = orders.some(order => order.id === orderId);
    if (!orderExists) {
      Alert.alert('Error', 'Order not found');
      return;
    }

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
    Alert.alert('Success', `Order #${orderId} status updated to ${newStatus}`);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new': return '#007AFF';
      case 'preparing': return '#FF9500';
      case 'ready': return '#4CD964';
      case 'completed': return '#8E8E93';
      case 'cancelled': return '#FF3B30';
      default: return '#666';
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'new': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const renderFilterStatus = ({ item }: { item: typeof FILTER_STATUSES[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterTag,
        { 
          backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
          borderWidth: 1,
          borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
        },
        selectedStatus === item.id && {
          backgroundColor: isDark ? '#1c1c1e' : '#fff',
          borderColor: '#007AFF'
        }
      ]}
      onPress={() => setSelectedStatus(item.id)}
    >
      <FontAwesome 
        name={item.icon as any} 
        size={16} 
        color={selectedStatus === item.id 
          ? '#007AFF'
          : isDark ? '#fff' : '#000'
        } 
        style={styles.filterIcon}
      />
      <Text style={[
        styles.filterTagText,
        { 
          color: selectedStatus === item.id 
            ? '#007AFF'
            : isDark ? '#fff' : '#000'
        }
      ]}>
        {item.label} ({selectedStatus === item.id 
          ? filteredOrders.length 
          : orders.filter(order => order.status === item.id).length})
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Orders Management",
          headerStyle: {
            backgroundColor: bgColor,
          },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: "",
        }}
      />
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search orders..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterListContainer}>
          <FlatList
            data={FILTER_STATUSES}
            renderItem={renderFilterStatus}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterList}
            contentContainerStyle={styles.filterListContent}
          />
        </View>

        <ScrollView style={styles.ordersList}>
          {filteredOrders.map(order => (
            <View 
              key={order.id}
              style={[styles.orderCard, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={[styles.orderNumber, { color: textColor }]}>
                    Order #{order.id}
                  </Text>
                  <Text style={styles.customerName}>{order.customerName}</Text>
                </View>
                <View style={styles.orderTime}>
                  <FontAwesome name="clock-o" size={14} color="#666" />
                  <Text style={styles.timeText}>{order.timeElapsed} ago</Text>
                </View>
              </View>

              <View style={styles.itemsList}>
                {order.items.map(item => (
                  <View key={item.id} style={styles.orderItem}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemName, { color: textColor }]}>
                        {item.quantity}x {item.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                    {item.customizations?.map((custom, index) => (
                      <Text key={index} style={styles.customization}>
                        • {custom.name}: {custom.option}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>

              {order.note && (
                <View style={styles.noteContainer}>
                  <FontAwesome name="sticky-note" size={14} color="#666" />
                  <Text style={styles.noteText}>{order.note}</Text>
                </View>
              )}

              <View style={styles.orderFooter}>
                <View style={styles.totalContainer}>
                  <Text style={[styles.totalLabel, { color: textColor }]}>Total:</Text>
                  <Text style={[styles.totalAmount, { color: textColor }]}>
                    ${order.total.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: getStatusColor(order.status) }
                      ]}
                      onPress={() => {
                        const nextStatus = getNextStatus(order.status);
                        if (nextStatus) {
                          updateOrderStatus(order.id, nextStatus);
                        }
                      }}
                    >
                      <Text style={styles.actionButtonText}>
                        {order.status === 'new' ? 'Start Preparing' :
                         order.status === 'preparing' ? 'Mark Ready' :
                         order.status === 'ready' ? 'Complete Order' : ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <TouchableOpacity
                      style={[styles.cancelButton]}
                      onPress={() => updateOrderStatus(order.id, 'cancelled')}
                    >
                      <FontAwesome name="times" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  filterListContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  filterList: {
    paddingVertical: 12,
  },
  filterListContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  filterIcon: {
    marginRight: 8,
    width: 16,
    textAlign: 'center',
  },
  filterTagText: {
    fontSize: 15,
    fontWeight: '600',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  orderTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  itemsList: {
    marginBottom: 12,
  },
  orderItem: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  customization: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
    marginTop: 2,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 