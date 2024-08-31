import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    title: {type: 'string', required: true},
    //we want to add a relationship between category and the user, whenever a new category get created i want
    //to store the reference of the user that created the category.
    user: {type: Schema.Types.ObjectId, ref:"User"}
  },
  {
    timestamps: true,
  }
)

const Category = models.Category || model("Category", CategorySchema);

export default Category;