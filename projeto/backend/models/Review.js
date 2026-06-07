const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    album: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret.id || (doc._id && String(doc._id));
        if (ret.user && ret.user._id) {
          ret.user.id = String(ret.user._id);
        }
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Review", reviewSchema);
