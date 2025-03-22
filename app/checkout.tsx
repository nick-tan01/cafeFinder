import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [pickupTime, setPickupTime] = useState('15'); // Default 15 minutes
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Parse the cart items from params
  const cartItemsStr = params.cartItems as string;
  const cafeName = params.cafeName as string;
  const cafeImage = params.cafeImage as string;
  
  const cartItems: OrderItem[] = cartItemsStr ? JSON.parse(decodeURIComponent(cartItemsStr)) : [];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderItemInfo}>
        <Text style={[styles.orderItemName, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          {item.name}
        </Text>
        <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
      </View>
      <Text style={styles.orderItemPrice}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  const processOrder = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Generate a unique order ID
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Current date and estimated pickup time
      const now = new Date();
      const pickupTimeDate = new Date(now.getTime() + parseInt(pickupTime) * 60000);
      const pickupTimeStr = pickupTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Create order object
      const order = {
        id: orderId,
        cafeName,
        cafeImage,
        items: cartItems,
        total,
        status: 'preparing',
        date: now.toISOString().split('T')[0],
        pickupTime: pickupTimeStr,
        notes
      };
      
      // Get existing orders or initialize empty array
      const existingOrdersStr = await AsyncStorage.getItem('orders');
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      
      // Add new order to array
      const updatedOrders = [order, ...existingOrders];
      
      // Save updated orders
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Navigate to order confirmation screen with the order ID
      router.push({
        pathname: `/order-confirmation`,
        params: { 
          orderId,
          pickupTime: pickupTimeStr
        }
      });
    } catch (error) {
      console.error('Error saving order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#007AFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Checkout
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Order Summary
          </Text>
          {cartItems.map((item) => renderOrderItem({ item }))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%)</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Pickup Details
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pickup Time (minutes)</Text>
            <TextInput
              style={styles.input}
              value={pickupTime}
              onChangeText={setPickupTime}
              keyboardType="numeric"
              placeholder="15"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Special Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any special instructions..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            isProcessing && styles.payButtonDisabled
          ]}
          onPress={processOrder}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
  },
  totalRow: {
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#999',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 