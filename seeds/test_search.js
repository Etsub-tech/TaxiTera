import "dotenv/config";
import mongoose from "mongoose";

const payload = {
  latitude: 9.060956701749191,
  longitude: 38.740369186705685,
  destination: "kazanchis",
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const coll = mongoose.connection.collection('terminals');

    const geometry = { type: 'Point', coordinates: [payload.longitude, payload.latitude] };
    const baseQuery = { location: { $near: { $geometry: geometry, $maxDistance: 3000 } } };

    // 1) Exact-match server query (routes $in [destination])
    const serverQuery = { ...baseQuery };
    if (payload.destination) serverQuery.routes = { $in: [payload.destination] };
    const serverResults = await coll.find(serverQuery).toArray();

    // 2) Case-insensitive destination match
    const ciQuery = { ...baseQuery };
    if (payload.destination) ciQuery.routes = { $regex: new RegExp(`^${payload.destination}$`, 'i') };
    const ciResults = await coll.find(ciQuery).toArray();

    // 3) Nearby terminals ignoring destination
    const nearbyResults = await coll.find(baseQuery).toArray();

    console.log('Payload:', payload);
    console.log('\nServer-query results count:', serverResults.length);
    serverResults.forEach(r => console.log('-', r.name, r.routes, r.location.coordinates));

    console.log('\nCase-insensitive results count:', ciResults.length);
    ciResults.forEach(r => console.log('-', r.name, r.routes, r.location.coordinates));

    console.log('\nNearby (no destination) results count:', nearbyResults.length);
    nearbyResults.forEach(r => console.log('-', r.name, r.routes, r.location.coordinates));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
