const mongoose = require('mongoose')

const itecdbsSchema = new mongoose.Schema({ 
      namec: {
        type: String,
      },
      emailc: {
        type: String,
      },
      passwordc: {
        type: String,
      },
      datec: {
        type: Date,
        default: Date.now
      },
      typec: {
        type:Number,
        default: 1
      },
})

mongoose.model("itecDB",itecdbsSchema)