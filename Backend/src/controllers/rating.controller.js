const Rating = require("../models/rating.model");

exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    if (rating > 5 || rating < 1) {
      return res.status(400).json({ message: "Rating must be between 1 to 5" });
    }

    await Rating.upsert(req.user.id, storeId, rating);

    res.json({ message: "Thanks for rating Rating submitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};
  