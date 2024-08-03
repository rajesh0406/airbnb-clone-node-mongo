import express from "express";
import {
  bookingPlace,
  getBookingOfUser,
  getBookingDetails,
} from "../controller/bookingController.js";
import authenticate from "../middleware/authenticate.js";

//Router Obj
const router = express.Router();

//Booking Place
router.post("/bookings", authenticate, bookingPlace);

// Get all booking of user (By User Id)
router.get("/getBookings", authenticate, getBookingOfUser);

//Get booking details (By Booking Id)
router.get("/getBooking/:id", authenticate, getBookingDetails);

//Export
export default router;
