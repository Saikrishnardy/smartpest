import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:lottie/lottie.dart';

// ADD: Import for navigation page
import 'pest_result_page.dart';

class PestDetectPage extends StatefulWidget {
  @override
  _PestDetectPageState createState() => _PestDetectPageState();
}

class _PestDetectPageState extends State<PestDetectPage> {
  File? _selectedImage;
  final ImagePicker _picker = ImagePicker();
  bool _isUploading = false;
  String? _detectionResult;

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _selectedImage = File(pickedFile.path);
        _detectionResult = null;
      });
    }
  }

  Future<void> _captureImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.camera);
    if (pickedFile != null) {
      setState(() {
        _selectedImage = File(pickedFile.path);
        _detectionResult = null;
      });
    }
  }

  Future<void> _uploadAndDetectPest() async {
    if (_selectedImage == null) return;

    setState(() {
      _isUploading = true;
    });

    try {
      await _sendToBackend(_selectedImage!);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Upload failed: $e")),
      );
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  Future<void> _sendToBackend(File imageFile) async {
    String backendUrl = "http://192.168.0.120:8000/api/predict/";

    try {
      var request = http.MultipartRequest('POST', Uri.parse(backendUrl));
      request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        String pestClass = data["class"];
        double confidence = data["confidence"];

        setState(() {
          _detectionResult = pestClass;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Pest detected: $_detectionResult")),
        );

        // ADD: Navigate to PestResultPage
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PestResultPage(pestName: pestClass),
          ),
        );
      } else {
        throw Exception("Error from backend: ${response.body}");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to send image: $e")),
      );
    }
  }

  void _retakeImage() {
    setState(() {
      _selectedImage = null;
      _detectionResult = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.green[700],
        title: const Text(
          "Pest Detection",
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/images/logo.jpg"),
            fit: BoxFit.cover,
          ),
        ),
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              children: [
                const SizedBox(height: 20),
                Image.asset("assets/images/logo.png", height: 150),
                const SizedBox(height: 20),
                const Text(
                  "Upload or capture an image of the pest for detection.\nEnsure it's clear and focused.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.black87),
                ),
                const SizedBox(height: 30),

                _selectedImage == null
                    ? Column(
                        children: [
                          _buildCenteredButton("Upload Image", Icons.upload, _pickImage),
                          const SizedBox(height: 20),
                          _buildCenteredButton("Capture Image", Icons.camera_alt, _captureImage),
                        ],
                      )
                    : Column(
                        children: [
                          Image.file(_selectedImage!, height: 250, fit: BoxFit.cover),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildOptionButton("Retake", Icons.refresh, _retakeImage, isSecondary: true),
                              const SizedBox(width: 10),
                              _isUploading
                                  ? SizedBox(
                                      height: 60,
                                      width: 60,
                                      child: Lottie.asset("assets/uploading.json"),
                                    )
                                  : _buildOptionButton("Upload", Icons.cloud_upload, _uploadAndDetectPest),
                            ],
                          ),
                          const SizedBox(height: 20),
                          if (_detectionResult != null)
                            Text(
                              "Detected Pest:\n$_detectionResult",
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.red,
                              ),
                            ),
                        ],
                      ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCenteredButton(String text, IconData icon, VoidCallback onPressed) {
    return FractionallySizedBox(
      widthFactor: 0.7,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.white),
        label: Text(text, style: const TextStyle(color: Colors.white)),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.green[700],
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  Widget _buildOptionButton(String text, IconData icon, VoidCallback onPressed, {bool isSecondary = false}) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: isSecondary ? Colors.black : Colors.white),
      label: Text(text, style: TextStyle(color: isSecondary ? Colors.black : Colors.white)),
      style: ElevatedButton.styleFrom(
        backgroundColor: isSecondary ? Colors.grey[300] : Colors.green[700],
        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
