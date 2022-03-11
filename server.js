//---* Import Dependencies *---//

require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override")
const path = require("path")

const Photograph = require("./models/photograph");


//---* Create Express App *---//
//views
app.use(express.static("public"));

app.set("view engine", "jsx")
app.engine("jsx", require("express-react-views").createEngine())


//models
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//---* Middleware *---//

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.body)
    next()
})
app.use(methodOverride("_method"));



//---* Routes *---//
//Home
app.get("/", (req, res) => {
    res.render("photographs/Home")
})

//Index
app.get("/photographs", (req, res) => {
    Photograph.find({}, (err, foundPhotographs) => {
        if (err) {
            res.status(400).json({ err })
        } else {
            res.render("photographs/Index", {
                photographs: foundPhotographs
            })
        }
    })
})

//New
app.get("/photographs/new", (req, res) => {
    res.render("photographs/New")
})

//Delete
app.delete("/photographs/:id", (req, res) => {
    const { id } = req.params;
    Photograph.findByIdAndDelete(id)
    .then(() => {
        res.redirect("/photographs")
    })
    .catch((error) => {
        res.status(400).json({ error })
    })
})

//Update
app.put("/photographs/:id", (req, res) => {
    Photograph.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedPhotograph) => {
        if(err){
            res.status(400).send(err)
        } else {
            res.redirect(`/photographs/${req.params.id}`)
        }
    })
})

//Create
app.post("/photographs", (req, res) => {
    Photograph.create(req.body, (error, createdPhotograph) => {
        if(error){
            res.status(400).json({ error })
        } else {
            res.redirect("/photographs")
        }
    })
})
//Edit
app.get("/photographs/:id/edit", (req, res) => {
    const { id } = req.params;
    Photograph.findById(id)
    .then((photograph) => {
        res.render("photographs/Edit", { photograph })
    })
    .catch((error) => {
        res.status(400).json({ error })
    })
})

//Show
app.get("/photographs/:id", (req, res) => {
    const { id } = req.params

    Photograph.findById(id) 
        .then((photograph) => {
            res.render("photographs/Show", { photograph })
        })
        .catch((error) => {
            res.status(400).json({ error })    
        })
})


//---* Server Listener *---//

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`*** Listening on port ${PORT} ***`))