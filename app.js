const mongoose = require("mongoose");
const express = require("express");

//session
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);

//routes
const formRoutes = require("./routes/formRoutes");
const authRoutes = require("./routes/authRoutes");

//middleware
const bodyParser = require("body-parser");
const { isAuth, isNotAuth } = require("./middleware/authMiddleware");


//models
const Topic = require("./models/Topic");
const Company = require("./models/Company");
const Experience = require("./models/Experience");
const Question = require("./models/Question");

//mongodb URI
const dbURI =
  "mongodb+srv://admin-vinit:vinsan@cluster0.4zgtg.mongodb.net/InterviewPrepApp?retryWrites=true&w=majority";


//mongoose connect
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("mongoose connected");

    appsetup();
  })
  .catch((err) => console.log("dberror vro:", err));


//Appsetup
const appsetup = () => {
  const app = express();

  const port = 3000;
  // bind and listen the connections on the specified host and port.
  app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

  //middleware
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: false }));

  //views
  app.set("view engine", "ejs");

  //sessions
  const store = new MongoDBStore({ uri: dbURI, collection: 'sessions' })
  app.use(session({ secret: "my secret", resave: false, saveUninitialized: false, store: store }));

  //middleware for storing session variables in res.locals which can be accessed by all pages
  app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    if (req.session.user)
      res.locals.username = req.session.user.username;
    else
      res.locals.username = null
    next();
  })

  //Home route
  app.get("/", (req, res) => {
    console.log("sucess nikkiiii :) :)");
    res.render("home");
  });


  // Auth and form routes
  app.use(authRoutes);
  app.use(formRoutes);



  //add and post topic
  app.get("/addtopic",isAuth, (req, res) => {
    res.render('formTopic');
  })

  app.post("/addtopic",isAuth, async (req, res) => {

    const t = await Topic.create({
      name: req.body.topic
    })
    res.redirect("/")
  })

  // show all topics
  app.get("/topics", isAuth, async (req, res) => {
    const topics = await Topic.find({});
    res.render("topics", { topics: topics });

  });

  // show questions of selected topic  
  app.get("/topics/:t_name", isAuth, async (req, res) => {

    let topic = req.params.t_name;
    topic = topic.charAt(0).toUpperCase() + topic.slice(1); //making 1st char capital

    //find topic  in topics collection
    const foundtopic = await Topic.findOne({ name: topic.toString() })

    //then get all questions linked to it
    const questions = await Question.find({ topic: foundtopic._id })

    //finally render the page
    res.render("topic", { topic: topic, questions: questions });

  });

  //add and post company
  app.get("/addcompany",isAuth, (req, res) => {
    res.render('formCompany');
  })

  app.post("/addcompany",isAuth, async (req, res) => {
    const { name, link, image } = req.body;
    const c = await Company.create({
      name,
      link,
      image
    })
    res.redirect("/")
  })


  // show all companies
  app.get("/companys", isAuth, async (req, res) => {
    const companys = await Company.find({});
    res.render("companys", { companys: companys });
  });


  // show interview experinces of selected company
  app.get("/companys/:c_name", isAuth, async (req, res) => {

    let company = req.params.c_name;
    company = company.charAt(0).toUpperCase() + company.slice(1);
    
    //find company  in companys collection
    const foundcompany = await Company.findOne({ name: company.toString() })

    //then get all experiences linked to it
    const experiences = await Experience.find({ company: foundcompany._id })

    //finally render the page
    res.render("company", { company: company, experiences: experiences });

  });

  // get new page for selected experince
  app.get("/companys/:c_name/:expid", isAuth, async (req, res) => {
    let exp_id = req.params.expid;
    const foundexp = await Experience.findOne({ _id: exp_id });
    res.render("experience", { experience: foundexp });
  });
};
