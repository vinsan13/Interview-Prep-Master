const  Topic  = require("../models/Topic");
const Company= require("../models/Company");
const  Experience  = require("../models/Experience");
const  Question = require("../models/Question");
const app=require('../app');
// const {checkAdmin} = require('../middleware/authMiddleware');

const handleErrorsQuestion=(err)=>{
    console.log(err.message,err.code);

    //error messages
     let errors={name:'',link:'',topic:''};

    //1.duplicate error code
     if(err.code == 11000){
        if((Object.keys(error.keyPattern)).includes('name')){
            errors.name= 'question name  already taken';
        }
        else{
            errors.link = 'link already exists';
        }
        return errors;
    }

    //invalid question 
    if (err.message.includes('Question validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path]=properties.message;
        });
    }
    return errors;

}

const handleErrorsExperience=(err)=>{
    console.log(err.message,err.code);

    //error messages
     let errors={name:'',title:'',image:'',company:'',description:''};

    //1.duplicate error code
     if(err.code == 11000){
        errors.name= 'experience with this title already exists';
        return errors;
    }

    //invalid question 
    if (err.message.includes('Experience validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path]=properties.message;
        });
    }
    return errors;

}

module.exports.formQuestion_get = async(req,res) => {
    const topics =await Topic.find({});
     res.render('formQuestion',{ topics : topics});    
}

module.exports.formQuestion_post = (req,res) => {
    const {name,link,topic}=req.body;
    try
    {
        
        const question= Question.create({name,link,topic});
        
        res.redirect('/');
    }
    catch(err)
    {
       const errors=handleErrorsQuestion(err);
       console.log("shit ..error               ",err);
       res.status(400).json({errors});
    }
}

module.exports.formExperience_get = async(req,res) => {
    const companys =await Company.find({});
    res.render('formExperience',{ companys : companys});    
}

module.exports.formExperience_post = (req,res) => {
   const {name,title,image,company,description}=req.body;
   try
   {
       const experience= Experience.create({name,title,image,company,description});
       console.log("done vro u go gall",experience);
       
       res.redirect('/');
   }
   catch(err)
   {
      const errors=handleErrorsExperience(err);
      console.log(err);
      res.status(400).json({errors});
   }
}

