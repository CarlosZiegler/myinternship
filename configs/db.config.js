const mongoose = require('mongoose');

const DbConnection = mongoose
  .connect('mongodb+srv://myinternship:ironhack2020@cluster0-voe4r.mongodb.net/interniship?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

module.exports = DbConnection

