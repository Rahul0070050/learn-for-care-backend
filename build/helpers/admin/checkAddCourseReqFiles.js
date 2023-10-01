"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAddCourseReqFiles = void 0;
const yup_1 = require("yup");
function checkAddCourseReqFiles(files) {
    const validFileExtensions = { image: ['jpg', 'png', 'jpeg', 'webp'] };
    function isValidFileType(fileName) {
        return fileName && validFileExtensions["image"].indexOf(fileName.split('.').pop() || "") > -1;
    }
    (0, yup_1.object)().shape({
        image: (0, yup_1.mixed)()
            .required("Required")
            .test("is-valid-type", "Not a valid image type", value => isValidFileType(value.name.toLowerCase() || ""))
    });
}
exports.checkAddCourseReqFiles = checkAddCourseReqFiles;
