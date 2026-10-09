const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Jwt a");
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`ServerRunning on ${PORT}`);
  });
};

// const startServer = async () => {
//   try {
//     await dbConnect();

//     const server = app.listen(PORT, "127.0.0.1", () => {
//       console.log(`Server running at http://127.0.0.1:${PORT}`);
//     });

//     server.on("error", (error) => {
//       console.error("Server error:", error.message);
//     });
//   } catch (error) {
//     console.error("Startup failed:", error.message);
//   }
// };

// startServer();

// const startServer = async () => {
//   try {
//     await dbConnect();

//     const server = app.listen(PORT, "127.0.0.1", () => {
//       console.log(`Open http://127.0.0.1:${PORT}`);
//     });

//     server.on("error", (error) => {
//       console.error("Server error:", error.message);
//     });
//   } catch (error) {
//     console.error("Startup failed:", error.message);
//   }
// };

// startServer();

startServer();
