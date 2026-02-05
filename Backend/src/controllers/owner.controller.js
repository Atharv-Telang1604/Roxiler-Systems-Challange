const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const storesResult = await db.query(
      "SELECT id, name FROM stores WHERE owner_id = $1",
      [ownerId]
    );

    const stores = storesResult.rows;

    if (!stores.length) {
      return res
        .status(404)
        .json({ message: "No store assigned to this owner" });
    }

    const storeId = stores[0].id;

    const ratingsResult = await db.query(
      `
      SELECT u.name, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      `,
      [storeId]
    );

    const ratings = ratingsResult.rows;

    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) /
      (ratings.length || 1);

    res.json({
      storeName: stores[0].name,
      averageRating: Number(avgRating.toFixed(1)),
      ratedBy: ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to load",
    });
  }
};
