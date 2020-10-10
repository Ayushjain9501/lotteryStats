import React, { Component } from "react";
import axios from "axios";
import { TablePagination } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import "./mon_wed.css";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import { Paper } from "@material-ui/core";
import predictNumbers from "./prediction";
const gameConfig = require("../game_config/game_config.js");

class PowerBall extends Component {
	constructor(props) {
		super(props);
		this.update = this.update.bind(this);
		this.getTable = this.getTable.bind(this);
		this.infoLine = this.infoLine.bind(this);
		this.getSetInfo = this.getSetInfo.bind(this);
		this.getPrediction = this.getPrediction.bind(this);
		this.deleteOldContent = this.deleteOldContent.bind(this);
		this.handlePredict = this.handlePredict.bind(this);
		this.getPowerballTable = this.getPowerballTable.bind(this);
		this.state = { dataFetched: false, predict: false };
	}

	async componentDidMount() {
		//console.log("Here");
		let game = gameConfig.games;
		let lenGame = game.length;
		let curConditions;
		for (var i = 0; i < lenGame; ++i) {
			if (game[i].name === "powerball") {
				curConditions = game[i];
			}
		}
		this.setState({ conditions: curConditions });
		await this.update();
		console.log(this.state);
	}

	async update() {
		let b = await axios.get("http://localhost:5000/api/powerball");
		//console.log("Here");
		let curData = b.data;

		//console.log(curData);

		curData.sort((a, b) => {
			return -a.draw_id + b.draw_id;
		});
		let count = {};
		let lastDrawn = {};
		let frequencyNum = {};
		let countPowerball = {};
		let frequencyNumPowerball = {};
		let lastDrawnPowerball = {};
		let totalDraws = curData.length;
		//console.log(totalDraws);

		for (var i = 1; i <= 35; ++i) {
			count[i] = 0;
			lastDrawn[i] = new Date(2016, 1, 1);
			frequencyNum[i] = 0;
		}

		for (i = 1; i <= 25; ++i) {
			countPowerball[i] = 0;
			lastDrawnPowerball[i] = new Date(2016, 1, 1);
			frequencyNumPowerball[i] = 0;
		}

		for (i = 0; i < totalDraws; ++i) {
			curData[i].numbers = JSON.parse(curData[i].numbers);
			curData[i].numbers.primaryNumbers.sort(function (a, b) {
				return a - b;
			});
			curData[i].powerball = JSON.parse(curData[i].powerball);
			curData[i].powerball.secondaryNumbers.sort(function (a, b) {
				return a - b;
			});
		}

		//console.log("Curdata");

		curData.map((item) => {
			let dateItem = new Date(item.draw_date);
			//let num = JSON.parse(item.numbers);
			item.numbers.primaryNumbers.map((number) => {
				// console.log(
				// 	`${item.draw_id} : ${number}, ${dateItem.toDateString()}`
				// );
				if (dateItem > lastDrawn[number]) {
					lastDrawn[number] = dateItem;
				}
				count[number] += 1;
			});

			item.powerball.secondaryNumbers.map((number) => {
				// console.log(
				// 	`${item.draw_id} : ${number}, ${dateItem.toDateString()}`
				// );
				if (dateItem > lastDrawnPowerball[number]) {
					lastDrawnPowerball[number] = dateItem;
				}
				countPowerball[number] += 1;
			});
		});
		for (i = 1; i <= 35; ++i) {
			frequencyNum[i] = (count[i] * 100) / totalDraws;
		}
		for (i = 1; i <= 20; ++i) {
			frequencyNumPowerball[i] = (countPowerball[i] * 100) / totalDraws;
		}

		this.setState({
			data: curData,
			dataFetched: true,
			count: count,
			frequencyNum: frequencyNum,
			totalDraws: totalDraws,
			lastDrawn: lastDrawn,
			countPowerball: countPowerball,
			frequencyNumPowerball: frequencyNumPowerball,
			lastDrawnPowerball: lastDrawnPowerball,
			predict: false,
		});

		//console.log(this.state);
	}

	getSetInfo() {
		if (this.state.dataFetched) {
			var data = this.state.data;
			//console.log(frq);
			//console.log(lastDrawn);
			var len = data.length;
			var states = [5, 25, 50, 100, 200, 500, 1000];
			var finalStates = [];
			for (var g = 0; g < states.length; g++) {
				if (states[g] < len) {
					finalStates.push(states[g]);
				}
			}
			finalStates.push(len);
			var tableData = [];
			for (var i = 0; i < data.length; i++) {
				var cur = {};
				cur.draw_id = data[i].draw_id;
				cur.draw_date = data[i].draw_date;

				var text = data[i].numbers.primaryNumbers.join(" , ");
				cur.numbers = text;

				cur.powerball = data[i].powerball.secondaryNumbers[0];

				tableData.push(cur);
			}
			//console.log(data);
			return (
				<MaterialTable
					title="Set Information"
					columns={[
						{ title: "Draw Number", field: "draw_id" },
						{ title: "Date", field: "draw_date", type: "date" },
						{ title: "Numbers", field: "numbers" },
						{ title: "Powerball", field: "powerball" },
					]}
					data={tableData}
					options={{
						sorting: true,
					}}
					components={{
						Pagination: (props) => (
							<TablePagination {...props} rowsPerPageOptions={finalStates} />
						),
					}}
				/>
			);
		} else {
			return (
				<center>
					<CircularProgress />
				</center>
			);
		}
	}

	getTable() {
		if (this.state.dataFetched) {
			var frq = this.state.frequencyNum;
			var lastDrawn = this.state.lastDrawn;
			var cnt = this.state.count;
			//console.log(frq);
			//console.log(lastDrawn);
			var data = [];
			for (var i = 1; i < 36; i++) {
				var cur = {};
				cur.number = i;
				cur.frequency = frq[i];
				cur.lastDrawn = lastDrawn[i];
				cur.count = cnt[i];
				data.push(cur);
			}
			//console.log(data);
			return (
				<MaterialTable
					title="Primary Number Statistics"
					columns={[
						{ title: "Number", field: "number" },
						{ title: "Frequency", field: "frequency" },
						{ title: "Last Drawn", field: "lastDrawn", type: "date" },
						{ title: "Number of Occurence", field: "count" },
					]}
					data={data}
					options={{
						sorting: true,
					}}
					components={{
						Pagination: (props) => (
							<TablePagination
								{...props}
								rowsPerPageOptions={[5, 10, 25, 50]}
							/>
						),
					}}
				/>
			);
		} else {
			return (
				<center>
					<CircularProgress />
				</center>
			);
		}
	}

	getPowerballTable() {
		if (this.state.dataFetched) {
			var frq = this.state.frequencyNumPowerball;
			var lastDrawn = this.state.lastDrawnPowerball;
			var cnt = this.state.countPowerball;
			//console.log(frq);
			//console.log(lastDrawn);
			var data = [];
			for (var i = 1; i <= 20; i++) {
				var cur = {};
				cur.number = i;
				cur.frequency = frq[i];
				cur.lastDrawn = lastDrawn[i];
				cur.count = cnt[i];
				data.push(cur);
			}
			//console.log(data);
			return (
				<MaterialTable
					title="Powerball Number Statistics"
					columns={[
						{ title: "Number", field: "number" },
						{ title: "Frequency", field: "frequency" },
						{ title: "Last Drawn", field: "lastDrawn", type: "date" },
						{ title: "Number of Occurence", field: "count" },
					]}
					data={data}
					options={{
						sorting: true,
					}}
					components={{
						Pagination: (props) => (
							<TablePagination
								{...props}
								rowsPerPageOptions={[5, 10, 25, 50]}
							/>
						),
					}}
				/>
			);
		} else {
			return (
				<center>
					<CircularProgress />
				</center>
			);
		}
	}

	async deleteOldContent() {
		var a = document.getElementById("tf");
		if (a.value) {
			let count = a.value;
			let data = this.state.data;
			//console.log(data);
			let len = data.length;
			if (count >= len)
				console.log(`Current Database Contains ${len} Entries only.`);
			else {
				var ids = [];
				for (var i = count; i < len; ++i) {
					ids.push(data[i].draw_id);
				}
				//send ids to backend to remove data
				console.log(ids);
				await axios.post("http://localhost:5000/api/powerball/delete", {
					ids: ids,
				});

				this.setState({ dataFetched: false });
				await this.update();
			}
		} else {
			console.log("Input Field Empty");
		}
	}

	infoLine() {
		if (this.state.dataFetched) {
			var len = this.state.data.length;
			return <p>*Conatins Information from {len} Sets.</p>;
		} else {
			return <p>Fetching Data</p>;
		}
	}

	getPrediction() {
		if (this.state.dataFetched && this.state.predict) {
			let {
				conditions,
				frequencyNum,
				data,
				frequencyNumPowerball,
			} = this.state;

			var prediction = predictNumbers(
				conditions,
				frequencyNum,
				data,
				false,
				true,
				frequencyNumPowerball
			);
			return prediction;
		} else {
			console.log("Can't Predict, Predict not called");
		}
	}
	handlePredict() {
		this.setState({ predict: true });
	}
	render() {
		return (
			<React.Fragment>
				<TextField id="tf" placeholder="New Maximum Data Count" />
				<Button onClick={this.deleteOldContent}>Delete Old Data</Button>
				<br></br>
				{this.infoLine()}
				<br></br>

				<Button onClick={this.handlePredict}>Predict</Button>
				<br></br>

				{this.getPrediction()}

				<br />
				{this.getTable()}
				<br />
				{this.getPowerballTable()}
				<br />
				{this.getSetInfo()}
			</React.Fragment>
		);
	}
}

export default PowerBall;
