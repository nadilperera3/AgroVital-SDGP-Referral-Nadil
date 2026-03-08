import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  Clipboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, updateDoc, increment, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import styles from '../Styles/PostDetailStyles';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import CustomPopup from './CustomPopup'; 
import { additionalStyles } from '../Styles/PostDetailStyles';

const PostDetailScreen = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  const { user } = useAuth();
  const db = getFirestore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showOptions, setShowOptions] = useState(null);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupOnConfirm, setPopupOnConfirm] = useState(() => () => {});

  const showPopup = (title, message, onConfirm) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupOnConfirm(() => onConfirm);
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    fetchPostDetails();
    subscribeToComments();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      const postDoc = await getDoc(doc(db, 'communityPosts', postId));
      if (postDoc.exists()) {
        setPost({ id: postDoc.id, ...postDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      showPopup('Error', 'Failed to fetch post details.', () => {});
    }
  };

  const handleCameraPress = async () => {
    if (!user) {
      showPopup('Login Required', 'You need to log in to add images.', () => {});
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        showPopup('Permission Required', 'Please allow access to your photo library.', () => {});
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showPopup('Error', 'Failed to pick image.', () => {});
    }
  };

  const subscribeToComments = () => {
    const q = query(
      collection(db, 'communityPosts', postId, 'comments'),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const commentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsList);
    });
  };

  const handleLikePost = async () => {
    if (!user) {
      showPopup('Login Required', 'You need to log in to like a post.', () => {});
      return;
    }

    try {
      const db = getFirestore();
      const postRef = doc(db, 'communityPosts', postId);
      const likesCollectionRef = collection(db, 'communityPosts', postId, 'likesCollection');
      const userLikeRef = doc(likesCollectionRef, user.email);

      const userLikeDoc = await getDoc(userLikeRef);

      if (userLikeDoc.exists()) {
        showPopup('Already Liked', 'You have already liked this post.', () => {});
        return;
      }

      await setDoc(userLikeRef, { liked: true });
      await updateDoc(postRef, {
        likes: increment(1),
      });

      // Refresh post details to update the UI
      fetchPostDetails();
    } catch (error) {
      console.error('Error liking post:', error);
      showPopup('Error', 'Failed to like the post.', () => {});
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      // Create the deep link to your post
      const postDeepLink = `myapp://post/${postId}`;
      
      // Create the message to share
      const message = `Check out this post:\n\n${post.question}\n\n${postDeepLink}`;
      
      // Encode the message for the URL
      const encodedMessage = encodeURIComponent(message);
      
      // Create the WhatsApp URL
      const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
      
      // Check if WhatsApp is installed
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // If WhatsApp is not installed, open in browser
        const webWhatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        await Linking.openURL(webWhatsappUrl);
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      showPopup('Error', 'Could not open WhatsApp. Please make sure WhatsApp is installed.', () => {});
    }
  };

  const handleDislikePost = async () => {
    if (!user) {
      showPopup('Login Required', 'You need to log in to dislike a post.', () => {});
      return;
    }

    try {
      const db = getFirestore();
      const postRef = doc(db, 'communityPosts', postId);
      const dislikesCollectionRef = collection(db, 'communityPosts', postId, 'dislikesCollection');
      const userDislikeRef = doc(dislikesCollectionRef, user.email);

      const userDislikeDoc = await getDoc(userDislikeRef);

      if (userDislikeDoc.exists()) {
        showPopup('Already Disliked', 'You have already disliked this post.', () => {});
        return;
      }

      await setDoc(userDislikeRef, { disliked: true });
      await updateDoc(postRef, {
        dislikes: increment(1),
      });

      // Refresh post details to update the UI
      fetchPostDetails();
    } catch (error) {
      console.error('Error disliking post:', error);
      showPopup('Error', 'Failed to dislike the post.', () => {});
    }
  };

  const handleSubmitComment = async () => {
    if ((!newComment.trim() && !selectedImage) || !user) {
      showPopup('Error', 'Please add a comment or image.', () => {});
      return;
    }
    setIsUploading(true);

    try {
      let imageUrl = null;
      if (selectedImage) {
        // Upload image to Firebase Storage
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const filename = `comment_${new Date().getTime()}_${Math.random().toString(36).substring(7)}`;
        
        const storage = getStorage();
        const storageRef = ref(storage, `comments/${postId}/${filename}`);
        
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const commentData = {
        text: newComment.trim(),
        userEmail: user.email,
        timestamp: new Date(),
        points: 0,
        imageUrl: imageUrl, 
      };

      await addDoc(collection(db, 'communityPosts', postId, 'comments'), commentData);

      await updateDoc(doc(db, 'communityPosts', postId), {
        commentsCount: increment(1),
      });

      setNewComment('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      showPopup('Error', 'Failed to post comment.', () => {});
    } finally {
      setIsUploading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      showPopup('Login Required', 'You need to log in to like a comment.', () => {});
      return;
    }

    try {
      const db = getFirestore();
      const commentRef = doc(db, 'communityPosts', postId, 'comments', commentId);
      const likesCollectionRef = collection(db, 'communityPosts', postId, 'comments', commentId, 'likesCollection');
      const userLikeRef = doc(likesCollectionRef, user.email);

      const userLikeDoc = await getDoc(userLikeRef);

      if (userLikeDoc.exists()) {
        showPopup('Already Liked', 'You have already liked this comment.', () => {});
        return;
      }

      await setDoc(userLikeRef, { liked: true });
      await updateDoc(commentRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error('Error liking comment:', error);
      showPopup('Error', 'Failed to like the comment.', () => {});
    }
  };

  const handleDislikeComment = async (commentId) => {
    if (!user) {
      showPopup('Login Required', 'You need to log in to dislike a comment.', () => {});
      return;
    }

    try {
      const db = getFirestore();
      const commentRef = doc(db, 'communityPosts', postId, 'comments', commentId);
      const dislikesCollectionRef = collection(db, 'communityPosts', postId, 'comments', commentId, 'dislikesCollection');
      const userDislikeRef = doc(dislikesCollectionRef, user.email);

      const userDislikeDoc = await getDoc(userDislikeRef);

      if (userDislikeDoc.exists()) {
        showPopup('Already Disliked', 'You have already disliked this comment.', () => {});
        return;
      }

      await setDoc(userDislikeRef, { disliked: true });
      await updateDoc(commentRef, {
        dislikes: increment(1),
      });
    } catch (error) {
      console.error('Error disliking comment:', error);
      showPopup('Error', 'Failed to dislike the comment.', () => {});
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp?.toDate()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleCommentOptions = (comment) => {
    setShowOptions(comment.id);
  };

  const handleCopyComment = async (comment) => {
    try {
      await Clipboard.setString(comment.text);
      showPopup('Success', 'Comment copied to clipboard.', () => {});
      setShowOptions(null);
    } catch (error) {
      console.error('Error copying comment:', error);
      showPopup('Error', 'Failed to copy comment.', () => {});
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditText(comment.text);
    setShowOptions(null);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'communityPosts', postId, 'comments', commentId));
      await updateDoc(doc(db, 'communityPosts', postId), {
        commentsCount: increment(-1),
      });
      setShowOptions(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      showPopup('Error', 'Failed to delete comment.', () => {});
    }
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) {
      showPopup('Comment cannot be empty.', () => {});
      return;
    }

    try {
      await updateDoc(doc(db, 'communityPosts', postId, 'comments', editingComment.id), {
        text: editText.trim(),
        edited: true,
        editedAt: new Date(),
      });
      setEditingComment(null);
      setEditText('');
      showPopup('Success', 'Comment updated successfully.', () => {});
    } catch (error) {
      console.error('Error updating comment:', error);
      showPopup('Error', 'Failed to update comment.', () => {});
    }
  };

  const OptionsModal = ({ comment }) => (
    <Modal
      transparent={true}
      visible={showOptions === comment.id}
      onRequestClose={() => setShowOptions(null)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        onPress={() => setShowOptions(null)}
      >
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => handleCopyComment(comment)}
          >
            <MaterialIcons name="content-copy" size={24} color="#666" />
            <Text style={styles.optionText}>Copy</Text>
          </TouchableOpacity>

          {user && comment.userEmail === user.email && (
            <>
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => handleEditComment(comment)}
              >
                <MaterialIcons name="edit" size={24} color="#666" />
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => {
                  showPopup(
                    'Delete Comment',
                    'Are you sure you want to delete this comment?',
                    () => handleDeleteComment(comment.id)
                  );
                }}
              >
                <MaterialIcons name="delete" size={24} color="#f44336" />
                <Text style={[styles.optionText, { color: '#f44336' }]}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <Image
            style={styles.userAvatar}
            source={{ uri: 'https://ui-avatars.com/api/?name=' + item.userEmail.split('@')[0] }}
          />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{item.userEmail.split('@')[0]}</Text>
            </View>
            <Text style={styles.timeAgo}>{getTimeAgo(item.timestamp)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleCommentOptions(item)}>
          <MaterialIcons name="more-vert" size={20} color="#666" />
        </TouchableOpacity>
        <OptionsModal comment={item} />
      </View>
  
      {editingComment?.id === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            multiline
            autoFocus
          />
          <View style={styles.editButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditingComment(null)}
            >
              <Text style={styles.editButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.editButton, styles.saveButton]}
              onPress={handleUpdateComment}
            >
              <Text style={[styles.editButtonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {item.text && <Text style={styles.commentText}>{item.text}</Text>}
          {item.imageUrl && (
            <View style={styles.commentImageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.commentImage}
                resizeMode="cover"
              />
            </View>
          )}
        </>
      )}
  
      <View style={styles.commentActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleLikeComment(item.id)}
        >
          <MaterialIcons name="thumb-up" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleDislikeComment(item.id)}
        >
          <MaterialIcons name="thumb-down" size={20} color="#666" />
          <Text style={styles.actionText}>{item.dislikes || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleDeletePost = async () => {
    try {
      // Delete all comments
      const commentsSnapshot = await getDocs(collection(db, 'communityPosts', postId, 'comments'));
      const deleteCommentPromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteCommentPromises);

      // Delete likes collection
      const likesSnapshot = await getDocs(collection(db, 'communityPosts', postId, 'likesCollection'));
      const deleteLikesPromises = likesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteLikesPromises);

      // Delete dislikes collection
      const dislikesSnapshot = await getDocs(collection(db, 'communityPosts', postId, 'dislikesCollection'));
      const deleteDislikesPromises = dislikesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteDislikesPromises);

      // Delete the post document
      await deleteDoc(doc(db, 'communityPosts', postId));

      // Navigate back to main screen
      navigation.navigate('MainCommunityScreen');

    } catch (error) {
      console.error('Error deleting post:', error);
      showPopup('Error', 'Failed to delete post.', () => {});
    }
  };

  const PostOptionsModal = () => (
    <Modal
      transparent={true}
      visible={showPostOptions}
      onRequestClose={() => setShowPostOptions(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        onPress={() => setShowPostOptions(false)}
      >
        <View style={styles.optionsContainer}>
          {user && post && user.email === post.userEmail && (
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                showPopup(
                  'Delete Post',
                  'Are you sure you want to delete this post? This action cannot be undone.',
                  handleDeletePost
                );
                setShowPostOptions(false);
              }}
            >
              <MaterialIcons name="delete" size={24} color="#f44336" />
              <Text style={[styles.optionText, { color: '#f44336'}]}>Delete Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (!post) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
            onPress={() => navigation.navigate('MainCommunityScreen')} 
            style={styles.backArrowContainer}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        {user && post && user.email === post.userEmail && (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowPostOptions(true)}
          >
            <MaterialIcons name="more-vert" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <PostOptionsModal />

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View>
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            <View style={styles.postContent}>
              <View style={styles.userInfo}>
                <Image
                  style={styles.userAvatar}
                  source={{ uri: 'https://ui-avatars.com/api/?name=' + post.userEmail.split('@')[0] }}
                />
                <View>
                  <Text style={styles.userName}>{post.userEmail.split('@')[0]} • {post.location || 'Sri Lanka'}</Text>
                  <Text style={styles.timeAgo}>{getTimeAgo(post.timestamp)}</Text>
                </View>
              </View>
              <Text style={styles.questionText}>{post.question}</Text>
              <Text style={styles.category}>{post.description}</Text>
              <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.stat} onPress={handleLikePost}>
                  <MaterialIcons name="thumb-up" size={20} color="#666" />
                  <Text style={styles.statText}>{post.likes || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stat} onPress={handleDislikePost}>
                  <MaterialIcons name="thumb-down" size={20} color="#666" />
                  <Text style={styles.statText}>{post.dislikes || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppShare}>
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {selectedImage && (
        <View style={additionalStyles.imagePreviewContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={additionalStyles.selectedImagePreview}
          />
          <TouchableOpacity
            style={additionalStyles.removeImageButton}
            onPress={() => setSelectedImage(null)}
          >
            <MaterialIcons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
      <TouchableOpacity 
          style={styles.cameraButton}
          onPress={handleCameraPress}
        >
          <MaterialIcons name="photo-camera" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Write your answer"
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSubmitComment}
          disabled={isUploading}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={isUploading ? "#999" : (newComment.trim() || selectedImage) ? "#2196F3" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      <CustomPopup
        isVisible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onConfirm={() => {
          popupOnConfirm();
          hidePopup();
        }}
        onCancel={hidePopup}
      />
    </SafeAreaView>
  );
};

export default PostDetailScreen;