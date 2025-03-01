import { Router } from "express";
import Card from "../models/Card.schema.js";
import { 
    createNewCard, deleteCard, getCardById, 
    getUserCards, toggleCardLike, updateCard 
} from "../services/cardsDataAccess.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { isBusiness } from "../../middlewares/isBusiness.js";
import { isUser } from "../../middlewares/isUser.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const cardRouter = Router();

// Get all cards
cardRouter.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create a new card (Requires authentication & business role)
cardRouter.post("/", auth, isBusiness, async (req, res) => {
    try {
        const cardData = { ...req.body, userId: req.user._id };
        const card = await createNewCard(cardData);
        res.json(card);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get user-specific cards (Requires authentication)
cardRouter.get("/my-cards", auth, async (req, res) => {
    try {
        const myCards = await getUserCards(req.user._id);
        res.json(myCards);
    } catch (err) {
        res.status(404).send("No Cards Found");
    }
});

// Get card by ID
cardRouter.get("/:id", async (req, res) => {
    try {
        const card = await getCardById(req.params.id);
        res.json(card);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// Update card by ID (Requires authentication & user role)
cardRouter.put("/:id", auth, isUser, async (req, res) => {
    try {
        await updateCard(req.params.id, req.body);
        res.json(req.body);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete card by ID (Requires authentication & user role)
cardRouter.delete("/:id", auth, isUser, async (req, res) => {
    try {
        const card = await deleteCard(req.params.id);
        res.json({ message: "Card deleted successfully", card });
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// Like/unlike a card (Requires authentication)
cardRouter.patch("/:id", auth, async (req, res) => {
    try {
        const card = await toggleCardLike(req.params.id, req.user._id);
        res.json(card);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Change bizNumber (Requires authentication & admin role)
cardRouter.patch("/bizNumber/:id", auth, isAdmin, async (req, res) => {
    try {
        const existingCard = await Card.findOne({ 
            bizNumber: req.body.bizNumber, _id: { $ne: req.params.id } 
        });
        if (existingCard) return res.status(409).json({ message: "bizNumber is already taken" });
        
        const cardToUpdate = await Card.findById(req.params.id);
        cardToUpdate.bizNumber = req.body.bizNumber;
        await cardToUpdate.save();
        res.json({ message: "bizNumber changed successfully", cardToUpdate });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default cardRouter;
