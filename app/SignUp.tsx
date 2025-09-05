import React, { useState } from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

export default function SpotifySignUpScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [gender, setGender] = useState("");

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

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      {/* Full Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={fullName}
        onChangeText={setFullName}
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

      {/* Date of Birth */}
      <View style={styles.dobGenderRow}>
        <Text style={styles.label}>Date Of Birth :</Text>
        <View style={styles.dobRow}>
          <TextInput
            style={styles.dobInput}
            placeholder="DD"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={dob.day}
            onChangeText={(day) => setDob({ ...dob, day })}
            maxLength={2}
          />
          <TextInput
            style={styles.dobInput}
            placeholder="MM"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={dob.month}
            onChangeText={(month) => setDob({ ...dob, month })}
            maxLength={2}
          />
          <TextInput
            style={styles.dobInput}
            placeholder="YY"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={dob.year}
            onChangeText={(year) => setDob({ ...dob, year })}
            maxLength={2}
          />
        </View>
      </View>

      {/* Gender Selection */}
      <View style={styles.dobGenderRow}>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender("Male")}
          >
            <View
              style={[styles.circle, gender === "Male" && styles.selectedCircle]}
            >
              {gender === "Male" && <View style={styles.innerCircle} />}
            </View>
            <Text
              style={[styles.genderText, gender === "Male" && styles.selectedText]}
            >
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender("Female")}
          >
            <View
              style={[
                styles.circle,
                gender === "Female" && styles.selectedCircle,
              ]}
            >
              {gender === "Female" && <View style={styles.innerCircle} />}
            </View>
            <Text
              style={[
                styles.genderText,
                gender === "Female" && styles.selectedText,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.replace("/SignIn")}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>Sign Up With</Text>

      {/* Social Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialText}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialText}>G</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Link */}
      <View style={styles.signInRow}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/SignIn")}>
          <Text style={styles.signInLink}>Sign In</Text>
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
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
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
  label: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
    width: 110,
  },
  dobGenderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  dobRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  dobInput: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    width: 60,
    marginHorizontal: 4,
  },
  genderRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,

  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircle: {
    borderColor: "#1DB954",
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1DB954",
  },
  genderText: {
    fontSize: 16,
    color: "#aaa",
    fontWeight: "600",
  },
  selectedText: {
    color: "#1DB954",
  },
  signUpButton: {
    backgroundColor: "#1DB954",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 150,
    marginBottom: 20,
  },
  signUpText: {
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
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  signInText: {
    color: "#aaa",
    fontSize: 15,
  },
  signInLink: {
    color: "#1DB954",
    fontSize: 15,
    fontWeight: "600",
  },
});
