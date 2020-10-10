const axios = require("axios");
const query = require("./models/db_promisify");

var startDate;
var url =
	"https://data.api.thelott.com/sales/vmax/web/data/lotto/results/search/daterange";
var endDate = new Date();

var mon_wed_id, tatts_id, oz_id, setforlife_id, powerball_id;
var mon_bool = false;
var tatts_bool = false;
var oz_bool = false;
var setforlife_bool = false;
var powerball_bool = false;

async function getStartDate() {
	var data = await query("SELECT date FROM last_updated WHERE name = 'api'");
	console.log(data);
	var stringDate = data[0].date;
	startDate = new Date(stringDate);
	startDate.setDate(startDate.getDate() + 1);
}

const fetchDataMonWed = async () => {
	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["MonWedLotto"],
		CompanyFilter: ["NTLotteries"],
	});

	var data = req.data.Draws;
	if (data == null || data.length == 0) {
		console.log("No new Records in MonWed");
		return;
	}
	mon_bool = true;
	mon_wed_id = data[0].DrawNumber;

	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		let id = data[i].DrawNumber;
		var sqlres = await query(`SELECT * FROM mon_wed WHERE draw_id = ?`, [id]);
		// /console.log(sqlres);

		var exists = sqlres.length == 0 ? 0 : 1;
		if (!exists) {
			await query("INSERT INTO mon_wed VALUES (?, ?, ?)", [
				data[i].DrawNumber,
				data[i].DrawDate,
				JSON.stringify(numbers),
			]);
			console.log("1 record inserted ", data[i].DrawNumber);
		} else {
			console.log(id, " already exists in monwed");
		}
	}
};

const fetchDataTattsLotto = async () => {
	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["TattsLotto"],
		CompanyFilter: ["Tattersalls"],
	});

	var data = req.data.Draws;
	// console.log(data);
	if (data == null || data.length == 0) {
		console.log("No new Records in Tatts Lotto");
		return;
	}

	//console.log(data.length);
	tatts_bool = true;
	tatts_id = data[0].DrawNumber;
	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		let id = data[i].DrawNumber;
		var sqlres = await query(`SELECT * FROM tattslotto WHERE draw_id = ?`, [
			id,
		]);

		var exists = sqlres.length == 0 ? 0 : 1;
		if (!exists) {
			await query("INSERT INTO tattslotto VALUES (?, ?, ?)", [
				data[i].DrawNumber,
				data[i].DrawDate,
				JSON.stringify(numbers),
			]);
			console.log("1 record inserted ", data[i].DrawNumber);
		} else {
			console.log(id, " already exists in tattslotto");
		}
	}
};

const fetchDataOzLotto = async () => {
	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["OzLotto"],
		CompanyFilter: ["NTLotteries"],
	});

	var data = req.data.Draws;

	// console.log(data);
	if (data == null || data.length == 0) {
		console.log("No new Records in Oz Lotto");
		return;
	}
	oz_bool = true;
	oz_id = data[0].DrawNumber;
	//console.log(data.length);
	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		let id = data[i].DrawNumber;
		var sqlres = await query(`SELECT * FROM ozlotto WHERE draw_id = ?`, [id]);

		var exists = sqlres.length == 0 ? 0 : 1;
		if (!exists) {
			var numbers = { primaryNumbers: data[i].PrimaryNumbers };
			await query("INSERT INTO ozlotto VALUES (?, ?, ?)", [
				data[i].DrawNumber,
				data[i].DrawDate,
				JSON.stringify(numbers),
			]);
			console.log("1 record inserted ", data[i].DrawNumber);
		} else {
			console.log(id, " already exists in ozlotto");
		}
	}
};

const fetchDataSetForLife = async () => {
	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["SetForLife744"],
		CompanyFilter: ["NTLotteries"],
	});

	//console.log(req);
	var data = req.data.Draws;
	// console.log(data);
	if (data == null || data.length == 0) {
		console.log("No new Records in Set For Life");
		return;
	}

	//console.log(data.length);
	setforlife_bool = true;
	setforlife_id = data[0].DrawNumber;

	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		let id = data[i].DrawNumber;
		var sqlres = await query(`SELECT * FROM setforlife WHERE draw_id = ?`, [
			id,
		]);

		var exists = sqlres.length == 0 ? 0 : 1;
		if (!exists) {
			await query("INSERT INTO setforlife VALUES (?, ?, ?)", [
				data[i].DrawNumber,
				data[i].DrawDate,
				JSON.stringify(numbers),
			]);
			console.log("1 record inserted ", data[i].DrawNumber);
		} else {
			console.log(id, " already exists in setforlife");
		}
	}
};

const fetchDataPowerball = async () => {
	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["Powerball"],
		CompanyFilter: ["NTLotteries"],
	});

	//console.log(req);
	var data = req.data.Draws;
	// console.log(data);
	if (data == null || data.length == 0) {
		console.log("No new Records in PowerBall");
		return;
	}

	//console.log(data.length);
	powerball_bool = true;
	powerball_id = data[0].DrawNumber;

	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		var sec = { secondaryNumbers: data[i].SecondaryNumbers };
		let id = data[i].DrawNumber;
		var sqlres = await query(`SELECT * FROM powerball WHERE draw_id = ?`, [id]);

		var exists = sqlres.length == 0 ? 0 : 1;
		if (!exists) {
			await query("INSERT INTO powerball VALUES (?, ?, ?, ?)", [
				data[i].DrawNumber,
				data[i].DrawDate,
				JSON.stringify(numbers),
				JSON.stringify(sec),
			]);
			console.log("1 record inserted ", data[i].DrawNumber);
		} else {
			console.log(id, " already exists in powerball");
		}
	}
};

const updateLastFetched = async (
	monwed_id,
	tatts_id,
	oz_id,
	setforlife_id,
	powerball_id
) => {
	if (mon_bool) {
		await query(
			"UPDATE last_updated SET mon_wed = ?, date = ? WHERE name = 'api'",
			[monwed_id, new Date()]
		);
	}

	if (tatts_bool) {
		await query(
			"UPDATE last_updated SET tattslotto = ?, date = ? WHERE name = 'api'",
			[tatts_id, new Date()]
		);
	}

	if (oz_bool) {
		await query(
			"UPDATE last_updated SET ozlotto = ?, date = ? WHERE name = 'api'",
			[oz_id, new Date()]
		);
	}

	if (setforlife_bool) {
		await query(
			"UPDATE last_updated SET setforlife = ?, date = ? WHERE name = 'api'",
			[setforlife_id, new Date()]
		);
	}

	if (powerball_bool) {
		await query(
			"UPDATE last_updated SET powerball = ?, date = ? WHERE name = 'api'",
			[powerball_id, new Date()]
		);
	}

	console.log("Last Update Updated");
};

const updateDBAPI = async () => {
	console.log("\n", "\n", "\n", "Update using API Called");
	await getStartDate();
	console.log("Start Date is ", startDate);
	console.log("End Date is ", endDate);
	console.log("In MonWed");
	await fetchDataMonWed();
	console.log("MonWed End");
	console.log("In Tatts Lotto");
	await fetchDataTattsLotto();
	console.log("TattsLotto End");
	console.log("In Oz Lotoo");
	await fetchDataOzLotto();
	console.log("Oz Lotto End");
	console.log("In Set For Life");
	await fetchDataSetForLife();
	console.log("Set For Life End");
	console.log("In PowerBall");
	await fetchDataPowerball();
	console.log("Powerball End");
	await updateLastFetched(
		mon_wed_id,
		tatts_id,
		oz_id,
		setforlife_id,
		powerball_id
	);
};

module.exports = updateDBAPI;
