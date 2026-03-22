import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlays: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(205, 228, 244, 0.2)",
  },
  container: {
    backgroundColor: "rgba(230, 243, 247, 0.8)",
    padding: 20,
    width: "85%",
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(2, 2, 2, 1)",
  },
  toggleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  activeToggle: {
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderColor:'black',
    borderWidth: 1,
  },
  inactiveToggle: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  toggleTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  toggleTextInactive: {
    color: "black",
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 1,
    marginBottom: 5,
  },
  inputPassword: {
    flex: 1,
    fontSize: 14,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: '5%',
    marginLeft: "48%",
    color: "#555",
  },
  loginButton: {
    backgroundColor: "blue",
    width: "50%",
    padding: 9,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
    borderColor:'black',
    borderWidth: 1,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  orText: {
    marginVertical: 10,
    color: "#555",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
  socialButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
});

export default styles;