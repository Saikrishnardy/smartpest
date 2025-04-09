import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ManagePesticidesPage extends StatefulWidget {
  @override
  _ManagePesticidesPageState createState() => _ManagePesticidesPageState();
}

class _ManagePesticidesPageState extends State<ManagePesticidesPage> {
  final TextEditingController _pestNameController = TextEditingController();
  final TextEditingController _pesticideNameController = TextEditingController();
  final TextEditingController _usageController = TextEditingController();

  void _addOrUpdatePesticide({String? docId}) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(docId == null ? "Add Pesticide" : "Edit Pesticide"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _pestNameController,
                decoration: InputDecoration(labelText: "Pest Name"),
              ),
              TextField(
                controller: _pesticideNameController,
                decoration: InputDecoration(labelText: "Pesticide Name"),
              ),
              TextField(
                controller: _usageController,
                decoration: InputDecoration(labelText: "Usage Instructions"),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () async {
                if (_pestNameController.text.isEmpty ||
                    _pesticideNameController.text.isEmpty ||
                    _usageController.text.isEmpty) {
                  return;
                }

                if (docId == null) {
                  // Add new pesticide
                  await FirebaseFirestore.instance.collection("pesticides").add({
                    "pestName": _pestNameController.text.trim(),
                    "pesticide": _pesticideNameController.text.trim(),
                    "usage": _usageController.text.trim(),
                  });
                } else {
                  // Update existing pesticide
                  await FirebaseFirestore.instance.collection("pesticides").doc(docId).update({
                    "pestName": _pestNameController.text.trim(),
                    "pesticide": _pesticideNameController.text.trim(),
                    "usage": _usageController.text.trim(),
                  });
                }

                _pestNameController.clear();
                _pesticideNameController.clear();
                _usageController.clear();
                Navigator.pop(context);
              },
              child: Text(docId == null ? "Add" : "Update"),
            ),
          ],
        );
      },
    );
  }

  void _deletePesticide(String docId) {
    FirebaseFirestore.instance.collection("pesticides").doc(docId).delete();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Manage Pesticides"),
        backgroundColor: Colors.green[700],
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              await FirebaseAuth.instance.signOut();
              Navigator.pushReplacementNamed(context, "/login");
            },
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection("pesticides").snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }

          var pesticides = snapshot.data!.docs;

          if (pesticides.isEmpty) {
            return Center(
              child: Text("No pesticides available", style: TextStyle(fontSize: 18)),
            );
          }

          return ListView.builder(
            itemCount: pesticides.length,
            itemBuilder: (context, index) {
              var pesticide = pesticides[index];
              String pestName = pesticide["pestName"];
              String pesticideName = pesticide["pesticide"];
              String usage = pesticide["usage"];

              return Card(
                margin: EdgeInsets.all(10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                elevation: 5,
                child: ListTile(
                  title: Text("$pestName - $pesticideName", style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text("Usage: $usage"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: Icon(Icons.edit, color: Colors.blue),
                        onPressed: () {
                          _pestNameController.text = pestName;
                          _pesticideNameController.text = pesticideName;
                          _usageController.text = usage;
                          _addOrUpdatePesticide(docId: pesticide.id);
                        },
                      ),
                      IconButton(
                        icon: Icon(Icons.delete, color: Colors.red),
                        onPressed: () => _deletePesticide(pesticide.id),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.green[600],
        onPressed: () => _addOrUpdatePesticide(),
        child: Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
