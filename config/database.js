const mongoose = require("mongoose");


// const connectDatabase = mongoose.connect(
//   "mongodb://localhost:27017/e-commerce",
//   {
//     // useUnifiedTopology: true,
//     // useNewUrlParser: true,
//     // useCreateIndex: true, //make this true
//     // autoIndex: true, //make this also true
// }).then(() => {
//     console.log('Connected to mongoDB');
// }).catch((e)=>{
//   console.log(e)
// })

const connectDatabase=process.env.MONGO_CONNECTION_ID
mongoose.connect(connectDatabase, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) return console.log('err connection', err);
    console.log('database connected');
})




module.exports = connectDatabase;