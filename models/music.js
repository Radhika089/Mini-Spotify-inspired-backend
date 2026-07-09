import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const musicModel =
  mongoose.models.Music || mongoose.model("Music", musicSchema);

export default musicModel;
