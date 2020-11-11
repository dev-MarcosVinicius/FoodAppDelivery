const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./itecDB')
require('./itecDBProd')

app.use(bodyParser.json())

const itecDB = mongoose.model("itecDB")

const itecDBProd = mongoose.model("itecDBProd")

const mongoUri = "mongodb+srv://124578mv:124578mv@7itecdb.yv0nb.mongodb.net/itecDB?retryWrites=true&w=majority"

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
})

mongoose.connection.on("connected", ()=>{
    console.log("conectado ao mongoDB")
})
mongoose.connection.on("error", (err)=>{
    console.log("error",err)
})

app.get('/',(req,res)=>{
    itecDBProd.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})

app.post('/send-data',(req,res)=>{
    const ItecDB = new itecDBProd({
        emailp:req.body.emailp,
        productc:req.body.productc,
        statusc:req.body.statusc,
    })
    ItecDB.save()
    .then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    })

})

app.post('/register', (req, res) => {
    itecDB.findOne({ emailc: req.body.emailc }).then(data => {
      if (data) {
        console.log('Email já existe.')
      } else {
        const ItecDB = new itecDB({
          namec: req.body.namec,
          emailc: req.body.emailc,
          passwordc: req.body.passwordc
        });
        ItecDB.save()
        .then(data=>{
            console.log(data.name)
        }).catch(err=>{
            console.log(err)
        })
      }
    });
  });

app.post('/delete',(req,res)=>{
    itecDB.findByIdAndDelete(req.body._id)
    .then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    })
})

app.post('/update',(req,res)=>{
    itecDBProd.findByIdAndUpdate(req.body._id,{
        statusc:req.body.statusc})
        .then(data=>{
            console.log(data)
        }).catch(err=>{
            console.log(err)
        })
})

app.post('/signin', (req, res) => {
 itecDB.findOne({ emailc: req.body.emailc, passwordc:req.body.passwordc }).then(data => {
  if (data) {
    console.log('Login realizado com sucesso'+data)
    res.send(data)
  } else {
    console.log('Login ou senha incorretos'+data)
  }
}).catch(err=>{
  console.log(err)
})
});

app.listen(3000, ()=> {
    console.log("server running")
})
