"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = void 0;
const validateCourseReqData_1 = require("../../helpers/admin/validateCourseReqData");
exports.courseController = {
    createCourse: (req, res) => {
        return new Promise((resolve, reject) => {
            try {
                (0, validateCourseReqData_1.checkAddCourseReqBodyAndFile)(req.body, req.files)
                    .then((result) => {
                    res.status(200).json({
                        success: true,
                        data: {
                            code: 200,
                            message: "course successfully created",
                            response: "",
                        },
                    });
                })
                    .catch((err) => {
                    res.status(406).json({
                        success: false,
                        errors: [
                            {
                                code: 406,
                                message: "values not acceptable",
                                error: err,
                            },
                        ],
                        errorType: "client",
                    });
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    errors: [
                        {
                            code: 500,
                            message: "some error occurred in the server try again after some times",
                            error: error === null || error === void 0 ? void 0 : error.message,
                        },
                    ],
                    errorType: "server",
                });
            }
        });
    },
    getCourseById: (req, res) => {
        var _a;
        try {
            let id = Number((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
            (0, validateCourseReqData_1.checkGetSingleCourseParams)(id)
                .then((result) => { })
                .catch((err) => {
                res.status(406).json({
                    success: false,
                    errors: [
                        {
                            code: 406,
                            message: "values not acceptable",
                            error: err,
                        },
                    ],
                    errorType: "client",
                });
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                errors: [
                    {
                        code: 500,
                        message: "some error occurred in the server try again after some times",
                        error: error === null || error === void 0 ? void 0 : error.message,
                    },
                ],
                errorType: "server",
            });
        }
    },
};
