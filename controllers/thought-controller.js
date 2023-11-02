const { Thought, User } = require("../models");

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.error(err); // Log the error for debugging
        res.status(500).json(err);
      });
  },

  // Get a single thought by its _id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select('-__v')
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        return res.json(thought);
      })
      .catch((err) => {
        console.error(err); // Log the error for debugging
        res.status(500).json(err);
      });
  },

  // Create a new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json(err));
  },

  // Update a thought by its _id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        return res.json(thought);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Remove a thought by its _id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        return User.findOneAndUpdate(
          { thoughts: params.thoughtId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json(err));
  },

  // Create a reaction stored in a thought's reactions array field
  addReaction({ params, body }, res) {
    if (!body || !body.reactionBody || !body.username) {
      return res.status(400).json({ message: 'Invalid reaction data. Please provide both reactionBody and username.' });
    }
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        return res.json(thought);
      })
      .catch((err) => {
        console.error(err); // Log the error for debugging
        res.status(500).json(err);
      });
  },

  // Pull and remove a reaction by the reaction's reactionId value
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id' });
        }
        return res.json(thought);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtController;
