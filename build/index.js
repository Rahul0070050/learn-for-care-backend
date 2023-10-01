"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const mysql_1 = require("./conf/mysql");
const auth_1 = __importDefault(require("./routes/user/auth"));
const auth_2 = __importDefault(require("./routes/admin/auth"));
const category_1 = __importDefault(require("./routes/admin/category"));
const course_1 = __importDefault(require("./routes/admin/course"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// middleware
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://test.learnforcare.com"],
    credentials: true,
}));
// mysql connection
(0, mysql_1.mySqlConnect)((err) => {
    try {
        if (err)
            console.log(err);
        else
            console.log("mysql connected");
    }
    catch (error) {
        console.log(error);
    }
});
// user routes
app.use("/api/user/auth", auth_1.default);
// admin routes
app.use("/api/admin/auth", auth_2.default);
app.use("/api/admin/category", category_1.default);
app.use("/api/admin/course", course_1.default);
// error handler
app.use((err, req, res, next) => {
    console.log(err);
    res
        .status(500)
        .json({ ok: false, error: err === null || err === void 0 ? void 0 : err.message, message: "Something broke!" });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("server running on port ", PORT);
});
