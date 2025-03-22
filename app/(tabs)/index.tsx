import { StyleSheet, FlatList, View, Text, TouchableOpacity, Image, Alert, Dimensions, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import React from 'react';

// Map component dimensions
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface Cafe {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  image: string;
  isOpen: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Temporary mock data for cafes with coordinates
const MOCK_CAFES: Cafe[] = [
  {
    id: '1',
    name: 'The Coffee House',
    address: '123 Main St',
    rating: 4.5,
    distance: '0.5 mi',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: '2',
    name: 'Bakery & Brew',
    address: '456 Oak Ave',
    rating: 4.8,
    distance: '0.8 mi',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7833,
      longitude: -122.4167,
    },
  },
  {
    id: '3',
    name: 'Morning Glory Cafe',
    address: '789 Maple Rd',
    rating: 4.3,
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7917,
      longitude: -122.4083,
    },
  },
  {
    id: '4',
    name: 'Artisan Bakehouse',
    address: '321 Pine St',
    rating: 4.7,
    distance: '1.5 mi',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.8000,
      longitude: -122.4000,
    },
  },
  {
    id: '5',
    name: 'The Sandwich Shop',
    address: '567 Cedar Ln',
    rating: 4.4,
    distance: '0.9 mi',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7800,
      longitude: -122.4150,
    },
  },
  {
    id: '6',
    name: 'Sweet & Savory',
    address: '890 Elm St',
    rating: 4.6,
    distance: '1.8 mi',
    image: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7850,
      longitude: -122.4100,
    },
  },
  {
    id: '7',
    name: 'Espresso Lane',
    address: '234 Birch Ave',
    rating: 4.9,
    distance: '0.3 mi',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
    isOpen: false,
    coordinates: {
      latitude: 37.7700,
      longitude: -122.4200,
    },
  },
  {
    id: '8',
    name: 'Breakfast Club',
    address: '678 Walnut St',
    rating: 4.2,
    distance: '2.1 mi',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7950,
      longitude: -122.4050,
    },
  },
  {
    id: '9',
    name: 'French Corner',
    address: '123 Chestnut Ave',
    rating: 4.7,
    distance: '1.1 mi',
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7780,
      longitude: -122.4130,
    },
  },
  {
    id: '10',
    name: 'Rustic Loaf',
    address: '456 Magnolia Blvd',
    rating: 4.6,
    distance: '1.7 mi',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7880,
      longitude: -122.4080,
    },
  },
  {
    id: '11',
    name: 'The Daily Grind',
    address: '789 Sycamore St',
    rating: 4.8,
    distance: '0.6 mi',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7730,
      longitude: -122.4180,
    },
  },
  {
    id: '12',
    name: 'Bagel Spot',
    address: '321 Willow Way',
    rating: 4.5,
    distance: '1.3 mi',
    image: 'https://images.unsplash.com/photo-1585088767768-94081fed9985?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7900,
      longitude: -122.4020,
    },
  },
  {
    id: '13',
    name: 'Croissant Corner',
    address: '567 Poplar Place',
    rating: 4.9,
    distance: '0.4 mi',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7710,
      longitude: -122.4190,
    },
  },
  {
    id: '14',
    name: 'Bean Scene',
    address: '890 Cedar Court',
    rating: 4.3,
    distance: '1.6 mi',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500',
    isOpen: false,
    coordinates: {
      latitude: 37.7920,
      longitude: -122.4060,
    },
  },
  {
    id: '15',
    name: 'Panini Press',
    address: '234 Maple Lane',
    rating: 4.4,
    distance: '0.7 mi',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7760,
      longitude: -122.4160,
    },
  },
  {
    id: '16',
    name: 'Sweet Tooth',
    address: '678 Oak Court',
    rating: 4.7,
    distance: '1.4 mi',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
    isOpen: true,
    coordinates: {
      latitude: 37.7910,
      longitude: -122.4040,
    },
  },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [cafes, setCafes] = useState<Cafe[]>(MOCK_CAFES);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert(
            'Location Permission Required',
            'Please enable location services to find cafes near you.',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);

        // Adjust mock cafes to be near user's location for demonstration
        const adjustedCafes = MOCK_CAFES.map((cafe, index) => {
          return {
            ...cafe,
            coordinates: {
              latitude: location.coords.latitude + (0.001 * (index + 1) * (index % 2 === 0 ? 1 : -1)),
              longitude: location.coords.longitude + (0.002 * (index + 1) * (index % 2 === 0 ? -1 : 1)),
            },
          };
        });
        
        setCafes(adjustedCafes);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Could not fetch your location. Please try again.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const calculateDistance = (cafe: Cafe) => {
    if (!location) return cafe.distance;
    
    const R = 6371; // Earth's radius in km
    const lat1 = location.coords.latitude * Math.PI / 180;
    const lat2 = cafe.coordinates.latitude * Math.PI / 180;
    const deltaLat = (cafe.coordinates.latitude - location.coords.latitude) * Math.PI / 180;
    const deltaLon = (cafe.coordinates.longitude - location.coords.longitude) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  // Function to animate to user's location on the map
  const goToUserLocation = () => {
    if (!location || !mapRef.current) return;
    
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }, 1000);
  };

  // Navigate to cafe details
  const goToCafeDetails = (cafeId: string) => {
    router.push(`/cafe/${cafeId}`);
  };

  const renderCafeItem = ({ item }: { item: Cafe }) => (
    <TouchableOpacity 
      style={styles.cafeCard}
      onPress={() => router.push(`/cafe/${item.id}`)}
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
          <Text style={styles.distance}>{calculateDistance(item)}</Text>
          <View style={[styles.openStatus, { backgroundColor: item.isOpen ? '#4CAF50' : '#F44336' }]}>
            <Text style={styles.openStatusText}>{item.isOpen ? 'Open' : 'Closed'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        } : undefined}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            coordinate={cafe.coordinates}
            pinColor={cafe.isOpen ? "#4CAF50" : "#F44336"}
          >
            <Callout
              onPress={() => goToCafeDetails(cafe.id)}
            >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{cafe.name}</Text>
                <Text style={styles.calloutAddress}>{cafe.address}</Text>
                <View style={styles.calloutDetails}>
                  <View style={styles.calloutRating}>
                    <FontAwesome name="star" size={12} color="#FFD700" />
                    <Text style={styles.calloutRatingText}>{cafe.rating}</Text>
                  </View>
                  {location && (
                    <Text style={styles.calloutDistance}>
                      {calculateDistance(cafe)}
                    </Text>
                  )}
                  <View style={[styles.calloutStatus, { backgroundColor: cafe.isOpen ? '#4CAF50' : '#F44336' }]}>
                    <Text style={styles.calloutStatusText}>{cafe.isOpen ? 'Open' : 'Closed'}</Text>
                  </View>
                </View>
                <Text style={styles.calloutTapText}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.mapButtonContainer}>
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={goToUserLocation}
        >
          <FontAwesome name="location-arrow" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Explore Cafes
        </Text>
        {errorMsg && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[
              styles.viewToggleButton, 
              viewMode === 'list' && styles.viewToggleButtonActive
            ]}
            onPress={() => setViewMode('list')}
          >
            <FontAwesome name="list" size={16} color={viewMode === 'list' ? '#fff' : '#007AFF'} />
            <Text style={[
              styles.viewToggleText,
              viewMode === 'list' && styles.viewToggleTextActive
            ]}>List</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.viewToggleButton,
              viewMode === 'map' && styles.viewToggleButtonActive
            ]}
            onPress={() => setViewMode('map')}
          >
            <FontAwesome name="map" size={16} color={viewMode === 'map' ? '#fff' : '#007AFF'} />
            <Text style={[
              styles.viewToggleText,
              viewMode === 'map' && styles.viewToggleTextActive
            ]}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={cafes}
          renderItem={renderCafeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        renderMapView()
      )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    marginTop: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 4,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
  },
  viewToggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  viewToggleText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewToggleTextActive: {
    color: '#fff',
  },
  listContainer: {
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  myLocationButton: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContainer: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calloutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  calloutRatingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  calloutDistance: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  calloutStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  calloutStatusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  calloutTapText: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
