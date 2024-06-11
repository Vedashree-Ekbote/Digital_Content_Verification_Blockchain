const mongoose = require('mongoose'); 

// password:H1H3uFW8Exw8t5T8
// username:vedashreeekbote10
mongoose.connect('mongodb+srv://<password>:H1H3uFW8Exw8t5T8@cluster0.dr2bfvi.mongodb.net/CONTENT_VERIFICATION',{
    useNewUrlParser: true,
  useUnifiedTopology: true,
}).then("Connected to Database!")
.catch(err => console.error('MongoDB connection error:', err));

module.exports=mongoose;
