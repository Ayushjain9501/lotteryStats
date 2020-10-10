const express = require("express");
const router = express.Router();

const mon_wed = require("../controllers/monwed.controller");
const tattsLotto = require("../controllers/tattslotto.controller");
const ozLotto = require("../controllers/ozlotto.controller");
const setForLife = require("../controllers/setforlife.controller");
const powerBall = require("../controllers/powerball.controller");

router.get("/", (req, res) => {
	res.send("This is the basic route for api");
});

router.get("/monwed", mon_wed.findAll);
router.post("/monwed/delete", mon_wed.delete);

router.get("/tatts", tattsLotto.findAll);
router.post("/tatts/delete", tattsLotto.delete);

router.get("/oz", ozLotto.findAll);
router.post("/oz/delete", ozLotto.delete);

router.get("/setforlife", setForLife.findAll);
router.post("/setforlife/delete", setForLife.delete);

router.get("/powerball", powerBall.findAll);
router.post("/powerball/delete", powerBall.delete);

module.exports = router;
