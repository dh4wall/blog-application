import React, { useState, useEffect } from 'react';
import './App.css';

/* const API_URL = 'http://localhost:5000/posts'; */
const API_URL = 'http://YOUR_PUBLIC_IP:5000/posts';

// ── Edit Modal ───────────────────────────────────────────────
function EditModal({ post, onClose, onSave }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update post.');
      } else {
        const updated = await res.json();
        onSave(updated);
      }
    } catch (err) {
      setError('Failed to update post. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit Post</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSave}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            autoFocus
          />
          <label>Content</label>
          <textarea
            rows="7"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
          />
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Post Card ────────────────────────────────────────────────
function PostCard({ post, onDelete, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="post-card">
      <div className="post-header">
        <h3>{post.title}</h3>
        <div className="post-actions">
          <button className="btn-edit" onClick={() => onEdit(post)}>Edit</button>
          {confirmDelete ? (
            <>
              <button className="btn-confirm-delete" onClick={() => onDelete(post._id)}>Confirm</button>
              <button className="btn-cancel-delete" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn-delete" onClick={() => setConfirmDelete(true)}>Delete</button>
          )}
        </div>
      </div>
      <p className="post-content">{post.content}</p>
      <small className="post-date">
        🕐 {new Date(post.createdAt).toLocaleString()}
      </small>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────
function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setFetching(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Is the backend running?');
    } finally {
      setFetching(false);
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
        const newPost = await res.json();
        setPosts((prev) => [newPost, ...prev]);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      setError('Failed to create post. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const handleSaveEdit = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setEditingPost(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 My Blog</h1>
        <p className="subtitle">Share your thoughts with the world</p>
      </header>

      <main className="container">
        {/* Create Post Form */}
        <section className="form-section">
          <h2>✍️ New Post</h2>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Write your post content here..."
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {error && <p className="error">⚠️ {error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : '🚀 Publish Post'}
            </button>
          </form>
        </section>

        {/* Posts List */}
        <section className="posts-section">
          <h2>📚 All Posts <span className="post-count">{posts.length}</span></h2>
          {fetching ? (
            <p className="empty">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="empty">No posts yet. Be the first to write one!</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
                onEdit={setEditingPost}
              />
            ))
          )}
        </section>
      </main>

      {/* Edit Modal */}
      {editingPost && (
        <EditModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default App;
