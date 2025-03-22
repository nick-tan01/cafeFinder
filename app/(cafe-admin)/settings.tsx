import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Switch, 
  Image,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Mock cafe data
const INITIAL_CAFE_DATA = {
  name: "The Coffee House",
  address: "123 Coffee Street, City, State, 10001",
  phone: "(555) 123-4567",
  email: "info@thecoffeehouse.com",
  description: "A cozy cafe specializing in artisanal coffee and fresh pastries, serving the community since 2018.",
  image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2047&q=80",
  openingHours: {
    monday: { open: "07:00", close: "18:00", isOpen: true },
    tuesday: { open: "07:00", close: "18:00", isOpen: true },
    wednesday: { open: "07:00", close: "18:00", isOpen: true },
    thursday: { open: "07:00", close: "18:00", isOpen: true },
    friday: { open: "07:00", close: "19:00", isOpen: true },
    saturday: { open: "08:00", close: "19:00", isOpen: true },
    sunday: { open: "08:00", close: "16:00", isOpen: true },
  },
  notifications: {
    newOrders: true,
    orderStatus: true,
    reviews: true,
    promotions: false,
  }
};

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface OpeningHours {
  open: string;
  close: string;
  isOpen: boolean;
}

interface CafeData {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  image: string;
  openingHours: Record<DayOfWeek, OpeningHours>;
  notifications: {
    newOrders: boolean;
    orderStatus: boolean;
    reviews: boolean;
    promotions: boolean;
  };
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [cafeData, setCafeData] = useState<CafeData>(INITIAL_CAFE_DATA);
  const [activeSection, setActiveSection] = useState<'basic' | 'hours' | 'notifications'>('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<CafeData>(INITIAL_CAFE_DATA);

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = isDark ? '#000' : '#fff';
  const cardBgColor = isDark ? '#1c1c1e' : '#f2f2f7';

  const handleSave = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone validation (basic format: (XXX) XXX-XXXX)
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(editedData.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number in format (XXX) XXX-XXXX');
      return;
    }

    setCafeData(editedData);
    setIsEditing(false);
    Alert.alert('Success', 'Settings saved successfully');
  };

  const handleSignOut = () => {
    // Sign out logic
    router.push('/(cafe-admin)/login');
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedData(prev => ({
        ...prev,
        image: result.assets[0].uri
      }));
    }
  };

  const updateOpeningHours = (day: DayOfWeek, field: keyof OpeningHours, value: string | boolean) => {
    setEditedData({
      ...cafeData,
      openingHours: {
        ...cafeData.openingHours,
        [day]: {
          ...cafeData.openingHours[day],
          [field]: value
        }
      }
    });
  };

  const updateNotification = (key: keyof CafeData['notifications'], value: boolean) => {
    setEditedData({
      ...cafeData,
      notifications: {
        ...cafeData.notifications,
        [key]: value
      }
    });
  };

  const renderBasicInfoSection = () => (
    <View style={styles.sectionContent}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: editedData.image }} 
          style={styles.cafeImage} 
        />
        {isEditing && (
          <TouchableOpacity style={styles.editImageButton} onPress={handleImagePick}>
            <FontAwesome name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cafe Name</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: isEditing ? (isDark ? '#333' : '#f5f5f5') : 'transparent',
              color: textColor,
              borderColor: isEditing ? (isDark ? '#444' : '#ddd') : 'transparent'
            }
          ]}
          value={editedData.name}
          onChangeText={(text) => setEditedData({...editedData, name: text})}
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: isEditing ? (isDark ? '#333' : '#f5f5f5') : 'transparent',
              color: textColor,
              borderColor: isEditing ? (isDark ? '#444' : '#ddd') : 'transparent'
            }
          ]}
          value={editedData.address}
          onChangeText={(text) => setEditedData({...editedData, address: text})}
          editable={isEditing}
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: isEditing ? (isDark ? '#333' : '#f5f5f5') : 'transparent',
              color: textColor,
              borderColor: isEditing ? (isDark ? '#444' : '#ddd') : 'transparent'
            }
          ]}
          value={editedData.phone}
          onChangeText={(text) => setEditedData({...editedData, phone: text})}
          editable={isEditing}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: isEditing ? (isDark ? '#333' : '#f5f5f5') : 'transparent',
              color: textColor,
              borderColor: isEditing ? (isDark ? '#444' : '#ddd') : 'transparent'
            }
          ]}
          value={editedData.email}
          onChangeText={(text) => setEditedData({...editedData, email: text})}
          editable={isEditing}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[
            styles.textArea,
            { 
              backgroundColor: isEditing ? (isDark ? '#333' : '#f5f5f5') : 'transparent',
              color: textColor,
              borderColor: isEditing ? (isDark ? '#444' : '#ddd') : 'transparent'
            }
          ]}
          value={editedData.description}
          onChangeText={(text) => setEditedData({...editedData, description: text})}
          editable={isEditing}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderHoursSection = () => (
    <View style={styles.sectionContent}>
      {(Object.keys(cafeData.openingHours) as DayOfWeek[]).map((day) => (
        <View key={day} style={styles.hourRow}>
          <Text style={[styles.dayLabel, { color: textColor }]}>
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Text>
          
          <View style={styles.hoursContainer}>
            <Switch
              value={cafeData.openingHours[day].isOpen}
              onValueChange={(value) => updateOpeningHours(day, 'isOpen', value)}
              disabled={!isEditing}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={cafeData.openingHours[day].isOpen ? '#007AFF' : '#f4f3f4'}
            />
            
            {cafeData.openingHours[day].isOpen && (
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={[
                    styles.timeInput,
                    { 
                      backgroundColor: isEditing ? (isDark ? '#333' : '#f5f5f5') : 'transparent',
                      color: textColor,
                      borderColor: isEditing ? (isDark ? '#444' : '#ddd') : 'transparent'
                    }
                  ]}
                  value={cafeData.openingHours[day].open}
                  onChangeText={(text) => updateOpeningHours(day, 'open', text)}
                  editable={isEditing}
                />
                <Text style={{ color: textColor, marginHorizontal: 8 }}>to</Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    { 
                      backgroundColor: isEditing ? (isDark ? '#333' : '#f5f5f5') : 'transparent',
                      color: textColor,
                      borderColor: isEditing ? (isDark ? '#444' : '#ddd') : 'transparent'
                    }
                  ]}
                  value={cafeData.openingHours[day].close}
                  onChangeText={(text) => updateOpeningHours(day, 'close', text)}
                  editable={isEditing}
                />
              </View>
            )}
            
            {!cafeData.openingHours[day].isOpen && (
              <Text style={styles.closedText}>Closed</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderNotificationsSection = () => (
    <View style={styles.sectionContent}>
      <View style={styles.notificationRow}>
        <View>
          <Text style={[styles.notificationTitle, { color: textColor }]}>New Orders</Text>
          <Text style={styles.notificationDescription}>
            Receive notifications when a new order is placed
          </Text>
        </View>
        <Switch
          value={cafeData.notifications.newOrders}
          onValueChange={(value) => updateNotification('newOrders', value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={cafeData.notifications.newOrders ? '#007AFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.notificationRow}>
        <View>
          <Text style={[styles.notificationTitle, { color: textColor }]}>Order Status Updates</Text>
          <Text style={styles.notificationDescription}>
            Receive notifications when an order status changes
          </Text>
        </View>
        <Switch
          value={cafeData.notifications.orderStatus}
          onValueChange={(value) => updateNotification('orderStatus', value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={cafeData.notifications.orderStatus ? '#007AFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.notificationRow}>
        <View>
          <Text style={[styles.notificationTitle, { color: textColor }]}>New Reviews</Text>
          <Text style={styles.notificationDescription}>
            Receive notifications when a customer leaves a review
          </Text>
        </View>
        <Switch
          value={cafeData.notifications.reviews}
          onValueChange={(value) => updateNotification('reviews', value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={cafeData.notifications.reviews ? '#007AFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.notificationRow}>
        <View>
          <Text style={[styles.notificationTitle, { color: textColor }]}>Promotions</Text>
          <Text style={styles.notificationDescription}>
            Receive notifications about new platform features and promotions
          </Text>
        </View>
        <Switch
          value={cafeData.notifications.promotions}
          onValueChange={(value) => updateNotification('promotions', value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={cafeData.notifications.promotions ? '#007AFF' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Settings",
          headerStyle: {
            backgroundColor: bgColor,
          },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
            >
              <Text style={styles.headerButtonText}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeSection === 'basic' && styles.activeTab,
              { borderColor: activeSection === 'basic' ? '#007AFF' : 'transparent' }
            ]}
            onPress={() => setActiveSection('basic')}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === 'basic' && { color: '#007AFF' }
              ]}
            >
              Basic Info
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeSection === 'hours' && styles.activeTab,
              { borderColor: activeSection === 'hours' ? '#007AFF' : 'transparent' }
            ]}
            onPress={() => setActiveSection('hours')}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === 'hours' && { color: '#007AFF' }
              ]}
            >
              Opening Hours
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeSection === 'notifications' && styles.activeTab,
              { borderColor: activeSection === 'notifications' ? '#007AFF' : 'transparent' }
            ]}
            onPress={() => setActiveSection('notifications')}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === 'notifications' && { color: '#007AFF' }
              ]}
            >
              Notifications
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={[styles.card, { backgroundColor: cardBgColor }]}>
            {activeSection === 'basic' && renderBasicInfoSection()}
            {activeSection === 'hours' && renderHoursSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
          </View>
          
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: isDark ? '#333' : '#f5f5f5' }]}
            onPress={handleSignOut}
          >
            <FontAwesome name="sign-out" size={18} color="#FF3B30" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sectionContent: {
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  cafeImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayLabel: {
    width: 100,
    fontSize: 16,
  },
  hoursContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  timeInput: {
    width: 70,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
  },
  closedText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#666',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    maxWidth: '80%',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  signOutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
}); 