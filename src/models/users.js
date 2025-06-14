import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    restPassword: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: { expires: "30d" }, // delete user after 30 days
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
        delete ret.restPassword;
        delete ret.deletedAt;
        return ret;
      },
    },
  }
);

userSchema.pre("save", function (next) {
  if (this.name.length <= 2) {
    return next(new Error("name must be more than 2 characters"));
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
