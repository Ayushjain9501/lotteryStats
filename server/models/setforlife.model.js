const sql = require("./db");

const Mon_Wed = {};

Mon_Wed.getAll = (result) => {
	sql.query("SELECT * FROM setforlife", (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		console.log("customers: ", res);
		result(null, res);
	});
};

Mon_Wed.remove = (draw_id, result) => {
	sql.query("DELETE FROM setforlife WHERE draw_id = ?", draw_id, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		if (res.affectedRows == 0) {
			// not found Customer with the draw_id
			result({ kind: "not_found" }, null);
			return;
		}

		console.log("deleted customer with draw_id: ", draw_id);
		result(null, res);
	});
};

module.exports = Mon_Wed;
