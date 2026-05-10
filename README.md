#  Napaty | AI-Powered Smart Agriculture Platform

Napaty is a smart agriculture web application designed to help farmers and agricultural users make better decisions using Artificial Intelligence.

The platform provides plant disease diagnosis, crop recommendation, soil analysis support, and agricultural consultation with experts through a modern, simple, and user-friendly interface.

---

##  Project Overview

Napaty aims to support the agriculture sector by combining web development with AI-powered services.

The system allows users to:

- Upload plant images to detect diseases.
- Get crop recommendations based on soil and environmental data.
- Analyze soil-related information.
- Communicate with agricultural experts.
- Use the platform in Arabic and English.

Arabic is the main language of the system, with RTL layout support.

---

##  Main Features

## 1. Plant Disease Diagnosis

Users can upload an image of a plant leaf, and the AI model analyzes the image to detect possible plant diseases.

### Features

- Upload plant images.
- Send images to an external AI prediction API.
- Display the predicted disease.
- Show confidence score when available.
- Support more than one AI model version.
- Display top predictions for advanced models.
- Support Arabic and English disease information.

---

## 2.  Crop Recommendation System

The crop recommendation system suggests suitable crops based on agricultural data.

The system includes two modes:

---

### Basic Mode

This mode is designed for normal farmers who may not know advanced soil values.

Inputs may include:

- Governorate
- Soil type
- Season

The system uses these inputs to estimate suitable environmental values and recommend crops.

---

### Advanced Mode

This mode is designed for users who have accurate soil and environment data.

Inputs include:

- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- Rainfall
- pH value

The system uses a trained Machine Learning model to recommend the most suitable crop.

---

## 3.  Soil Analysis

The soil analysis feature helps users understand soil conditions and receive useful agricultural notes.

It may include:

- Soil type
- pH value
- Nutrient levels
- Crop suitability notes
- Recommendations for soil improvement

---

## 4.  Agricultural Consultation System

Napaty includes a consultation system that connects farmers with agricultural experts.

### Users can:

- Browse available experts.
- Send consultation requests.
- Track request status.
- Chat with experts after request approval.

### Experts can:

- View incoming consultation requests.
- Accept or reject requests.
- Communicate with users through chat.

---

## 5.  Notifications

The platform includes notification logic for consultation updates and chat messages.

Examples:

- New consultation request.
- Request accepted.
- Request rejected.
- New message received.
- Unread message indicators.

---

## 6.  Multi-language Support

Napaty supports:

- Arabic
- English

Language behavior:

- Arabic interface uses RTL direction.
- English interface uses LTR direction.
- Language preference can be saved locally.
- UI content changes dynamically based on the selected language.

---

##  Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap 5
- Axios
- React Router

### Backend

- Django
- Django REST Framework
- Simple JWT Authentication
- Django CORS Headers
- WhiteNoise
- SQLite / PostgreSQL

### AI / Machine Learning

- Plant Disease Classification Model
- Crop Recommendation Machine Learning Model
- Random Forest
- Image Classification API
- Hugging Face Spaces

### Deployment

- Frontend: Vercel
- Backend: PythonAnywhere
- AI APIs: Hugging Face Spaces

---

##  AI Services

## Plant Disease AI

The disease diagnosis feature sends uploaded plant images to an external AI API.

The AI model processes the image and returns the prediction result.

Example endpoint:

```txt
/predict
