const pool = require("./models/db_promisify");
const axios = require("axios");
const query = require("./models/db_promisify");

var mon_wed_id, tattslotto_id, ozlotto_id, setforlife_id, powerball_id;
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

	var dateOffset3 = 24 * 60 * 60 * 1000 * 182;
	var dateOffset4 = 24 * 60 * 60 * 1000 * 92;

	var startDate3 = new Date();
	var endDate3 = new Date();
	startDate3.setTime(startDate.getTime() - dateOffset3);
	endDate3.setTime(startDate.getTime() - dateOffset4);
	//console.log(startDate2);
	//console.log(endDate2);

	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["MonWedLotto"],
		CompanyFilter: ["NTLotteries"],
	});

	var data = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate2,
		DateEnd: endDate2,
		ProductFilter: ["MonWedLotto"],
		CompanyFilter: ["NTLotteries"],
	});
	// console.log(req);

	var data2 = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate3,
		DateEnd: endDate3,
		ProductFilter: ["MonWedLotto"],
		CompanyFilter: ["NTLotteries"],
	});
	// console.log(req);

	var data3 = req.data.Draws;
	// console.log(data);
	console.log("Inserting Data in MonWed");

	mon_wed_id = data[0].DrawNumber;

	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		await query("INSERT INTO mon_wed VALUES (?, ?, ?)", [
			data[i].DrawNumber,
			data[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data[i].DrawNumber);
	}

	for (var i = 0; i < data2.length; i++) {
		var numbers = { primaryNumbers: data2[i].PrimaryNumbers };
		await query("INSERT INTO mon_wed VALUES (?, ?, ?)", [
			data2[i].DrawNumber,
			data2[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data2[i].DrawNumber);
	}

	for (var i = 0; i < data3.length; i++) {
		var numbers = { primaryNumbers: data3[i].PrimaryNumbers };
		await query("INSERT INTO mon_wed VALUES (?, ?, ?)", [
			data3[i].DrawNumber,
			data3[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data3[i].DrawNumber);
	}
};

const fetchDataTattsLotto = async () => {
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

	var dateOffset3 = 24 * 60 * 60 * 1000 * 182;
	var dateOffset4 = 24 * 60 * 60 * 1000 * 92;

	var startDate3 = new Date();
	var endDate3 = new Date();
	startDate3.setTime(startDate.getTime() - dateOffset3);
	endDate3.setTime(startDate.getTime() - dateOffset4);
	//console.log(startDate2);
	//console.log(endDate2);

	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["TattsLotto"],
		CompanyFilter: ["Tattersalls"],
	});

	var data = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate2,
		DateEnd: endDate2,
		ProductFilter: ["TattsLotto"],
		CompanyFilter: ["Tattersalls"],
	});

	var data2 = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate3,
		DateEnd: endDate3,
		ProductFilter: ["TattsLotto"],
		CompanyFilter: ["Tattersalls"],
	});

	var data3 = req.data.Draws;

	console.log("Inserting Data in TattsLotto");

	tattslotto_id = data[0].DrawNumber;
	//console.log(data.length);
	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		await query("INSERT INTO tattslotto VALUES (?, ?, ?)", [
			data[i].DrawNumber,
			data[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data[i].DrawNumber);
	}

	for (var i = 0; i < data2.length; i++) {
		var numbers = { primaryNumbers: data2[i].PrimaryNumbers };
		await query("INSERT INTO tattslotto VALUES (?, ?, ?)", [
			data2[i].DrawNumber,
			data2[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data2[i].DrawNumber);
	}

	for (var i = 0; i < data3.length; i++) {
		var numbers = { primaryNumbers: data3[i].PrimaryNumbers };
		await query("INSERT INTO tattslotto VALUES (?, ?, ?)", [
			data3[i].DrawNumber,
			data3[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data3[i].DrawNumber);
	}
};

const fetchDataOzLotto = async () => {
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

	var dateOffset3 = 24 * 60 * 60 * 1000 * 182;
	var dateOffset4 = 24 * 60 * 60 * 1000 * 92;

	var startDate3 = new Date();
	var endDate3 = new Date();
	startDate3.setTime(startDate.getTime() - dateOffset3);
	endDate3.setTime(startDate.getTime() - dateOffset4);
	//console.log(startDate2);
	//console.log(endDate2);

	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["OzLotto"],
		CompanyFilter: ["NTLotteries"],
	});
	var data = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate2,
		DateEnd: endDate2,
		ProductFilter: ["OzLotto"],
		CompanyFilter: ["NTLotteries"],
	});

	var data2 = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate3,
		DateEnd: endDate3,
		ProductFilter: ["OzLotto"],
		CompanyFilter: ["NTLotteries"],
	});

	var data3 = req.data.Draws;
	//console.log(data);
	//console.log(data.length);
	console.log("Inserting data in OzLotto");

	ozlotto_id = data[0].DrawNumber;

	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		await query("INSERT INTO ozlotto VALUES (?, ?, ?)", [
			data[i].DrawNumber,
			data[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data[i].DrawNumber);
	}

	for (var i = 0; i < data2.length; i++) {
		var numbers = { primaryNumbers: data2[i].PrimaryNumbers };
		await query("INSERT INTO ozlotto VALUES (?, ?, ?)", [
			data2[i].DrawNumber,
			data2[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data2[i].DrawNumber);
	}

	for (var i = 0; i < data3.length; i++) {
		var numbers = { primaryNumbers: data3[i].PrimaryNumbers };
		await query("INSERT INTO ozlotto VALUES (?, ?, ?)", [
			data3[i].DrawNumber,
			data3[i].DrawDate,
			JSON.stringify(numbers),
		]);
		console.log("1 element inserted", data3[i].DrawNumber);
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

	var dateOffset3 = 24 * 60 * 60 * 1000 * 182;
	var dateOffset4 = 24 * 60 * 60 * 1000 * 92;

	var startDate3 = new Date();
	var endDate3 = new Date();
	startDate3.setTime(startDate.getTime() - dateOffset3);
	endDate3.setTime(startDate.getTime() - dateOffset4);
	//console.log(startDate2);
	//console.log(endDate2);

	var req = await axios.post(url, {
		DateStart: startDate,
		DateEnd: endDate,
		ProductFilter: ["Powerball"],
		CompanyFilter: ["NTLotteries"],
	});
	var data = req.data.Draws;
	req = await axios.post(url, {
		DateStart: startDate2,
		DateEnd: endDate2,
		ProductFilter: ["Powerball"],
		CompanyFilter: ["NTLotteries"],
	});
	var data2 = req.data.Draws;

	req = await axios.post(url, {
		DateStart: startDate3,
		DateEnd: endDate3,
		ProductFilter: ["Powerball"],
		CompanyFilter: ["NTLotteries"],
	});
	var data3 = req.data.Draws;
	//console.log(data);
	console.log("Inserting data in Powerball");

	powerball_id = data[0].DrawNumber;
	for (var i = 0; i < data.length; i++) {
		var numbers = { primaryNumbers: data[i].PrimaryNumbers };
		var sec = { secondaryNumbers: data[i].SecondaryNumbers };
		await query("INSERT INTO powerball VALUES (?, ?, ?, ?)", [
			data[i].DrawNumber,
			data[i].DrawDate,
			JSON.stringify(numbers),
			JSON.stringify(sec),
		]);
		console.log("1 element inserted", data2[i].DrawNumber);
	}

	for (var i = 0; i < data2.length; i++) {
		var numbers = { primaryNumbers: data2[i].PrimaryNumbers };
		var sec = { secondaryNumbers: data2[i].SecondaryNumbers };
		await query("INSERT INTO powerball VALUES (?, ?, ?, ?)", [
			data2[i].DrawNumber,
			data2[i].DrawDate,
			JSON.stringify(numbers),
			JSON.stringify(sec),
		]);
		console.log("1 element inserted", data2[i].DrawNumber);
	}

	for (var i = 0; i < data3.length; i++) {
		var numbers = { primaryNumbers: data3[i].PrimaryNumbers };
		var sec = { secondaryNumbers: data3[i].SecondaryNumbers };
		await query("INSERT INTO powerball VALUES (?, ?, ?, ?)", [
			data3[i].DrawNumber,
			data3[i].DrawDate,
			JSON.stringify(numbers),
			JSON.stringify(sec),
		]);
		console.log("1 element inserted", data3[i].DrawNumber);
	}
};
const updateLastFetched = async () => {
	var items = ["api", "ozlotteries", "lottodraw"];
	items.map(async function (item) {
		console.log(item);

		await query("INSERT INTO last_updated VALUES (?, ?, ?, ?, ?, ?, ?)", [
			item,
			mon_wed_id,
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
