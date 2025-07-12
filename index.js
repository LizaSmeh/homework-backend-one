const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const coockieParser = require("cookie-parser");
const auth = require("./middlewares/auth");

const {
  addNote,
  getNotes,
  removeNotes,
  editNotes,
} = require("./notes.controller");

const { addUser, loginUser } = require("./users.controller");

const port = 3000;

const app = express();

app.set("view engine", "ejs");

app.set("views", "pages");

app.use(express.json());
app.use(coockieParser());
app.use(express.static(path.resolve(__dirname, "pablic")));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", async (req, res) => {
  res.render("index", {
    title: "doctor's appointment",
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title, req.body.phone, req.body.problem);
  } catch (e) {
    console.error("Creation error", e);
  }
});

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express app",
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/notes");
  } catch (e) {
    res.render("login", {
      title: "Express app",
      error: e.message,
    });
  }
});

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Express app",
    error: undefined,
  });
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);

    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Express app",
        error: "Email is already registered",
      });
      return;
    }

    res.render("register", {
      title: "Express app",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });

  res.redirect("/login");
});

app.use(auth);

app.get("/notes", async (req, res) => {
  try {
    const notes = await getNotes();
    res.render("notes", {
      title: "Express App",
      notes,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("notes", {
      title: "Express App",
      notes: [],
      created: false,
      error: e.message,
    });
  }
});

mongoose
  .connect("mongodb://user:mongopass@localhost:27017/testdb?authSource=admin")
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.bgBlue(`Server has been started on port ${port}...`));
    });
  });
