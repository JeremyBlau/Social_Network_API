const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/api/users');
const thoughtRoutes = require('./routes/api/thoughts');
const reactionRoutes = require('./routes/api/reactions');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/thoughts/:thoughtId/reactions', reactionRoutes);

// Default response for unmatched routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Mongoose connection
mongoose.connect('mongodb://localhost/social-media', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
