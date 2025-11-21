import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
// 1. Import useLocalSearchParams
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const uploadedImageUri =
  "file:///mnt/data/fb99bccf-9898-45cd-8824-ea180d3cc0fb.png";

const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Japanese"];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  // 2. Destructure the params to get the new URI from Camera
  const { newAvatarUri } = useLocalSearchParams();

  const { colors, dark } = useTheme();
  const accentColor = useSelector((state: any) => state.theme?.accentColor) || "#007AFF";

  // Profile State
  const [profileUsername, setProfileUsername] = useState("Thae");
  const [profileEmail, setProfileEmail] = useState("thae@mail.com");
  const [profileGenre, setProfileGenre] = useState("Pop");
  const [avatar, setAvatar] = useState<any>({ uri: uploadedImageUri });

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; genre?: string }>({});
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  // Stats
  const [playlists] = useState([
    { id: "1", title: "2020", followers: 1 },
    { id: "2", title: "2019", followers: 2 },
    { id: "3", title: "2018", followers: 3 },
  ]);
  const [playlistsCount] = useState(10);
  const [followersCount] = useState(32);
  const [followingCount] = useState(382);

  // Animations
  const fadeIn = useSharedValue(0);
  const shakeXUsername = useSharedValue(0);
  const shakeXEmail = useSharedValue(0);

  // Initial Load
  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 600 });
    loadCache();
  }, []);

  // 3. LISTENER: Automatically update when Camera sends a photo back
  useEffect(() => {
    if (newAvatarUri) {
      console.log("Received new avatar:", newAvatarUri);

      const uriString = newAvatarUri as string;

      // Update State Immediately
      setAvatar({ uri: uriString });

      // Update Cache (so it remembers next time you open the app)
      saveCache({
        username: profileUsername,
        email: profileEmail,
        genre: profileGenre,
        avatar: { uri: uriString },
      });

      // Optional: Clear the param so it doesn't loop (though useLocalSearchParams handles this well)
      router.setParams({ newAvatarUri: "" });
    }
  }, [newAvatarUri]);

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
    if (field === "username" && value && !/^[a-zA-Z0-9_ ]{3,30}$/.test(value))
      error = "Username must be 3–30 characters.";
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email.";
    if (field === "genre" && value && !genres.includes(value)) error = "Select a valid genre.";
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const saveCache = async (data: any) => {
    try {
      // Merge existing data with new data to avoid overwriting missing fields
      const current = await AsyncStorage.getItem("profile");
      const currentData = current ? JSON.parse(current) : {};
      const newData = { ...currentData, ...data };

      await AsyncStorage.setItem("profile", JSON.stringify(newData));
    } catch (e) {
      console.log("Cache save error", e);
    }
  };

  const loadCache = async () => {
    try {
      const cache = await AsyncStorage.getItem("profile");
      if (cache) {
        const data = JSON.parse(cache);
        if (data.username) setProfileUsername(data.username);
        if (data.email) setProfileEmail(data.email);
        if (data.genre) setProfileGenre(data.genre);
        if (data.avatar) setAvatar(data.avatar);
      }
    } catch (e) {
      console.log("Cache load error", e);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const finalUsername = username || profileUsername;
    const finalEmail = email || profileEmail;
    const finalGenre = genre || profileGenre;

    validate("username", finalUsername);
    validate("email", finalEmail);
    validate("genre", finalGenre);

    if (!finalUsername || errors.username) triggerShake("username");
    if (!finalEmail || errors.email) triggerShake("email");

    if ((errors.username && errors.username.length) || (errors.email && errors.email.length) || (errors.genre && errors.genre.length)) return;

    setProfileUsername(finalUsername);
    setProfileEmail(finalEmail);
    setProfileGenre(finalGenre);

    await saveCache({ username: finalUsername, email: finalEmail, genre: finalGenre, avatar });

    setSuccess("Profile updated!");
    setUsername("");
    setEmail("");
    setGenre("");
    setErrors({});
    setSubmitted(false);

    setTimeout(() => setSuccess(""), 3000);
  };

  const pickImage = async () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Take a Photo",
        // 4. Navigate to Camera (No callbacks needed now!)
        onPress: () => router.push("/camera/CameraScreen"),
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
          if (!result.canceled && result.assets && result.assets[0]) {
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

  const renderPlaylist = ({ item }: any) => (
    <TouchableOpacity style={styles.playlistRow}>
      <View style={styles.playlistThumb}>
        <Text style={styles.playlistThumbText}>{item.title[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.playlistTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.playlistSub, { color: colors.border }]}>{item.followers} follower{item.followers > 1 ? "s" : ""}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>

            <Animated.View style={[shakeStyleUsername]}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: dark ? "#fff" : "#000", borderColor: colors.border, borderWidth: 1 }]}
                placeholder="Username"
                placeholderTextColor={colors.border}
                value={username}
                onChangeText={(text) => { setUsername(text); validate("username", text); }}
              />
            </Animated.View>
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}

            <Animated.View style={[shakeStyleEmail]}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: dark ? "#fff" : "#000", borderColor: colors.border, borderWidth: 1 }]}
                placeholder="Email"
                placeholderTextColor={colors.border}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => { setEmail(text); validate("email", text); }}
              />
            </Animated.View>
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View style={styles.genreRow}>
              {genres.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genreOption,
                    { backgroundColor: genre === g ? accentColor : "transparent", borderWidth: 1, borderColor: colors.border },
                  ]}
                  onPress={() => { setGenre(g); validate("genre", g); }}
                >
                  <Text style={{ color: genre === g ? "#fff" : colors.text, fontWeight: genre === g ? "700" : "400" }}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.genre && <Text style={styles.error}>{errors.genre}</Text>}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: accentColor }]} onPress={async () => { await handleSubmit(); setEditVisible(false); }}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setEditVisible(false)}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {success ? <Text style={{ color: "lime", textAlign: "center", marginTop: 10 }}>{success}</Text> : null}
          </View>
        </View>
      </Modal>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylist}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            <Animated.View style={[animatedProfileStyle]}>
              <LinearGradient
                colors={["rgba(120,80,110,0.95)", "rgba(40,40,40,0.95)"]}
                style={styles.header}
                start={[0, 0]}
                end={[0, 1]}
              >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>

                <View style={styles.centerBlock}>
                  <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
                    {/* IMAGE UPDATE HAPPENS HERE VIA STATE */}
                    <Image source={avatar} style={[styles.avatar, { borderColor: colors.background }]} />
                  </TouchableOpacity>

                  <Text style={[styles.name, { color: "#fff" }]}>{profileUsername}</Text>

                  <TouchableOpacity
                    onPress={() => setEditVisible(true)}
                    style={[styles.editBtn, { backgroundColor: "#fff" }]}
                    activeOpacity={0.85}
                  >
                    <Text style={{ color: "#000", fontWeight: "700", letterSpacing: 0.5 }}>EDIT PROFILE</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>

            <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{playlistsCount}</Text>
                <Text style={[styles.statLabel, { color: colors.border }]}>PLAYLISTS</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{followersCount}</Text>
                <Text style={[styles.statLabel, { color: colors.border }]}>FOLLOWERS</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{followingCount}</Text>
                <Text style={[styles.statLabel, { color: colors.border }]}>FOLLOWING</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Public playlists</Text>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "ios" ? 24 : 18,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: "absolute",
    left: 18,
    top: Platform.OS === "ios" ? 28 : 20,
    zIndex: 10,
  },
  centerBlock: { alignItems: "center", marginTop: 6 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, backgroundColor: "#eee" },
  name: { fontSize: 22, fontWeight: "700", marginTop: 10, marginBottom: 8 },
  editBtn: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, alignItems: "center" },

  statsRow: { flexDirection: "row", paddingVertical: 18, paddingHorizontal: 12, justifyContent: "space-around", marginTop: 8, alignItems: "center" },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 11, marginTop: 6, letterSpacing: 0.9 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 12, marginBottom: 6 },
  sectionTitle: { fontSize: 20, fontWeight: "800" },

  playlistRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20 },
  playlistThumb: { width: 48, height: 48, borderRadius: 6, backgroundColor: "#eee", alignItems: "center", justifyContent: "center", marginRight: 12 },
  playlistThumbText: { fontWeight: "700", fontSize: 18 },
  playlistTitle: { fontSize: 16, fontWeight: "700" },
  playlistSub: { fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "88%", padding: 18, borderRadius: 14, elevation: 12 },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12, textAlign: "center" },
  input: { borderRadius: 8, padding: 12, marginBottom: 8 },
  error: { color: "red", fontSize: 13, marginBottom: 6 },
  genreRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  genreOption: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, margin: 5 },
  modalBtnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, marginHorizontal: 6, alignItems: "center" },
});