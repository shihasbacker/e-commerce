const mongoose = require("mongoose");


const connectDatabase = mongoose.connect(
  "mongodb://localhost:27017/e-commerce",
  {
    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    // useCreateIndex: true, //make this true
    // autoIndex: true, //make this also true
}).then(() => {
    console.log('Connected to mongoDB');
})

module.exports = connectDatabase;