const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "貼文名稱未填寫"],
  },
  type: {
    type: String,
  },
  image: {
    type: String,
    default: "",
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  content: {
    type: String,
    required: [true, "貼文內容未填寫"],
  },
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
