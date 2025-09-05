import React, { useState } from "react";
import { Redirect, router } from "expo-router";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

export default function SpotifyLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Spotify Logo */}
      <Image
        source={{
          uri: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Spotify</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={() => router.replace("/(drawer)/Profile")}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>Be Correct With</Text>

      {/* Social Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialText}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialText}>G</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/SignUp")}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#aaa",
    fontSize: 15,
  },
  signInButton: {
    backgroundColor: "#1DB954",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 150,
    marginBottom: 20,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  orText: {
    color: "#1DB954",
    fontSize: 15,
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    backgroundColor: "#1e1e1e",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  signUpRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  signUpText: {
    color: "#aaa",
    fontSize: 15,
  },
  signUpLink: {
    color: "#1DB954",
    fontSize: 15,
    fontWeight: "600",
  },
});