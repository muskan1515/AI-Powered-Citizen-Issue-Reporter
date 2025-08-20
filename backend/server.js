const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan")
const helmet = require("helmet")

const authRoutes = require("./src/routes/auth.routes.js");
const userRoutes = require("./src/routes/user.routes.js");
const complaintsRoutes = require("./src/routes/complaint.routes.js");
const { connectDB } = require("./src/config/db.js");
const { generalLimiter } = require("./src/middleware/ratelimiter.js");
const { notFound, errorHandler } = require("./src/middleware/errorHandler.js");

dotenv.config();

const app = express();

app.use(morgan('dev'))
app.use(helmet())
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalLimiter);


app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/complaints", complaintsRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
