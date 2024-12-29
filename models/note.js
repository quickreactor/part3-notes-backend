// MOGOOSE STUFF ------------------------------------------
const mongoose = require("mongoose");
const util = require("util");
require("dotenv").config();

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
// console.log(process.env, "lol")

mongoose
    .connect(url)
    .then((res) => {
        console.log(`Connected to MongoDB...`);
    })
    .catch((err) => {
        console.log(`Error connecting to MongoDB: ${err}`);
    });

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true,
    },
    important: Boolean,
});

noteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Note", noteSchema);

// ENDF MONGOOSE ---------------------------------------
