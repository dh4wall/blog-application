const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/posts', postRoutes);

// Root route
/* app.get('/', (req, res) => {
  res.send('Blog API is running...');
}); */

// Serve Vite build (dist)



// -----------comment these if using 2 separate VMs (backend VM + frontend VM)
// If using 1 VM: uncomment these AND run 'npm run build' in frontend first
// NOTE: Vite builds to 'dist/', NOT 'build/' like CRA

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
