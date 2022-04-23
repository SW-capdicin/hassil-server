const express = requrie("express");
const router = require(".");
const { User } = require("../models");

router.delete("/:userId", async (req, res, next) => {
  try {
    const user = await User.destroy({ where: { id: req.params.userId } });
    res.send("success");
  } catch (err) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
