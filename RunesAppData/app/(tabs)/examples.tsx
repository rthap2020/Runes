import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

// 1. Type definition
type PostData = {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
};

// 2. Dummy Data for Examples
const EXAMPLE_POSTS: PostData[] = [
  {
    id: "ex1",
    author: "Jane Doe",
    content: "This is a great example of a longer post. Social media apps need to handle text wrapping properly so that when a user types a lot of content, it doesn't break the layout.",
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    likes: 15,
  },
  {
    id: "ex2",
    author: "Tech Guru",
    content: "Hot take: React Native is still the best way to build cross-platform apps in 2026. 📱🔥",
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    likes: 104,
  },
  {
    id: "ex3",
    author: "Minimalist UI",
    content: "Sometimes, less styling is better. Focus on the content.",
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    likes: 42,
  }
];

// 3. Example Posts Page Component
export default function Examples() {
  const [posts, setPosts] = useState<PostData[]>(EXAMPLE_POSTS);

  // Local like handler just for this page
  const handleLike = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // Render function for individual items
  const renderItem = ({ item }: { item: PostData }) => (
    <View style={styles.postContainer}>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeButton}>
          <Text>Like ({item.likes})</Text>
        </TouchableOpacity>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Example Posts</Text>
        {/* If using Expo Router, you can link back to home like this: */}
        {/* <Link href="/" style={styles.link}>Back to Home</Link> */}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// 4. Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  link: {
    color: "#007AFF",
    marginTop: 5,
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  author: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  content: {
    marginBottom: 15,
    fontSize: 15,
    lineHeight: 20,
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
});