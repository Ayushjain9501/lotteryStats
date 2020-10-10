const pool = require("./models/db_promisify");
const axios = require("axios");
const query = require("./models/db_promisify");
const fs = require("fs");

var mon_id = 3990,
	wed_id = 3991,
	tattslotto_id = 4069,
	ozlotto_id = 1378,
	setforlife_id,
	powerball_id = 1261;

const createTables = async () => {
	var query1 =
		"create table if not exists mon_wed(draw_id INT NOT NULL,draw_date DATE,numbers JSON,PRIMARY KEY ( draw_id ))";
	await query(query1);
	console.log("Mon_wed Created");
	query1 =
		"create table if not exists ozlotto(draw_id INT NOT NULL,draw_date DATE,numbers JSON,PRIMARY KEY ( draw_id ))";
	await query(query1);
	console.log("Oz_Lotto Created");
	query1 =
		"create table if not exists tattslotto(draw_id INT NOT NULL,draw_date DATE,numbers JSON,PRIMARY KEY ( draw_id ))";
	await query(query1);
	console.log("TattsLotto Created");
	query1 =
		"create table if not exists setforlife(draw_id INT NOT NULL,draw_date DATE,numbers JSON,PRIMARY KEY ( draw_id ))";
	await query(query1);
	console.log("SetForLife Created");
	query1 =
		"create table if not exists powerball(draw_id INT NOT NULL,draw_date DATE,numbers JSON,powerball JSON, PRIMARY KEY ( draw_id ))";
	await query(query1);
	console.log("PowerBall Created");
	query1 =
		"create table if not exists last_updated(name VARCHAR(20) NOT NULL , mon_wed INT, tattslotto INT, ozlotto INT, setforlife INT, powerball INT, date DATE, PRIMARY KEY ( name ))";
	await query(query1);
	console.log("Last_Updated Created");
};

const fetchDataMonWed = async () => {
	var data = await fs.promises.readFile("./data/mon.txt", "utf8");

	lines = data.split("\n");
	var id = mon_id + 2;
	for (var i = 1; i < lines.length; ++i) {
		id -= 2;
		var t = lines[i].replace(/"/g, "");
		var d = t.split(",");
		var dateParts = d[0].split("/");

		var date = new Date(
			Date.UTC(
				dateParts[2].length == 4 ? dateParts[2] : parseInt("20" + dateParts[2]),
				dateParts[1] - 1,
				dateParts[0]
			)
		);
		// console.log(d[0]);
		var numbers = [];
		numbers.push(parseInt(d[1]));
		numbers.push(parseInt(d[2]));
		numbers.push(parseInt(d[3]));
		numbers.push(parseInt(d[4]));
		numbers.push(parseInt(d[5]));
		numbers.push(parseInt(d[6]));

		var numbers_to_insert = { primaryNumbers: numbers };

		// console.log(id, date, numbers_to_insert);

		var sqlres = await query(`SELECT * FROM mon_wed WHERE draw_id = ?`, [id]);
		//console.log(sqlres);
		var exists = sqlres.length == 0 ? 0 : 1;

		if (!exists) {
			await query("INSERT INTO mon_wed VALUES (?, ?, ?)", [
				id,
				date,
				JSON.stringify(numbers_to_insert),
			]);
			console.log("1 element inserted in mon_wed", id);
		}
	}

	data = await fs.promises.readFile("./data/wed.txt", "utf8");

	lines = data.split("\n");
	id = wed_id + 2;
	for (var i = 1; i < lines.length; ++i) {
		id -= 2;
		var t = lines[i].replace(/"/g, "");
		var d = t.split(",");
		var dateParts = d[0].split("/");

		var date = new Date(
			Date.UTC(
				dateParts[2].length == 4 ? dateParts[2] : "20" + dateParts[2],
				dateParts[1] - 1,
				dateParts[0]
			)
		);
		// console.log(d[0]);
		var numbers = [];
		numbers.push(parseInt(d[1]));
		numbers.push(parseInt(d[2]));
		numbers.push(parseInt(d[3]));
		numbers.push(parseInt(d[4]));
		numbers.push(parseInt(d[5]));
		numbers.push(parseInt(d[6]));

		var numbers_to_insert = { primaryNumbers: numbers };

		// console.log(id, date, numbers_to_insert);

		var sqlres = await query(`SELECT * FROM mon_wed WHERE draw_id = ?`, [id]);
		//console.log(sqlres);
		var exists = sqlres.length == 0 ? 0 : 1;

		if (!exists) {
			await query("INSERT INTO mon_wed VALUES (?, ?, ?)", [
				id,
				date,
				JSON.stringify(numbers_to_insert),
			]);
			console.log("1 element inserted in mon_wed", id);
		}
	}
};

const fetchDataTattsLotto = async () => {
	var data = await fs.promises.readFile("./data/tattslotto.txt", "utf8");

	lines = data.split("\n");
	var id = tattslotto_id + 2;
	for (var i = 1; i < lines.length; ++i) {
		id -= 2;
		var t = lines[i].replace(/"/g, "");
		var d = t.split(",");
		var dateParts = d[0].split("/");

		var date = new Date(
			Date.UTC(
				dateParts[2].length == 4 ? dateParts[2] : parseInt("20" + dateParts[2]),
				dateParts[1] - 1,
				dateParts[0]
			)
		);
		// console.log(d[0]);
		var numbers = [];
		numbers.push(parseInt(d[1]));
		numbers.push(parseInt(d[2]));
		numbers.push(parseInt(d[3]));
		numbers.push(parseInt(d[4]));
		numbers.push(parseInt(d[5]));
		numbers.push(parseInt(d[6]));

		var numbers_to_insert = { primaryNumbers: numbers };

		// console.log(id, date, numbers_to_insert);

		var sqlres = await query(`SELECT * FROM tattslotto WHERE draw_id = ?`, [
			id,
		]);
		//console.log(sqlres);
		var exists = sqlres.length == 0 ? 0 : 1;

		if (!exists) {
			await query("INSERT INTO tattslotto VALUES (?, ?, ?)", [
				id,
				date,
				JSON.stringify(numbers_to_insert),
			]);
			console.log("1 element inserted in tattslotto", id);
		}
	}
};

const fetchDataOzLotto = async () => {
	var data = await fs.promises.readFile("./data/ozlotto.txt", "utf8");

	lines = data.split("\n");
	var id = ozlotto_id + 1;
	for (var i = 1; i < lines.length; ++i) {
		id--;
		var t = lines[i].replace(/"/g, "");
		var d = t.split(",");
		var dateParts = d[0].split("/");

		var date = new Date(
			Date.UTC(
				dateParts[2].length == 4 ? dateParts[2] : parseInt("20" + dateParts[2]),
				dateParts[1] - 1,
				dateParts[0]
			)
		);
		// console.log(d[0]);
		var numbers = [];
		numbers.push(parseInt(d[1]));
		numbers.push(parseInt(d[2]));
		numbers.push(parseInt(d[3]));
		numbers.push(parseInt(d[4]));
		numbers.push(parseInt(d[5]));
		numbers.push(parseInt(d[6]));
		numbers.push(parseInt(d[7]));

		var numbers_to_insert = { primaryNumbers: numbers };

		// console.log(id, date, numbers_to_insert);

		var sqlres = await query(`SELECT * FROM ozlotto WHERE draw_id = ?`, [id]);
		//console.log(sqlres);
		var exists = sqlres.length == 0 ? 0 : 1;

		if (!exists) {
			await query("INSERT INTO ozlotto VALUES (?, ?, ?)", [
				id,
				date,
				JSON.stringify(numbers_to_insert),
			]);
			console.log("1 element inserted in ozlotto", id);
		}
	}
};

const fetchDataSetForLife = async () => {
	var url =
		"https://data.api.thelott.com/sales/vmax/web/data/lotto/results/search/daterange";
	var startDate = new Date(new Date().setDate(new Date().getDate() - 90));
	var endDate = new Date();
	//console.log(startDate);
	//console.log(endDate);

	var dateOffset1 = 24 * 60 * 60 * 1000 * 91;
	var dateOffset2 = 24 * 60 * 60 * 1000 * 1;

	var startDate2 = new Date();
	var endDate2 = new Date();
	startDate2.setTime(startDate.getTime() - dateOffset1);
	endDate2.setTime(startDate.getTime() - dateOffset2);

	//console.log(endDate2);

	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["SetForLife744"],
		CompanyFilter: ["NTLotteries"],
	});
	var data = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate2,
		DateEnd: endDate2,
		ProductFilter: ["SetForLife744"],
		CompanyFilter: ["NTLotteries"],
	});
	var data2 = req.data.Draws;

	//console.log(data);
	console.log("Inserting data in SetForLife");
	setforlife_id = data[0].DrawNumber;
	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		await query("INSERT INTO setforlife VALUES (?, ?, ?)", [
			data[i].DrawNumber,
			data[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data[i].DrawNumber);
	}

	for (var i = 0; i < data2.length; i++) {
		var numbers = { primaryNumbers: data2[i].PrimaryNumbers };
		await query("INSERT INTO setforlife VALUES (?, ?, ?)", [
			data2[i].DrawNumber,
			data2[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data2[i].DrawNumber);
	}
};

const fetchDataPowerball = async () => {
	var id = powerball_id + 1;
	var data = await fs.promises.readFile("./data/powerball.txt", "utf8");
	lines = data.split("\n");

	for (var i = 1; i < lines.length; ++i) {
		id--;
		var t = lines[i].replace(/"/g, "");
		var d = t.split(",");
		var dateParts = d[0].split("/");

		var date = new Date(
			Date.UTC(
				dateParts[2].length == 4 ? dateParts[2] : "20" + dateParts[2],
				dateParts[1] - 1,
				dateParts[0]
			)
		);
		// console.log(d[0]);
		var numbers = [];
		numbers.push(parseInt(d[1]));
		numbers.push(parseInt(d[2]));
		numbers.push(parseInt(d[3]));
		numbers.push(parseInt(d[4]));
		numbers.push(parseInt(d[5]));
		numbers.push(parseInt(d[6]));
		numbers.push(parseInt(d[7]));
		var powerball = [];
		powerball.push(parseInt(d[8]));

		var numbers_to_insert = { primaryNumbers: numbers };
		var sec = { secondaryNumbers: powerball };

		var sqlres = await query(`SELECT * FROM powerball WHERE draw_id = ?`, [id]);
		//console.log(sqlres);
		var exists = sqlres.length == 0 ? 0 : 1;

		if (!exists) {
			await query("INSERT INTO powerball VALUES (?, ?, ?, ?)", [
				id,
				date,
				JSON.stringify(numbers_to_insert),
				JSON.stringify(sec),
			]);
			console.log("1 element inserted in powerball", id);
		}
	}
};

const updateLastFetched = async () => {
	var items = [
		"api",
		"ozlotteries",
		"lottodraw",
		"lotteryExtreme",
		"nationalLottery",
		"AustralianLotto",
	];
	items.map(async function (item) {
		console.log(item);

		await query("INSERT INTO last_updated VALUES (?, ?, ?, ?, ?, ?, ?)", [
			item,
			Math.floor(Math.max(mon_id, wed_id)),
			tattslotto_id,
			ozlotto_id,
			setforlife_id,
			powerball_id,
			new Date(),
		]);
	});
};

const fetch = async () => {
	await createTables();
	console.log("Tables Created");
	console.log("fetchDataMonWed start");
	await fetchDataMonWed();
	console.log("fetchDataMonWed end");
	console.log("fetchTattsLotto start");
	await fetchDataTattsLotto();
	console.log("fetchTattsLotto end");
	console.log("fetchOzLotto start");
	await fetchDataOzLotto();
	console.log("fetchOzLotto End");
	console.log("fetchDataSetForLife start");
	await fetchDataSetForLife();
	console.log("fetchDataSetForLife end");
	console.log("fetchDataPowerball start");
	await fetchDataPowerball();
	console.log("fetchDataPowerball end");
	console.log("Updating Last Fetched");
	await updateLastFetched();
	console.log("Last Fetch Updated");
};

fetch();
