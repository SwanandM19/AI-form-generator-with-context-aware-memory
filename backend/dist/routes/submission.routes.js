"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submission_controller_1 = require("../controllers/submission.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public route - submit form
router.post('/:link', submission_controller_1.SubmissionController.submitForm);
// Protected routes - view submissions
router.get('/form/:formId', auth_middleware_1.authenticate, submission_controller_1.SubmissionController.getFormSubmissions);
router.get('/all', auth_middleware_1.authenticate, submission_controller_1.SubmissionController.getAllUserSubmissions);
exports.default = router;
