"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const validateCategoryReqData_1 = require("../../helpers/admin/validateCategoryReqData");
const category_1 = require("../../db/mysql/admin/category");
exports.categoryController = {
    createCategory: (req, res) => {
        try {
            (0, validateCategoryReqData_1.checkCreateCategoryReqBody)(req.body)
                .then((result) => {
                (0, category_1.insertNewCategory)(result.category)
                    .then((result) => {
                    res.status(201).json({
                        success: true,
                        data: {
                            code: 201,
                            message: "new category added",
                        },
                    });
                })
                    .catch((error) => {
                    res.status(406).json({
                        success: false,
                        errors: [
                            {
                                code: 406,
                                message: "value not acceptable",
                                error: error,
                            },
                        ],
                        errorType: "client",
                    });
                });
            })
                .catch((error) => {
                res.status(406).json({
                    success: false,
                    errors: [
                        { code: 406, message: "value not acceptable", error: error },
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
    updateCategory: (req, res) => {
        try {
            (0, validateCategoryReqData_1.checkUpdateCategoryReqBody)(req.body)
                .then((result) => {
                (0, category_1.updateCategory)(result)
                    .then((result) => {
                    res.status(201).json({
                        success: true,
                        data: {
                            code: 201,
                            message: "category updated successfully",
                        },
                    });
                })
                    .catch((error) => {
                    res.status(406).json({
                        success: false,
                        errors: [
                            {
                                code: 406,
                                message: "value not acceptable",
                                error: error,
                            },
                        ],
                        errorType: "client",
                    });
                });
            })
                .catch((error) => {
                res.status(406).json({
                    success: false,
                    errors: [
                        { code: 406, message: "value not acceptable", error: error },
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
