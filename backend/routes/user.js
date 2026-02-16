const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
  const userData = req.user;
  res.json({
    success: true,
    userData,
  });
});

module.exports = router;
