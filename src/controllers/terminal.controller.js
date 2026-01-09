import Terminal from "../models/Terminal.model.js";

export const searchTerminals = async (req, res) => {
  try {
    const { latitude, longitude, destination } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "User location is required" });
    }

    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);

    // Build query for nearby terminals
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userLongitude, userLatitude], // Mongo expects [lon, lat]
          },
          $maxDistance: 10000, // 10 km radius
        },
      },
    };

    // If destination provided, filter routes
    if (destination) {
      query.routes = { $in: [destination] };
    }

    // Find terminals
    const terminals = await Terminal.find(query);

    if (!terminals.length) {
      return res.status(404).json({ message: "No nearby taxi terminals found" });
    }

    // Return terminal info; hide price if user not logged in
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
    console.error("searchTerminals error:", error);
    res.status(500).json({ message: error.message });
  }
};
