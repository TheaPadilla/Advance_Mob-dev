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
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native"; // ✅ import theme
import { useSelector } from "react-redux";

export default function PlaylistsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme(); // ✅ get colors from theme
  const { accentColor } = useSelector((state: any) => state.theme);

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
    <TouchableOpacity style={[styles.deleteButton, { backgroundColor: colors.notification }]} onPress={() => removePlaylist(id)}>
      <FontAwesome name="trash" size={20} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Your Playlists Section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Playlists</Text>

      <View style={styles.playlistInputRow}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="New playlist name"
          placeholderTextColor="#888"
          value={newPlaylist}
          onChangeText={setNewPlaylist}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: accentColor }]} onPress={addPlaylist}>
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
            style={[styles.playlistCard, { backgroundColor: colors.card }]}
            onPress={() =>
              navigation.navigate(
                "PlaylistDetail" as never,
                { playlistId: playlist.id, playlistName: playlist.name } as never
              )
            }
          >
            <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
            <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
          </TouchableOpacity>
        </Swipeable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 10 },

  playlistInputRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  input: { flex: 1, padding: 10, borderRadius: 6, marginRight: 10 },
  addButton: { padding: 10, borderRadius: 6 },
  addButtonText: { color: "#fff", fontWeight: "bold" },

  playlistCard: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 6, marginBottom: 10 },
  playlistImage: { width: 50, height: 50, borderRadius: 6, marginRight: 10 },
  playlistName: { fontSize: 16 },

  deleteButton: { justifyContent: "center", alignItems: "center", width: 80, borderRadius: 6, marginBottom: 10 },
  deleteText: { color: "#fff", fontWeight: "bold", marginTop: 5 },
});
