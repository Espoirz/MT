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
  getCaptureLocations,
  captureWildDog,
  getShelterDogs,
  adoptDog,
  sponsorDog,
} = require('../controllers/dogController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/breeds', getBreeds);
router.use(auth); // All routes below require authentication

// Capture system routes
router.get('/capture-locations', getCaptureLocations);
router.post('/capture', captureWildDog);

// Shelter system routes
router.get('/shelter', getShelterDogs);
router.post('/adopt/:id', adoptDog);
router.post('/sponsor/:id', sponsorDog);

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
