# SmartPest - AI-Powered Pest Detection System

A comprehensive pest detection system with a React frontend and Django backend powered by AI/ML.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd smartpest_backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Start the Django server:**
   ```bash
   python start_server.py
   ```
   
   Or alternatively:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

   The backend will be available at: http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend-react
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at: http://localhost:5173

## 🔗 API Endpoints

### Pest Detection
- **POST** `/api/predict/` - Upload an image for pest detection
  - Body: FormData with 'image' field
  - Returns: `{"class": "pest_name", "confidence": 0.95}`

### Pest Information
- **GET** `/api/pest-info/<pest_name>/` - Get detailed pest information
  - Returns: Pest details including description, damage, control methods, and pesticides

### Report Management
- **POST** `/api/save-report/` - Save a pest detection report
  - Body: JSON with pest detection data
  - Returns: Success confirmation with report ID

## 🏗️ Project Structure

```
smartpest-project/
├── frontend-react/          # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── services/       # API service layer
│   └── package.json
├── smartpest_backend/       # Django backend application
│   ├── api/                # API views and models
│   ├── models/             # ML model files
│   └── manage.py
└── README.md
```

## 🎯 Features

### Frontend Features
- **Modern UI/UX**: Clean, responsive design with Material Design principles
- **File Upload**: Drag-and-drop image upload with preview
- **Real-time Detection**: Instant pest detection with confidence scores
- **Detailed Results**: Comprehensive pest information and recommendations
- **Report Management**: Save and manage detection reports

### Backend Features
- **AI/ML Integration**: EfficientNet-B5 model for accurate pest detection
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Error Handling**: Robust error handling and validation
- **File Processing**: Secure image processing with temporary file cleanup

## 🔧 Configuration

### Backend Configuration
- **CORS Settings**: Configured for React development server (localhost:5173)
- **Model Path**: Update model path in `api/inference.py` if needed
- **Database**: SQLite for development (can be changed to PostgreSQL for production)

### Frontend Configuration
- **API Base URL**: Configured to `http://localhost:8000/api` in `src/services/api.js`
- **Development Server**: Vite dev server on port 5173

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure Django server is running on port 8000
   - Check CORS settings in `settings.py`
   - Verify API endpoints are accessible

2. **Model Loading Error**
   - Ensure model files are in the correct location
   - Check model path in `api/inference.py`
   - Verify PyTorch and timm are installed

3. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Development Tips

1. **Backend Development**
   - Use Django's built-in admin interface for data management
   - Enable DEBUG mode for detailed error messages
   - Use Django REST framework's browsable API for testing

2. **Frontend Development**
   - Use React Developer Tools for debugging
   - Check browser console for API errors
   - Use Network tab to monitor API calls

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository. 