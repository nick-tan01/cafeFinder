import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Customization {
  id: string;
  name: string;
  options: string[];
  maxSelections: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
  customizations: Customization[];
}

interface FormData {
  name: string;
  price: string;
  category: string;
  description: string;
  isAvailable: boolean;
  customizations: Customization[];
}

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: 'th-large' },
  { id: 'Drinks', label: 'Drinks', icon: 'coffee' },
  { id: 'Food', label: 'Food', icon: 'cutlery' },
  { id: 'Desserts', label: 'Desserts', icon: 'birthday-cake' },
  { id: 'Snacks', label: 'Snacks', icon: 'cutlery' },
];

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso',
    price: 3.50,
    category: 'Coffee',
    description: 'Single shot of premium espresso',
    isAvailable: true,
    customizations: [
      {
        id: '1',
        name: 'Size',
        options: ['Single', 'Double', 'Triple'],
        maxSelections: 1
      },
      {
        id: '2',
        name: 'Milk',
        options: ['Whole', 'Skim', 'Almond', 'Soy'],
        maxSelections: 1
      }
    ]
  },
  {
    id: '2',
    name: 'Croissant',
    price: 4.50,
    category: 'Pastries',
    description: 'Buttery, flaky French-style croissant',
    isAvailable: true,
    customizations: [
      {
        id: '3',
        name: 'Filling',
        options: ['Plain', 'Chocolate', 'Almond'],
        maxSelections: 1
      }
    ]
  }
];

export default function MenuManagement() {
  const colorScheme = useColorScheme();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    category: '',
    description: '',
    isAvailable: true,
    customizations: []
  });

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = isDark ? '#000' : '#fff';
  const cardBgColor = isDark ? '#1c1c1e' : '#f2f2f7';

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      isAvailable: true,
      customizations: []
    });
    setIsModalVisible(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description,
      isAvailable: item.isAvailable,
      customizations: [...item.customizations]
    });
    setIsModalVisible(true);
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.price || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      isAvailable: formData.isAvailable,
      customizations: formData.customizations
    };

    if (editingItem) {
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItem.id ? newItem : item
        )
      );
    } else {
      setMenuItems(prevItems => [...prevItems, newItem]);
    }

    setIsModalVisible(false);
    Alert.alert('Success', `Item ${editingItem ? 'updated' : 'added'} successfully`);
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
            Alert.alert('Success', 'Item deleted successfully');
          }
        }
      ]
    );
  };

  const handleAddCustomization = () => {
    const newCustomization: Customization = {
      id: Date.now().toString(),
      name: '',
      options: [],
      maxSelections: 1
    };
    setFormData(prev => ({
      ...prev,
      customizations: [...prev.customizations, newCustomization]
    }));
  };

  const handleUpdateCustomization = (index: number, field: keyof Customization, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.map((custom, i) =>
        i === index ? { ...custom, [field]: value } : custom
      )
    }));
  };

  const handleAddOption = (customizationIndex: number) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.map((custom, i) =>
        i === customizationIndex
          ? { ...custom, options: [...custom.options, ''] }
          : custom
      )
    }));
  };

  const handleUpdateOption = (customizationIndex: number, optionIndex: number, value: string) => {
    if (!value.trim()) {
      Alert.alert('Error', 'Option cannot be empty');
      return;
    }
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.map((custom, i) =>
        i === customizationIndex
          ? {
              ...custom,
              options: custom.options.map((opt, j) =>
                j === optionIndex ? value.trim() : opt
              )
            }
          : custom
      )
    }));
  };

  const handleRemoveCustomization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index)
    }));
  };

  const renderFilterCategory = ({ item }: { item: typeof FILTER_CATEGORIES[0] }) => {
    const count = item.id === 'all'
      ? menuItems.length
      : menuItems.filter(menuItem => menuItem.category === item.id).length;

    return (
      <TouchableOpacity
        style={[
          styles.filterTag,
          { 
            backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
            borderWidth: 1,
            borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
          },
          selectedCategory === item.id && {
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            borderColor: '#007AFF'
          }
        ]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <FontAwesome 
          name={item.icon as any} 
          size={16} 
          color={selectedCategory === item.id 
            ? '#007AFF'
            : isDark ? '#fff' : '#000'
          } 
          style={styles.filterIcon} 
        />
        <Text style={[
          styles.filterTagText,
          { 
            color: selectedCategory === item.id 
              ? '#007AFF'
              : isDark ? '#fff' : '#000'
          }
        ]}>
          {item.label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View 
      style={[
        styles.menuCard,
        { 
          backgroundColor: isDark ? '#1c1c1e' : '#fff',
          shadowColor: isDark ? '#000' : '#000',
        }
      ]}
    >
      <View style={styles.menuCardHeader}>
        <View style={styles.menuCardTitleSection}>
          <Text style={[styles.menuItemName, { color: isDark ? '#fff' : '#000' }]}>
            {item.name}
          </Text>
          <Text style={[styles.menuItemCategory, { color: isDark ? '#999' : '#666' }]}>
            {item.category}
          </Text>
        </View>
        <View style={styles.menuCardActions}>
          <Switch
            value={item.isAvailable}
            onValueChange={(value) => {
              setMenuItems(prevItems =>
                prevItems.map(menuItem =>
                  menuItem.id === item.id
                    ? { ...menuItem, isAvailable: value }
                    : menuItem
                )
              );
            }}
          />
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }]}
            onPress={() => handleEditItem(item)}
          >
            <FontAwesome name="edit" size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }]}
            onPress={() => handleDeleteItem(item.id)}
          >
            <FontAwesome name="trash" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.menuItemPrice, { color: isDark ? '#fff' : '#000' }]}>
        ${item.price.toFixed(2)}
      </Text>
      <Text style={[styles.menuItemDescription, { color: isDark ? '#999' : '#666' }]}>
        {item.description}
      </Text>

      {item.customizations.length > 0 && (
        <View style={styles.customizationsSection}>
          <Text style={[styles.customizationsTitle, { color: isDark ? '#fff' : '#000' }]}>
            Customizations
          </Text>
          {item.customizations.map((custom, index) => (
            <View key={custom.id} style={styles.customizationItem}>
              <Text style={[styles.customizationName, { color: isDark ? '#fff' : '#000' }]}>
                {custom.name}
              </Text>
              <View style={styles.optionsContainer}>
                {custom.options.map((option, optionIndex) => (
                  <View 
                    key={optionIndex}
                    style={[
                      styles.optionTag,
                      { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }
                    ]}
                  >
                    <Text style={[styles.optionText, { color: isDark ? '#fff' : '#666' }]}>
                      {option}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f8f8' }]}>
      <Stack.Screen
        options={{
          headerTitle: "Menu Management",
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#f8f8f8',
          },
          headerTintColor: isDark ? '#fff' : '#000',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: "",
        }}
      />

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color={isDark ? '#999' : '#666'} style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput,
            { 
              color: textColor,
              backgroundColor: isDark ? '#1c1c1e' : '#fff',
            }
          ]}
          placeholder="Search menu items..."
          placeholderTextColor={isDark ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        ListHeaderComponent={
          <FlatList
            data={FILTER_CATEGORIES}
            renderItem={renderFilterCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterList}
            contentContainerStyle={styles.filterListContent}
          />
        }
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.menuList}
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          { shadowColor: isDark ? '#000' : '#000' }
        ]}
        onPress={handleAddItem}
      >
        <LinearGradient
          colors={['#007AFF', '#0056B3']}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome name="plus" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Add/Edit Item Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[
            styles.modalContent,
            { 
              backgroundColor: cardBgColor,
              shadowColor: isDark ? '#000' : '#000',
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <FontAwesome name="close" size={24} color={isDark ? '#fff' : '#666'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: textColor }]}>Name *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      color: textColor,
                      backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8',
                      borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
                    }
                  ]}
                  value={formData.name}
                  onChangeText={(value) => setFormData({ ...formData, name: value })}
                  placeholder="Item name"
                  placeholderTextColor={isDark ? '#999' : '#666'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: textColor }]}>Price *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      color: textColor,
                      backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8',
                      borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
                    }
                  ]}
                  value={formData.price}
                  onChangeText={(value) => setFormData({ ...formData, price: value })}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#999' : '#666'}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: textColor }]}>Category *</Text>
                <View style={styles.categoryButtons}>
                  {FILTER_CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        formData.category === category.id && styles.selectedCategoryButton,
                        { 
                          backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8',
                          borderColor: formData.category === category.id ? '#007AFF' : 'transparent'
                        }
                      ]}
                      onPress={() => setFormData({ ...formData, category: category.id })}
                    >
                      <FontAwesome 
                        name={category.icon as any} 
                        size={16} 
                        color={formData.category === category.id ? '#007AFF' : isDark ? '#999' : '#666'} 
                        style={styles.categoryIcon} 
                      />
                      <Text style={[
                        styles.categoryButtonText,
                        { 
                          color: formData.category === category.id 
                            ? '#007AFF' 
                            : isDark ? '#999' : '#666'
                        }
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: textColor }]}>Description</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    styles.textArea,
                    { 
                      color: textColor,
                      backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8',
                      borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
                    }
                  ]}
                  value={formData.description}
                  onChangeText={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Item description"
                  placeholderTextColor={isDark ? '#999' : '#666'}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.availabilityRow}>
                  <Text style={[styles.formLabel, { color: textColor }]}>Available</Text>
                  <Switch
                    value={formData.isAvailable}
                    onValueChange={(value) => setFormData({ ...formData, isAvailable: value })}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.customizationHeader}>
                  <Text style={[styles.formLabel, { color: textColor }]}>Customizations</Text>
                  <TouchableOpacity
                    style={[
                      styles.addCustomizationButton,
                      { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }
                    ]}
                    onPress={handleAddCustomization}
                  >
                    <FontAwesome name="plus" size={16} color="#007AFF" />
                    <Text style={styles.addCustomizationText}>Add Customization</Text>
                  </TouchableOpacity>
                </View>

                {formData.customizations.map((custom, index) => (
                  <View key={custom.id} style={styles.customizationForm}>
                    <TextInput
                      style={[
                        styles.formInput,
                        { 
                          color: textColor,
                          backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8',
                          borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
                        }
                      ]}
                      value={custom.name}
                      onChangeText={(value) => handleUpdateCustomization(index, 'name', value)}
                      placeholder="Customization name"
                      placeholderTextColor={isDark ? '#999' : '#666'}
                    />

                    <View style={styles.optionsHeader}>
                      <Text style={[styles.optionsLabel, { color: isDark ? '#999' : '#666' }]}>
                        Options
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.addOptionButton,
                          { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }
                        ]}
                        onPress={() => handleAddOption(index)}
                      >
                        <FontAwesome name="plus" size={14} color="#007AFF" />
                        <Text style={styles.addOptionText}>Add Option</Text>
                      </TouchableOpacity>
                    </View>

                    {custom.options.map((option, optionIndex) => (
                      <TextInput
                        key={optionIndex}
                        style={[
                          styles.formInput,
                          styles.optionInput,
                          { 
                            color: textColor,
                            backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8',
                            borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
                          }
                        ]}
                        value={option}
                        onChangeText={(value) => handleUpdateOption(index, optionIndex, value)}
                        placeholder="Option name"
                        placeholderTextColor={isDark ? '#999' : '#666'}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }
                ]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={[
                  styles.cancelButtonText,
                  { color: isDark ? '#fff' : '#666' }
                ]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { opacity: !formData.name || !formData.price || !formData.category ? 0.6 : 1 }
                ]}
                onPress={handleSaveItem}
                disabled={!formData.name || !formData.price || !formData.category}
              >
                <Text style={styles.saveButtonText}>
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  filterList: {
    marginBottom: 8,
  },
  filterListContent: {
    paddingHorizontal: 16,
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
  menuList: {
    padding: 16,
  },
  menuCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  menuCardTitleSection: {
    flex: 1,
    marginRight: 16,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemCategory: {
    fontSize: 14,
    marginBottom: 8,
  },
  menuCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuItemPrice: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  menuItemDescription: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 16,
  },
  customizationsSection: {
    marginTop: 8,
  },
  customizationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  customizationItem: {
    marginBottom: 12,
  },
  customizationName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  selectedCategoryButton: {
    borderColor: '#007AFF',
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addCustomizationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addCustomizationText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  customizationForm: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addOptionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },
  optionInput: {
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 