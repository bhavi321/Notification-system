const express = require("express");
const route = require("./routes/route");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const { setupRealTimeService } = require("./controllers/realtime");


const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", route);

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://Bhavi:Bhavi123@cluster1.yydegcy.mongodb.net/notification-system",
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("Server running on port 3000");

  setupRealTimeService(app);
});
