require('dotenv').config();
import { listen } from './src/app';

const PORT = process.env.PORT || 5000;

listen(PORT, () => {
  console.log(`TaxiTera backend running on port ${PORT}`);
});
