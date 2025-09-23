import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";

const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Japanese"];
const defaultAvatar = require("../../assets/images/augusta.jpg");

export default function ProfileScreen() {
  const navigation = useNavigation();

  // profile data
  const [profileUsername, setProfileUsername] = useState("Augusta");
  const [profileEmail, setProfileEmail] = useState("augusta@mail.com");
  const [profileGenre, setProfileGenre] = useState("Hip-Hop");
  const [avatar, setAvatar] = useState<any>(defaultAvatar);

  // form data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; genre?: string }>({});
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // animations
  const fadeIn = useSharedValue(0);
  const shakeXUsername = useSharedValue(0);
  const shakeXEmail = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 600 });
    loadCache();
  }, []);

  const animatedProfileStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const shakeStyleUsername = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeXUsername.value }],
  }));

  const shakeStyleEmail = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeXEmail.value }],
  }));

  const triggerShake = (field: "username" | "email") => {
    const target = field === "username" ? shakeXUsername : shakeXEmail;
    target.value = withSequence(
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(-6, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  // validation (no shake here!)
  const validate = useCallback((field: string, value: string) => {
    let error = "";
    if (field === "username") {
      if (!/^[a-zA-Z0-9_ ]{8,20}$/.test(value)) {
        error = "Username must be 8–20 characters (letters, numbers, underscores).";
      }
    }
    if (field === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email.";
      }
    }
    if (field === "genre") {
      if (!genres.includes(value)) {
        error = "Select a valid genre.";
      }
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // cache
  const saveCache = async (data: any) => {
    try {
      await AsyncStorage.setItem("profile", JSON.stringify(data));
    } catch (e) {
      console.log("Cache save error", e);
    }
  };

  const loadCache = async () => {
    try {
      const cache = await AsyncStorage.getItem("profile");
      if (cache) {
        const data = JSON.parse(cache);
        setProfileUsername(data.username || "Your Name");
        setProfileEmail(data.email || "your@email.com");
        setProfileGenre(data.genre || "Not selected");
        setAvatar(data.avatar || defaultAvatar);
      }
    } catch (e) {
      console.log("Cache load error", e);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    validate("username", username);
    validate("email", email);
    validate("genre", genre);

    // trigger shake ONLY after submit if errors exist
    if (errors.username) triggerShake("username");
    if (errors.email) triggerShake("email");

    if (!errors.username && !errors.email && !errors.genre) {
      setProfileUsername(username);
      setProfileEmail(email);
      setProfileGenre(genre);

      const newData = { username, email, genre, avatar };
      await saveCache(newData);

      setSuccess("Profile updated successfully!");

      setUsername("");
      setEmail("");
      setGenre("");
      setErrors({});
      setSubmitted(false);

      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar({ uri: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={28} color="#1DB954" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Dynamic Profile */}
      <Animated.View style={[animatedProfileStyle]}>
        <LinearGradient colors={["#2a2a2a", "#121212"]} style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={avatar} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.name}>{profileUsername || "Your Name"}</Text>
            <Text style={styles.email}>{profileEmail || "your@email.com"}</Text>
            <Text style={styles.genre}>
              Favorite genre: {profileGenre || "Not selected"}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Form */}
      <View style={styles.form}>
        {/* Username */}
        <Animated.View style={[shakeStyleUsername]}>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              validate("username", text);
            }}
          />
        </Animated.View>
        {errors.username ? (
          <Animated.Text entering={FadeIn} style={styles.error}>
            {errors.username}
          </Animated.Text>
        ) : null}

        {/* Email */}
        <Animated.View style={[shakeStyleEmail]}>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validate("email", text);
            }}
          />
        </Animated.View>
        {errors.email ? (
          <Animated.Text entering={FadeIn} style={styles.error}>
            {errors.email}
          </Animated.Text>
        ) : null}

        {/* Genre */}
        <View style={styles.genreRow}>
          {genres.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genreOption, genre === g && styles.genreSelected]}
              onPress={() => {
                setGenre(g);
                validate("genre", g);
              }}
            >
              <Text
                style={[
                  styles.genreText,
                  genre === g && styles.genreTextSelected,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.genre ? (
          <Animated.Text entering={FadeIn} style={styles.error}>
            {errors.genre}
          </Animated.Text>
        ) : null}

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        {success ? (
          <Animated.Text
            entering={FadeIn}
            style={{ color: "lime", fontSize: 14, marginTop: 8 }}
          >
            {success}
          </Animated.Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 15 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#1DB954",
  },
  name: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  email: { color: "#bbb", fontSize: 14, marginTop: 4 },
  genre: { color: "#bbb", fontSize: 14, marginTop: 2 },
  form: { paddingHorizontal: 20, marginTop: 20 },
  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    color: "#fff",
  },
  error: { color: "red", fontSize: 13, marginBottom: 6 },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  genreOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    margin: 5,
  },
  genreSelected: { backgroundColor: "#1DB954" },
  genreText: { color: "#fff" },
  genreTextSelected: { color: "#000", fontWeight: "bold" },
  submitBtn: {
    backgroundColor: "#1DB954",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "#000", fontWeight: "bold" },
});