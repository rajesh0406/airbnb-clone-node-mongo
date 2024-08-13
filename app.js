import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import ReviewRoutes from "./routes/reviewRoutes.js";

//********* DOTENV CONFIGURATION *****/
dotenv.config();

const server = async () => {
  //****** DATABASE CONFIG *****/
  await connectDB();

  //********* REST OBJECT ********/
  const app = express();

  //********* MIDDLEWARE **********/
  app.use(
    cors({
      origin:
        "https://airbnb-clone-react-a7f80va53-rajesh-jayaramans-projects.vercel.app", // Specify allowed origin
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed methods
      allowedHeaders: [
        "X-CSRF-Token",
        "X-Requested-With",
        "Accept",
        "Content-Type",
      ], // Allowed headers
      credentials: true,
    })
  );

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use("/uploads", express.static("uploads"));

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());

  //********* MIDDLEWARE ROUTES **********/
  app.use("/api/user", userRoutes);
  app.use("/api/place", placeRoutes);
  app.use("/api/book", bookingRoutes);
  app.use("/api/listing", listingRoutes);
  app.use("/api/review", ReviewRoutes);

  //********* PORTS AND LISTEN **********/
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(
      `Node server running in ${process.env.DEV_MODE} mode on Port ${port}.`
        .bgBrightMagenta.white
    );
  });
};

server();
