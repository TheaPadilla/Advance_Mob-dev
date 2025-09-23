import React, { useReducer, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

interface Song {
  id: string;
  title: string;
  image: string;
}

interface State {
  songs: Song[];
  past: Song[][];
  future: Song[][];
}

type Action =
  | { type: "ADD"; title: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; songs: Song[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const newSong = {
        id: Date.now().toString(),
        title: action.title,
        image: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
      };
      const newSongs = [...state.songs, newSong];
      return { songs: newSongs, past: [...state.past, state.songs], future: [] };
    }
    case "REMOVE": {
      const newSongs = state.songs.filter((s) => s.id !== action.id);
      return { songs: newSongs, past: [...state.past, state.songs], future: [] };
    }
    case "CLEAR": {
      return { songs: [], past: [...state.past, state.songs], future: [] };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return { songs: prev, past: newPast, future: [state.songs, ...state.future] };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { songs: next, past: [...state.past, state.songs], future: rest };
    }
    case "SET": {
      return { ...state, songs: action.songs };
    }
    default:
      return state;
  }
}

export default function PlaylistDetailScreen() {
  const route = useRoute<RouteProp<{ params: { playlistId: string; playlistName: string } }, "params">>();
  const { playlistId, playlistName } = route.params;

  const [state, dispatch] = useReducer(reducer, { songs: [], past: [], future: [] });
  const [newSong, setNewSong] = useState("");

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    saveSongs();
  }, [state.songs]);

  const loadSongs = async () => {
    const stored = await AsyncStorage.getItem(`createplaylist_${playlistId}`);
    if (stored) {
      dispatch({ type: "SET", songs: JSON.parse(stored) });
    }
  };

  const saveSongs = async () => {
    await AsyncStorage.setItem(`createplaylist_${playlistId}`, JSON.stringify(state.songs));
  };

  const addSong = () => {
    if (!newSong.trim()) return;
    dispatch({ type: "ADD", title: newSong });
    setNewSong("");
  };

  const removeSong = (id: string) => {
    dispatch({ type: "REMOVE", id });
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => removeSong(id)}>
      <FontAwesome name="trash" size={22} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{playlistName}</Text>

      {/* Song input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter song name"
          placeholderTextColor="#aaa"
          value={newSong}
          onChangeText={setNewSong}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSong}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Songs list */}
      <FlatList
        data={state.songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <View style={styles.songRow}>
                <Image source={{ uri: item.image }} style={styles.songImage} />
                <Text style={styles.songTitle}>{item.title}</Text>
              </View>
            </Swipeable>
          </Animated.View>
        )}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => dispatch({ type: "UNDO" })}>
          <Text style={styles.controlText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "REDO" })}>
          <Text style={styles.controlText}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "CLEAR" })}>
          <Text style={styles.controlText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: "#1DB954",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  songImage: { width: 40, height: 40, borderRadius: 6, marginRight: 12 },
  songTitle: { color: "#fff", fontSize: 16, flex: 1 },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginBottom: 8,
    borderRadius: 8,
  },
  controls: { flexDirection: "row", justifyContent: "space-around", marginTop: 16 },
  controlText: { color: "#1DB954", fontSize: 16, fontWeight: "bold" },
});
