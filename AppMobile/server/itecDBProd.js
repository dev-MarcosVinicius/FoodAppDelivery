const mongoose = require('mongoose')

const itecdbsprodSchema = new mongoose.Schema({ 
      emailp: {
       type: String
      },
      productc: {
        type: String,
      },
      statusc: {
        type: String,
      },datec: {
        type: Date,
        default: Date.now
      },
})

mongoose.model("itecDBProd",itecdbsprodSchema)