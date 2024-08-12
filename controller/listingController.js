import mongoose from "mongoose";
import ListingModel from "../model/ListingModel.js";
import PlaceModel from "../model/PlaceModel.js";
import BookingModel from "../model/BookingModel.js";

//************ CREATE LISTING **************/
export const createListing = async (req, res, next) => {
  try {
    const user = req.user;
    const { placeId, availableDates, pricePerNight, maxPeople } = req.body;

    // Validation
    if (!placeId || !availableDates || !pricePerNight || !maxPeople) {
      return res.status(422).json({
        message: "Please Provide All Fields!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({
        message: "Invalid Place ID!",
      });
    }

    const place = await PlaceModel.findById(placeId);
    console.log("userId", user.userId);
    console.log("ownerId", place.owner.toString());

    if (user.userId !== place.owner.toString()) {
      return res.status(422).json({
        message: "Invalid User!",
      });
    }

    // Listing
    const listing = new ListingModel({
      availableDates,
      pricePerNight,
      property: placeId,
      maxPeople,
    });
    await listing.save();

    return res.status(201).json({
      message: "Listing Created Successfully!",
      data: {
        listing,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************ GET ALL LISTINGS **************/
export const getAllListings = async (req, res, next) => {
  try {
    const { search, tags } = req.query;

    let matchStage = {};

    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      matchStage = {
        ...matchStage,
        $or: [
          { "property.title": { $regex: searchRegex } },
          { "property.description": { $regex: searchRegex } },
          { "property.address": { $regex: searchRegex } },
        ],
      };
    }

    // Filter by tags in the Place schema
    if (tags) {
      let tagArr = tags.split(",").map((tag) => tag.trim());
      matchStage = {
        ...matchStage,
        "property.tags": { $in: tagArr },
      };
    }

    const listings = await ListingModel.aggregate([
      {
        $lookup: {
          from: "places",
          localField: "property",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" }, // Ensure we have a document or remove documents with null properties
      { $match: matchStage }, // Apply the search and tag filtering
      {
        $project: {
          "property.title": 1,
          "property.description": 1,
          "property.tags": 1,
          "property.photos": 1,
          "property._id": 1,
          "property.address": 1,
          availableDates: 1,
          maxPeople: 1,
          pricePerNight: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]).exec();

    return res.status(200).json({
      message: "Success",
      data: {
        listings,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************ GET LISTING OF HOST **************/
export const getAllListingsOfUser = async (req, res, next) => {
  try {
    const user = req.user;

    const listings = await ListingModel.find({}).populate({
      path: "property",
      match: { owner: user.userId },
    });

    return res.status(200).json({
      message: "Success",
      data: {
        listings,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************ GET LISTING BY ID **************/
export const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return res.status(400).json({
        message: "Invalid ID!",
      });
    }

    //Get list
    const listing = await ListingModel.findById(id).populate({
      path: "property",
      populate: {
        path: "owner",
      },
    });
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    //Res message
    return res.status(200).json({
      message: "Success",
      data: {
        listing,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************ UPDATE LISTING **************/
export const updateListing = async (req, res, next) => {
  try {
    const user = req.user;
    const { availableDates, pricePerNight, listingId } = req.body;

    // Validation
    if (!availableDates || !pricePerNight || !listingId) {
      return res.status(422).json({
        message: "Please Provide All Fields!",
      });
    }

    // Listing
    const listing = await ListingModel.findById(listingId).populate({
      path: "place",
      match: {
        owner: user.userId,
      },
    });

    if (!listing) {
      // Listing Id did not match
      return res.status(422).json({
        message: "Invalid Listing!",
      });
    }

    let updatedListing = listing.set({
      availableDates,
      pricePerNight,
    });
    await updatedListing.save();

    return res.status(200).json({
      message: "Listing Updated Successfully!",
      data: {
        listing,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************ DELETE LISTING **************/
export const deleteListing = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const user = req.user;

    const listing = await ListingModel.findById(listingId).populate({
      path: "property",
      match: {
        owner: user.userId,
      },
    });

    if (!listing) {
      // Listing Id did not match
      return res.status(422).json({
        message: "Invalid Listing!",
      });
    }

    const now = new Date();

    // Find active bookings (ongoing bookings)
    const activeBookings = await BookingModel.find({
      listing: listingId,
      checkIn: { $lte: now },
      checkOut: { $gte: now },
    });

    // Find future bookings (bookings scheduled in the future)
    const futureBookings = await BookingModel.find({
      listing: listingId,
      $or: [
        { checkIn: { $gt: now } }, // Check if checkIn is greater than current date
        { checkOut: { $gt: now } }, // Check if checkOut is greater than current date
      ],
    });

    if (activeBookings?.length > 0 || futureBookings?.length > 0) {
      return res.status(400).json({
        message:
          activeBookings?.length > 0 && futureBookings?.length > 0
            ? "Error: Cannot Delete. There are upcoming and active bookings associated with it."
            : `Error: Cannot Delete. There are ${
                activeBookings?.length > 0 ? "active" : "upcoming"
              } bookings associated with it.`,
      });
    }

    const deletedListing = await ListingModel.findByIdAndDelete(listingId);
    return res.status(200).json({
      message: "Place Removed!",
      data: {
        deletedListing,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
