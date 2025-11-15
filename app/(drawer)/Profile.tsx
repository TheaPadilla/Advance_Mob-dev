import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useTheme } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Japanese"];
const defaultAvatar = require("../../assets/images/augusta.jpg");

export default function ProfileScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors } = useTheme();
  const { accentColor } = useSelector((state: any) => state.theme);

  const [profileUsername, setProfileUsername] = useState("Augusta");
  const [profileEmail, setProfileEmail] = useState("augusta@mail.com");
  const [profileGenre, setProfileGenre] = useState("Hip-Hop");
  const [avatar, setAvatar] = useState<any>(defaultAvatar);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; genre?: string }>({});
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const fadeIn = useSharedValue(0);
  const shakeXUsername = useSharedValue(0);
  const shakeXEmail = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 600 });
    loadCache();
  }, []);

  const animatedProfileStyle = useAnimatedStyle(() => ({ opacity: fadeIn.value }));
  const shakeStyleUsername = useAnimatedStyle(() => ({ transform: [{ translateX: shakeXUsername.value }] }));
  const shakeStyleEmail = useAnimatedStyle(() => ({ transform: [{ translateX: shakeXEmail.value }] }));

  const triggerShake = (field: "username" | "email") => {
    const target = field === "username" ? shakeXUsername : shakeXEmail;
    target.value = withSequence(
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(-6, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const validate = useCallback((field: string, value: string) => {
    let error = "";
    if (field === "username" && !/^[a-zA-Z0-9_ ]{8,20}$/.test(value))
      error = "Username must be 8–20 characters (letters, numbers, underscores).";

    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      error = "Enter a valid email.";

    if (field === "genre" && !genres.includes(value)) error = "Select a valid genre.";

    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

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

    if (errors.username) triggerShake("username");
    if (errors.email) triggerShake("email");

    if (!errors.username && !errors.email && !errors.genre) {
      setProfileUsername(username);
      setProfileEmail(email);
      setProfileGenre(genre);

      await saveCache({ username, email, genre, avatar });

      setSuccess("Profile updated successfully!");
      setUsername("");
      setEmail("");
      setGenre("");
      setErrors({});
      setSubmitted(false);

      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // **Pick or take avatar**
  const pickImage = async () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Take a Photo",
        onPress: () =>
          router.push({
            pathname: "/camera/CameraScreen",
            params: {
              onCapture: (uri: string) => {
                setAvatar({ uri });
                saveCache({
                  username: profileUsername,
                  email: profileEmail,
                  genre: profileGenre,
                  avatar: { uri },
                });
              },
            },
          }),
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled && result.assets[0].uri) {
            const uri = result.assets[0].uri;
            setAvatar({ uri });
            await saveCache({
              username: profileUsername,
              email: profileEmail,
              genre: profileGenre,
              avatar: { uri },
            });
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={28} color={accentColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <Animated.View style={[animatedProfileStyle]}>
        <LinearGradient colors={[colors.card, colors.background]} style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={avatar} style={styles.avatar} />
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text style={[styles.name, { color: colors.text }]}>{profileUsername}</Text>
            <Text style={[styles.email, { color: colors.border }]}>{profileEmail}</Text>
            <Text style={[styles.genre, { color: colors.border }]}>
              Favorite genre: {profileGenre}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Form */}
      <View style={styles.form}>
        <Animated.View style={[shakeStyleUsername]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Enter username"
            placeholderTextColor={colors.border}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              validate("username", text);
            }}
          />
        </Animated.View>
        {errors.username && <Animated.Text entering={FadeIn} style={styles.error}>{errors.username}</Animated.Text>}

        <Animated.View style={[shakeStyleEmail]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Enter email"
            placeholderTextColor={colors.border}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validate("email", text);
            }}
          />
        </Animated.View>
        {errors.email && <Animated.Text entering={FadeIn} style={styles.error}>{errors.email}</Animated.Text>}

        <View style={styles.genreRow}>
          {genres.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genreOption, { backgroundColor: genre === g ? accentColor : colors.card }]}
              onPress={() => {
                setGenre(g);
                validate("genre", g);
              }}
            >
              <Text
                style={[
                  styles.genreText,
                  { color: genre === g ? colors.background : colors.text, fontWeight: genre === g ? "bold" : "normal" },
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.genre && <Animated.Text entering={FadeIn} style={styles.error}>{errors.genre}</Animated.Text>}

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: accentColor }]} onPress={handleSubmit}>
          <Text style={[styles.submitText, { color: colors.background }]}>Submit</Text>
        </TouchableOpacity>

        {success && <Animated.Text entering={FadeIn} style={{ color: "lime", fontSize: 14, marginTop: 8 }}>{success}</Animated.Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 15 },
  header: { alignItems: "center", justifyContent: "center", paddingTop: 40, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 140, height: 140, borderRadius: 70, marginBottom: 15, borderWidth: 3 },
  name: { fontSize: 26, fontWeight: "bold" },
  email: { fontSize: 14, marginTop: 4 },
  genre: { fontSize: 14, marginTop: 2 },
  form: { paddingHorizontal: 20, marginTop: 20 },
  input: { borderRadius: 8, padding: 12, marginBottom: 8 },
  error: { color: "red", fontSize: 13, marginBottom: 6 },
  genreRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  genreOption: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, margin: 5 },
  genreText: { fontSize: 14 },
  submitBtn: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10 },
  submitText: { fontWeight: "bold" },
});
