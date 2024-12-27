const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Note = require("./models/note");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// GET ALL NOTES
app.get("/api/notes", (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    });
});

// GET NOTE BY ID
app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch((err) => next(err));
});

// CREATE NEW NOTE
app.post("/api/notes", (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({
            error: "content missing",
        });
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    note.save().then((savedNote) => {
        response.json(savedNote);
    });
});

// CHANGE NOTE BY ID
app.put("/api/notes/:id", (req, res) => {
    const { content, important } = req.body;

    const note = {
        content,
        important,
    };

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then((updatedNote) => res.json(updatedNote))
        .catch((err) => next(err));
});

//DELETE NOTE BY ID
app.delete("/api/notes/:id", (request, response) => {
    Note.findByIdAndDelete(request.params.id)
        .then((result) => response.status(204).end())
        .catch((err) => next(err));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
