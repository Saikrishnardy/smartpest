import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:smartpest/pages/feedback_page.dart';
import 'package:smartpest/pages/pest_detect_page.dart';
import 'description_page.dart';
import 'background_container.dart';
// Add this import once FeedbackPage is created
// import 'feedback_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String userName = "User";

  @override
  void initState() {
    super.initState();
    _fetchUserName();
  }

  void _fetchUserName() async {
    User? user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      DocumentSnapshot userDoc = await FirebaseFirestore.instance
          .collection("users")
          .doc(user.uid)
          .get();
      if (userDoc.exists) {
        setState(() {
          userName = userDoc["name"] ?? "User";
        });
      }
    }
  }

  void _logout(BuildContext context) async {
    await FirebaseAuth.instance.signOut();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => DescriptionPage()),
    );
  }

  void _navigateToFeedback(BuildContext context) {
    // Replace this with your actual FeedbackPage route
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Navigate to Feedback Page")),
    );
    // Example:
    // Navigator.push(context, MaterialPageRoute(builder: (context) => FeedbackPage()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.green[800],
        title: const Text(
          "SmartPest - Home",
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        actions: [
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              icon: Padding(
                padding: const EdgeInsets.only(right: 10),
                child: Row(
                  children: [
                    const Icon(Icons.person, color: Colors.black),
                    const SizedBox(width: 5),
                    Text(
                      userName,
                      style: const TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                          fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              items: const [
                DropdownMenuItem(value: "feedback", child: Text("Feedback")),
                DropdownMenuItem(value: "logout", child: Text("Logout")),
              ],
              onChanged: (value) {
                if (value == "logout") {
                  _logout(context);
                } else if (value == "feedback") {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => FeedbackPage()));
                }
              },
            ),
          ),
        ],
      ),
      body: BackgroundContainer(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),

              // 🌿 LOGO
              Image.asset(
                'assets/images/logo.png',
                height: 120,
              ),
              const SizedBox(height: 20),

              const Text(
                "Welcome to SmartPest! 🌿",
                style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 18, 15, 15)),
              ),
              const SizedBox(height: 10),
              const Text(
                "AI-powered Pest Detection & Pesticide Recommendation",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.black87),
              ),
              const SizedBox(height: 30),

              const Text(
                "How to Use SmartPest:",
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.green),
              ),
              const SizedBox(height: 10),
              _buildStep("📷 Upload a clear image of the pest."),
              _buildStep("🤖 Our AI will identify the pest."),
              _buildStep("💊 Get pesticide suggestions with dosage."),
              _buildStep("⚠️ Follow all safety precautions."),
              const SizedBox(height: 30),

              _buildCustomButton(
                context,
                "Get Started",
                Icons.camera_alt_outlined,
                () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => PestDetectPage()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 16, color: Colors.black87),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomButton(BuildContext context, String text, IconData icon,
      VoidCallback onPressed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.white),
        label: Text(
          text,
          style: const TextStyle(
              color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.green[800],
          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }
}
