import "dotenv/config";
import mongoose from "mongoose";

const routeToFind = process.argv[2] || 'Kasanchis';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const coll = mongoose.connection.collection('terminals');

    const regex = new RegExp(`^${routeToFind}$`, 'i');
    const results = await coll.find({ routes: { $elemMatch: { $regex: regex } } }).toArray();

    console.log(`Searching for route: ${routeToFind}`);
    console.log(`Found ${results.length} terminals:\n`);
    results.forEach(t => {
      console.log(`- ${t.name} | area: ${t.area} | routes: ${t.routes.join(', ')} | coords: ${JSON.stringify(t.location.coordinates)}`);
    });

    if (results.length === 0) {
      console.log('\nNo exact matches. Searching partial (contains) matches...');
      const partial = new RegExp(routeToFind, 'i');
      const partialResults = await coll.find({ routes: { $elemMatch: { $regex: partial } } }).toArray();
      console.log(`Found ${partialResults.length} partial matches:\n`);
      partialResults.forEach(t => {
        console.log(`- ${t.name} | area: ${t.area} | routes: ${t.routes.join(', ')} | coords: ${JSON.stringify(t.location.coordinates)}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
