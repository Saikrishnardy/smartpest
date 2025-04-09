import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ManageFeedbackPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Manage Feedback"),
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
        stream: FirebaseFirestore.instance.collection("feedback").snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }

          var feedbacks = snapshot.data!.docs;

          if (feedbacks.isEmpty) {
            return Center(
              child: Text("No feedback available", style: TextStyle(fontSize: 18)),
            );
          }

          return ListView.builder(
            itemCount: feedbacks.length,
            itemBuilder: (context, index) {
              var feedback = feedbacks[index];
              String userName = feedback["userName"];
              String userFeedback = feedback["feedback"];

              return Card(
                margin: EdgeInsets.all(10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                elevation: 5,
                child: ListTile(
                  title: Text(userName, style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(userFeedback),
                  trailing: IconButton(
                    icon: Icon(Icons.delete, color: Colors.red),
                    onPressed: () => _deleteFeedback(feedback.id),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _deleteFeedback(String feedbackId) {
    FirebaseFirestore.instance.collection("feedback").doc(feedbackId).delete();
  }
}
