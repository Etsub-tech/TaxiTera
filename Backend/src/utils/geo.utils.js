import axios from "axios";
import https from "https"; // just for untrusted certificates

const LOCATIONIQ_KEY = process.env.LOCATIONIQ_KEY;

if (!LOCATIONIQ_KEY) {
  console.warn("Warning: LOCATIONIQ_KEY not set in .env → geocoding will fail");
}

export const getCoordinates = async (address) => {
  if (!address?.trim()) return null;

  try {
    const query = `${address.trim()}, Addis Ababa, Ethiopia`;

    const response = await axios.get(
      "https://api.locationiq.com/v1/autocomplete",
      {
        params: {
          key: LOCATIONIQ_KEY,
          q: query,
          limit: 1,
          countrycodes: "et",
          viewbox: "38.6,8.8,39.0,9.2",
          bounded: 1,
        },
        timeout: 5000,
        headers: {
          "User-Agent": "TaxiTera-App/1.0 (contact@TaxiTera.com)",
        },
        // just to SELF-SIGNED CERT
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Ignore self-signed / invalid certs
        }),
      },
    );

    if (response.data?.length > 0) {
      const best = response.data[0];
      return {
        lat: parseFloat(best.lat),
        lng: parseFloat(best.lon),
        displayName: best.display_name || address,
        confidence: best.importance || 0,
      };
    }

    console.warn(`No results for "${address}"`);
    return null;
  } catch (error) {
    console.error("LocationIQ geocoding failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    }
    return null;
  }
};
