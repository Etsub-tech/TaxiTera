import History from "../models/History.model.js";

//  Save history
export const saveHistory = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: "Both from and to are required" });
    }

    const history = await History.create({
      userId: req.user.id,
      from,
      to,
    });

    res.status(201).json({ message: "Search saved", data: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20); 

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get popular routes (for DashboardPage)
export const getPopularRoutes = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id });

    const routeCounts = {};

    history.forEach(item => {
      const key = `${item.from}→${item.to}`;
      routeCounts[key] = (routeCounts[key] || 0) + 1;
    });

    const popular = Object.entries(routeCounts)
      .map(([key, count]) => {
        const [from, to] = key.split("→");
        return { from, to, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json(popular);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
