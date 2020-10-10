import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Switch from "@material-ui/core/Switch";
import { CircularProgress } from "@material-ui/core";

import "./main.css";

class Main extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.getHealth = this.getHealth.bind(this);
		this.state = {
			selectedAPI: false,
			selectedOzlotteries: false,
			selectedLottodraw: false,
			selectedNationalLottery: false,
			selectedLotteryExtreme: false,
			selectedAustralianLotto: false,
			tableDataBool: 0,
			maxCompare: {
				mon_wed: -1,
				ozlotto: -1,
				powerball: -1,
				setforlife: -1,
				tattslotto: -1,
			},
		};
	}

	componentDidMount = async () => {
		var res = await axios.get("http://localhost:5000/api/details");
		console.log(res);
		this.setState({ tableDataBool: 1, tableData: res.data });
		this.getHealth();
		console.log(this.state);
	};

	handleClick = async () => {
		console.log(this.state);
		this.setState({ tableDataBool: 2 });
		var params = this.state;
		var res = await axios.post("http://localhost:5000/api/update", {
			params,
		});
		console.log(res);
		this.setState({ tableDataBool: 1, tableData: res.data });
		this.getHealth();
	};

	getHealth = () => {
		if (this.state.tableDataBool) {
			this.state.tableData.map((item) => {
				var { mon_wed, ozlotto, powerball, setforlife, tattslotto } = item;

				var mon_wed_max = Math.max(mon_wed, this.state.maxCompare.mon_wed);
				var ozlotto_max = Math.max(ozlotto, this.state.maxCompare.ozlotto);
				var powerball_max = Math.max(
					powerball,
					this.state.maxCompare.powerball
				);
				var setforlife_max = Math.max(
					setforlife,
					this.state.maxCompare.setforlife
				);
				var tattslotto_max = Math.max(
					tattslotto,
					this.state.maxCompare.tattslotto
				);

				var a = {
					mon_wed: mon_wed_max,
					ozlotto: ozlotto_max,
					powerball: powerball_max,
					setforlife: setforlife_max,
					tattslotto: tattslotto_max,
				};
				console.log(a);
				this.setState({ maxCompare: a });
			});
		}
		return;
	};

	getInfo = () => {
		if (this.state.tableDataBool === 1) {
			return this.state.tableData.map((item) => {
				var {
					name,
					mon_wed,
					ozlotto,
					powerball,
					setforlife,
					tattslotto,
					date,
				} = item;
				return (
					<div>
						<h2>{name.toUpperCase()}</h2>
						Last Updated on : {date}
						<ul>
							<li
								className={
									mon_wed === this.state.maxCompare.mon_wed
										? "success"
										: "failure"
								}
							>
								Mon_Wed : {mon_wed}
							</li>
							<li
								className={
									tattslotto === this.state.maxCompare.tattslotto
										? "success"
										: "failure"
								}
							>
								Tatts : {tattslotto}
							</li>
							<li
								className={
									ozlotto === this.state.maxCompare.ozlotto
										? "success"
										: "failure"
								}
							>
								Oz : {ozlotto}
							</li>
							<li
								className={
									setforlife === this.state.maxCompare.setforlife
										? "success"
										: "failure"
								}
							>
								Set For Life : {setforlife}
							</li>
							<li
								className={
									powerball === this.state.maxCompare.powerball
										? "success"
										: "failure"
								}
							>
								Powerball : {powerball}
							</li>
						</ul>
					</div>
				);
			});
		} else if (this.state.tableDataBool === 2) {
			return <h1>Updating...</h1>;
		} else {
			return <CircularProgress></CircularProgress>;
		}
	};

	render() {
		return (
			<div>
				<h1>Welcome to Australian Lottery Predictor</h1> <br />
				<br />
				<ul>
					<li>
						API :{" "}
						<Switch
							name="checkAPI"
							selected={this.state.selectedAPI}
							onChange={() => {
								var cur = this.state.selectedAPI;
								this.setState({ selectedAPI: !cur }, function () {
									console.log(this.state);
								});
							}}
							color="primary"
						></Switch>
					</li>
					<br />
					<li>
						Lottodraw Scraper :{" "}
						<Switch
							name="checkLottoDraw"
							selected={this.state.selectedLottodraw}
							onChange={() => {
								var cur = this.state.selectedLottodraw;
								this.setState({ selectedLottodraw: !cur }, function () {
									console.log(this.state);
								});
							}}
							color="primary"
						></Switch>
					</li>
					<br />
					<li>
						OzLotteries Scraper :{" "}
						<Switch
							name="checkOzLotteries"
							selected={this.state.selectedOzlotteries}
							onChange={() => {
								var cur = this.state.selectedOzlotteries;
								this.setState({ selectedOzlotteries: !cur }, function () {
									console.log(this.state);
								});
							}}
							inputProps={{ "aria-label": "primary checkbox" }}
							color="primary"
						></Switch>
					</li>
					<br />
					<li>
						Australian Lotto Scraper :{" "}
						<Switch
							name="checkAustralianLotto"
							selected={this.state.selectedAustralianLotto}
							onChange={() => {
								var cur = this.state.selectedAustralianLotto;
								this.setState({ selectedAustralianLotto: !cur }, function () {
									console.log(this.state);
								});
							}}
							inputProps={{ "aria-label": "primary checkbox" }}
							color="primary"
						></Switch>
					</li>
					<br />
					<li>
						Lottery Extreme Scraper :{" "}
						<Switch
							name="checkLottoExtreme"
							selected={this.state.selectedLotteryExtreme}
							onChange={() => {
								var cur = this.state.selectedLotteryExtreme;
								this.setState({ selectedLotteryExtreme: !cur }, function () {
									console.log(this.state);
								});
							}}
							inputProps={{ "aria-label": "primary checkbox" }}
							color="primary"
						></Switch>
					</li>
					<br />
					<li>
						National Lottery Scraper :{" "}
						<Switch
							name="checkLotteryScraper"
							selected={this.state.selectedNationalLottery}
							onChange={() => {
								var cur = this.state.selectedNationalLottery;
								this.setState({ selectedNationalLottery: !cur }, function () {
									console.log(this.state);
								});
							}}
							inputProps={{ "aria-label": "primary checkbox" }}
							color="primary"
						></Switch>
					</li>
				</ul>
				<Button color="primary" variant="contained" onClick={this.handleClick}>
					Update
				</Button>
				<br />
				<br />
				{this.getInfo()}
			</div>
		);
	}
}

export default Main;
