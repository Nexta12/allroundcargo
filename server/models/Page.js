const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

// initialize plugin
 mongoose.plugin(slug)

const pageSchema = new mongoose.Schema(
  {
    ptitle: String,
    coverImg: { type: String, default: "header.jpg" },
    textcontent: String,
    subtitle:String,
    sideImage: { type: String, default: "wharf.jpg" },
    slug: {
      type: String,
      slug: "ptitle",
      uniqueSlug: true,
      slug_padding_size: 2,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
