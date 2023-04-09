import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api-2', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
})