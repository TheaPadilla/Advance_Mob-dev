import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";

const goodMorning = [
  { id: "1", title: "Today's Top Hits", image: "https://picsum.photos/200/200?random=1" },
  { id: "2", title: "Dope Labs", image: "https://picsum.photos/200/200?random=2" },
];

const recent = [
  { id: "3", title: "God’s Menu", subtitle: "Stray Kids", image: "https://picsum.photos/200/200?random=5" },
  { id: "4", title: "Black Magic", subtitle: "Little Mix", image: "https://picsum.photos/200/200?random=6" },
  { id: "5", title: "The One That Got Away", subtitle: "Katy Perry", image: "https://picsum.photos/200/200?random=7" },
];

const madeForYou = [
  { id: "6", title: "On Repeat", subtitle: "Songs you can’t get enough of", image: "https://picsum.photos/200/200?random=8" },
  { id: "7", title: "Your Discover Weekly", subtitle: "Your weekly mixtape", image: "https://picsum.photos/200/200?random=9" },
];

const popular = [
  { id: "8", title: "Feelin' Good", image: "https://picsum.photos/200/200?random=10" },
  { id: "9", title: "Pumped Pop", image: "https://picsum.photos/200/200?random=11" },
  { id: "10", title: "Chill Mix", image: "https://picsum.photos/200/200?random=12" },
];

export default function PlaylistsScreen() {
  const navigation = useNavigation();
  const [playlists, setPlaylists] = useState<{ id: string; name: string; image: string }[]>([]);
  const [newPlaylist, setNewPlaylist] = useState("");

  useEffect(() => {
    const loadPlaylists = async () => {
      const stored = await AsyncStorage.getItem("createplaylist");
      if (stored) setPlaylists(JSON.parse(stored));
    };
    loadPlaylists();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  const addPlaylist = () => {
    if (!newPlaylist.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name: newPlaylist,
      image: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
    };
    setPlaylists([...playlists, newItem]);
    setNewPlaylist("");
  };

  const removePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => removePlaylist(id)}>
      <FontAwesome name="trash" size={20} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>


      {/* Your Playlists Section */}
      <Text style={styles.sectionTitle}>Your Playlists</Text>
      <View style={styles.playlistInputRow}>
        <TextInput
          style={styles.input}
          placeholder="New playlist name"
          placeholderTextColor="#888"
          value={newPlaylist}
          onChangeText={setNewPlaylist}
        />
        <TouchableOpacity style={styles.addButton} onPress={addPlaylist}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {playlists.map((playlist) => (
        <Swipeable
          key={playlist.id}
          renderRightActions={() => renderRightActions(playlist.id)}
          overshootRight={false}
        >
          <TouchableOpacity
            style={styles.playlistCard}
            onPress={() =>
              navigation.navigate(
                "PlaylistDetail" as never,
                { playlistId: playlist.id, playlistName: playlist.name } as never
              )
            }
          >
            <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
            <Text style={styles.playlistName}>{playlist.name}</Text>
          </TouchableOpacity>
        </Swipeable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingHorizontal: 15, paddingTop: 20 },
  sectionTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 10 },

  // Header
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginLeft: 10 },

  // Good morning grid
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridItem: {
    backgroundColor: "#282828",
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 6,
    overflow: "hidden",
    paddingRight: 10,
  },
  gridImage: { width: 50, height: 50 },
  gridText: { color: "#fff", marginLeft: 10, flexShrink: 1 },

  // Horizontal card style (Made for you, Popular)
  card: { marginRight: 15, width: 140 },
  cardImage: { width: "100%", height: 140, borderRadius: 6, marginBottom: 8 },
  cardTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  cardSubtitle: { color: "#aaa", fontSize: 12 },

  // Recent vertical list
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  listImage: {
    width: 55,
    height: 55,
    borderRadius: 6,
    marginRight: 15,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  listSubtitle: {
    fontSize: 14,
    color: "#aaa",
  },

  // Playlist management
  playlistInputRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  input: { flex: 1, backgroundColor: "#282828", color: "#fff", padding: 10, borderRadius: 6, marginRight: 10 },
  addButton: { backgroundColor: "#1DB954", padding: 10, borderRadius: 6 },
  addButtonText: { color: "#fff", fontWeight: "bold" },

  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#282828",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  playlistImage: { width: 50, height: 50, borderRadius: 6, marginRight: 10 },
  playlistName: { color: "#fff", fontSize: 16 },

  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 6,
    marginBottom: 10,
  },
  deleteText: { color: "#fff", fontWeight: "bold", marginTop: 5 },
});
