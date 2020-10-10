const axios = require("axios");
const query = require("./models/db_promisify");
const cheerio = require("cheerio");

const getData = (html, tableName, powerball = false) => {
	var numPrimary = 7;
	if (tableName === "mon_wed" || tableName === "tattslotto") {
		numPrimary = 6;
	}
	const $ = cheerio.load(html);
	//console.log("here in getData");
	var elem = $(".lotterygame2")[0];
	var numbers = [];
	var powerballNumbers = [];
	var dt, id;

	var d = elem.children[0].data;
	d = d
		.split(" ")
		.map((item) => {
			return item.trim();
		})
		.filter((item) => item != "");

	//console.log(d);

	id = parseInt(
		d[tableName === "mon_wed" || tableName === "tattslotto" ? 1 : 2].substr(
			1,
			4
		)
	);

	var dateParts = d[0].split(tableName === "tattslotto" ? "-" : "/");

	dt = new Date(
		Date.UTC(
			dateParts[2].length == 4 ? dateParts[2] : "20" + dateParts[2],
			dateParts[1] - 1,
			dateParts[0]
		)
	);

	if (tableName === "tattslotto") {
		dt = new Date(
			Date.UTC(
				dateParts[0].length == 4 ? dateParts[0] : "20" + dateParts[0],
				dateParts[1] - 1,
				dateParts[2]
			)
		);
	}

	var num = $(".results2")[0];
	$(num)
		.find("td")
		.map(function (index, element) {
			if (index < numPrimary) {
				numbers.push(parseInt($(element).text()));
			}
			if (powerball && index == numPrimary + 1) {
				powerballNumbers.push(parseInt($(element).text()));
			}
		});
	//console.log(numbers, id, dt);

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
		"UPDATE last_updated SET mon_wed = ?, tattslotto = ?, ozlotto = ?, setforlife = ?, powerball = ?, date = ? WHERE name = 'lotteryExtreme'",
		[monwed_id, tatts_id, oz_id, setforlife_id, powerball_id, new Date()]
	);
	console.log("Last Update Updated");
};

const updateScrapeDBLotteryExtreme = async () => {
	console.log(
		"\n",
		"\n",
		"\n",
		"Update using Lotteries Extreme Scraper Called"
	);

	var url = "http://www.lotteryextreme.com/australia/mondaylotto-results";
	var mon_id = await update(url, "mon_wed");

	url = "http://www.lotteryextreme.com/australia/wednesdaylotto-results";
	var wed_id = await update(url, "mon_wed");

	url = "http://www.lotteryextreme.com/australia/saturdaylotto-results";
	var tatts_id = await update(url, "tattslotto");

	url = "http://www.lotteryextreme.com/australia/ozlotto-results";
	var oz_id = await update(url, "ozlotto");

	url = "http://www.lotteryextreme.com/australia/setforlife-results";
	var setforlife_id = await update(url, "setforlife");

	url = "http://www.lotteryextreme.com/australia/powerball-results";
	var powerball_id = await update(url, "powerball");

	await updateLastFetched(
		Math.max(mon_id, wed_id),
		tatts_id,
		oz_id,
		setforlife_id,
		powerball_id
	);
};

module.exports = updateScrapeDBLotteryExtreme;
