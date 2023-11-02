const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction'); // Import the schema

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAt) => dateFormat(createdAt),
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema], // Define reactions as an array of embedded documents
});

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
