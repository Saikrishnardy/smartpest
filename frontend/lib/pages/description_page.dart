import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'login_page.dart';
import 'background_container.dart'; // Adjust the path if needed

class DescriptionPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5), // Light background
      appBar: AppBar(
        backgroundColor: Colors.green.shade700,
        title: const Text("SmartPest", style: TextStyle(color: Colors.white)),
        centerTitle: true,
        actions: [
          StreamBuilder<User?>(
            stream: FirebaseAuth.instance.authStateChanges(),
            builder: (context, snapshot) {
              final user = snapshot.data;
              return TextButton(
                onPressed: () async {
                  if (user != null) {
                    await FirebaseAuth.instance.signOut();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Logout Successful")),
                    );
                  }
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => LoginPage()),
                  );
                },
                child: Text(
                  user == null ? "Login" : "Logout",
                  style: const TextStyle(color: Colors.white),
                ),
              );
            },
          ),
        ],
      ),
      body: BackgroundContainer(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 30),
            child: Column(
              children: [
                // App Banner or Illustration
                Image.asset(
                  'assets/images/logo.png', // Add your image asset here
                  height: 180,
                ),

                const SizedBox(height: 20),

                const Text(
                  "Welcome to SmartPest",
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),

                const SizedBox(height: 16),

                const Text(
                  "SmartPest is your intelligent companion in modern agriculture. "
                  "With advanced deep learning and computer vision, it helps farmers "
                  "accurately identify pests from images and suggests the most effective, "
                  "region-specific pesticides.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.black87),
                ),

                const SizedBox(height: 12),

                const Text(
                  "Our goal is to empower farmers with timely information, minimize crop losses, "
                  "and reduce unnecessary pesticide use through AI-powered precision farming.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.black87),
                ),

                const SizedBox(height: 12),

                const Text(
                  "Features:\n"
                  "- Image-based pest detection\n"
                  "- Pesticide recommendation with dosage\n"
                  "- Safety and precaution tips\n"
                  "- Crop-wise pest tracking\n"
                  "- User-friendly mobile interface",
                  textAlign: TextAlign.left,
                  style: TextStyle(fontSize: 15, color: Colors.black87),
                ),

                const SizedBox(height: 30),

                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => LoginPage()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade700,
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    textStyle: const TextStyle(fontSize: 18),
                  ),
                  icon: const Icon(Icons.arrow_forward),
                  label: const Text("Get Started"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
