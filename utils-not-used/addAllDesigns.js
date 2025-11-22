const express = require("express");
const app = express();
const axios = require("axios");
const connectDB = require("./db/connect");
const daesigns = require("./routes/designs");
require("dotenv").config();
const data = require("./fives");

// middleware

app.use(express.json());

// Routes
app.use("/api/v1/designs", designs);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`Connected to DB`);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      await axios.post("http://localhost:5000/api/v1/designs", item);
    }
  } catch (error) {
    console.log(error);
  }
};

start();
