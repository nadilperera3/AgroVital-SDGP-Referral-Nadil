import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(238, 253, 240, 0.4)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#C2E7B0",
    padding: 20,
    elevation: 3,
    marginBottom: 10,
    zIndex: 10,
    position: "relative",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: "18%",
    color: "#333",
    marginTop: "8%",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },

  scrollContent: {
    flex: 1,
  },

  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },

  overlays: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(238, 253, 240, 0.82)",
  },

  backArrowContainer: {
    position: "absolute",
    top: 40,
    left: 22,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },

  backButton: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },

  authStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  authStatusText: {
    marginLeft: 8,
    color: "#333",
  },

  connectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  connectedText: {
    marginLeft: 8,
    color: "#333",
  },

  dataCard: {
    backgroundColor: "rgb(238, 248, 229)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1.8,
    borderColor: "rgb(0, 60, 22)",
  },

  dataHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  dataTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },

  dataContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dataValue: {
    fontSize: 24,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  statusIndicator: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#333",
  },

  chartCard: {
    backgroundColor: "rgb(238, 248, 229)",
    borderRadius: 15,
    padding: 15,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1.8,
    borderColor: "rgb(0, 60, 22)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },

  chartContent: {
    alignItems: "center",
  },

  chartPlaceholder: {
    height: 220,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#888",
    fontSize: 16,
  },

  recommendationCard: {
    backgroundColor: "rgb(238, 248, 229)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 24,
    borderWidth: 1.8,
    borderColor: "rgb(0, 60, 22)",
  },

  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  recommendationSection: {
    marginBottom: 12,
  },

  recommendationSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },

  recommendationText: {
    color: "#333",
  },

  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  recommendationItemText: {
    marginLeft: 8,
    color: "#333",
  },

  actionButton: {
    backgroundColor: "#005000",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },

  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  actionButtonDisabled: {
    opacity: 0.5,
  },

  bottomNavBar: {
    flexDirection: "row",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: "#C2E7B0",
  },

  navItem: {
    alignItems: "center",
    padding: 8,
  },

  activeNavItem: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    paddingHorizontal: 20,
  },

  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },

  activeNavText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default styles;