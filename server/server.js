const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const query = require("./models/db_promisify");
const routes = require("./routes/allroutes");

const updateDBAPI = require("./updatedbAPI");
const updateScrapeDBLottodraw = require("./updatedbLottoDraw");
const updateScrapeDBOzLotteries = require("./updatedbOzLotteries");
const updateScrapeDBAustralianLotto = require("./updatedbAustralianLottoResults");
const updateScrapeDBLotteryExtreme = require("./updatedbLotteryExtreme");
const updateScrapeDBNationalLottery = require("./updatedbNationalLottery");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({ message: "Welcome to Lottery application." });
});

app.use("/api/", routes);

app.get("/api/details", async (req, res) => {
	var sqlres = await query("SELECT * from last_updated");
	res.send(sqlres);
});

app.post("/api/update", async (req, res) => {
	var {
		selectedAPI,
		selectedOzlotteries,
		selectedLottodraw,
		selectedNationalLottery,
		selectedLotteryExtreme,
		selectedAustralianLotto,
	} = req.body.params;

	if (selectedAPI) {
		try {
			await updateDBAPI();
		} catch (e) {
			console.log(e);
		}
	}
	if (selectedOzlotteries) {
		try {
			await updateScrapeDBOzLotteries();
		} catch (e) {
			console.log(e);
		}
	}
	if (selectedLottodraw) {
		try {
			await updateScrapeDBLottodraw();
		} catch (e) {
			console.log(e);
		}
	}

	if (selectedNationalLottery) {
		try {
			await updateScrapeDBNationalLottery();
		} catch (e) {
			console.log(e);
		}
	}

	if (selectedAustralianLotto) {
		try {
			await updateScrapeDBAustralianLotto();
		} catch (e) {
			console.log(e);
		}
	}

	if (selectedLotteryExtreme) {
		try {
			await updateScrapeDBLotteryExtreme();
		} catch (e) {
			console.log(e);
		}
	}

	var sqlres = await query("SELECT * from last_updated");
	res.send(sqlres);
});

var now = new Date();

//Update Using Scraper
var millisTillTimeScrape =
	new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0) - now;
if (millisTillTimeScrape < 0) {
	millisTillTimeScrape += 86400000;
}
setTimeout(async function () {
	await updateScrape();
}, millisTillTimeScrape);

async function updateScrape() {
	try {
		await updateScrapeDBOzLotteries();
	} catch (e) {
		console.log(e);
	}
	try {
		await updateScrapeDBLottodraw();
	} catch (e) {
		console.log(e);
	}
	try {
		await updateScrapeDBNationalLottery();
	} catch (e) {
		console.log(e);
	}
	try {
		await updateScrapeDBAustralianLotto();
	} catch (e) {
		console.log(e);
	}
	try {
		await updateScrapeDBLotteryExtreme();
	} catch (e) {
		console.log(e);
	}

	console.log(
		"Update Database using Scraper Completed, will run again in 12 hrs."
	);
	setTimeout(updateScrape, 43200000);
}

//start Server

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
	console.log(`Server Started at ${now}`);
});
