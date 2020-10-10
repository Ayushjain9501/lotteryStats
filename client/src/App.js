import React from "react";
import logo from "./logo.svg";
import "./App.css";

import MonWed from "./components/mon_wed";
import Tatts from "./components/tatts_lotto";
import Oz from "./components/oz_lotto";
import SetForLife from "./components/set_for_life";
import PowerBall from "./components/powerball";
import Main from "./components/main";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import WhatshotIcon from "@material-ui/icons/Whatshot";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	appBar: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginRight: drawerWidth,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
}));

function App() {
	const classes = useStyles();
	const links = ["mon_wed", "tattslotto", "ozlotto", "setforlife", "powerball"];
	return (
		<Router>
			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" noWrap>
							<Link to="/" style={{ textDecoration: "none", color: "white" }}>
								Lottery Predictor
							</Link>
						</Typography>
					</Toolbar>
				</AppBar>

				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Switch>
						<Route path="/" exact component={Main}></Route>
						<Route path="/mon_wed" component={MonWed}></Route>
						<Route path="/tattslotto" component={Tatts}></Route>
						<Route path="/ozlotto" component={Oz}></Route>
						<Route path="/setforlife" component={SetForLife}></Route>
						<Route path="/powerball" component={PowerBall}></Route>
					</Switch>
				</main>

				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}
					anchor="right"
				>
					<div className={classes.toolbar}>
						<ListItem key="Lotteries">
							<ListItemText primary="Lotteries"></ListItemText>
						</ListItem>
					</div>
					<Divider />
					<List>
						{[
							"Mon/Wed Lotto",
							"TattsLotto",
							"Oz Lotto",
							"Set For Life",
							"PowerBall",
						].map((text, index) => (
							<ListItem button key={text} component={Link} to={links[index]}>
								<ListItemIcon>
									<WhatshotIcon />
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						))}
					</List>
				</Drawer>
			</div>
		</Router>
	);
}

export default App;
