import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class PestResultPage extends StatefulWidget {
  final String pestName;

  const PestResultPage({required this.pestName});

  @override
  _PestResultPageState createState() => _PestResultPageState();
}

class _PestResultPageState extends State<PestResultPage> {
  Map<String, dynamic>? pestDescription;
  List<dynamic>? pesticideList;

  @override
  void initState() {
    super.initState();
    loadPestData();
  }

  Future<void> loadPestData() async {
    final descString = await rootBundle.loadString('assets/pest_description.json');
    final pestDescJson = json.decode(descString);

    final pestInfo = (pestDescJson as List).firstWhere(
      (item) => item["pest_name"] == widget.pestName,
      orElse: () => null,
    );

    final pesticideString = await rootBundle.loadString('assets/pesticides_info.json');
    final pesticideJson = json.decode(pesticideString);

    final pesticideInfo = (pesticideJson as List).firstWhere(
      (item) => item["pest_name"] == widget.pestName,
      orElse: () => null,
    );

    setState(() {
      pestDescription = pestInfo;
      pesticideList = pesticideInfo != null ? pesticideInfo["pesticides"] : [];
    });
  }

  Future<void> generatePDF() async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text('Pest Name: ${widget.pestName}', style: pw.TextStyle(fontSize: 20, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 10),
              pw.Text('Description: ${pestDescription?["description"] ?? "N/A"}'),
              pw.SizedBox(height: 20),
              pw.Text('Pesticide Recommendations:', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
              ...?pesticideList?.map((pest) => pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('- Name: ${pest["name"]}'),
                      pw.Text('  Dosage: ${pest["dosage"]}'),
                      pw.Text('  Precautions: ${pest["safety_precautions"]}'),
                      pw.SizedBox(height: 10),
                    ],
                  )),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(onLayout: (format) => pdf.save());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Pest Information"),
        backgroundColor: Colors.green[700],
        centerTitle: true,
      ),
      body: pestDescription == null
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.pestName.replaceAll("_", " ").toUpperCase(),
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.green[800]),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "Description:",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(pestDescription?["description"] ?? "No description found."),
                  const SizedBox(height: 20),
                  Text(
                    "Recommended Pesticides:",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  ...?pesticideList?.map((pest) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.green),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Name: ${pest["name"]}", style: TextStyle(fontWeight: FontWeight.bold)),
                              Text("Dosage: ${pest["dosage"]}"),
                              Text("Precautions: ${pest["safety_precautions"]}"),
                            ],
                          ),
                        ),
                      )),
                  const SizedBox(height: 20),
                  Center(
                    child: ElevatedButton.icon(
                      onPressed: generatePDF,
                      icon: Icon(Icons.download),
                      label: Text("Download PDF"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green[700],
                        padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
