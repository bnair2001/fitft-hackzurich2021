import 'dart:convert';
import 'dart:math';

import 'package:FitFT/dashboard.dart';
import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

const users = const {
  'dribbble@gmail.com': '12345',
  'hunter@gmail.com': 'hunter',
};

class LoginScreen extends StatelessWidget {
  Duration get loginTime => Duration(milliseconds: 2250);

  Future<String> _authUser(LoginData data) {
    print('Name: ${data.name}, Password: ${data.password}');
    var email = data.name.toString();
    var password = data.password.toString();
    return Future.delayed(loginTime).then((_) async {
      // if (!users.containsKey(data.name)) {
      //   return 'User not exists';
      // }
      // if (users[data.name] != data.password) {
      //   return 'Password does not match';
      // }
      Map data = {
        'email': email,
        'password': password,
      };
      // data['email'] = email;
      // data['password'] = password;
      var body = json.encode(data);
      var response = await http.post(
        Uri.parse('https://wptv1r.deta.dev/users/login'),
        // headers: <String, String>{
        //   'Content-Type': 'application/json; charset=UTF-8',
        // },
        headers: {"Content-Type": "application/json"},
        body: body,
      );
      print(response.body);
      if (response.statusCode == 200) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        Map valueMap = json.decode(response.body);
        prefs.setString('key', valueMap['key']);
        prefs.setString('user', valueMap['name']);
        prefs.setString('email', valueMap['email']);
        prefs.setInt('caloriesBurned', valueMap['caloriesBurned']);
        prefs.setInt('distanceTravelled', valueMap['distanceTravelled']);
        prefs.setBool("loggedIn", true);
      } else {
        return 'User not exists';
      }
      return "";
    });
  }

  Future<String> _signUpUser(LoginData data) {
    print('Name: ${data.name}, Password: ${data.password}');
    return Future.delayed(loginTime).then((_) {
      return 'Signup closed, please contact developer for details';
    });
  }

  Future<String> _recoverPassword(String name) {
    print('Name: $name');
    return Future.delayed(loginTime).then((_) {
      return 'Not available, please contact developer for details';
    });
  }

  @override
  Widget build(BuildContext context) {
    return FlutterLogin(
      title: 'FitFT',
      onLogin: _authUser,
      onSignup: _signUpUser,
      onSubmitAnimationCompleted: () {
        Navigator.of(context).pushReplacement(MaterialPageRoute(
          builder: (context) => Dashboard(),
        ));
      },
      onRecoverPassword: _recoverPassword,
    );
  }
}
