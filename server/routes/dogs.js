const express = require('express');
const {
  getDogs,
  getDog,
  createDog,
  updateDog,
  deleteDog,
  breedDogs,
  trainDog,
  getBreeds,
} = require('../controllers/dogController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/breeds', getBreeds);
router.use(auth); // All routes below require authentication

router.route('/')
  .get(getDogs)
  .post(createDog);

router.route('/:id')
  .get(getDog)
  .put(updateDog)
  .delete(deleteDog);

router.post('/breed', breedDogs);
router.put('/:id/train', trainDog);

module.exports = router;
