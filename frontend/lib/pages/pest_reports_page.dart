import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class PestReportsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Pest Reports"),
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
        stream: FirebaseFirestore.instance.collection("pest_reports").snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }

          var reports = snapshot.data!.docs;

          if (reports.isEmpty) {
            return Center(
              child: Text("No pest reports available", style: TextStyle(fontSize: 18)),
            );
          }

          return ListView.builder(
            itemCount: reports.length,
            itemBuilder: (context, index) {
              var report = reports[index];
              String pestName = report["pestName"];
              String userName = report["userName"];
              String imageUrl = report["imageUrl"];
              String status = report["status"];

              return Card(
                margin: EdgeInsets.all(10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                elevation: 5,
                child: ListTile(
                  leading: Image.network(imageUrl, width: 60, height: 60, fit: BoxFit.cover),
                  title: Text("$pestName detected", style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text("Reported by: $userName"),
                  trailing: status == "pending"
                      ? Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: Icon(Icons.check_circle, color: Colors.green),
                              onPressed: () => _updateReportStatus(report.id, "approved"),
                            ),
                            IconButton(
                              icon: Icon(Icons.cancel, color: Colors.red),
                              onPressed: () => _updateReportStatus(report.id, "rejected"),
                            ),
                          ],
                        )
                      : Text(status.toUpperCase(), style: TextStyle(color: status == "approved" ? Colors.green : Colors.red)),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _updateReportStatus(String reportId, String newStatus) {
    FirebaseFirestore.instance.collection("pest_reports").doc(reportId).update({
      "status": newStatus,
    });
  }
}
