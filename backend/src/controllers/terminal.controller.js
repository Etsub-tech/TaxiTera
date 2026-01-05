import Terminal from "../models/Terminal.model.js";

export const searchTerminals = async (req, res) => {
  try {
    const { latitude, longitude, destination } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "User location is required" });
    }

    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);

    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userLongitude, userLatitude],
          },
          $maxDistance: 3000, // 3 km
        },
      },
    };

    if (destination) {
      query.routes = { $in: [destination] };
    }

    const terminals = await Terminal.find(query);

    if (!terminals.length) {
      return res.status(404).json({ message: "No nearby taxi terminals found" });
    }

    // If user is authenticated, price will be shown
    // Otherwise, hide price
    const isLoggedIn = req.user ? true : false;

    const response = terminals.map((terminal) => ({
      _id: terminal._id,
      name: terminal.name,
      area: terminal.area,
      routes: terminal.routes,
      location: terminal.location,
      price: req.user ? terminal.price : null,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};