const Store = require("../models/store.model");

exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;


    if (req.user && req.user.role === "USER") {
      const stores = await Store.getAllWithUserRating(req.user.id, {
        name,
        address,
      });
      return res.json(stores);
    }

    
    const stores = await Store.getAllWithFilters({ name, email, address });
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address || !owner_id) {
      return res
        .status(400)
        .json({ message: "Name, email, address and owner_id are required" });
    }

    await Store.create({ name, email, address, owner_id });

    res.json({ message: "Store added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create store" });
  }
};
