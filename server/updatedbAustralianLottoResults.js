const axios = require("axios");
const query = require("./models/db_promisify");
const cheerio = require("cheerio");

const getData = (html, tableName, powerball = false) => {
	var numPrimary = 7;
	if (tableName === "mon_wed" || tableName === "tattslotto") {
		numPrimary = 6;
	}
	const $ = cheerio.load(html);

	var numbers = [];
	var powerballNumbers = [];
	var dt = 1,
		id = 0;

	var title = $("h2", ".link-lotto-title").text();
	id = parseInt(title.substr(title.length - 5, 4));

	var time = $("time", ".col-lg-4.text-right")[0].children[0].data;
	var dateText = time.split(",").map((item) => {
		return item.trim();
	});
	var tempdt = new Date(dateText[1]);
	dt = new Date(
		Date.UTC(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate())
	);

	var elemBalls = $(".num");
	elemBalls.map(function (index, element) {
		// if (powerball) {
		// 	console.log(index, $(element).text());
		// }
		if (index < numPrimary) {
			numbers.push(parseInt($(element).text()));
		}
		if (powerball && index == numPrimary) {
			powerballNumbers.push(parseInt($(element).text()));
		}
	});

	if (powerball) {
		return {
			numbers: numbers,
			dt: dt,
			id: id,
			powerballNumbers: powerballNumbers,
		};
	}

	return { numbers: numbers, dt: dt, id: id };
};
const update = async (url, tableName) => {
	console.log(`Updating ${tableName}`);
	if (tableName != "powerball") {
		var res = await axios.get(url);
		var numbers, dt;
		var retObj = getData(res.data, tableName);
		var id = 1;
		console.log(retObj);
		numbers = retObj.numbers;
		dt = retObj.dt;
		id = retObj.id;
		var sqlres = await query(`SELECT * FROM ${tableName} WHERE draw_id = ?`, [
			id,
		]);
		//console.log(sqlres);
		var exists = sqlres.length == 0 ? 0 : 1;

		if (!exists) {
			var numbersINS = { primaryNumbers: numbers };
			await query(`INSERT INTO ${tableName} VALUES (?, ?, ?)`, [
				id,
				dt,
				JSON.stringify(numbersINS),
			]);
			console.log("Inserted in ", tableName, id);
		} else {
			console.log(`${tableName} already up to date, ${id} exists`);
		}
	} else {
		var res = await axios.get(url);
		var numbers, dt;
		var retObj = getData(res.data, tableName, (powerball = true));
		console.log(retObj);
		id = 1;
		numbers = retObj.numbers;
		dt = retObj.dt;
		id = retObj.id;
		powerballNumbers = retObj.powerballNumbers;

		var sqlres = await query(`SELECT * FROM ${tableName} WHERE draw_id = ?`, [
			id,
		]);
		//console.log(sqlres);
		var exists = sqlres.length == 0 ? 0 : 1;
		if (!exists) {
			var numbers = { primaryNumbers: numbers };
			var sec = { secondaryNumbers: powerballNumbers };
			await query("INSERT INTO powerball VALUES (?, ?, ?, ?)", [
				id,
				dt,
				JSON.stringify(numbers),
				JSON.stringify(sec),
			]);
			console.log("Inserted in ", tableName, id);
		} else {
			console.log(`${tableName} already up to date, ${id} exists`);
		}
	}

	return id;
};

const updateLastFetched = async (
	monwed_id,
	tatts_id,
	oz_id,
	setforlife_id,
	powerball_id
) => {
	await query(
		"UPDATE last_updated SET mon_wed = ?, tattslotto = ?, ozlotto = ?, setforlife = ?, powerball = ?, date = ? WHERE name = 'AustralianLotto'",
		[monwed_id, tatts_id, oz_id, setforlife_id, powerball_id, new Date()]
	);
	console.log("Last Update Updated");
};

const updateScrapeDBAustralianLotto = async () => {
	console.log(
		"\n",
		"\n",
		"\n",
		"Update using Australian Lotto Results Scraper Called"
	);

	var url = "https://www.australianlottoresults.com.au/monday-lotto-results";
	var mon_id = await update(url, "mon_wed");

	url = "https://www.australianlottoresults.com.au/wednesday-lotto-results";
	var wed_id = await update(url, "mon_wed");

	url = "https://www.australianlottoresults.com.au/saturday-tattslotto-results";
	var tatts_id = await update(url, "tattslotto");

	url = "https://www.australianlottoresults.com.au/oz-lotto-results";
	var oz_id = await update(url, "ozlotto");

	url = "https://www.australianlottoresults.com.au/set-for-life-results";
	var setforlife_id = await update(url, "setforlife");

	url = "https://www.australianlottoresults.com.au/powerball-results";
	var powerball_id = await update(url, "powerball");

	await updateLastFetched(
		Math.max(mon_id, wed_id),
		tatts_id,
		oz_id,
		setforlife_id,
		powerball_id
	);
};

module.exports = updateScrapeDBAustralianLotto;
