import Offer from "../models/Offer.js";
import { deleteCloudinaryImage } from "../utils/cloudinaryHelper.js";

export const createOffer = async (req, res) => {
  try {
    const offerData = {
      title: req.body.title,
      description: req.body.description,
      link: req.body.link || "",
      discount: req.body.discount || "",
      sortOrder: Number(req.body.sortOrder) || 0,
    };

    if (req.files?.image) {
      offerData.image = req.files.image[0].path;
    }

    const offer = await Offer.create(offerData);
    res.status(201).json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating offer." });
  }
};

export const getOffers = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const filter = activeOnly === "true" ? { isActive: true } : {};
    const offers = await Offer.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching offers." });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const existing = await Offer.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Offer not found." });

    const updateData = { ...req.body };

    if (req.files?.image) {
      await deleteCloudinaryImage(existing.image);
      updateData.image = req.files.image[0].path;
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === "true" || updateData.isActive === true;
    }
    if (updateData.sortOrder) {
      updateData.sortOrder = Number(updateData.sortOrder);
    }

    const offer = await Offer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: "Server error while updating offer." });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found." });
    await deleteCloudinaryImage(offer.image);
    res.json({ message: "Offer deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting offer." });
  }
};

export const toggleOfferActive = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found." });
    offer.isActive = !offer.isActive;
    await offer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
