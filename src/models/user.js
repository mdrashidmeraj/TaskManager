import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Task from './task.js'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
});

// virtual property
UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// methods for methods that are accessible on the instance i.e user
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, "theSecretKey", { expiresIn: '7 days' });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

// .toJson is called automatically whenvever we are sending a user data (  when a user object is being converted to a JSON object)
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

// statics for methods that are accessible on the model i.e User
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}
  
// hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

//delete user tasks when user is removed
UserSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
})


const User = mongoose.model('User', UserSchema);

export default User