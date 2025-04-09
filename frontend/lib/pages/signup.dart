import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:smartpest/components/my_button.dart';
import 'package:smartpest/components/my_textfield.dart';

class SignupPage extends StatefulWidget {
  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _landExtentController = TextEditingController();
  final TextEditingController _landTypeController = TextEditingController();
  final TextEditingController _cropsGrownController = TextEditingController();

  String _userType = 'user';
  bool _isLoading = false;

  void _signUp() async {
    if (_nameController.text.isEmpty ||
        _phoneController.text.isEmpty ||
        _passwordController.text.isEmpty ||
        _landExtentController.text.isEmpty ||
        _landTypeController.text.isEmpty ||
        _cropsGrownController.text.isEmpty ||
        (_userType == "admin" && _emailController.text.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill in all required fields")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      UserCredential userCredential = await _auth.createUserWithEmailAndPassword(
        email: _userType == "admin"
            ? _emailController.text.trim()
            : "${_phoneController.text}@smartpest.com",
        password: _passwordController.text.trim(),
      );

      await _firestore.collection("users").doc(userCredential.user!.uid).set({
        "name": _nameController.text.trim(),
        "phone": _phoneController.text.trim(),
        "email": _userType == "admin" ? _emailController.text.trim() : "",
        "userType": _userType,
        "landExtent": double.parse(_landExtentController.text.trim()),
        "landType": _landTypeController.text.trim(),
        "cropsGrown": _cropsGrownController.text.trim(),
        "createdAt": FieldValue.serverTimestamp(),
      });

      Navigator.pushReplacementNamed(context, "/home");
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: ${e.toString()}")),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 81, 188, 81),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
          child: Column(
            children: [
              const SizedBox(height: 20),
              ClipOval(
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 100,
                  height: 100,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                "Create Your SmartPest Account",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 25),

              // All Input Fields on Colored Background
              MyTextField(controller: _nameController, hintText: 'Name', obscureText: false),
              const SizedBox(height: 10),

              MyTextField(
                controller: _phoneController,
                hintText: 'Phone Number',
                obscureText: false,
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 10),

              // DropdownButtonFormField<String>(
              //   value: _userType,
              //   decoration: InputDecoration(
              //     filled: true,
              //     fillColor: Colors.white,
              //     hintText: 'Select User Type',
              //     border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              //   ),
              //   items: ['user', 'admin']
              //       .map((type) => DropdownMenuItem(
              //             value: type,
              //             child: Text(type[0].toUpperCase() + type.substring(1)),
              //           ))
              //       .toList(),
              //   onChanged: (val) {
              //     setState(() {
              //       _userType = val!;
              //     });
              //   },
              // ),
              // const SizedBox(height: 10),

              if (_userType == "admin")
                MyTextField(
                  controller: _emailController,
                  hintText: 'Email (Admin only)',
                  obscureText: false,
                  keyboardType: TextInputType.emailAddress,
                ),
              if (_userType == "admin") const SizedBox(height: 10),

              MyTextField(controller: _passwordController, hintText: 'Password', obscureText: true),
              const SizedBox(height: 10),
              MyTextField(
                  controller: _landExtentController,
                  hintText: 'Land Extent',
                  obscureText: false,
                  keyboardType: TextInputType.number),
              const SizedBox(height: 10),
              MyTextField(controller: _landTypeController, hintText: 'Land Type', obscureText: false),
              const SizedBox(height: 10),
              MyTextField(controller: _cropsGrownController, hintText: 'Crops Grown', obscureText: false),
              const SizedBox(height: 20),

              _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : MyButton(onTap: _signUp, text: "Sign Up"),

              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Already have an account?", style: TextStyle(color: Colors.white70)),
                  const SizedBox(width: 5),
                  GestureDetector(
                    onTap: () => Navigator.pushReplacementNamed(context, "/login"),
                    child: const Text("Login now", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  )
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}
