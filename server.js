const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const app = express();
const port = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup (Assuming you have MongoDB installed locally)
mongoose.connect(process.env.MONGODBURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB Schema and Model
const routeSchema = new mongoose.Schema({
  technicianId: String,
  technicianLocation: {
    lat: Number,
    lng: Number,
  },
  jobLocations: [
    {
      lat: Number,
      lng: Number,
    },
  ],
});

const Route = mongoose.model('Route', routeSchema);

app.post('/planRoute', async (req, res) => {
  const { technicianId, technicianLocation, jobLocations } = await req.body;

  const newRoute = new Route({
    technicianId,
    technicianLocation,
    jobLocations,
  });

  try {
    await newRoute.save();
    res.json({ message: 'Route planned successfully.' });
  } catch (err) {
    console.error('Error saving route:', err);
    res.status(500).json({ message: 'Error saving route.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at ${BASE_URL}`);
});
