const express = require('express');
const {
  getHorses,
  getHorse,
  createHorse,
  updateHorse,
  deleteHorse,
  breedHorses,
  trainHorse,
  getBreeds,
  getCaptureBiomes,
  captureWildHorse,
} = require('../controllers/horseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/breeds', getBreeds);
router.get('/capture/biomes', auth, getCaptureBiomes);
router.post('/capture', auth, captureWildHorse);
router.use(auth); // All routes below require authentication

router.route('/')
  .get(getHorses)
  .post(createHorse);

router.route('/:id')
  .get(getHorse)
  .put(updateHorse)
  .delete(deleteHorse);

router.post('/breed', breedHorses);
router.put('/:id/train', trainHorse);

module.exports = router;
