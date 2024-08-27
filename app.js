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
  const allowedOrigins = [
    "https://airbnb-clone-react-axxy.onrender.com",
    "https://superlative-llama-cbdfa0.netlify.app",
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

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
