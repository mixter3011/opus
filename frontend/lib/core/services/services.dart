import 'package:shared_preferences/shared_preferences.dart';

class SpService {
  Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('user-auth-token', token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user-auth-token');
  }
}
