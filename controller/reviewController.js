import mongoose from "mongoose";
import ReviewModel from "../model/ReviewModel.js";
import BookingModel from "../model/BookingModel.js";

//************* ADD NEW REVIEW *****************/
export const addReview = async (req, res, next) => {
  try {
    const { listing, comment, rating } = req.body;
    const user = req.user;

    //Validation
    if (!listing || !comment || !rating) {
      return res.status(422).json({
        message: "Please Provide All Fields!",
      });
    }

    const booking = await BookingModel.find({
      guest: user.userId,
      listing: listing,
    });

    // Only user who have made a booking can add a review
    if (booking.length === 0) {
      return res.status(401).json({
        message: "Error: Only booked users can add a review",
      });
    }

    const newReview = new ReviewModel({
      comment,
      listing,
      rating,
      reviewer: user.userId,
    });
    await newReview.save();
    x;

    return res.status(201).json({
      message: "Review Added Successfully!",
      data: {
        newReview,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************* GET ALL REVIEWS *****************/
export const getAllReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return res.status(400).json({
        message: "Invalid ID!",
      });
    }

    const reviews = await ReviewModel.find({
      listing: id,
    }).populate({
      path: "reviewer",
      select: "name email createdAt _id",
    });

    return res.status(200).json({
      message: "Success",
      data: {
        reviews,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************* GET REVIEW BY ID *****************/
export const getReviewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await ReviewModel.findById(id);

    if (!review) {
      return res.status(400).json({
        message: "Error: Invalid Review Id!",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: {
        review,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************* DELETE REVIEW *****************/
export const deleteReview = async (req, res, next) => {
  try {
    const user = req.user;
    const { reviewId } = req.body;

    const review = await ReviewModel.findById(reviewId);
    if (user.userId !== review.reviewer?.toString()) {
      return res.status(401).json({
        message: "Error: Invalid User!",
      });
    }

    if (!review) {
      return res.status(400).json({
        message: "Error: Invalid Review Id!",
      });
    }

    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);
    return res.status(200).json({
      message: "Success",
      data: {
        deletedReview,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
