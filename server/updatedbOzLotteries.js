const axios = require("axios");
const query = require("./models/db_promisify");
const cheerio = require("cheerio");

const getData = (html, powerball = false) => {
	const $ = cheerio.load(html);

	var elem = $(".css-1b5vidf-Results")[0];
	var numbers = [];
	$(elem)
		.find(".results-number-set__number--ns1")
		.each(function () {
			numbers.push(parseInt($(this).text()));
		});

	let dt;
	$(elem)
		.find("h4")
		.each(function () {
			let txt = $(this).text();
			var idx = txt.indexOf("Dr");
			//console.log(g[i].substr(0, idx));
			tempdt = new Date(Date.parse(txt.substr(0, idx)));
			dt = new Date(
				Date.UTC(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate())
			);
			id = parseInt(txt.substr(idx + 5));
		});

	if (powerball) {
		var powerballNumbers = [];
		$(elem)
			.find(".results-number-set__number--ns2")
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
		"UPDATE last_updated SET mon_wed = ?, tattslotto = ?, ozlotto = ?, setforlife = ?, powerball = ?, date = ? WHERE name = 'ozlotteries'",
		[monwed_id, tatts_id, oz_id, setforlife_id, powerball_id, new Date()]
	);
	console.log("Last Update Updated");
};

const updateScrapeDBOzLotteries = async () => {
	console.log("\n", "\n", "\n", "Update using Oz Lotteries Scraper Called");

	var url = "https://www.ozlotteries.com/monday-lotto/results";
	var mon_id = await update(url, "mon_wed");

	url = "https://www.ozlotteries.com/wednesday-lotto/results";
	var wed_id = await update(url, "mon_wed");

	url = "https://www.ozlotteries.com/saturday-lotto/results";
	var tatts_id = await update(url, "tattslotto");

	url = "https://www.ozlotteries.com/oz-lotto/results";
	var oz_id = await update(url, "ozlotto");

	url = "https://www.ozlotteries.com/set-for-life/results";
	var setforlife_id = await update(url, "setforlife");

	url = "https://www.ozlotteries.com/powerball/results";
	var powerball_id = await update(url, "powerball");

	await updateLastFetched(
		Math.max(mon_id, wed_id),
		tatts_id,
		oz_id,
		setforlife_id,
		powerball_id
	);
};

module.exports = updateScrapeDBOzLotteries;
