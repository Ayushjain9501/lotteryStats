const axios = require("axios");
const query = require("./models/db_promisify");
const cheerio = require("cheerio");

const getData = (html, powerball = false) => {
	const $ = cheerio.load(html);

	var elem = $(".draw-numbers")[0];

	var numbers = [];
	$(elem)
		.find("span")
		.each(function () {
			numbers.push(parseInt($(this).text()));
		});

	numbers.sort();
	let dt;

	elem = $(".list-title")[0];
	var allText = $(elem).text();
	var idText = $(elem).find("span").text();

	allText = allText.replace(idText, "");
	allText = allText.split(",");
	allText = allText[1].trim();
	var id = parseInt(idText.substr(idText.length - 5, idText.length - 1));
	// console.log(allText);
	//console.log(idText);

	// dt = new Date(allText);
	// dt.setDate(dt.getDate() + 1);
	var tempdt = new Date(allText);
	dt = new Date(
		Date.UTC(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate())
	);

	if (powerball) {
		var powerballNumbers = [];
		elem = $(".supp")[0];
		$(elem)
			.find("span")
			.each(function () {
				powerballNumbers.push(parseInt($(this).text()));
			});

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
		var retObj = getData(res.data);
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
		var retObj = getData(res.data, (powerball = true));
		console.log(retObj);
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
		"UPDATE last_updated SET mon_wed = ?, tattslotto = ?, ozlotto = ?, setforlife = ?, powerball = ?, date = ? WHERE name = 'lottodraw'",
		[monwed_id, tatts_id, oz_id, setforlife_id, powerball_id, new Date()]
	);
	console.log("Last Update Updated");
};

const updateScrapeDBLottodraw = async () => {
	console.log("\n", "\n", "\n", "Update using Lotto Draw Scraper Called");

	var url = "https://www.lottodraw.com.au/monday-lotto/results";
	var mon_id = await update(url, "mon_wed");

	url = "https://www.lottodraw.com.au/wednesday-lotto/results";
	var wed_id = await update(url, "mon_wed");

	url = "https://www.lottodraw.com.au/saturday-lotto/results";
	var tatts_id = await update(url, "tattslotto");

	var url = "https://www.lottodraw.com.au/oz-lotto/results";
	var oz_id = await update(url, "ozlotto");

	url = "https://www.lottodraw.com.au/set-for-life/results";
	var setforlife_id = await update(url, "setforlife");

	url = "https://www.lottodraw.com.au/powerball/results";
	var powerball_id = await update(url, "powerball");

	await updateLastFetched(
		Math.max(mon_id, wed_id),
		tatts_id,
		oz_id,
		setforlife_id,
		powerball_id
	);
};

module.exports = updateScrapeDBLottodraw;
