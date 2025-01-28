const mongoose = require("mongoose");
const Category = require("./models/Category");

const seedCategories = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const categories = [
    { name: "Entertainment" },
    { name: "Fitness" },
    { name: "Software" },
  ];

  await Category.insertMany(categories);
  console.log("Categories seeded successfully!");
  mongoose.disconnect();
};

seedCategories();
