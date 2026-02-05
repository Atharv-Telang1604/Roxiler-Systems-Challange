const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const rating = require("../controllers/rating.controller");

router.post("/", auth, rating.submitRating);

module.exports = router;
