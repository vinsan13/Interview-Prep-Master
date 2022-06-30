const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);
const req = require("express/lib/request");
const bodyParser = require("body-parser");

const methodOverride = require("method-override");

const formRoutes = require("./routes/formRoutes");
const authRoutes = require("./routes/authRoutes");
const { isAuth, isNotAuth } = require("./middleware/authMiddleware");


const  Topic  = require("./models/Topic");
const Company= require("./models/Company");
const  Experience  = require("./models/Experience");
const  Question = require("./models/Question");




const dbURI =
  "mongodb+srv://admin-vinit:vinsan@cluster0.4zgtg.mongodb.net/InterviewPrepApp?retryWrites=true&w=majority";

const store = new MongoDBStore({ uri: dbURI, collection: 'sessions' })
//mongoose connect
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(async() => {
    console.log("mongoose connected");
  
    appsetup();
  })
  .catch((err) => console.log("dberror vro:", err));


//after mongoose connection is setup and database is extracted , appsetup will run
const appsetup = () => {
  const app = express();


  const port = 3000;

  app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

  //middleware
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: false }));


  //views
  app.set("view engine", "ejs");

  app.use(session({ secret: "my secret", resave: false, saveUninitialized: false, store: store }));

  app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    if (req.session.user)
      res.locals.username = req.session.user.username;
    else
      res.locals.username = null
    next();
  })

  app.get("/", (req, res) => {
    console.log("sucess nikkiiii :) :)");
    res.render("home");
  });

  app.use(authRoutes);
  app.use(formRoutes);

  //createAdminCumUser("email","username","password"); //to create admin cum user

  //add topic route
  app.get("/addtopic", (req, res) => {
    res.render('formTopic');
  })

  app.post("/addtopic",async (req, res) => {
    
    const t = await Topic.create({
      name :req.body.topic
    })
    res.redirect("/")
  })


  app.get("/topics", isAuth, async(req, res) => {
        const topics = await Topic.find({});
        res.render("topics", { topics: topics });
      
  });


  app.get("/addcompany", (req, res) => {
    res.render('formCompany');
  })

  app.post("/addcompany",async (req, res) => {
    const {name,link,image} = req.body;
    const c = await Company.create({
      name,
      link,
      image
    })
    res.redirect("/")
  })

  app.get("/companys", isAuth,async (req, res) => {
    const companys = await Company.find({});
        res.render("companys", { companys: companys });
     
  });

  app.get("/topics/:t_name", isAuth,async (req, res) => {
    //to convert arrays -> Arrays
    let topic = req.params.t_name;
    topic = topic.charAt(0).toUpperCase() + topic.slice(1);
    //find topic  in topics collection
    const foundtopic = await Topic.findOne({ name: topic.toString() })
    
    const questions  = await Question.find({topic: foundtopic._id})
    
      //finally render the page
   
      res.render("topic", { topic: topic, questions: questions });
     
  });

  app.get("/companys/:c_name", isAuth,async (req, res) => {
    //to convert arrays -> Arrays
    let company = req.params.c_name;
    company = company.charAt(0).toUpperCase() + company.slice(1);
    //find company  in companys collection
    
      const foundcompany = await Company.findOne({ name: company.toString() })
      //then get all experiences linked to it
      
      const experiences = await Experience.find({ company: foundcompany._id })
      
      //finally render the page
      
        res.render("company", { company: company, experiences: experiences });
      
      
  });
  app.get("/companys/:c_name/:expid", isAuth,async (req, res) => {
  
    let exp_id = req.params.expid;
    
    
    
      const foundexp = await Experience.findOne({ _id: exp_id })
      
      
        res.render("experience", { experience: foundexp });
      
      
  });
};
