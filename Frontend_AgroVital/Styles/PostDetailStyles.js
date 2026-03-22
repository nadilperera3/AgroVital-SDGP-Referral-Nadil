import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlays: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(238, 253, 240, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: "100%",
    backgroundColor: "#C2E7B0",
    padding: 15,
    elevation: 3,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 14,
    color: '#333',
    marginTop: '6%',
    marginLeft: '18%',
  },
    backArrowContainer: {
    position: 'absolute',
    top: 40,
    left: 22,
    zIndex: 10,
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000', 
  },
  backButton: {
    fontSize: 24, 
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center', 
    lineHeight: 24, 
  },
  menuButton: {
    padding: 8,
    alignSelf: 'flex-end',
    marginTop: '7%',
    marginLeft: '55%',

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: ' rgb(236, 239, 236)',
    borderRadius: 8,
    padding: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  postContent: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 14,
    color: '#666',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  translateButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  translateText: {
    fontSize: 14,
    color: '#2196F3',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  whatsappButton: {
    marginLeft: 'auto',
  },
  commentContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 12,
    color: '#FFA000',
    marginLeft: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#C2E7B0',
  },
  cameraButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgb(243, 251, 235)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: 'rgb(0, 60, 22)',
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  commentContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  commentImageContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },

  commentImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },

  actionText: {
    marginLeft: 5,
    color: '#666',
  },

  commentActions: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '80%',
    maxWidth: 300,
    
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  editContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  editButtonText: {
    color: '#666',
  },
  saveButtonText: {
    color: 'white',
  },
  editedText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

const additionalStyles =StyleSheet.create( {
  commentImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  selectedImagePreview: {
    width: '100%',
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default styles;
export { additionalStyles };