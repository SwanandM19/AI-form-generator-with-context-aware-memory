"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const form_controller_1 = require("../controllers/form.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes
router.post('/generate', auth_middleware_1.authenticate, form_controller_1.FormController.generateForm);
router.get('/my-forms', auth_middleware_1.authenticate, form_controller_1.FormController.getUserForms);
router.get('/:id', auth_middleware_1.authenticate, form_controller_1.FormController.getFormById);
router.delete('/:id', auth_middleware_1.authenticate, form_controller_1.FormController.deleteForm);
// Public route
router.get('/public/:link', form_controller_1.FormController.getFormByLink);
exports.default = router;
