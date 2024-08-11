import express from "express";
import {
  bookingPlace,
  getBookingOfUser,
  getBookingDetails,
  getBookingOfUserForListing,
  getReservations,
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

//Get booking details on listing
router.get(
  "/getBookingOnListing/:id",
  authenticate,
  getBookingOfUserForListing
);

//Get Reservations
router.get("/reservations", authenticate, getReservations);

//Export
export default router;
