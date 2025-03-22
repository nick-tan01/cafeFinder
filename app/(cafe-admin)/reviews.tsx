import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Modal, Alert, FlatList, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Reply {
  id: string;
  text: string;
  date: string;
}

interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  date: string;
  text: string;
  images?: string[];
  reply?: Reply;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'John Doe',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    date: '2024-03-15',
    text: 'Amazing coffee and pastries! The atmosphere is cozy and perfect for working or catching up with friends.',
    images: ['https://picsum.photos/200/200'],
    reply: {
      id: '1',
      text: 'Thank you for your kind words! We\'re glad you enjoyed your visit.',
      date: '2024-03-15'
    }
  },
  {
    id: '2',
    userName: 'Jane Smith',
    userImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    date: '2024-03-14',
    text: 'Great service and delicious food. The latte art is beautiful!',
    images: ['https://picsum.photos/200/200', 'https://picsum.photos/200/200']
  },
  {
    id: '3',
    userName: 'Mike Johnson',
    userImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 3,
    date: '2024-03-13',
    text: 'The coffee was good but the place was a bit crowded during peak hours.',
    images: ['https://picsum.photos/200/200']
  },
  {
    id: '4',
    userName: 'Sarah Wilson',
    userImage: 'https://randomuser.me/api/portraits/women/67.jpg',
    rating: 5,
    date: '2024-03-12',
    text: 'Best croissants in town! Will definitely come back.',
    images: ['https://picsum.photos/200/200']
  }
];

const FILTER_RATINGS = [
  { id: 'all', label: 'All', icon: 'star' },
  { id: '5', label: '5 Stars', icon: 'star' },
  { id: '4', label: '4 Stars', icon: 'star' },
  { id: '3', label: '3 Stars', icon: 'star' },
  { id: '2', label: '2 Stars', icon: 'star' },
  { id: '1', label: '1 Star', icon: 'star' },
];

export default function ReviewsManagement() {
  const colorScheme = useColorScheme();
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = isDark ? '#000' : '#fff';
  const cardBgColor = isDark ? '#1c1c1e' : '#f2f2f7';

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const filteredReviews = reviews.filter(review => 
    selectedRating === 'all' || review.rating === parseInt(selectedRating)
  );

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setReplyText('');
    setIsReplyModalVisible(true);
  };

  const handleSubmitReply = () => {
    if (!selectedReview || !replyText.trim()) return;

    // Check if review already has a reply
    if (selectedReview.reply) {
      Alert.alert('Error', 'This review already has a reply');
      return;
    }

    // Validate reply length
    if (replyText.trim().length < 10) {
      Alert.alert('Error', 'Reply must be at least 10 characters long');
      return;
    }

    const newReply: Reply = {
      id: Date.now().toString(),
      text: replyText.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === selectedReview.id
          ? { ...review, reply: newReply }
          : review
      )
    );

    setIsReplyModalVisible(false);
    setSelectedReview(null);
    setReplyText('');
    Alert.alert('Success', 'Reply submitted successfully');
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesome
        key={index}
        name={index < rating ? 'star' : 'star-o'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  const renderFilterRating = ({ item }: { item: typeof FILTER_RATINGS[0] }) => {
    const count = item.id === 'all'
      ? reviews.length
      : reviews.filter(review => review.rating === parseInt(item.id)).length;

    return (
      <TouchableOpacity
        style={[
          styles.filterTag,
          { 
            backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
            borderWidth: 1,
            borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
          },
          selectedRating === item.id && {
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            borderColor: '#007AFF'
          }
        ]}
        onPress={() => setSelectedRating(item.id)}
      >
        <FontAwesome 
          name={item.icon as any} 
          size={16} 
          color={selectedRating === item.id 
            ? '#007AFF'
            : isDark ? '#fff' : '#000'
          } 
          style={styles.filterIcon} 
        />
        <Text style={[
          styles.filterTagText,
          { 
            color: selectedRating === item.id 
              ? '#007AFF'
              : isDark ? '#fff' : '#000'
          }
        ]}>
          {item.label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  const renderReviewCard = ({ item: review }: { item: Review }) => (
    <View 
      style={[
        styles.reviewCard,
        { 
          backgroundColor: isDark ? '#1c1c1e' : '#fff',
          shadowColor: isDark ? '#000' : '#000',
        }
      ]}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: review.userImage }} 
            style={styles.userImage} 
          />
          <View>
            <Text style={[styles.userName, { color: isDark ? '#fff' : '#000' }]}>
              {review.userName}
            </Text>
            <Text style={[styles.reviewDate, { color: isDark ? '#999' : '#666' }]}>
              {review.date}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(review.rating)}
        </View>
      </View>

      <Text style={[styles.reviewText, { color: isDark ? '#fff' : '#000' }]}>
        {review.text}
      </Text>

      {review.images && review.images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
        >
          {review.images.map((image, index) => (
            <Image 
              key={index} 
              source={{ uri: image }} 
              style={styles.reviewImage}
            />
          ))}
        </ScrollView>
      )}

      {review.reply ? (
        <View style={[
          styles.replyContainer,
          { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }
        ]}>
          <View style={styles.replyHeader}>
            <FontAwesome name="reply" size={16} color={isDark ? '#999' : '#666'} />
            <Text style={[styles.replyLabel, { color: isDark ? '#999' : '#666' }]}>
              Your Reply
            </Text>
            <Text style={[styles.replyDate, { color: isDark ? '#999' : '#666' }]}>
              {review.reply.date}
            </Text>
          </View>
          <Text style={[styles.replyText, { color: isDark ? '#fff' : '#000' }]}>
            {review.reply.text}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.replyButton,
            { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }
          ]}
          onPress={() => handleReply(review)}
        >
          <FontAwesome name="reply" size={16} color="#007AFF" />
          <Text style={styles.replyButtonText}>Reply to Review</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f8f8' }]}>
      <Stack.Screen
        options={{
          headerTitle: "Reviews Management",
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

      <FlatList
        ListHeaderComponent={
          <>
            {/* Rating Overview */}
            <View style={[
              styles.overviewCard,
              { 
                backgroundColor: isDark ? '#1c1c1e' : '#fff',
                shadowColor: isDark ? '#000' : '#000',
              }
            ]}>
              <View style={styles.overviewHeader}>
                <View style={styles.overviewRating}>
                  <Text style={[styles.averageRating, { color: isDark ? '#fff' : '#000' }]}>
                    {averageRating.toFixed(1)}
                  </Text>
                  <View style={styles.starsContainer}>
                    {renderStars(Math.round(averageRating))}
                  </View>
                  <Text style={[styles.totalReviews, { color: isDark ? '#999' : '#666' }]}>
                    {reviews.length} total reviews
                  </Text>
                </View>
                <View style={styles.ratingBreakdown}>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <TouchableOpacity 
                      key={rating} 
                      style={styles.ratingRow}
                      onPress={() => setSelectedRating(rating.toString())}
                    >
                      <Text style={[styles.ratingLabel, { color: isDark ? '#fff' : '#000' }]}>
                        {rating}
                      </Text>
                      <View style={styles.ratingBarContainer}>
                        <View 
                          style={[
                            styles.ratingBar,
                            { 
                              width: `${((ratingCounts[rating] || 0) / reviews.length) * 100}%`,
                              backgroundColor: rating >= 4 ? '#4CAF50' : rating >= 3 ? '#FFC107' : '#FF5722'
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.ratingCount, { color: isDark ? '#999' : '#666' }]}>
                        {ratingCounts[rating] || 0}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Rating Filters */}
            <FlatList
              data={FILTER_RATINGS}
              renderItem={renderFilterRating}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterList}
              contentContainerStyle={styles.filterListContent}
            />
          </>
        }
        data={filteredReviews}
        renderItem={renderReviewCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsList}
      />

      {/* Reply Modal */}
      <Modal
        visible={isReplyModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            { 
              backgroundColor: isDark ? '#1c1c1e' : '#fff',
              shadowColor: isDark ? '#000' : '#000',
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
                Reply to Review
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsReplyModalVisible(false)}
              >
                <FontAwesome name="close" size={24} color={isDark ? '#fff' : '#666'} />
              </TouchableOpacity>
            </View>

            {selectedReview && (
              <View style={styles.selectedReview}>
                <View style={styles.selectedReviewHeader}>
                  <Image 
                    source={{ uri: selectedReview.userImage }} 
                    style={styles.selectedReviewUserImage} 
                  />
                  <View>
                    <Text style={[styles.selectedReviewUserName, { color: isDark ? '#fff' : '#000' }]}>
                      {selectedReview.userName}
                    </Text>
                    <View style={styles.selectedReviewRating}>
                      {renderStars(selectedReview.rating)}
                    </View>
                  </View>
                </View>
                <Text style={[styles.selectedReviewText, { color: isDark ? '#999' : '#666' }]}>
                  {selectedReview.text}
                </Text>
              </View>
            )}

            <TextInput
              style={[
                styles.replyInput,
                { 
                  color: isDark ? '#fff' : '#000',
                  backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8',
                  borderColor: isDark ? '#3c3c3e' : '#e5e5e5'
                }
              ]}
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Write your reply..."
              placeholderTextColor={isDark ? '#999' : '#666'}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: isDark ? '#2c2c2e' : '#f8f8f8' }
                ]}
                onPress={() => setIsReplyModalVisible(false)}
              >
                <Text style={[
                  styles.cancelButtonText,
                  { color: isDark ? '#fff' : '#666' }
                ]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { opacity: !replyText.trim() ? 0.6 : 1 }
                ]}
                onPress={handleSubmitReply}
                disabled={!replyText.trim()}
              >
                <Text style={styles.submitButtonText}>Submit Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overviewCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  overviewRating: {
    alignItems: 'center',
    marginRight: 24,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 14,
  },
  ratingBreakdown: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 24,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    borderRadius: 4,
  },
  ratingCount: {
    fontSize: 14,
    width: 24,
    textAlign: 'right',
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
  reviewsList: {
    padding: 16,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  reviewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  replyContainer: {
    padding: 12,
    borderRadius: 12,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 'auto',
  },
  replyDate: {
    fontSize: 12,
  },
  replyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
  },
  replyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
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
  selectedReview: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  selectedReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedReviewUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  selectedReviewUserName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedReviewRating: {
    flexDirection: 'row',
  },
  selectedReviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  replyInput: {
    margin: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
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
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 