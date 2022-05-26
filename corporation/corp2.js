/** @param {NS} ns **/

export async function main(ns) {
	ns.disableLog("ALL");

	if (!ns.getPlayer().hasCorporation) {
		ns.print("Creating corporation and purchasing initial upgrades.");
		ns.corporation.createCorporation("UmbrellaCorp");
		// Perform corporation exploit
		doExploit(ns);
		// Complete initial upgrades for the corporation
		initialCorpUpgrade(ns);
	}

	if (ns.corporation.getCorporation().divisions.length == 0) {
		spawnDivision(ns);
	}

	while (true) {
		await ns.sleep(10*1000);
		let corp = ns.corporation.getCorporation();
		
		// Check if sufficient funds to expand industries.
		let nextInd = industryTypes[corp.divisions.length].name;
		if (corp.funds > 10*(ns.corporation.getExpandIndustryCost(nextInd) + expandAdder)) {
			spawnDivision(ns);
		}

		// Iterate over industries and perform logistics
	}
}

function doExploit(ns) {
	// Purchase API upgrades
	let x = Object.keys(document.getElementsByClassName("jss3")[0]);
	document.getElementsByClassName("jss3")[0][x].children.props.player.corporation.unlockUpgrades[7] = 1;
	document.getElementsByClassName("jss3")[0][x].children.props.player.corporation.unlockUpgrades[8] = 1;
	
	// Exploit public valuation
	ns.corporation.goPublic(1);
	ns.corporation.buyBackShares(1);
	document.getElementsByClassName("jss3")[0][x].children.props.player.corporation.immediatelyUpdateSharePrice();
}

function spawnDivision(ns) {
	let corp = ns.corporation.getCorporation();
	let nextInd = industryTypes[corp.divisions.length].name;
	ns.print(`Corp currently has ${corp.divisions.length} divisions.`);
	if (corp.funds > ns.corporation.getExpandIndustryCost(nextInd) + expandAdder) {
		ns.print(`Opening a new division in ${nextInd}`);
		ns.corporation.expandIndustry(nextInd, nextInd);
		// Expand to all cities and open warehouses.
		let div = ns.corporation.getDivision(nextInd);
		for (const city of cities) {
			if (!div.cities.includes(city)) {
				ns.print(`Opening ${nextInd} office in ${city}`);
				ns.corporation.expandCity(nextInd, city);
				if (ns.corporation.hasUnlockUpgrade("Warehouse API")) {
					ns.print(`Creating warehouse in ${city}`);
					ns.corporation.purchaseWarehouse(nextInd, city);
				} else {
					ns.print("Opened division but did not buy warehouses!  Need API.");
				}
			}
		}
	} else {
		ns.print("Insufficient funds to open the next division.");
	}
}

function initialCorpUpgrade(ns) {
	ns.print("Initial corp upgrades");
    for (const upgrade of oneShotCorpUpgrades) {
		if (upgrade.init) {
			ns.corporation.unlockUpgrade(upgrade.name);
		}
	}
}

const expandAdder = 5 * (5e9 + 4e9); // Account for expansion into all cities.

const cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];

const industryTypes = [
	{name: "Agriculture", makeProd: false},
	{name: "Tobacco", makeProd: true},
	{name: "Healthcare", makeProd: true},
	{name: "Energy", makeProd: false},
	{name: "Water Utilities", makeProd: false},
	{name: "Fishing", makeProd: false},
	{name: "Mining", makeProd: false},
	{name: "Food", makeProd: true},
	{name: "Chemical", makeProd: false},
	{name: "Pharmaceutical", makeProd: true},
	{name: "Computer Hardware", makeProd: true},
	{name: "Robotics", makeProd: true},
	{name: "Software", makeProd: true},
	{name: "RealEstate", makeProd: true},
];

const oneShotCorpUpgrades = [
	{ name: "Export", init: false },
	{ name: "Smart Supply", init: true },
	{ name: "Market Research - Demand", init: false },
	{ name: "Market Data - Competition", init: false },
	{ name: "VeChain", init: false },
	{ name: "Shady Accounting", init: false },
	{ name: "Government Partnership", init: false },
	{ name: "Warehouse API", init: false },
	{ name: "Office API", init: false },
];

const corpUpgrades = [
	// lower priority value -> upgrade faster
	{ name: "Project Insight" },
	{ name: "DreamSense" },
	{ name: "ABC SalesBots" },
	{ name: "Smart Factories" },
	{ name: "Smart Storage" },
	{ name: "Neural Accelerators" },
	{ name: "Nuoptimal Nootropic Injector Implants" },
	{ name: "FocusWires" },
	{ name: "Speech Processor Implants" },
	{ name: "Wilson Analytics" },
];

const researchList = [
	// lower priority value -> upgrade faster
	{ name: "Hi-Tech R&D Laboratory"},
	{ name: "Overclock" },
	{ name: "uPgrade: Fulcrum" },
	{ name: "uPgrade: Capacity.I" },
	{ name: "uPgrade: Capacity.II" },
	{ name: "uPgrade: Dashboard" },
	{ name: "Self-Correcting Assemblers" },
	{ name: "Drones" },
	{ name: "Drones - Assembly" },
	{ name: "Drones - Transport" },
	{ name: "Automatic Drug Administration" },
	{ name: "CPH4 Injections" },
	{ name: "sudo.Assist" }
];