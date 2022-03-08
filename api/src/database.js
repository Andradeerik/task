const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tasks', {
    useNewUrlParser: true
})
    .then(db => console.log('Db is connected'))
    .catch(err => console.log(err));