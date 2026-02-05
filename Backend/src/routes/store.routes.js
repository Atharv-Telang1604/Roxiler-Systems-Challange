const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const store = require("../controllers/store.controller");

router.get("/", auth, store.getStores);

module.exports = router;
