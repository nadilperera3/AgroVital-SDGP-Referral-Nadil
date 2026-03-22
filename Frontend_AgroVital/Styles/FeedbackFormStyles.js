import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(238, 248, 229)',
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  input: {
    height: 150,
    backgroundColor: 'rgb(238, 248, 229)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    fontSize: 16,
    color: '#333333',
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCounter: {
    textAlign: 'right',
    color: '#777777',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: 'rgb(0, 60, 22)',
    borderRadius: 100,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default styles;
