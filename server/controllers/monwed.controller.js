const Mon_Wed = require("../models/monwed.model.js");

exports.findAll = (req, res) => {
	Mon_Wed.getAll((err, data) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving customers.",
			});
		else res.send(data);
	});
};

exports.delete = (req, res) => {
	let ids = req.body.ids;
	ids.map((id) => {
		console.log(id);
		Mon_Wed.remove(id, (err, data) => {
			if (err) {
				if (err.kind === "not_found") {
					res.status(404).send({
						message: `Not found Customer with id ${id}.`,
					});
				} else {
					res.status(500).send({
						message: "Could not delete Customer with id " + id,
					});
				}
			}
		});
	});
	res.status(200).send("Deleted Required Rows Succesfully");
};
