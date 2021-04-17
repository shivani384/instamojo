const express = require('express')
//const cors=require('cors');
const app = express()
const mongoose  = require('mongoose')
require('dotenv').config();
const PORT = process.env.PORT 
//const {MONGOURI} = require('./config/keys')

const MONGOURI=process.env.ATLAS_URI;

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true

}
)

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

mongoose.connection.on('connected',()=>{
    console.log("conneted to mongo yeahh")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})


require('./models/user')
require('./models/post')

//app.use(cors())
app.use(function(req,res,next){
    //res.setHeader('Access-Control-Allow-Origin', '*');
  //  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Required-With,Content-Type,Accept');
   // res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE, OPTIONS');
    next();
})
app.use(express.json())
app.use("/",require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV=="production"){
    app.use(express.static('instamojo-react/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'instamojo-react','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})