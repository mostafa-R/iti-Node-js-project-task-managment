const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    resetPassword: {  
      type: String,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.resetPassword;
        delete ret.deletedAt;
        return ret;
      },
    },
  }
);

userSchema.pre('save', function (next) {
  if (this.name.length <= 2) {
    return next(new Error('name must be more than 2 characters'));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
