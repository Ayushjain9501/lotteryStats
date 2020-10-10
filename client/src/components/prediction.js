import React from "react";
import { Paper } from "@material-ui/core";

function predictNumbers(
	conditions,
	frequencyNum,
	data,
	isSetForLife = false,
	isPowerBall = false,
	frequencyNumPowerball = undefined
) {
	// let { conditions, frequencyNum, data } = this.state;
	let PRIMARYBALLHIGH = 45;

	if (isSetForLife) {
		console.log("isSetForLife");
		PRIMARYBALLHIGH = 44;
	}

	if (isPowerBall) {
		console.log("isPowerBall");
		PRIMARYBALLHIGH = 35;
	}

	let output = [];
	let selected = {};
	for (var i = 1; i <= 45; ++i) {
		selected[i] = false;
	}

	// let lastGame = [];

	// data[0].numbers.primaryNumbers.map((number) => {
	// 	if (!selected[number]) {
	// 		if (
	// 			frequencyNum[number] >= conditions.conditions_prev.lower &&
	// 			frequencyNum[number] <= conditions.conditions_prev.upper
	// 		) {
	// 			lastGame.push({
	// 				number: number,
	// 				reason: `Occured in Last Game and frequency ${frequencyNum[number]}% is between ${conditions.conditions_prev.lower}% and ${conditions.conditions_prev.upper}%`,
	// 			});
	// 		}
	// 	}
	// });

	// var lastEnough = 1;
	// let randomLastGame = [];

	// // console.log(lastGameCandidates);
	// // console.log(conditions.conditions_prev.num);

	// if (lastGame.length < conditions.conditions_prev.num) {
	// 	lastEnough = 0;
	// }

	// var lastGameLen = lastGame.length;
	// var lastGameIntro = (
	// 	<div>
	// 		<h3>
	// 			Last Game Condtion : {conditions.conditions_prev.lower}%-
	// 			{conditions.conditions_prev.upper}%, number required -{" "}
	// 			{conditions.conditions_prev.num}
	// 		</h3>{" "}
	// 		<p>{lastGameLen} Numbers found in Last Game satisying criteria.</p>
	// 	</div>
	// );

	// output.push(lastGameIntro);

	// for (i = 0; i < Math.min(conditions.conditions_prev.num, lastGameLen); ++i) {
	// 	var index = Math.floor(Math.random() * lastGame.length);
	// 	randomLastGame.push(lastGame[index]);
	// 	selected[lastGame[index].number] = true;
	// 	lastGame.splice(index, 1);
	// }

	// let lastGamejsx = randomLastGame.map((item) => {
	// 	return (
	// 		<li key={item.number}>
	// 			<strong>{item.number}</strong> : {item.reason}
	// 		</li>
	// 	);
	// });

	// output.push(lastGamejsx);
	// if (!lastEnough) {
	// 	var notEnough = (
	// 		<p>
	// 			For current constraints of last game, only {randomLastGame.length}{" "}
	// 			candidates were found and is less than required number :{" "}
	// 			{conditions.conditions_prev.num}.
	// 		</p>
	// 	);
	// 	// lastGamejsx = (
	// 	// 	<div>
	// 	// 		{lastGamejsx}
	// 	// 		{notEnough}
	// 	// 	</div>
	// 	// );
	// 	output.push(notEnough);
	// }

	for (i = 0; i < conditions.conditions.length; ++i) {
		let lower = conditions.conditions[i].lower;
		let upper = conditions.conditions[i].upper;
		let limit = conditions.conditions[i].num;
		let numSets = conditions.conditions[i].numSets;
		let notEnough = 0;
		let conditionCandidates = [];
		let conditionCandidatesLimit = [];

		for (var k = 1; k <= PRIMARYBALLHIGH; ++k) {
			if (!selected[k]) {
				if (frequencyNum[k] >= lower && frequencyNum[k] <= upper) {
					conditionCandidates.push(k);
				}
			}
		}

		var lastKGames = new Set();

		for (k = 0; k < numSets; ++k) {
			for (var l = 0; l < data[k].numbers.primaryNumbers.length; ++l) {
				//console.log(data[k].numbers.primaryNumbers[l]);
				lastKGames.add(data[k].numbers.primaryNumbers[l]);
			}
		}

		for (k = 0; k < conditionCandidates.length; ++k) {
			if (lastKGames.has(conditionCandidates[k])) {
				conditionCandidatesLimit.push(conditionCandidates[k]);
			}
		}

		if (conditionCandidatesLimit.length < limit) {
			notEnough = 1;
		}

		var intro = (
			<div>
				<h3>
					Condtion : {lower}% - {upper}% , Number Required = {limit}, Number
					Sets : {numSets}{" "}
				</h3>
				<p>
					{conditionCandidates.length} numbers found satisfying the frequency
					criteria : {lower} : {upper}. <br />
					{conditionCandidatesLimit.length} numbers occured in last {numSets}{" "}
					games.
				</p>
			</div>
		);
		var gameLen = conditionCandidatesLimit.length;
		let randomConditionCandidatesLimit = [];

		for (k = 0; k < Math.min(limit, gameLen); ++k) {
			let index = Math.floor(Math.random() * conditionCandidatesLimit.length);
			randomConditionCandidatesLimit.push(conditionCandidatesLimit[index]);
			selected[conditionCandidatesLimit[index]] = true;
			conditionCandidatesLimit.splice(index, 1);
		}

		var listItems = randomConditionCandidatesLimit.map((number) => {
			return (
				<li key={number}>
					<strong>{number}</strong> : Occured in last {numSets} games and{" "}
					{frequencyNum[number]}% is between {lower} and {upper}.
				</li>
			);
		});

		output.push(intro);
		output.push(listItems);

		if (notEnough) {
			var notEnoughNote = (
				<p>
					For current Constraints, only {conditionCandidatesLimit.length}{" "}
					numbers were found and is less than required numbers : {limit}.
				</p>
			);
			output.push(notEnoughNote);
		}
	}

	var selectedHeading = [];
	for (i = 1; i <= 45; ++i) {
		if (selected[i]) {
			var tempHeading = <span>{i} </span>;
			selectedHeading.push(tempHeading);
		}
	}
	if (isPowerBall) {
		let POWERBALLHIGH = 20;
		var candidates = [];
		var lower = conditions.powerballCondition.lower;
		var upper = conditions.powerballCondition.upper;
		var lastSets = conditions.powerballCondition.numSets;

		for (i = 1; i <= POWERBALLHIGH; ++i) {
			if (
				frequencyNumPowerball[i] >= lower &&
				frequencyNumPowerball[i] <= upper
			) {
				candidates.push(i);
			}
		}

		lastKGames = new Set();
		console.log(data);
		console.log(frequencyNumPowerball);
		for (i = 0; i < lastSets; i++) {
			lastKGames.add(data[i].powerball.secondaryNumbers[0]);
		}

		var candidatesLimit = [];
		for (i = 0; i < candidates.length; ++i) {
			if (lastKGames.has(candidates[i])) {
				candidatesLimit.push(candidates[i]);
			}
		}

		let index = Math.floor(Math.random() * candidatesLimit.length);
		console.log("Index is ", index);
		intro = (
			<div>
				<h3>
					PowerBall Condtion : {lower}% - {upper}% , number required = {1}{" "}
				</h3>
				<p>
					{candidates.length} numbers found satisfying the frequency criteria :{" "}
					{lower} : {upper}. <br />
					{candidatesLimit.length} numbers occured in last {lastSets} games.
				</p>
			</div>
		);

		let listItem = (
			<li key="power">
				<strong>{candidatesLimit[index]}</strong> : Occured in last {lastSets}{" "}
				games and {frequencyNumPowerball[candidatesLimit[index]]}% is between{" "}
				{lower} and {upper}.
			</li>
		);
		selectedHeading.push(<br />);
		selectedHeading.push(<span>Powerball : {candidatesLimit[index]}</span>);
		output.push(intro);
		output.push(listItem);
	}

	return (
		<Paper elevation={2} style={{ margin: 10, padding: 20 }}>
			<p>
				<h2>{selectedHeading}</h2>
			</p>
			<br />
			{output}
		</Paper>
	);
}

export default predictNumbers;
