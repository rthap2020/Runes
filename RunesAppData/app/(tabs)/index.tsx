import React, { useState } from "react";
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
} from "react-native";

// 1. Define TypeScript types for our data
type PostData = {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
};

// 2. Individual Post Component
const PostItem = ({ post, onLike }: { post: PostData; onLike: (id: string) => void }) => (
  <View style={styles.postContainer}>
    <Text style={styles.author}>{post.author}</Text>
    <Text style={styles.content}>{post.content}</Text>

    <View style={styles.footer}>
      <TouchableOpacity onPress={() => onLike(post.id)} style={styles.likeButton}>
        <Text>Like ({post.likes})</Text>
      </TouchableOpacity>
      <Text style={styles.timestamp}>
        {new Date(post.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  </View>
);

// 3. Main App Component
export default function Index() {
  // Initialize state with the PostData type
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: "1",
      author: "Alice",
      content: "Just setting up my new React Native profile!",
      timestamp: Date.now() - 100000,
      likes: 2,
    },
    {
      id: "2",
      author: "Bob",
      content: "Does anyone know a good Expo tutorial?",
      timestamp: Date.now() - 50000,
      likes: 0,
    },
  ]);

  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleAddPost = () => {
    // Basic validation
    if (!author.trim() || !content.trim()) return;

    const newPost: PostData = {
      id: Date.now().toString(),
      author: author.trim(),
      content: content.trim(),
      timestamp: Date.now(),
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    
    // Clear inputs
    setAuthor("");
    setContent("");
  };

  const handleLike = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView prevents the keyboard from covering the inputs on mobile */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.header}>SimpleSocial</Text>

        {/* Create Post Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create a Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={author}
            onChangeText={setAuthor} // RN uses onChangeText instead of onChange
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

        {/* Feed List */}
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

// 4. Minimal Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 15,
    textAlign: "center",
  },
  formContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top", // Fixes text alignment on Android multiline inputs
  },
  submitButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    alignItems: "center",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 15,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
  },
  author: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  content: {
    marginBottom: 15,
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});