const firebaseService = {
  saveSoilData: async () => true,
  getSoilHistory: async () => [],
  getNutrientRecommendations: async () => ({
    recommendation: 'No recommendation available yet',
    fertilizers: [],
    crops: [],
  }),
};

export default firebaseService;