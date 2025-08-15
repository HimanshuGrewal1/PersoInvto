import mongoose, { Schema } from "mongoose";

const animeSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    totalEpisodes: { type: Number, default: 0 },
    genre: [{ type: String }],
    status: { type: String, enum: ["Watching", "Completed", "Plan to Watch"], default: "Plan to Watch" },
    season: { type: String }, 
    coverImage: { type: String },
  },
  { timestamps: true }
);

export const Anime = mongoose.model("Anime", animeSchema);
