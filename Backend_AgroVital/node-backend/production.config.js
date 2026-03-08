// /mnt/c/Users/ASUS/Desktop/Ml done/Backend_AgroVital/node-backend/production.config.js
module.exports = {
    port: process.env.PORT || 5000,
    mlApiUrl: process.env.ML_API_URL || 'https://agrovital-sdgp-l5-group-project-flask-api.onrender.com',
    debug: false,
    logLevel: 'info',
    uploadLimit: '10mb'
  };
