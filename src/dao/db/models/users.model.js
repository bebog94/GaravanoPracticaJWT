import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isGithub: {
    type: Boolean,
    default: false,
  },
  cart:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Carts",
    required: true,
  },
  role:{
    type: String,
    default: "user"
  }
});
export const usersModel = mongoose.model("Users", usersSchema);