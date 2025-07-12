const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const coockieParser = require('cookie-parser');
const auth = require('./middlewares/auth');


const {
  addNote,
  getNotes,
  removeNotes,
  editNotes,
} = require("./notes.controller");

const {
  addUser,
  loginUser
} = require("./users.controller");

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

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express app",
    error: undefined
  });
}); 

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.cookie('token', token, {httpOnly:true})
    res.redirect('/')
     } catch (e) {
    
    res.render("login", {
      title: "Express app",
      error: e.message
    });
  }
});

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Express app",
    error: undefined
  });
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);

    res.redirect('/login')
  } catch (e) {
    if(e.code === 11000) {
      res.render("register", {
      title: "Express app",
      error: 'Email is already registered'
    });
    return
    }

    res.render("register", {
      title: "Express app",
      error: e.message
    });
  }
});

app.get('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true })

  res.redirect('/login')
})

app.use(auth)

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express app",
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);

    res.render("index", {
      title: "Express app",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (e) {
    console.log("Creation error", e);
    res.render("index", {
      title: "Express app",
      notes: await getNotes(),
      created: false,
      error: true,
    });
  }
});

app.delete("/:id", async (req, res) => {
   try {
    await removeNotes(req.params.id, req.user.email)
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false
    })
  } catch (e) {
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message
    })
  }
});

app.put("/:id", async (req, res) => {
  
  try {
    await editNotes(req.params.id, req.body.title, req.user.email);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false
    })
  } catch (e) {
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message
    })
  }
});

mongoose
  .connect("mongodb://user:mongopass@localhost:27017/testdb?authSource=admin")
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.bgBlue(`Server has been started on port ${port}...`));
    });
  });
