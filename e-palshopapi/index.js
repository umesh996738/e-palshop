const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');//Hide imp data 
dotenv.config();
const useRoute = require('./routes/User');
const authRoute = require('./routes/auth');



mongoose.connect(process.env.Mongoose_URl)
    .then(() => { 
        console.log("DB coonect");
    })
    .catch((err) => {
        console.log(err)
    });

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users',useRoute);    


app.listen(process.env.PORT || 6000, () => {
    console.log('Backend server start');
});