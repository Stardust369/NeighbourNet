import mongoose from "mongoose"

const issueTags = ["Road", "Water", "Electricity", "Education", "Health", "Sanitation"];

const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true,
        enum: issueTags
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String
    },
    images: [{
        url: String,
        caption: String,
    }],
    videos: [{
        url: String,
        caption: String,
    }],
    issueLocation: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Open", "Assigned", "Completed"],
        default: "Open"
    },
    upvoters: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }],
    downvoters: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }],
    isFlagged: {
        type: Boolean,
        default: false
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        date: { type: Date, default: Date.now }
    }],
   
}, { timestamps: true });

//to create slug from the title:
IssueSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = this.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
  }
  next();
});

export default mongoose.model("Issue", IssueSchema)