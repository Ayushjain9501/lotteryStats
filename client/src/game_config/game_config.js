//Make sure that value of num in all the conditions sum to numRequired.
//make sure numSets is less than or equal to the number of sets available.

module.exports = {
	games: [
		{
			name: "monwed",
			numRequired: 6,
			conditions: [
				{ lower: 5, upper: 10, num: 0, numSets: 4 },
				{ lower: 15, upper: 17, num: 0, numSets: 4 },
				{ lower: 19, upper: 28, num: 4, numSets: 4 },
				{ lower: 28, upper: 32, num: 1, numSets: 4 },
				{ lower: 5, upper: 50, num: 3, numSets: 1 },
			],
			// conditions_prev: { lower: 5, upper: 50, num: 3 },
		},
		{
			name: "tattslotto",
			numRequired: 6,
			conditions: [
				{ lower: 5, upper: 10, num: 0, numSets: 4 },
				{ lower: 15, upper: 17, num: 0, numSets: 4 },
				{ lower: 19, upper: 23, num: 4, numSets: 4 },
				{ lower: 28, upper: 32, num: 1, numSets: 4 },
				{ lower: 5, upper: 50, num: 1, numSets: 1 },
			],
		},
		{
			name: "ozlotto",
			numRequired: 7,
			conditions: [
				{ lower: 5, upper: 10, num: 0, numSets: 4 },
				{ lower: 15, upper: 17, num: 0, numSets: 4 },
				{ lower: 19, upper: 23, num: 4, numSets: 4 },
				{ lower: 28, upper: 32, num: 1, numSets: 4 },
				{ lower: 5, upper: 50, num: 1, numSets: 1 },
			],
		},
		{
			name: "setforlife",
			numRequired: 7,
			conditions: [
				{ lower: 5, upper: 10, num: 0, numSets: 4 },
				{ lower: 15, upper: 17, num: 0, numSets: 4 },
				{ lower: 19, upper: 23, num: 4, numSets: 4 },
				{ lower: 28, upper: 32, num: 1, numSets: 4 },
				{ lower: 5, upper: 50, num: 1, numSets: 1 },
			],
		},
		{
			name: "powerball",
			numRequired: 7,
			conditions: [
				{ lower: 5, upper: 10, num: 0, numSets: 4 },
				{ lower: 15, upper: 17, num: 0, numSets: 4 },
				{ lower: 19, upper: 23, num: 5, numSets: 4 },
				{ lower: 28, upper: 32, num: 1, numSets: 4 },
				{ lower: 5, upper: 50, num: 1, numSets: 1 },
			],
			powerballCondition: { lower: 2, upper: 100, numSets: 11 },
		},
	],
};
