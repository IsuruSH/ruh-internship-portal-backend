const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");

// Public routes
router.get("/", noticeController.getAllNotices);
router.get("/active", noticeController.getActiveNotices);
router.get("/important", noticeController.getImportantNotices);
router.get("/:id", noticeController.getNoticeById);

// Protected routes (add your auth middleware as needed)
router.post("/", noticeController.createNotice);
router.put("/:id", noticeController.updateNotice);
router.delete("/:id", noticeController.deleteNotice);
router.post("/:id/restore", noticeController.restoreNotice);

module.exports = router;
