import mongoose, { trusted } from "mongoose"

const VolunteeringPositionSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: trusted
    },
    slots: {
        type: Number, 
        required: true
    },
    registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    waGroupLink: {
        type: String,
        default: ""
    }
})

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
    volunteeringPositions: [VolunteeringPositionSchema],
    registeredVolunteers: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
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