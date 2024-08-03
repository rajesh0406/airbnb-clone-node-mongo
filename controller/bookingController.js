import BookingModel from "../model/BookingModel.js";
import mongoose from "mongoose";

//*************** ADD NEW BOOKING *********************/
export const bookingPlace = async (req, res, next) => {
  try {
    const {
      listing,
      checkIn,
      checkOut,
      numberOfAdults,
      numberOfChildren,
      totalPrice,
    } = req.body;
    const user = req.user;

    // Validation
    if (!listing || !checkIn || !checkOut || !numberOfAdults || !totalPrice) {
      return res.status(422).json({
        message: "Please Provide All Fields!",
      });
    }

    // Booking
    const booking = new BookingModel({
      listing,
      checkIn,
      checkOut,
      numberOfAdults,
      numberOfChildren,
      totalPrice,
      mobile: user.mobile,
      price,
      guest: user.id,
    });
    await booking.save();

    return res.status(201).json({
      message: "Booking Successfull!",
      data: {
        booking,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//********* GET ALL BOOKINGS OF USER (BY USER ID) ************/
export const getBookingOfUser = async (req, res, next) => {
  try {
    const user = req.user;

    //Get Bookings
    const allBookingsOfUser = await BookingModel.find({
      guest: user.userId,
    }).populate("listing");
    if (allBookingsOfUser.length === 0) {
      return res.status(404).json({
        message: "No places found for the user.",
      });
    }

    //Success response
    return res.status(200).json({
      message: "Success",
      data: {
        allBookingsOfUser,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//********* GET BOOKING DETAILS (BY BOOKING ID) ************/
export const getBookingDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID!",
      });
    }

    //Get Booking
    const booking = await BookingModel.findById(id).populate("listing");
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    //Res
    return res.status(200).json({
      message: "Success",
      data: {
        booking,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
