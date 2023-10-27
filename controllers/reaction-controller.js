// reaction-controller.js
const { Thought } = require('../models');

const reactionController = {
  // Create a reaction stored in a single thought's reactions array field
  addReaction({ params, body }, res) {
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
      .catch((err) => res.status(400).json(err));
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

module.exports = reactionController;
