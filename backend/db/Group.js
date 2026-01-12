import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    category: {
      type: String,
      enum: [
        "trip",
        "travel",
        "food",
        "fest",
        "roommates",
        "office",
        "party",
        "other",
      ],
      default: "trip",
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

      expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
     
    totalExpense: { type: Number, default: 0 },

  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Indexes (important for performance) 
groupSchema.index({ members: 1 });
groupSchema.index({ createdBy: 1 });

export const Group = mongoose.model("Group", groupSchema);
