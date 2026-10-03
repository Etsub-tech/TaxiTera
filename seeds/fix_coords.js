import "dotenv/config";
import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const coll = mongoose.connection.collection('terminals');
    const terminals = await coll.find({}).toArray();
    let fixed = 0;

    for (const t of terminals) {
      const loc = t.location;
      if (!loc || !Array.isArray(loc.coordinates)) continue;
      const [a, b] = loc.coordinates;
      if (typeof a === 'number' && typeof b === 'number' && a < 20 && b > 20) {
        const newCoords = [b, a];
        await coll.updateOne({ _id: t._id }, { $set: { 'location.coordinates': newCoords } });
        fixed++;
        console.log(`Fixed ${t._id}: [${a}, ${b}] -> [${newCoords}]`);
      }
    }

    console.log(`Done. Documents fixed: ${fixed}`);
    process.exit(0);
  } catch (err) {
    console.error('Error fixing coordinates:', err);
    process.exit(1);
  }
})();
