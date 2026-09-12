import React, { useState } from 'react';

// 1. Individual Post Component
function Post({ post, onLike }) {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
      <h3 style={{ margin: '0 0 5px 0' }}>{post.author}</h3>
      <p style={{ margin: '0 0 10px 0' }}>{post.content}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => onLike(post.id)}>
          Like ({post.likes})
        </button>
        <small style={{ color: '#666' }}>
          {new Date(post.timestamp).toLocaleString()}
        </small>
      </div>
    </div>
  );
}

// 2. Create Post Form Component
function CreatePost({ onAddPost }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    onAddPost({ author, content });
    
    // Clear the form after submission
    setAuthor('');
    setContent('');
  };

  return (
    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9' }}>
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Your name" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          required
        />
        <textarea 
          placeholder="What's on your mind?" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          rows="3"
          required
        />
        <button type="submit" style={{ alignSelf: 'flex-start' }}>Post</button>
      </form>
    </div>
  );
}

// 3. Main App Component
export default function App() {
  // Initialize with some dummy data
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Alice',
      content: 'Just setting up my new social media profile!',
      timestamp: Date.now() - 100000,
      likes: 2
    },
    {
      id: 2,
      author: 'Bob',
      content: 'Does anyone know a good React tutorial?',
      timestamp: Date.now() - 50000,
      likes: 0
    }
  ]);

  // Handler to add a new post to the top of the feed
  const handleAddPost = (newPostData) => {
    const newPost = {
      id: Date.now(), // simple way to generate a unique ID
      author: newPostData.author,
      content: newPostData.content,
      timestamp: Date.now(),
      likes: 0
    };
    
    setPosts([newPost, ...posts]);
  };

  // Handler to increment likes on a specific post
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>SimpleSocial</h1>
      
      <CreatePost onAddPost={handleAddPost} />
      
      <h2>Feed</h2>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first!</p>
      ) : (
        <div>
          {posts.map(post => (
            <Post key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  );
}