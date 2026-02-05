const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const admin = require("../controllers/admin.controller");
const store = require("../controllers/store.controller");

router.get("/dashboard", auth, role("ADMIN"), admin.getDashboard);


router.post("/stores", auth, role("ADMIN"), store.createStore);
router.get("/stores", auth, role("ADMIN"), store.getStores);


router.post("/users", auth, role("ADMIN"), admin.createUser);
router.get("/users", auth, role("ADMIN"), admin.listUsers);
router.get("/users/:id", auth, role("ADMIN"), admin.getUserDetails);

module.exports = router;
