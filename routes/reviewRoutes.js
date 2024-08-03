import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getReviewsById,
} from "../controller/reviewController.js";

//Router Obj
const router = express.Router();

//***** Create routes */

//Add Review
router.post("/add-review", authenticate, addReview);

//Get Review By Id
router.get("/review/:id", getReviewsById);

//Get All Reviews
router.get("/reviews", getAllReviews);

//Delete Reviews
router.post("/delete-review", authenticate, deleteReview);

export default router;
