import "dotenv/config";
import mongoose from "mongoose";
import Terminal from "../src/models/Terminal.model.js";  // 👈 import the model itself

const terminals = [

  {
    name: "Bole Edna Mall Terminal 1",
    area: "Bole",
    routes: ["Piyasa", "4 Kilo"],
    price: 25,
    location: { 
      type: "Point", 
      coordinates: [8.999077410485825, 38.785769581030316]
    },
  },

  {
    name: "Bole Edna Mall Terminal 1",
    area: "Bole",
    routes: ["Kasanchis"],
    price: 20,
    location: { 
      type: "Point", 
      coordinates: [8.999077410485825, 38.785769581030316]
    },
  }, 

  {
    name: "Bole Edna Mall Terminal 2",
    area: "Bole",
    routes: ["Megenagna"],
    price: 20,
    location: {
      type: "Point",
      coordinates: [8.997985024037764, 38.78728705404324],
    },
  },

  {
    name: "Bole Edna Mall Terminal 2",
    area: "Bole",
    routes: ["Gurdshola (Summit)"],
    price: 50,
    location: {
      type: "Point",
      coordinates: [8.997985024037764, 38.78728705404324],
    },
  },
  
  {
    name: "Bole Edna Mall Terminal 3",
    area: "Bole",
    routes: ["Bole"],
    price: 10,
    location: {
      type: "Point",
      coordinates: [8.997881217731683, 38.786796896372174],
    },
  },

  {
    name: "Bole Edna Mall Terminal 4",
    area: "Bole",
    routes: ["22"],
    price: 30,
    location: {
      type: "Point",
      coordinates: [8.990835849300968, 38.793067367536665],
    },
  },

  {
    name: "22 Terminal 1",
    area: "22",
    routes: ["Bole Edna Mall"],
    price: 15,
    location: {
      type: "Point",
      coordinates: [9.015556205797761, 38.78767090986596],
    },
  },

  {
    name: "22 Terminal 1",
    area: "22",
    routes: ["4 Kilo"],
    price: 15,
    location: {
      type: "Point",
      coordinates: [9.015556205797761, 38.78767090986596],
    },
  },

  {
    name: "22 Terminal 1",
    area: "22",
    routes: ["Piyasa"],
    price: 30,
    location: {
      type: "Point",
      coordinates: [9.015556205797761, 38.78767090986596],
    },
  }, 

  {
    name: "22 Terminal 1",
    area: "22",
    routes: ["Gurdshola (Summit)"],
    price: 35,
    location: {
      type: "Point",
      coordinates: [9.015556205797761, 38.78767090986596],
    },
  },

  {
    name: "22 Terminal 2",
    area: "22",
    routes: ["Megenagna"],
    price: 10,
    location: {
      type: "Point",
      coordinates: [9.016041801752639, 38.788070227056146],
    },
  },
  
  {
    name: "Gerji Terminal 1",
    area: "Gerji",
    routes: ["Megenagna"],
    price: 15,
    location: {
      type: "Point",
      coordinates: [8.995024428962918, 38.812473667536615],
    },
  },

  {
    name: "Gerji Terminal 1",
    area: "Gerji",
    routes: ["Bole"],
    price: 20,
    location: {
      type: "Point",
      coordinates: [8.995024428962918, 38.812473667536615],
    },
  },

  {
    name: "Gerji Terminal 1",
    area: "Gerji",
    routes: ["Woloo Sefer (Mexico)"],
    price: 30,
    location: {
      type: "Point",
      coordinates: [8.995024428962918, 38.812473667536615],
    },
  },
  
  {
    name: "Gerji Terminal 2",
    area: "Gerji",
    routes: ["Gerji Mebrat Hayil"],
    price: 10,
    location: {
      type: "Point",
      coordinates: [8.996210025131015, 38.813858409865865],
    },
  },

  {
    name: "Gerji Terminal 2",
    area: "Gerji",
    routes: ["Goro"],
    price: 25,
    location: {
      type: "Point",
      coordinates: [8.996210025131015, 38.813858409865865],
    },
  },

  {
    name: "Gerji Mebrat Hayil Terminal 1",
    area: "Gerji Mebrat Hayil",
    routes: ["Gurdshola"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.002825247706866, 38.81398528287863],
    },
  },

  {
    name: "Gerji Mebrat Hayil Terminal 1",
    area: "Gerji Mebrat Hayil",
    routes: ["Bole"],
    price: 20,
    location: { 
      type: "Point", 
      coordinates: [9.002825247706866, 38.81398528287863],
    },
  },

  {
    name: "Gerji Mebrat Hayil Terminal 2",
    area: "Gerji Mebrat Hayil",
    routes: ["Goro"],
    price: 20,
    location: { 
      type: "Point", 
      coordinates: [9.00389181031543, 38.81305762520782],
    },
  },

  {
    name: "Gerji Mebrat Hayil Terminal 3",
    area: "Gerji Mebrat Hayil",
    routes: ["Megenagna"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.00400621359875, 38.812971794524074], 
    },
  },

  {
    name: "Shola Terminal",
    area: "Yeka",
    routes: ["Piyasa"],
    price: 20,
    location: { 
      type: "Point", 
      coordinates: [9.025206199272436, 38.795953096372386],
    },
  },

  {
    name: "Shola Terminal",
    area: "Yeka",
    routes: ["4 Kilo"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.025206199272436, 38.795953096372386],
    },
  },

  {
    name: "Shola Terminal",
    area: "Yeka",
    routes: ["6 Kilo"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.025206199272436, 38.795953096372386],
    },
  },


  {
    name: "Megenagna (Alem Cinema)",
    area: "Yeka",
    routes: ["Gogam Berenda"],
    price: 35,
    location: { 
      type: "Point", 
      coordinates: [9.02182739378475, 38.79944049452433],
    },
  },

  {
    name: "Megenagna (Alem Cinema)",
    area: "Yeka",
    routes: ["Merkato"],
    price: 25,
    location: { 
      type: "Point", 
      coordinates: [9.02182739378475, 38.79944049452433],
    },
  },

  {
    name: "Megenagna (Alem Cinema)",
    area: "Yeka",
    routes: ["Autobis Tera"],
    price: 40,
    location: { 
      type: "Point", 
      coordinates: [9.02182739378475, 38.79944049452433],
    },
  },

  {
    name: "Megenagna (Alem Cinema)",
    area: "Yeka",
    routes: ["Piyasa", "4 Kilo"],
    price: 20,
    location: { 
      type: "Point", 
      coordinates: [9.02182739378475, 38.79944049452433],
    },
  },
  
  {
    name: "Megenagna Terminal (22 / Golagol)",
    area: "Yeka",
    routes: ["22"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.01937524138093, 38.799295023359754],
    },
  },

  {
    name: "Megenagna Terminal (22 / Golagol)",
    area: "Yeka",
    routes: ["Golagol"],
    price: 10,
    location: { 
      type: "Point", 
      coordinates: [9.01937524138093, 38.799295023359754],
    },
  },

  {
    name: "Megenagna – Admas University",
    area: "Yeka",
    routes: ["Gerji"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.019237991877588, 38.800890596372334] 
    },
  },

  {
    name: "Megenagna (24 Taxi Tera)",
    area: "Yeka",
    routes: ["24 Taxi Tera"],
    price: 10,
    location: { 
      type: "Point", 
      coordinates: [9.018449415206705, 38.79925398103056]
    },
  },

  {
    name: "Megenagna (24 Taxi Tera)",
    area: "Yeka",
    routes: ["Edna Mall"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.018449415206705, 38.79925398103056]
    },
  },

  {
    name: "24 Taxi Tera",
    area: "Yeka",
    routes: ["Edna Mall"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.008260017705158, 38.79554502335949] 
    },
  },

  {
    name: "Megenagna Taxi Station – Terminal 1",
    area: "Yeka",
    routes: ["Betel"],
    price: 25,
    location: { 
      type: "Point", 
      coordinates: [9.020473587087327, 38.802453096372375]
    },
  },

  {
    name: "Megenagna Taxi Station – Terminal 2",
    area: "Yeka",
    routes: ["Lamberet"],
    price: 10,
    location: { 
      type: "Point", 
      coordinates: [9.02106381753478, 38.80234866753686] 
    },
  },

  {
    name: "Megenagna Taxi Station – Terminal 2",
    area: "Yeka",
    routes: ["02"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.02106381753478, 38.80234866753686] 
    },
  },

  {
    name: "6 Kilo Terminal (Menelik)",
    area: "Arada",
    routes: ["Menelik"],
    price: 10,
    location: { 
      type: "Point", 
      coordinates: [9.043606186811157, 38.76289856568899] 
    },
  },

  {
    name: "6 Kilo Terminal (Menelik)",
    area: "Arada",
    routes: ["Megenagna", "Shola"],
    price: 15,
    location: { 
      type: "Point", 
      coordinates: [9.043606186811157, 38.76289856568899] 
    },
  },

  {
    name: "6 Kilo Terminal (Mazoria)",
    area: "Arada",
    routes: ["Mazoria", "Kela", "Ferensay", "Ankocha", "Eyesus"],
    price: 10,
    location: {
      type: "Point",
      coordinates: [38.7655310, 9.0450356],
    },
  },

  {
    name: "6 Kilo Terminal (Autobus Tera)",
    area: "Arada",
    routes: ["Giorgis"],
    price: 10,
    location: {
      type: "Point",
      coordinates: [38.7595953, 9.0439672],
    },
  },

  {
    name: "6 Kilo Terminal (Autobus Tera)",
    area: "Arada",
    routes: ["Autobis Tera"],
    price: 15,
    location: {
      type: "Point",
      coordinates: [38.7595953, 9.0439672],
    },
  },

  {
    name: "6 Kilo Terminal (Autobus Tera)",
    area: "Arada",
    routes: ["Merkato"],
    price: 20,
    location: {
      type: "Point",
      coordinates: [38.7595953, 9.0439672],
    },
  },

  {
    name: "5 Kilo Terminal",
    area: "Arada",
    routes: ["4 Kilo"],
    price: 10,
    location: {
      type: "Point",
      coordinates: [38.7619784, 9.0404991],
    },
  },

  {
    name: "5 Kilo Terminal",
    area: "Arada",
    routes: ["Mexico", "Beherawi Theater"],
    price: 15,
    location: {
      type: "Point",
      coordinates: [38.7619784, 9.0404991],
    },
  },

  {
    name: "Megenagna Terminal",
    area: "Yeka",
    routes: ["Bole", "Piazza"],
    price: 35,
    location: {
      type: "Point",
      coordinates: [38.7993, 9.0243],
    },
  },
  {
    name: "Bole Terminal",
    area: "Bole",
    routes: ["Megenagna"],
    price: 40,
    location: {
      type: "Point",
      coordinates: [38.7816, 9.0054],
    },
  },

  {
    name: "Adis Ketema Terminal 1",
    area: "Adis Ketema",
    routes: ["Abnet"],
    price: 20,
    location: {
      type: "Point",
      coordinates: [9.032787511530621, 38.732213084658156]
    },
  },

  {
    name: "Adis Ketema Terminal 2",
    area: "Adis Ketema",
    routes: ["Atana Tera"],
    price: 10,
    location: {
      type: "Point",
      coordinates: [9.034205085153598, 38.7291148134936]
    },
  },

  {
    name: "Adis Ketema Terminal 3",
    area: "Adis Ketema",
    routes: ["Paster"],
    price: 15,
    location: {
      type: "Point",
      coordinates: [9.034205085153598, 38.7291148134936]
    },
  },

];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Terminal.insertMany(terminals);   // 👈 call insertMany on the model
    console.log("Terminal data seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
})();
