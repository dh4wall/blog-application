import React, { useState, useEffect } from 'react';
import './App.css';

/* const API_URL = 'http://localhost:5000/posts'; */
const API_URL = 'http://YOUR_PUBLIC_IP:5000/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Is the backend running?');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to create post.');
      } else {
        setTitle('');
        setContent('');
        fetchPosts();
      }
    } catch (err) {
      setError('Failed to create post. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  return (
    <div className="container">
      <h1>📝 My Blog</h1>

      {/* Create Post Form */}
      <section className="form-section">
        <h2>Create a New Post</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your post content here..."
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </section>

      {/* Posts List */}
      <section className="posts-section">
        <h2>All Posts ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="empty">No posts yet. Be the first to write one!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
              <p className="post-content">{post.content}</p>
              <small className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
