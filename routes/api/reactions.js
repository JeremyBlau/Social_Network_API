const router = require('express').Router();
const {
  addReaction,
  removeReaction,
} = require('../../controllers/reaction-controller');

// /api/thoughts/:thoughtId/reactions
router
  .route('/:thoughtId/reactions')
  .post(addReaction)
  .delete(removeReaction);

module.exports = router;
