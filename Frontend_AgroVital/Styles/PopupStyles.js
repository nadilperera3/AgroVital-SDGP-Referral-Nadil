import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  popupContainer: {
    backgroundColor: 'rgb(225, 245, 250)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0066FF',
    margin: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#0066FF',
    padding: 10,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'rgb(123, 123, 123)',
    padding: 10,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;