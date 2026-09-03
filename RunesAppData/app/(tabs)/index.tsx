import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";

// ⚠️ REPLACE THIS WITH YOUR COMPUTER's LOCAL IP ADDRESS
const API_URL = "http://192.168.86.27:3000/posts"; 

type PostData = {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
};

const PostItem = ({ post, onLike }: { post: PostData; onLike: (post: PostData) => void }) => (
  <View style={styles.postContainer}>
    <Text style={styles.author}>{post.author}</Text>
    <Text style={styles.content}>{post.content}</Text>
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => onLike(post)} style={styles.likeButton}>
        <Text>Like ({post.likes})</Text>
      </TouchableOpacity>
      <Text style={styles.timestamp}>
        {new Date(post.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  </View>
);

export default function Index() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. READ: Fetch posts on load
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Sort newest first
        const sortedData = data.sort((a: PostData, b: PostData) => b.timestamp - a.timestamp);
        setPosts(sortedData);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  // 2. CREATE: POST new data to the server
  const handleAddPost = () => {
    if (!author.trim() || !content.trim()) return;

    const newPost = {
      // json-server auto-generates IDs, but it expects a string. We'll provide it.
      id: Date.now().toString(), 
      author: author.trim(),
      content: content.trim(),
      timestamp: Date.now(),
      likes: 0,
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then((res) => res.json())
      .then((savedPost) => {
        setPosts([savedPost, ...posts]);
        setAuthor("");
        setContent("");
      })
      .catch((err) => console.error("Error creating post:", err));
  };

  // 3. UPDATE: PATCH likes on the server
  const handleLike = (post: PostData) => {
    const updatedLikes = post.likes + 1;

    // Optimistically update UI first for a snappy feel
    setPosts((currentPosts) =>
      currentPosts.map((p) => (p.id === post.id ? { ...p, likes: updatedLikes } : p))
    );

    // Update backend
    fetch(`${API_URL}/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: updatedLikes })
    }).catch((err) => {
      console.error("Error updating likes:", err);
      // If it fails, revert the like in the UI (basic error handling)
      setPosts((currentPosts) =>
        currentPosts.map((p) => (p.id === post.id ? { ...p, likes: post.likes } : p))
      );
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.header}>Runes</Text>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create a Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddPost}>
            <Text>Post</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.feedTitle}>Feed</Text>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostItem post={item} onLike={handleLike} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No posts yet. Be the first!</Text>}
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... Keep the same StyleSheet from the previous index.tsx file ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", padding: 15, textAlign: "center" },
  formContainer: { padding: 15, backgroundColor: "#f9f9f9", borderBottomWidth: 1, borderColor: "#eee" },
  formTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 4, backgroundColor: "#fff" },
  textArea: { height: 80, textAlignVertical: "top" },
  submitButton: { backgroundColor: "#e0e0e0", padding: 10, alignItems: "center", borderRadius: 4, alignSelf: "flex-start" },
  feedTitle: { fontSize: 20, fontWeight: "bold", padding: 15 },
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  postContainer: { borderWidth: 1, borderColor: "#ccc", padding: 15, marginBottom: 15, borderRadius: 4 },
  author: { fontWeight: "bold", marginBottom: 5, fontSize: 16 },
  content: { marginBottom: 15, fontSize: 15 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  likeButton: { paddingVertical: 5, paddingHorizontal: 10, backgroundColor: "#f0f0f0", borderRadius: 4 },
  timestamp: { color: "#666", fontSize: 12 },
  emptyText: { textAlign: "center", color: "#666", marginTop: 20 },
});