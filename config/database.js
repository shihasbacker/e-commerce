const mongoose = require("mongoose");

const connectDatabase=process.env.MONGO_CONNECTION_ID
mongoose.connect(connectDatabase, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) return console.log('err connection', err);
    console.log('database connected');
})


module.exports = connectDatabase;