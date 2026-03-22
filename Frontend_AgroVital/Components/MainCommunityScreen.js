import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, orderBy, getDocs, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import CustomPopup from './CustomPopup'; 
import styles from '../Styles/MainCommunityStyles';
import { useAuth } from './AuthContext';

const MainCommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  const showPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    // Fetch posts in real-time
    const fetchPostsRealtime = () => {
      const db = getFirestore();
      const postsRef = collection(db, 'communityPosts');
      const q = query(postsRef, orderBy('timestamp', 'desc'));

      // Set up a real-time listener
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const fetchedPosts = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const commentsRef = collection(db, 'communityPosts', doc.id, 'comments');
            const commentsSnapshot = await getDocs(commentsRef);
            const commentsCount = commentsSnapshot.size;

            return {
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate?.() || new Date(),
              commentsCount, // Add the comments count to the post object
            };
          })
        );

        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts); // Initialize filteredPosts with all posts
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };

    fetchPostsRealtime();
  }, []);

  const handleSearch = debounce((query) => {
    const searchText = query.toLowerCase().trim();
    if (searchText === '') {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) => {
      const questionMatch = post.question?.toLowerCase().includes(searchText);
      const descriptionMatch = post.description?.toLowerCase().includes(searchText);
      const userMatch = post.userEmail?.toLowerCase().includes(searchText);

      return questionMatch || descriptionMatch || userMatch;
    });

    setFilteredPosts(filtered);
  }, 300);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, posts]);

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleLike = async (postId) => {
    try {
      const db = getFirestore();
      const postRef = doc(db, 'communityPosts', postId);
      const likesCollectionRef = collection(db, 'communityPosts', postId, 'likesCollection');
      const userLikeRef = doc(likesCollectionRef, user.email);

      const userLikeDoc = await getDoc(userLikeRef);

      if (userLikeDoc.exists()) {
        showPopup('Already Liked', 'You have already liked this post.');
        return;
      }

      await setDoc(userLikeRef, { liked: true });
      await updateDoc(postRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error('Error liking post:', error);
      showPopup('Error', 'Failed to like the post.');
    }
  };

  const handleDislike = async (postId) => {
    try {
      const db = getFirestore();
      const postRef = doc(db, 'communityPosts', postId);
      const dislikesCollectionRef = collection(db, 'communityPosts', postId, 'dislikesCollection');
      const userDislikeRef = doc(dislikesCollectionRef, user.email);

      const userDislikeDoc = await getDoc(userDislikeRef);

      if (userDislikeDoc.exists()) {
        showPopup('Already Disliked', 'You have already disliked this post.');
        return;
      }

      await setDoc(userDislikeRef, { disliked: true });
      await updateDoc(postRef, {
        dislikes: increment(1),
      });
    } catch (error) {
      console.error('Error disliking post:', error);
      showPopup('Error', 'Failed to dislike the post.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // No need to manually fetch posts since onSnapshot handles real-time updates
    setRefreshing(false); 
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.postContent}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={24} color="#666" />
          <Text style={styles.userName}>{item.userEmail?.split('@')[0]} • </Text>
          <Text style={styles.timeAgo}>{getTimeAgo(item.timestamp)}</Text>
        </View>

        <Text style={styles.questionText}>{item.question}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.postActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the like button
                handleLike(item.id);
              }}
            >
              <MaterialIcons name="thumb-up-off-alt" size={20} color="#666" />
              <Text style={styles.actionText}>{item.likes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the dislike button
                handleDislike(item.id);
              }}
            >
              <MaterialIcons name="thumb-down-off-alt" size={20} color="#666" />
              <Text style={styles.actionText}>{item.dislikes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the comments button
                navigation.navigate('PostDetail', { postId: item.id });
              }}
            >
              <MaterialIcons name="chat-bubble-outline" size={20} color="#666" />
              <Text style={styles.actionText}>{item.commentsCount || 0} answers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptySearch = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search-off" size={48} color="#666" />
      <Text style={styles.emptyText}>No posts found</Text>
      <Text style={styles.emptySubtext}>Try different keywords</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/tea-plantation-2.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlays} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backArrowContainer}
          >
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community Forum</Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions, descriptions, or users"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.postContainer}>
            <FlatList
              ref={flatListRef}
              data={filteredPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptySearch}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              scrollEnabled={false} // Disable scrolling in FlatList since ScrollView handles it
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.askButton}
          onPress={() => navigation.navigate('AskCommunityScreen')}
        >
          <MaterialIcons name="edit" size={24} color="white" />
          <Text style={styles.askButtonText}>Ask Community</Text>
        </TouchableOpacity>

        <CustomPopup
          isVisible={popupVisible}
          title={popupTitle}
          message={popupMessage}
          onConfirm={hidePopup}
        />

      </ImageBackground>
    </SafeAreaView>
  );
};

export default MainCommunityScreen;