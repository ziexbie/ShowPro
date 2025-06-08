const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: String,     
  area: String,     
  githubLink: String,
  liveLink: String,
  images: [String], 
  videos: [String], 
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);