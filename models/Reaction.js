const { Schema } = require('mongoose');

const reactionSchema = new Schema({
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAt) => dateFormat(createdAt),
  },
});

module.exports = reactionSchema; // Export the schema, not the model
