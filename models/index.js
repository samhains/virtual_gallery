var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_97l0w7db:vdgmm2gaoavlqp5c132okpgsae@ds049198.mongolab.com:49198/heroku_97l0w7db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var User,Message;
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  //url_name: String,
  //user_id:   String,
  body:   { type: String, required: true },
  date: { type: Date, default: Date.now }
});

var userSchema = new Schema({
  name:  {
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
  email: { type: String, required: true }
});

Message = mongoose.model('Message', messageSchema);
User = mongoose.model('User', userSchema);

module.exports = {
	Message: Message,
	User: User
};
