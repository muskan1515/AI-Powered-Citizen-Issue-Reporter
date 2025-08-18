const mongoose = require("mongoose");
const envConfig = require("./env");

module.exports.connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(envConfig.mongoUri, {
    autoIndex: envConfig.nodeEnv !== "production",
  });  
  console.log("✅ Mongo connected");
};
