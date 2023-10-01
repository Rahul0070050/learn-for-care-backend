"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = void 0;
const jwt_1 = require("../helpers/jwt");
function validateAdmin(req, res, next) {
    const { authorization } = req.headers;
    const token = (authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1]) || "";
    (0, jwt_1.validateAdminJwtToken)(token)
        .then((result) => {
        next();
    })
        .catch((err) => {
        res.status(401).json({
            success: false,
            errors: [
                {
                    code: 500,
                    message: "please login",
                    error: err,
                },
            ],
            errorType: "server",
        });
    });
}
exports.validateAdmin = validateAdmin;
