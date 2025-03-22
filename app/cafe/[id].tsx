import React, { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  customization?: {
    name: string;
    options: { name: string; price: number }[];
  }[];
}

interface Cafe {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number;
  image: string;
  isOpen: boolean;
  menu: MenuItem[];
  reviews: Review[];
  openingHours: {
    [key: string]: { open: string; close: string };
  };
  specialOffers: {
    id: string;
    title: string;
    description: string;
    validUntil: string;
  }[];
}

// Mock data for a single cafe
const MOCK_CAFE: Cafe = {
  id: '1',
  name: 'The Coffee House',
  address: '123 Coffee Street',
  rating: 4.5,
  distance: 0.5,
  image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500',
  isOpen: true,
  openingHours: {
    Monday: { open: '07:00', close: '18:00' },
    Tuesday: { open: '07:00', close: '18:00' },
    Wednesday: { open: '07:00', close: '18:00' },
    Thursday: { open: '07:00', close: '18:00' },
    Friday: { open: '07:00', close: '19:00' },
    Saturday: { open: '08:00', close: '19:00' },
    Sunday: { open: '08:00', close: '17:00' },
  },
  specialOffers: [
    {
      id: '1',
      title: 'Happy Hour',
      description: '20% off all pastries from 2-4 PM',
      validUntil: '2024-04-01',
    },
  ],
  menu: [
    {
      id: '1',
      name: 'Espresso',
      description: 'Rich and bold single shot espresso',
      price: 3.50,
      category: 'Coffee',
      image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500',
      customization: [
        {
          name: 'Size',
          options: [
            { name: 'Single Shot', price: 0 },
            { name: 'Double Shot', price: 1.00 },
          ],
        },
        {
          name: 'Milk',
          options: [
            { name: 'Regular', price: 0 },
            { name: 'Oat', price: 0.50 },
            { name: 'Almond', price: 0.50 },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Latte',
      description: 'Espresso with steamed milk and light foam',
      price: 4.50,
      category: 'Coffee',
      image: 'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?w=500',
      customization: [
        {
          name: 'Size',
          options: [
            { name: 'Small', price: 0 },
            { name: 'Medium', price: 0.50 },
            { name: 'Large', price: 1.00 },
          ],
        },
        {
          name: 'Milk',
          options: [
            { name: 'Regular', price: 0 },
            { name: 'Oat', price: 0.50 },
            { name: 'Almond', price: 0.50 },
          ],
        },
      ],
    },
    {
      id: '3',
      name: 'Croissant',
      description: 'Buttery, flaky French-style croissant',
      price: 4.50,
      category: 'Pastries',
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500',
    },
    {
      id: '4',
      name: 'Scone',
      description: 'Fresh-baked scone with your choice of flavor',
      price: 3.50,
      category: 'Pastries',
      image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500',
      customization: [
        {
          name: 'Flavor',
          options: [
            { name: 'Plain', price: 0 },
            { name: 'Blueberry', price: 0.50 },
            { name: 'Chocolate Chip', price: 0.50 },
          ],
        },
      ],
    },
  ],
  reviews: [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Best coffee in town! The pastries are amazing too.',
      date: '2024-03-15',
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Great atmosphere and friendly staff. Coffee is consistently good.',
      date: '2024-03-10',
    },
  ],
};

export default function CafeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<{
    id: string;
    quantity: number;
    customizations?: { name: string; option: string; price: number }[];
  }[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customizations, setCustomizations] = useState<{
    [key: string]: { name: string; option: string; price: number };
  }>({});

  const categories = Array.from(new Set(MOCK_CAFE.menu.map(item => item.category)));

  const filteredMenu = selectedCategory
    ? MOCK_CAFE.menu.filter(item => item.category === selectedCategory)
    : MOCK_CAFE.menu;

  const addToCart = (item: MenuItem) => {
    if (item.customization) {
      setSelectedItem(item);
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { id: item.id, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== itemId);
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const menuItem = MOCK_CAFE.menu.find(menuItem => menuItem.id === item.id);
      const basePrice = menuItem?.price || 0;
      const customizationTotal = item.customizations?.reduce(
        (sum, custom) => sum + custom.price,
        0
      ) || 0;
      return total + (basePrice + customizationTotal) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checking out.');
      return;
    }

    // Prepare the cart items to send to the checkout page
    const checkoutItems = cartItems.map(item => {
      const menuItem = MOCK_CAFE.menu.find(menuItem => menuItem.id === item.id);
      return {
        id: item.id,
        name: menuItem?.name || 'Unknown Item',
        price: menuItem?.price || 0,
        quantity: item.quantity
      };
    });

    // Convert cart items to a JSON string and encode for URL
    const cartItemsStr = encodeURIComponent(JSON.stringify(checkoutItems));
    
    router.push({
      pathname: '/checkout',
      params: {
        cartItems: cartItemsStr,
        cafeName: MOCK_CAFE.name,
        cafeImage: MOCK_CAFE.image
      }
    });
  };

  const handleCustomization = (item: MenuItem, customization: { name: string; option: string; price: number }) => {
    setCustomizations(prev => ({
      ...prev,
      [customization.name]: customization,
    }));
  };

  const handleAddCustomizedItem = () => {
    if (!selectedItem) return;

    const customizationsList = Object.values(customizations);
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === selectedItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === selectedItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: selectedItem.id, quantity: 1, customizations: customizationsList }];
    });
    setSelectedItem(null);
    setCustomizations({});
  };

  const renderCustomizationModal = () => {
    if (!selectedItem) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedItem.name}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setSelectedItem(null);
                setCustomizations({});
              }}
            >
              <FontAwesome name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            {selectedItem.image && (
              <Image 
                source={{ uri: selectedItem.image }} 
                style={styles.modalImage} 
                resizeMode="cover"
              />
            )}
            
            <Text style={styles.modalDescription}>{selectedItem.description}</Text>
            
            {selectedItem.customization?.map(custom => (
              <View key={custom.name} style={styles.customizationSection}>
                <Text style={styles.customizationTitle}>{custom.name}</Text>
                {custom.options.map(option => (
                  <TouchableOpacity
                    key={option.name}
                    style={[
                      styles.customizationOption,
                      customizations[custom.name]?.option === option.name && styles.customizationOptionSelected,
                    ]}
                    onPress={() => handleCustomization(selectedItem, {
                      name: custom.name,
                      option: option.name,
                      price: option.price,
                    })}
                  >
                    <Text style={styles.customizationOptionText}>
                      {option.name}
                    </Text>
                    <Text style={styles.customizationOptionPrice}>
                      {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Included'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalActionButton, styles.cancelButton]}
              onPress={() => {
                setSelectedItem(null);
                setCustomizations({});
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalActionButton, styles.addButton]}
              onPress={handleAddCustomizedItem}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Create dynamic styles based on color scheme
  const dynamicStyles = StyleSheet.create({
    reviewsSection: {
      padding: 16,
      backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    reviewsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    overallRating: {
      alignItems: 'center',
      marginBottom: 24,
      padding: 16,
      backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f8f8f8',
      borderRadius: 12,
    },
    ratingNumber: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 8,
    },
    review: {
      marginBottom: 24,
      padding: 16,
      backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f8f8f8',
      borderRadius: 12,
    },
    reviewerName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 4,
    },
    reviewComment: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#fff' : '#000',
      lineHeight: 20,
      marginBottom: 12,
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: MOCK_CAFE.name,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 8,
                borderRadius: 20,
              }}
              onPress={() => router.back()}
            >
              <FontAwesome 
                name="chevron-left" 
                size={20} 
                color={colorScheme === 'dark' ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: MOCK_CAFE.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.content}>
            <Text style={[styles.cafeName, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              {MOCK_CAFE.name}
            </Text>
            <Text style={styles.cafeAddress}>{MOCK_CAFE.address}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingStarsContainer}>
                <Text style={[styles.rating, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  {MOCK_CAFE.rating}
                </Text>
                <FontAwesome name="star" size={16} color="#FFD700" style={styles.ratingStar} />
              </View>
              <TouchableOpacity 
                style={styles.reviewsButton}
                onPress={() => router.push(`/cafe/${MOCK_CAFE.id}/reviews`)}
              >
                <Text style={styles.reviewsText}>See {MOCK_CAFE.reviews.length} reviews</Text>
              </TouchableOpacity>
              <Text style={styles.distance}>{MOCK_CAFE.distance} km away</Text>
            </View>
          </View>

          {MOCK_CAFE.specialOffers.length > 0 && (
            <View style={styles.specialOffers}>
              <Text style={styles.specialOffersTitle}>Special Offers</Text>
              {MOCK_CAFE.specialOffers.map(offer => (
                <View key={offer.id} style={styles.specialOffer}>
                  <FontAwesome name="gift" size={20} color="#FFD700" />
                  <View style={styles.specialOfferInfo}>
                    <Text style={styles.specialOfferTitle}>{offer.title}</Text>
                    <Text style={styles.specialOfferDescription}>{offer.description}</Text>
                    <Text style={styles.specialOfferValid}>
                      Valid until {new Date(offer.validUntil).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category ? null : category
                  )}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextSelected,
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.menuContainer}>
            {filteredMenu.map(item => (
              <View key={item.id} style={styles.menuItem}>
                {item.image && (
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.menuItemImage} 
                    resizeMode="cover"
                  />
                )}
                <View style={styles.menuItemInfo}>
                  <Text style={[styles.menuItemName, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                    {item.name}
                  </Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                  {item.customization && (
                    <Text style={styles.customizationNote}>Customizable</Text>
                  )}
                </View>
                <View style={styles.menuItemActions}>
                  {cartItems.find(cartItem => cartItem.id === item.id) ? (
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <FontAwesome name="minus" size={16} color="#007AFF" />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>
                        {cartItems.find(cartItem => cartItem.id === item.id)?.quantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => addToCart(item)}
                      >
                        <FontAwesome name="plus" size={16} color="#007AFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCart(item)}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {showReviews && (
            <View style={dynamicStyles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={dynamicStyles.reviewsTitle}>Reviews</Text>
                <TouchableOpacity
                  style={styles.writeReviewButton}
                  onPress={() => Alert.alert('Coming Soon', 'Write a review feature will be available soon!')}
                >
                  <FontAwesome name="pencil" size={16} color="#007AFF" />
                  <Text style={styles.writeReviewText}>Write a Review</Text>
                </TouchableOpacity>
              </View>
              <View style={dynamicStyles.overallRating}>
                <Text style={dynamicStyles.ratingNumber}>{MOCK_CAFE.rating}</Text>
                <View style={styles.ratingStars}>
                  {[...Array(5)].map((_, index) => (
                    <FontAwesome
                      key={index}
                      name={index < Math.floor(MOCK_CAFE.rating) ? 'star' : index < MOCK_CAFE.rating ? 'star-half-o' : 'star-o'}
                      size={24}
                      color="#FFD700"
                      style={styles.ratingStar}
                    />
                  ))}
                </View>
                <Text style={styles.totalReviews}>{MOCK_CAFE.reviews.length} reviews</Text>
              </View>
              {MOCK_CAFE.reviews.map(review => (
                <View key={review.id} style={dynamicStyles.review}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}>
                        <FontAwesome name="user-circle" size={32} color="#666" />
                      </View>
                      <View>
                        <Text style={dynamicStyles.reviewerName}>{review.userName}</Text>
                        <Text style={styles.reviewDate}>
                          {new Date(review.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, index) => (
                        <FontAwesome
                          key={index}
                          name={index < review.rating ? 'star' : 'star-o'}
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={dynamicStyles.reviewComment}>{review.comment}</Text>
                  <View style={styles.reviewActions}>
                    <TouchableOpacity
                      style={styles.reviewActionButton}
                      onPress={() => Alert.alert('Thanks!', 'Thanks for finding this review helpful!')}
                    >
                      <FontAwesome name="thumbs-up" size={16} color="#666" />
                      <Text style={styles.reviewActionText}>Helpful</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {cartItems.length > 0 && (
          <View style={styles.cartBar}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartItemCount}>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </Text>
              <Text style={styles.cartTotal}>${getCartTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}

        {renderCustomizationModal()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  cafeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cafeAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  ratingStar: {
    marginRight: 4,
  },
  reviewsButton: {
    marginRight: 16,
  },
  reviewsText: {
    color: '#007AFF',
    fontSize: 14,
  },
  distance: {
    color: '#666',
    fontSize: 14,
  },
  specialOffers: {
    padding: 16,
    backgroundColor: '#FFF9E6',
  },
  specialOffersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  specialOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  specialOfferInfo: {
    marginLeft: 12,
    flex: 1,
  },
  specialOfferTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialOfferDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  specialOfferValid: {
    fontSize: 12,
    color: '#999',
  },
  categoriesContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  customizationNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  menuItemActions: {
    alignItems: 'flex-end',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 12,
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartInfo: {
    flex: 1,
  },
  cartItemCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  customizationSection: {
    marginBottom: 16,
  },
  customizationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  customizationOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  customizationOptionSelected: {
    backgroundColor: '#007AFF',
  },
  customizationOptionText: {
    fontSize: 16,
    color: '#000',
  },
  customizationOptionPrice: {
    fontSize: 12,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  writeReviewText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 14,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    marginRight: 12,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  reviewActionText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  modalScrollView: {
    maxHeight: '85%',
  },
}); 