import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Constants
IMAGE_SIZE = 256  # Same as in your training code
BINARY_THRESHOLD = 0.5
DISEASE_THRESHOLD = 0.7

# Disease classes for display names mapping - match these to your trained model
DISEASE_CLASSES = ['algal_spot', 'brown_blight', 'gray_blight', 'healthy', 'helopeltis', 'red_spot']
DISEASE_DISPLAY_NAMES = {
    'algal_spot': 'Algal_Leaf',
    'brown_blight': 'Brown_Blight',
    'gray_blight': 'Gray_BLight',
    'healthy': 'Healthy_Leaf',
    'helopeltis': 'Bird_Eye_Spot',
    'red_spot': 'Anthracnose'
}

# Global model variables
binary_model = None
disease_model = None

# Load models
def load_models():
    global binary_model, disease_model
    
    try:
        # Load the binary classifier model
        binary_model_path = os.environ.get('BINARY_MODEL_PATH', 'models/binary_model.h5')
        logger.info(f"Loading binary model from: {binary_model_path}")
        if not os.path.exists(binary_model_path):
            raise FileNotFoundError(f"Binary model file not found: {binary_model_path}")
        binary_model = tf.keras.models.load_model(binary_model_path)
        logger.info("Binary model loaded successfully")
        
        # Load the disease classifier model
        disease_model_path = os.environ.get('DISEASE_MODEL_PATH', 'models/disease_model.h5')
        logger.info(f"Loading disease model from: {disease_model_path}")
        if not os.path.exists(disease_model_path):
            raise FileNotFoundError(f"Disease model file not found: {disease_model_path}")
        disease_model = tf.keras.models.load_model(disease_model_path)
        logger.info("Disease model loaded successfully")
        
        return True
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        return False

# Preprocess image for model input
def preprocess_image(img_path):
    try:
        img = Image.open(img_path)
        # Resize to match training size
        img = img.resize((IMAGE_SIZE, IMAGE_SIZE))
        # Convert to numpy array
        img_array = np.array(img)
        # Normalize pixel values
        img_array = img_array / 255.0
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

# Production mode prediction functions
def predict_binary(img_array):
    """Use the binary model to predict if image contains a tea leaf"""
    try:
        prediction = binary_model.predict(img_array)[0][0]
        is_tea = prediction > BINARY_THRESHOLD
        confidence = float(prediction if is_tea else 1 - prediction) * 100
        return is_tea, confidence
    except Exception as e:
        logger.error(f"Error in binary prediction: {str(e)}")
        raise

def predict_disease(img_array):
    """Use the disease model to predict the specific disease"""
    try:
        prediction = disease_model.predict(img_array)[0]
        predicted_index = np.argmax(prediction)
        confidence = float(prediction[predicted_index]) * 100
        disease_name = DISEASE_CLASSES[predicted_index]
        return disease_name, confidence
    except Exception as e:
        logger.error(f"Error in disease prediction: {str(e)}")
        raise

# API endpoint for disease prediction
@app.route('/api/predict-disease', methods=['POST'])
def predict_disease_api():
    if 'image' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No image file provided'
        }), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No image selected'
        }), 400
    
    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        logger.info(f"Image saved to {filepath}")
        
        # Ensure models are loaded
        if binary_model is None or disease_model is None:
            if not load_models():
                return jsonify({
                    'success': False,
                    'error': 'Failed to load ML models'
                }), 500
        
        # Preprocess the image
        img_array = preprocess_image(filepath)
        
        # Step 1: Check if it's a tea leaf using binary classifier
        is_tea, tea_confidence = predict_binary(img_array)
        
        logger.info(f"Binary classification result: {'Tea leaf' if is_tea else 'Not a tea leaf'} ({tea_confidence:.2f}% confidence)")
        
        # If not a tea leaf, return early
        if not is_tea:
            return jsonify({
                'success': True,
                'isTea': False,
                'teaConfidence': round(tea_confidence, 2),
                'message': 'The image does not appear to be a tea leaf.'
            })
        
        # Step 2: For tea leaves, identify the disease
        disease_name, confidence = predict_disease(img_array)
        display_disease_name = DISEASE_DISPLAY_NAMES.get(disease_name, disease_name)
        
        logger.info(f"Disease classification result: {display_disease_name} with {confidence:.2f}% confidence")
        
        # For production, you would handle image storage here (e.g., Firebase)
        image_url = None
        if disease_name != 'healthy':
            # Implement your image storage logic here if needed
            pass
        
        return jsonify({
            'success': True,
            'isTea': True,
            'teaConfidence': round(tea_confidence, 2),
            'diagnosis': {
                'diseaseName': display_disease_name,
                'confidence': round(confidence, 2),
                'imageUrl': image_url or filepath  # Use local path if no upload
            }
        })
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Error processing image: {str(e)}'
        }), 500
    finally:
        # Clean up the uploaded file
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except Exception as e:
            logger.error(f"Error removing temporary file: {str(e)}")

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'mode': 'production',
        'modelsLoaded': (binary_model is not None and disease_model is not None)
    })

if __name__ == '__main__':
    # Get port from environment or use default
    port = 5001
    
    # Load models
    load_models()
    
    logger.info(f"Starting Flask API in PRODUCTION mode on port {port}")
    
    # Start the server
    app.run(host='0.0.0.0', port=port, debug=False)