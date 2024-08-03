import ListingModel from "../model/ListingModel.js";
import PlaceModel from "../model/PlaceModel.js";
import mongoose from "mongoose";

//************* ADD NEW PLACE *****************/
export const addNewPlace = async (req, res, next) => {
  try {
    const { title, address, photos, description, amenities, tags } = req.body;
    const user = req.user;

    //Validation
    if (!title || !address || !description || !photos || !amenities || !tags) {
      return res.status(422).json({
        message: "Please Provide All Fields!",
      });
    }

    //Add new place
    let newPlace = new PlaceModel({
      owner: user.userId,
      title,
      address,
      photos,
      description,
      amenities,
      tags,
    });

    await newPlace.save();

    return res.status(201).json({
      message: "Place Created Successfully!",
      data: {
        newPlace,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//****************** GET ALL ADDED PLACES ********************** /
export const addedPlaces = async (req, res, next) => {
  try {
    const user = req.user;

    const addedPlace = await PlaceModel.find({ owner: user.userId });

    if (addedPlaces.length === 0) {
      return res.status(404).json({
        message: "No places found for the user.",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: {
        addedPlace,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//****************** GET PLACES BY ID ********************** /
export const getPlacesById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID!",
      });
    }

    //Get place
    const place = await PlaceModel.findById(id);
    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    //Res message
    return res.status(200).json({
      message: "Success",
      data: {
        place,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//****************** UPDATE PLACES ********************** /
export const updatePlace = async (req, res, next) => {
  try {
    const { id, title, address, photos, description, amenities, tags } =
      req.body;
    const user = req.user;

    //Validation
    if (
      !title ||
      !address ||
      !description ||
      !photos ||
      !amenities ||
      !id ||
      !tags
    ) {
      return res.status(422).json({
        message: "Please Provide All Fields!",
      });
    }

    const placeDocument = await PlaceModel.findById(id);

    //User id match
    if (user.userId === placeDocument.owner.toString()) {
      //Place Update
      let updatedPlace = placeDocument.set({
        title,
        address,
        photos,
        amenities,
        description,
        tags,
      });
      await updatedPlace.save();
      return res.status(200).json({
        message: "Place Updated Successfully!",
        data: {
          updatedPlace,
        },
      });
    } else {
      //user not match
      return res.status(401).json({
        message: "Invalid User!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//********** GET ALL ADDED PLACES (ADDED BY ALL USER) ******************* /
export const getAllAddedPlaces = async (req, res, next) => {
  try {
    const allPlaces = await PlaceModel.find();
    if (!allPlaces) {
      return res.status(404).json({
        message: "No Places Found!",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: {
        allPlaces,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//********** DELETE PLACE ******************* /
export const deletePlace = async (req, res, next) => {
  try {
    const { placeId } = req.body;
    const user = req.user;

    const place = await PlaceModel.findById(placeId);
    if (user.userId !== place.owner.toString()) {
      //user not match
      return res.status(401).json({
        message: "Invalid User!",
      });
    }

    // Check for active listings associated with this place
    const activeListings = await ListingModel.find({ property: placeId });
    if (activeListings.length > 0) {
      return res.status(400).json({
        message:
          "Error: Cannot Delete ,there are active listings associated with it.",
      });
    }

    const deletedPlace = await PlaceModel.findByIdAndDelete(placeId);
    return res.status(200).json({
      message: "Place Removed!",
      data: {
        deletedPlace,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
