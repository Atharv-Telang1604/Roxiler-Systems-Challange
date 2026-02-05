const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/update-password", auth, authController.updatePassword);

module.exports = router;
