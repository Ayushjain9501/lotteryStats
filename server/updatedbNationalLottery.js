const axios = require("axios");
const query = require("./models/db_promisify");
const cheerio = require("cheerio");

var last_mon_id,
	last_wed_id,
	last_tatts_id,
	last_ozlotto_id,
	last_setforlife_id,
	last_powerball_id;

var last_mon_date,
	last_wed_date,
	last_tatts_date,
	last_ozlotto_date,
	last_setforlife_date,
	last_powerball_date;

const getIdForTable = (tableName, dt) => {
	switch (tableName) {
		case "mon_wed":
			{
				if (dt.getDay() == 3) {
					if (dt.getTime() == last_wed_date.getTime()) {
						return last_wed_id;
					} else {
						return last_wed_id + 2;
					}
				} else {
					if (dt.getTime() == last_mon_date.getTime()) {
						return last_mon_id;
					} else {
						return last_mon_id + 2;
					}
				}
			}
			break;
		case "tattslotto":
			{
				if (dt.getTime() == last_tatts_date.getTime()) {
					return last_tatts_id;
				} else {
					return last_tatts_id + 2;
				}
			}
			break;
		case "ozlotto":
			{
				if (dt.getTime() == last_ozlotto_date.getTime()) {
					return last_ozlotto_id;
				} else {
					return last_ozlotto_id + 2;
				}
			}
			break;
		case "setforlife":
			{
				if (dt.getTime() == last_setforlife_date.getTime()) {
					return last_setforlife_id;
				} else {
					return last_setforlife_id + 2;
				}
			}
			break;
		case "powerball":
			{
				if (dt.getTime() == last_powerball_date.getTime()) {
					return last_powerball_id;
				} else {
					return last_powerball_id + 2;
				}
			}
			break;
		default:
			break;
	}
};

const getData = (html, tableName, powerball = false) => {
	var numPrimary = 7;
	if (tableName === "mon_wed" || tableName === "tattslotto") {
		numPrimary = 6;
	}
	const $ = cheerio.load(html);
	var numbers = [];
	var powerballNumbers = [];
	var dt, id;
	var elem = $(".resultsHeader")[0].children[2].data;
	var details = elem.split("-").map((item) => {
		return item.trim();
	});
	//console.log(details);
	var tempdt = new Date(details[0]);
	dt = new Date(
		Date.UTC(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate())
	);

	id = getIdForTable(tableName, dt);

	var elemBalls = $(".result", ".balls");
	//console.log(elemBalls);
	elemBalls.map((index, item) => {
		if (index < numPrimary) {
			numbers.push(parseInt($(item).text()));
		}
	});

	if (powerball) {
		var powerball = $(".powerball-powerball", ".balls")[0].children[0].data;
		powerballNumbers.push(powerball);
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
		"UPDATE last_updated SET mon_wed = ?, tattslotto = ?, ozlotto = ?, setforlife = ?, powerball = ?, date = ? WHERE name = 'nationalLottery'",
		[monwed_id, tatts_id, oz_id, setforlife_id, powerball_id, new Date()]
	);
	console.log("Last Update Updated");
};

const getDateFromText = (text) => {
	var tempdt = new Date(text);
	dt = new Date(
		Date.UTC(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate())
	);
	return dt;
};

const getLastQueries = async () => {
	var res = await query("SELECT * FROM mon_wed ORDER BY draw_date DESC");
	var dt = getDateFromText(res[0].draw_date);
	var dt_1 = getDateFromText(res[1].draw_date);
	if (dt.getDay() == 3) {
		last_mon_id = res[1].draw_id;
		last_wed_id = res[0].draw_id;
		last_mon_date = dt_1;
		last_wed_date = dt;
	} else {
		last_mon_id = res[0].draw_id;
		last_wed_id = res[1].draw_id;
		last_mon_date = dt;
		last_wed_date = dt_1;
	}

	res = await query("SELECT * FROM tattslotto ORDER BY draw_date DESC");
	dt = getDateFromText(res[0].draw_date);
	last_tatts_id = res[0].draw_id;
	last_tatts_date = dt;

	res = await query("SELECT * FROM ozlotto ORDER BY draw_date DESC");
	dt = getDateFromText(res[0].draw_date);
	last_ozlotto_id = res[0].draw_id;
	last_ozlotto_date = dt;

	res = await query("SELECT * FROM setforlife ORDER BY draw_date DESC");
	dt = getDateFromText(res[0].draw_date);
	last_setforlife_id = res[0].draw_id;
	last_setforlife_date = dt;

	res = await query("SELECT * FROM powerball ORDER BY draw_date DESC");
	dt = getDateFromText(res[0].draw_date);
	last_powerball_id = res[0].draw_id;
	last_powerball_date = dt;

	// console.log(
	// 	last_mon_id,
	// 	last_wed_id,
	// 	last_tatts_id,
	// 	last_ozlotto_id,
	// 	last_setforlife_id,
	// 	last_powerball_id
	// );

	// console.log(
	// 	last_mon_date,
	// 	last_wed_date,
	// 	last_tatts_date,
	// 	last_ozlotto_date,
	// 	last_setforlife_date,
	// 	last_powerball_date
	// );
};

const updateScrapeDBNationalLottery = async () => {
	console.log(
		"\n",
		"\n",
		"\n",
		"Update using National Lotteries Scraper Called"
	);

	await getLastQueries();
	var url = "https://australia.national-lottery.com/monday-lotto/results";
	var mon_id = await update(url, "mon_wed");

	url = "https://australia.national-lottery.com/wednesday-lotto/results";
	var wed_id = await update(url, "mon_wed");

	url = "https://australia.national-lottery.com/saturday-lotto/results";
	var tatts_id = await update(url, "tattslotto");

	url = "https://australia.national-lottery.com/oz-lotto/results";
	var oz_id = await update(url, "ozlotto");

	url = "https://australia.national-lottery.com/set-for-life/results";
	var setforlife_id = await update(url, "setforlife");

	url = "https://australia.national-lottery.com/powerball/results";
	var powerball_id = await update(url, "powerball");

	await updateLastFetched(
		Math.max(mon_id, wed_id),
		tatts_id,
		oz_id,
		setforlife_id,
		powerball_id
	);
};

module.exports = updateScrapeDBNationalLottery;
