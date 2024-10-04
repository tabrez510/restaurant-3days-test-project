import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import categoryRoute from "./routes/category.route";
import recipeRoute from "./routes/recipe.route";
// import orderRoute from "./routes/order.route";
// import cartRoute from "./routes/cart.route"
// import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// const DIRNAME = path.resolve();


app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}
app.use(cors(corsOptions));

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/recipe", recipeRoute);
// app.use("/api/v1/order", orderRoute);
// app.use("/api/v1/cart", cartRoute);

// app.use(express.static(path.join(DIRNAME,"/client/dist")));
// app.use("*",(_,res) => {
//     res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});