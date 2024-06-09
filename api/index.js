import express from "express";
import cors from "cors";
import courseRoutes from "./routes/courseRoutes.js"
import classroomRoutes from "./routes/classroomRoutes.js"
import instructorRoutes from "./routes/instructorRoutes.js"
import invigilatorRoutes from "./routes/invigilatorRoutes.js"
import semesterRoutes from "./routes/semesterRoutes.js"
import branchRoutes from "./routes/branchRoutes.js"
import educationRoutes from "./routes/educationRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import courseCalendarRoutes from "./routes/courseCalendarRoutes.js"
import examCalendarRoutes from "./routes/examCalendarRoutes.js";


const app = express();
const port = 8800;
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));

app.use("/dersler", courseRoutes);
app.use("/derslikler", classroomRoutes);
app.use("/ogretimUyeleri", instructorRoutes);
app.use("/gozetmenUyeler", invigilatorRoutes);
app.use("/donemler", semesterRoutes);
app.use("/subeler", branchRoutes);
app.use("/ogretimler", educationRoutes);
app.use("/auth", authRoutes);
app.use("/profil", userRoutes)
app.use("/roller", roleRoutes);
app.use("/dersTakvimi1", courseCalendarRoutes);
app.use("/dersTakvimi2", courseCalendarRoutes);
app.use("/sinavTakvimi", examCalendarRoutes);

app.listen(port, () => {
    console.log("Connectted.")
})

app.get("/", (req, res) => {
    res.json("this is the backend")
})

