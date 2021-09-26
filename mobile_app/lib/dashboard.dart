import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:rflutter_alert/rflutter_alert.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:qrscan/qrscan.dart' as scanner;
import 'package:http/http.dart' as http;

class Dashboard extends StatefulWidget {
  Dashboard({Key? key}) : super(key: key);

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  String name = "";
  String block = "";
  int calories = 0;
  int distance = 0;
  String user_id = "";

  void _getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      name = prefs.getString('user') ?? "";
      block = prefs.getString('block') ?? "";
      calories = prefs.getInt('caloriesBurned') ?? 0;
      distance = prefs.getInt('distanceTravelled') ?? 0;
      user_id = prefs.getString('key') ?? "";
    });
  }

  void _sendUpdateSignal() async {
    final prefs = await SharedPreferences.getInstance();
    Map data = {
      'connection_id': prefs.getString('conn_key') ?? "",
      'user_id': user_id,
      'operation': 'update'
    };
    var body = json.encode(data);
    var response = await http.post(
      Uri.parse("https://wptv1r.deta.dev/connection/operation"),
      headers: {"Content-Type": "application/json"},
      body: body,
    );
    print(response.body);
  }

  @override
  void initState() {
    _getUserData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('FitFT',
            style: TextStyle(color: Colors.white, fontSize: 25)),
        centerTitle: true,
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.published_with_changes_sharp,
                color: Colors.white),
            onPressed: () async {
              // Navigator.pushReplacementNamed(context, '/login');
              String? cameraScanResult = await scanner.scan();
              print(cameraScanResult);
              SharedPreferences prefs = await SharedPreferences.getInstance();
              if (cameraScanResult != null) {
                prefs.setString('conn_key', cameraScanResult);
                Map data = {
                  'connection_id': cameraScanResult,
                  'user_id': user_id,
                };
                var body = json.encode(data);
                var response = await http.post(
                  Uri.parse('https://wptv1r.deta.dev/connection/connect'),
                  headers: {"Content-Type": "application/json"},
                  body: body,
                );
                print(response.body);
                if (response.statusCode == 200) {
                  Alert(
                      context: context,
                      title: "Connection Succesfull",
                      content: Column(
                        children: const <Widget>[
                          Text(
                            "Connected to a web instance. Do you wanna update your progress?",
                            textAlign: TextAlign.center,
                          )
                        ],
                      ),
                      buttons: [
                        DialogButton(
                          color: Colors.black,
                          onPressed: () {
                            _sendUpdateSignal();
                          },
                          child: const Text(
                            "Update",
                            style: TextStyle(color: Colors.white, fontSize: 20),
                          ),
                        ),
                        DialogButton(
                          color: Colors.black,
                          onPressed: () => Navigator.pop(context),
                          child: const Text(
                            "Cancel",
                            style: TextStyle(color: Colors.white, fontSize: 20),
                          ),
                        )
                      ]).show();
                } else {
                  Alert(
                      context: context,
                      title: "Connection Failed",
                      content: Column(
                        children: const <Widget>[
                          Text(
                            "Connection failed. Please try again.",
                            textAlign: TextAlign.center,
                          )
                        ],
                      ),
                      buttons: [
                        DialogButton(
                          color: Colors.black,
                          onPressed: () => Navigator.pop(context),
                          child: const Text(
                            "Ok",
                            style: TextStyle(color: Colors.white, fontSize: 20),
                          ),
                        )
                      ]).show();
                }
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.shopping_bag_outlined, color: Colors.white),
            onPressed: () {
              // Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text("Block ID: " + "0x379v21k4g1g5j14h12".toUpperCase(),
                style: const TextStyle(
                    color: Colors.white, fontSize: 20, fontFamily: 'Roboto')),
            const SizedBox(height: 20),
            Image.network(
              'https://fitft-111.herokuapp.com/generated/000000000000180018.png',
              fit: BoxFit.contain,
              width: 280,
              height: 280,
            ),
            const SizedBox(height: 10),
            Text(
              name,
              style: const TextStyle(
                  fontSize: 40.0,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontFamily: "Handlee"),
            ),
            // Text(
            //   "20 of 100%",
            //   style: TextStyle(
            //       fontSize: 30.0,
            //       color: Colors.teal[100],
            //       fontWeight: FontWeight.bold,
            //       fontFamily: "SourceSansPro",
            //       letterSpacing: 2.0),
            // ),
            SizedBox(
              height: 10.0,
              width: 200,
              child: Center(
                child: Container(
                  margin:
                      const EdgeInsetsDirectional.only(start: 1.0, end: 1.0),
                  height: 1.0,
                  color: Colors.white,
                ),
              ),
            ),
            Card(
              margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 25),
              child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: ListTile(
                    leading: const Icon(
                      Icons.fitness_center_sharp,
                      color: Colors.black,
                    ),
                    title: Text(
                      calories.toString() + " Calories",
                      style: TextStyle(
                        color: Colors.teal.shade900,
                        fontFamily: "SourceSansPro",
                        fontSize: 20,
                      ),
                    ),
                  )),
            ),
            Card(
              margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 25),
              child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: ListTile(
                    leading: const Icon(
                      Icons.directions_walk_rounded,
                      color: Colors.black,
                    ),
                    title: Text(
                      (distance / 1000).toString() + " mi",
                      style: TextStyle(
                        color: Colors.teal.shade900,
                        fontFamily: "SourceSansPro",
                        fontSize: 20,
                      ),
                    ),
                  )),
            ),
          ],
        ),
      ),
    );
  }
}
