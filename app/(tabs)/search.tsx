import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

interface Cafe {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  image: string;
  isOpen: boolean;
  tags: string[];
}

// Temporary mock data for cafes
const MOCK_CAFES: Cafe[] = [
  {
    id: '1',
    name: 'The Coffee House',
    address: '123 Main St',
    rating: 4.5,
    distance: '0.5 mi',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500',
    isOpen: true,
    tags: ['coffee', 'pastries', 'breakfast'],
  },
  {
    id: '2',
    name: 'Bakery & Brew',
    address: '456 Oak Ave',
    rating: 4.8,
    distance: '0.8 mi',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
    isOpen: true,
    tags: ['coffee', 'bakery', 'sandwiches'],
  },
  {
    id: '3',
    name: 'Morning Glory Cafe',
    address: '789 Maple Rd',
    rating: 4.3,
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    isOpen: true,
    tags: ['breakfast', 'coffee', 'pastries'],
  },
  {
    id: '4',
    name: 'Artisan Bakehouse',
    address: '321 Pine St',
    rating: 4.7,
    distance: '1.5 mi',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500',
    isOpen: true,
    tags: ['bakery', 'pastries', 'breakfast'],
  },
  {
    id: '5',
    name: 'The Sandwich Shop',
    address: '567 Cedar Ln',
    rating: 4.4,
    distance: '0.9 mi',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
    isOpen: true,
    tags: ['sandwiches', 'coffee'],
  },
  {
    id: '6',
    name: 'Sweet & Savory',
    address: '890 Elm St',
    rating: 4.6,
    distance: '1.8 mi',
    image: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=500',
    isOpen: true,
    tags: ['pastries', 'breakfast', 'sandwiches'],
  },
  {
    id: '7',
    name: 'Espresso Lane',
    address: '234 Birch Ave',
    rating: 4.9,
    distance: '0.3 mi',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
    isOpen: false,
    tags: ['coffee', 'pastries'],
  },
  {
    id: '8',
    name: 'Breakfast Club',
    address: '678 Walnut St',
    rating: 4.2,
    distance: '2.1 mi',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=500',
    isOpen: true,
    tags: ['breakfast', 'coffee', 'sandwiches'],
  },
  {
    id: '9',
    name: 'French Corner',
    address: '123 Chestnut Ave',
    rating: 4.7,
    distance: '1.1 mi',
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?w=500',
    isOpen: true,
    tags: ['bakery', 'pastries', 'coffee'],
  },
  {
    id: '10',
    name: 'Rustic Loaf',
    address: '456 Magnolia Blvd',
    rating: 4.6,
    distance: '1.7 mi',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    isOpen: true,
    tags: ['bakery', 'breakfast', 'sandwiches'],
  },
  {
    id: '11',
    name: 'The Daily Grind',
    address: '789 Sycamore St',
    rating: 4.8,
    distance: '0.6 mi',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
    isOpen: true,
    tags: ['coffee', 'breakfast', 'pastries'],
  },
  {
    id: '12',
    name: 'Bagel Spot',
    address: '321 Willow Way',
    rating: 4.5,
    distance: '1.3 mi',
    image: 'https://images.unsplash.com/photo-1585088767768-94081fed9985?w=500',
    isOpen: true,
    tags: ['breakfast', 'sandwiches', 'bakery'],
  },
  {
    id: '13',
    name: 'Croissant Corner',
    address: '567 Poplar Place',
    rating: 4.9,
    distance: '0.4 mi',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
    isOpen: true,
    tags: ['pastries', 'bakery', 'coffee'],
  },
  {
    id: '14',
    name: 'Bean Scene',
    address: '890 Cedar Court',
    rating: 4.3,
    distance: '1.6 mi',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500',
    isOpen: false,
    tags: ['coffee', 'pastries', 'breakfast'],
  },
  {
    id: '15',
    name: 'Panini Press',
    address: '234 Maple Lane',
    rating: 4.4,
    distance: '0.7 mi',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=500',
    isOpen: true,
    tags: ['sandwiches', 'coffee', 'breakfast'],
  },
  {
    id: '16',
    name: 'Sweet Tooth',
    address: '678 Oak Court',
    rating: 4.7,
    distance: '1.4 mi',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
    isOpen: true,
    tags: ['pastries', 'bakery', 'coffee'],
  }
];

const FILTER_TAGS = [
  { id: 'all', label: 'All', icon: 'th-large' },
  { id: 'coffee', label: 'Coffee', icon: 'coffee' },
  { id: 'pastries', label: 'Pastries', icon: 'birthday-cake' },
  { id: 'breakfast', label: 'Breakfast', icon: 'sun-o' },
  { id: 'sandwiches', label: 'Sandwiches', icon: 'cutlery' },
  { id: 'bakery', label: 'Bakery', icon: 'shopping-basket' },
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredCafes = MOCK_CAFES.filter(cafe => {
    const matchesSearch = searchQuery === '' || 
      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || cafe.tags.includes(selectedFilter);
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Sort by distance
    return parseFloat(a.distance.split(' ')[0]) - parseFloat(b.distance.split(' ')[0]);
  });

  const renderFilterTag = ({ item }: { item: typeof FILTER_TAGS[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterTag,
        { 
          backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7',
          borderWidth: 1,
          borderColor: colorScheme === 'dark' ? '#3c3c3e' : '#e5e5e5'
        },
        selectedFilter === item.id && {
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff',
          borderColor: '#007AFF'
        }
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <FontAwesome 
        name={item.icon as any} 
        size={16} 
        color={selectedFilter === item.id 
          ? '#007AFF'
          : colorScheme === 'dark' ? '#fff' : '#000'
        } 
        style={styles.filterIcon}
      />
      <Text style={[
        styles.filterTagText,
        { 
          color: selectedFilter === item.id 
            ? '#007AFF'
            : colorScheme === 'dark' ? '#fff' : '#000'
        }
      ]}>
        {item.label} ({selectedFilter === item.id 
          ? filteredCafes.length 
          : MOCK_CAFES.filter(cafe => item.id === 'all' || cafe.tags.includes(item.id)).length})
      </Text>
    </TouchableOpacity>
  );

  const renderCafeItem = ({ item }: { item: Cafe }) => (
    <TouchableOpacity 
      style={[
        styles.cafeCard,
        { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff' }
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.cafeImage} />
      <View style={styles.cafeInfo}>
        <Text style={[styles.cafeName, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          {item.name}
        </Text>
        <Text style={styles.cafeAddress}>{item.address}</Text>
        <View style={styles.cafeStats}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.distance}>{item.distance}</Text>
          <View style={[styles.openStatus, { backgroundColor: item.isOpen ? '#4CAF50' : '#F44336' }]}>
            <Text style={styles.openStatusText}>{item.isOpen ? 'Open' : 'Closed'}</Text>
          </View>
        </View>
        <View style={styles.tagContainer}>
          {item.tags.map(tag => (
            <TouchableOpacity 
              key={tag} 
              style={styles.tag}
              onPress={() => setSelectedFilter(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <View style={[
        styles.searchContainer, 
        { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f5f5f5' }
      ]}>
        <FontAwesome 
          name="search" 
          size={18} 
          color={colorScheme === 'dark' ? '#fff' : '#666'} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[styles.searchInput, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
          placeholder="Search cafes, addresses, or tags..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery !== '' && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <FontAwesome 
              name="times-circle" 
              size={18} 
              color={colorScheme === 'dark' ? '#fff' : '#666'} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={FILTER_TAGS}
          renderItem={renderFilterTag}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
          contentContainerStyle={styles.filterListContent}
        />
      </View>

      {filteredCafes.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome name="search" size={48} color="#666" />
          <Text style={[styles.emptyStateText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            No cafes found
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCafes}
          renderItem={renderCafeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cafeList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    padding: 14,
    backgroundColor: '#f5f5f5',
    margin: 16,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterList: {
    paddingVertical: 12,
  },
  filterListContent: {
    paddingHorizontal: 16,
    gap: 12,
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
  cafeList: {
    padding: 16,
  },
  cafeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cafeImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cafeInfo: {
    flex: 1,
    padding: 12,
  },
  cafeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cafeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cafeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  openStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
}); 