import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
  createListing,
  deleteListing,
  getAllListings,
  getAllListingsOfUser,
  getListingById,
  updateListing,
} from "../controller/listingController.js";

//Router Obj
const router = express.Router();

//***** Create routes */

//Create Listings
router.post("/create-listing", authenticate, createListing);

// Get All Listings
router.get("/all-listings", getAllListings);

// Get All Listings Of A User
router.get("/all-listings-of-user", authenticate, getAllListingsOfUser);

// Get Listing By Id
router.get("/listing-of-id", getListingById);

// Update Listing
router.post("/update-listing", authenticate, updateListing);

// Delete Listing
router.post("/delete-listing", authenticate, deleteListing);

//Export
export default router;
