import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:smartpest/pages/admin_dashboard.dart';
import 'package:smartpest/pages/auth_page.dart';
import 'package:smartpest/pages/feedback_page.dart';
import 'package:smartpest/pages/forgot_password.dart';
import 'package:smartpest/pages/login_page.dart';
import 'package:smartpest/pages/manage_feedback_page.dart';
import 'package:smartpest/pages/manage_pesticides_page.dart';
import 'package:smartpest/pages/pest_detect_page.dart';
import 'package:smartpest/pages/pest_reports_page.dart';
import 'package:smartpest/pages/signup.dart';
import 'package:smartpest/pages/home_page.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:smartpest/pages/user_management_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(); // Initialize Firebase

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SmartPest',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      home: SplashScreen(), 
      routes: {
        "/auth": (context) => AuthPage(),
        "/login": (context) => LoginPage(),
        "/signup": (context) => SignupPage(),
        "/home": (context) => HomePage(),
        "/forgot-password": (context) => ForgotPasswordPage(),
        "/admin-dashboard": (context) => AdminDashboard(),
        "/pest-reports": (context) => PestReportsPage(),
        "/user-management": (context) => UserManagementPage(),
        "/manage-feedback": (context) => ManageFeedbackPage(),
        "/feedback": (context) => FeedbackPage(),
        "/manage-pesticides": (context) => ManagePesticidesPage(),
        "/pest-detect": (context) => PestDetectPage(),
      },
    );
  }
}

class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AnimatedSplashScreen(
      duration: 2000, // Animation duration (2 seconds)
      splash: SingleChildScrollView( // Prevents overflow
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset("assets/images/logo.png", height: 100), // Your logo
            const SizedBox(height: 20),
            const Text(
              "SmartPest",
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.bold,
                color: Colors.green,
              ),
            ),
          ],
        ),
      ),
      nextScreen: AuthPage(), 
      splashTransition: SplashTransition.fadeTransition, 
      backgroundColor: Color.fromRGBO(255, 255, 255, 1), 
    );
  }
}
