import { Schema, model } from "mongoose";

const cardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    web: {
        type: String,
        required: false
    },
    image: {
        url: {
            type: String,
            required: false,
            default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.marca.com%2Fen%2Ffootball%2Fmls%2F2024%2F02%2F14%2F65ccfbc9268e3e5e2e8b45bd.html&psig=AOvVaw3kFWAdbDppKZGF3_QXQJYT&ust=1738597917001000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOiP35KspYsDFQAAAAAdAAAAABAE"
        },
        alt: {
            type: String,
            required: false
        }
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: false
        },
        zip: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        houseNumber: {
            type: String,
            required: true
        }
    },
    bizNumber: {
        type: Number,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "user",
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now, // fecha de creación automática
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("card", cardSchema);