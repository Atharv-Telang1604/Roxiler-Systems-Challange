const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const owner = require("../controllers/owner.controller");


router.get(
  "/dashboard",
  auth,
  role("STORE_OWNER"),
  owner.getDashboard
);

module.exports = router;
