import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";

// 1. Type Definitions
type PostData = {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
};

type UserProfile = {
  name: string;
  username: string;
  avatarUrl: string;
  followers: number;
  following: number;
};

// 2. Dummy Data
const USER_PROFILE: UserProfile = {
  name: "Rohan Thap",
  username: "rohan_thap",
  avatarUrl: "https://ui-avatars.com/api/?name=Rohan+Thap&size=200&background=random",
  followers: 128,
  following: 42,
};

const USER_POSTS: PostData[] = [
  {
    id: "p1",
    author: "Rohan Thap",
    content: "Just pushed my first React Native app to TestFlight! 🚀",
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
    likes: 24,
  },
  {
    id: "p2",
    author: "Rohan Thap",
    content: "Trying to figure out the best navigation pattern for Expo apps. Tabs vs Drawers?",
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
    likes: 12,
  },
  {
    id: "p3",
    author: "Rohan Thap",
    content: "TypeScript makes refactoring so much less stressful.",
    timestamp: Date.now() - 86400000 * 7, // 1 week ago
    likes: 56,
  },
];

// 3. Profile Component
export default function Profile() {
  const [posts, setPosts] = useState<PostData[]>(USER_POSTS);

  const handleLike = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // The top section of the profile containing the image and stats
  const ProfileHeader = () => (
    <View style={styles.headerContainer}>
      <Image 
        source={{ uri: USER_PROFILE.avatarUrl }} 
        style={styles.avatar} 
      />
      <Text style={styles.name}>{USER_PROFILE.name}</Text>
      <Text style={styles.username}>@{USER_PROFILE.username}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{USER_PROFILE.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{USER_PROFILE.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>
      
      <Text style={styles.feedTitle}>My Posts</Text>
    </View>
  );

  // Individual post renderer
  const renderItem = ({ item }: { item: PostData }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postAuthor}>{item.author}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postFooter}>
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // Inject the profile header right above the feed
        ListHeaderComponent={<ProfileHeader />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  listContent: {
    padding: 15,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#ccc", 
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  postAuthor: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  postContent: {
    marginBottom: 15,
    fontSize: 15,
    lineHeight: 20,
  },
  postFooter: {
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