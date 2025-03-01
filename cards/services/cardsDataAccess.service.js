import Card from "../models/Card.schema.js";

/* Create a new card */
const createNewCard = async (cardData) => {
    try {
        if (!cardData) throw new Error("Card not created");
        const newCard = new Card(cardData);
        if (!cardData.bizNumber) {
            newCard.bizNumber = Math.floor(100000 + Math.random() * 900000);
        }
        await newCard.save();
        return newCard;
    } catch (err) {
        throw new Error(err.message);
    }
};

/* Get user's cards */
const getUserCards = async (userId) => {
    try {
        const myCards = await Card.find({ userId });
        if (!myCards.length) throw new Error("No cards found");
        return myCards;
    } catch (err) {
        throw new Error(err.message);
    }
};

/* Get card by ID */
const getCardById = async (cardId) => {
    try {
        const card = await Card.findById(cardId);
        if (!card) throw new Error("Card not found");
        return card;
    } catch (err) {
        throw new Error(err.message);
    }
};

/* Update card by ID */
const updateCard = async (cardId, cardData) => {
    try {
        const card = await Card.findByIdAndUpdate(cardId, cardData, { new: true });
        if (!card) throw new Error("Card not found");
        return card;
    } catch (err) {
        throw new Error(err.message);
    }
};

/* Delete card by ID */
const deleteCard = async (cardId) => {
    try {
        const card = await Card.findByIdAndDelete(cardId);
        if (!card) throw new Error("Card not found");
        return card;
    } catch (err) {
        throw new Error(err.message);
    }
};

/* Toggle card like */
const toggleCardLike = async (cardId, userId) => {
    try {
        const card = await Card.findById(cardId);
        if (!card) throw new Error("Card not found");
        if (card.likes.includes(userId)) {
            card.likes = card.likes.filter(id => id.toString() !== userId);
        } else {
            card.likes.push(userId);
        }
        await card.save();
        return card;
    } catch (err) {
        throw new Error(err.message);
    }
};

export { createNewCard, getCardById, updateCard, deleteCard, getUserCards, toggleCardLike };
