import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  //  NEW FIELD
  savedProperties: [
    {
      propertyId: String,
      title: String,
      price: Number,
      location: String,
      bedrooms: Number,
      bathrooms: Number,
      size_sqft: Number,
      amenities: [String],
      image_url: String,
      savedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
