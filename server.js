"use strict";
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./server/database/connection");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const initialize = require("./server/services/passport");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");

// load config file
dotenv.config({ path: "./config/config.env" });

connectDB();


const PORT = process.env.PORT || 8800;

// load passport
initialize(passport);

// load middlewares

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(cors());
// app.use(morgan("tiny"))
app.use(express.json());

// file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 1024 * 1024 * 8,
    },
  })
);

// set view engine
app.use(expressLayouts);
app.set("layout", "../layouts/layout");
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views/pages"));

// load body parser
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// set global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

// load static files
app.use(
  "/css",
  express.static(path.resolve(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.resolve(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.resolve(__dirname, "node_modules/jquery/dist"))
);

app.use(
  "/js",
  express.static(path.resolve(__dirname, "node_modules/sweetalert2/dist"))
);
app.use(
  "/css",
  express.static(path.resolve(__dirname, "node_modules/sweetalert2/dist"))
);

app.use("/css", express.static(path.resolve(__dirname, "./public/css")));
app.use("/js", express.static(path.resolve(__dirname, "./public/js")));
app.use("/img", express.static(path.resolve(__dirname, "./public/img")));
app.use("/img", express.static(path.resolve(__dirname, "./public/img")));

app.get("/", async (req, res) => {
  res.render("Home");
});

// APIs
app.use("/secure", require("./server/routes/auth"));
app.use("/d", require("./server/routes/dashboard"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




app.use((req, res) => {
  res.render("home");
});
