import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:smartpest/pages/description_page.dart';
import 'package:smartpest/pages/home_page.dart';
import 'package:smartpest/pages/admin_dashboard.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator()); // Loading state
          }

          if (snapshot.hasData) {
            return _checkUserType();
          } else {
            return DescriptionPage(); // If no user is logged in, show Description Page
          }
        },
      ),
    );
  }

  Widget _checkUserType() {
    User? user = FirebaseAuth.instance.currentUser;
    if (user == null) return DescriptionPage(); // If user is null, send to Description Page

    return FutureBuilder<DocumentSnapshot>(
      future: FirebaseFirestore.instance.collection("users").doc(user.uid).get(),
      builder: (context, snapshot) {
        if (!snapshot.hasData || !snapshot.data!.exists) {
          return DescriptionPage(); // If user record not found, send to Description Page
        }

         var userData = snapshot.data!;
        String userType = userData["userType"] ?? "user"; // Default to "user" if null

        print("Fetched userType from Firestore: $userType"); // Debugging line

        if (userType == "admin") {
          print("Redirecting to Admin Dashboard");
          return AdminDashboard();  
        } else {
          print("Redirecting to Home Page");
          return HomePage();
        }
      },
    );
  }
}
