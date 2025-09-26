const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));

// Iniciar
connectDB();
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
