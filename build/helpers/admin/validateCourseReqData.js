"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGetSingleCourseParams = exports.checkAddCourseReqBodyAndFile = void 0;
const yup_1 = require("yup");
function checkAddCourseReqBodyAndFile(body, files) {
    return new Promise((resolve, reject) => {
        const validFileExtensions = {
            image: ["jpg", "png", "jpeg", "webp"],
            video: ["mp4"],
            pptx: ["pptx"],
            pdf: ["pdf"],
        };
        function isValidFileType(fileName, fileType) {
            return (validFileExtensions[fileType].indexOf(fileName.split(".").pop() || "") >
                -1);
        }
        let bodyTemplate = (0, yup_1.object)({
            name: (0, yup_1.string)().required("please enter name"),
            description: (0, yup_1.string)().required("please enter description"),
            category: (0, yup_1.string)().required("please enter category"),
            price: (0, yup_1.number)().required("please enter price"),
        });
        let fileTemplate = (0, yup_1.object)().shape({
            thumbnail: (0, yup_1.mixed)()
                .required("Not a valid thumbnail image type")
                .test("is-valid-type", "Not a valid image type", (value) => { var _a, _b; return isValidFileType(((_b = (_a = value[0]) === null || _a === void 0 ? void 0 : _a.originalname) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "", "image"); }),
            intro_video: (0, yup_1.mixed)()
                .required("Not a valid intro video type")
                .test("is-valid-type", "Not a valid video type", (value) => { var _a, _b; return isValidFileType(((_b = (_a = value[0]) === null || _a === void 0 ? void 0 : _a.originalname) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "", "video"); }),
            video: (0, yup_1.mixed)()
                .required("Not a valid video type")
                .test("is-valid-type", "Not a valid video type", (value) => { var _a, _b; return isValidFileType(((_b = (_a = value[0]) === null || _a === void 0 ? void 0 : _a.originalname) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "", "video"); }),
            ppt: (0, yup_1.mixed)()
                .required("Not a valid ppt type")
                .test("is-valid-type", "Not a valid ppt type", (value) => { var _a, _b; return isValidFileType(((_b = (_a = value[0]) === null || _a === void 0 ? void 0 : _a.originalname) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "", "pptx"); }),
            pdf: (0, yup_1.mixed)()
                .required("Not a valid pdf type")
                .test("is-valid-type", "Not a valid pdf type", (value) => { var _a, _b; return isValidFileType(((_b = (_a = value[0]) === null || _a === void 0 ? void 0 : _a.originalname) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "", "pdf"); }),
        });
        try {
            let fileResult = fileTemplate.validate(files);
            let bodyResult = bodyTemplate.validate(body);
            Promise.all([fileResult, bodyResult])
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                if ((err === null || err === void 0 ? void 0 : err.message) ==
                    'price must be a `number` type, but the final value was: `NaN` (cast from the value `""`).') {
                    return reject("please enter price");
                }
                return reject(err === null || err === void 0 ? void 0 : err.message);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.checkAddCourseReqBodyAndFile = checkAddCourseReqBodyAndFile;
function checkGetSingleCourseParams(id) {
    return new Promise((resolve, reject) => {
        let paramsTemplate = (0, yup_1.number)().required("please provide valid course id");
        try {
            paramsTemplate
                .validate(id)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err === null || err === void 0 ? void 0 : err.message);
            });
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.checkGetSingleCourseParams = checkGetSingleCourseParams;
