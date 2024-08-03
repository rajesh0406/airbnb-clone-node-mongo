import express from "express";
import {
  addNewPlace,
  addedPlaces,
  getPlacesById,
  updatePlace,
  getAllAddedPlaces,
  deletePlace,
} from "../controller/placeController.js";
import authenticate from "../middleware/authenticate.js";

//Router Obj
const router = express.Router();

//Add New Place
router.post("/add-new-place", authenticate, addNewPlace);

//Get all addeded places (By User)
router.get("/added-places", authenticate, addedPlaces);

//Get places by ID (By Place ID)
router.get("/places/:id", getPlacesById);

//Update Place
router.put("/updatePlace", authenticate, updatePlace);

//Get all added Places (Home page)
router.get("/all-added-places", getAllAddedPlaces);

// Delete Place
router.post("/delete-place", authenticate, deletePlace);

//Export
export default router;
