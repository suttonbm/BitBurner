/** @param {NS} ns **/


export async function main(ns) {
	ns.disableLog("disableLog");
    ns.disableLog("sleep");

	if (!ns.getPlayer().hasCorporation) {
		ns.corporation.createCorporation("UmbrellaCorp");
	}

	var corp = ns.corporation.getCorporation();
	if (corp.divisions.length < 1) {
		// Start first division in agriculture, not tobacco
		ns.corporation.expandIndustry("Agriculture", "Ag");
		corp = ns.corporation.getCorporation();
        
		// Complete initial upgrades for the corporation
        await initialCorpUpgrade(ns);
        // Initialize cities for this division
		await initCities(ns, corp.divisions[0]);
	}

	while (true) {
		corp = ns.corporation.getCorporation();
		for (const division of corp.divisions.reverse()) {
			upgradeWarehouses(ns, division);
			upgradeCorp(ns);
			await hireEmployees(ns, division);
			newProduct(ns, division);
			doResearch(ns, division);
		}
		if (corp.divisions.length < 2 && corp.numShares == corp.totalShares) {
			if (corp.divisions[0].products.length > 2) {
				await trickInvest(ns, corp.divisions[0]);
			}
		}
		await ns.sleep(5000);
	}
}

async function initCities(ns, division, productCity=undefined) {
	for (const city of cities) {
		ns.print("Expand " + division.name + " to City " + city);
		if (!division.cities.includes(city)) {
			ns.corporation.expandCity(division.name, city);
			ns.corporation.purchaseWarehouse(division.name, city);
		}

		if (city != productCity) {
			// setup employees
			for (let i = 0; i < 3; i++) {
				ns.corporation.hireEmployee(division.name, city);
			}
			ns.corporation.setAutoJobAssignment(division.name, city, "Operations", 1);
            ns.corporation.setAutoJobAssignment(division.name, city, "Engineer", 1);
            ns.corporation.setAutoJobAssignment(division.name, city, "Business", 1);
            for (let i=0; i<2; i++) {
                ns.corporation.upgradeWarehouse(division.name, city);
            }
		}
	}

	ns.corporation.makeProduct(division.name, productCity, "Product-0", "1e9", "1e9");
}

async function initialCorpUpgrade(ns) {
	ns.print("Initial corp upgrades");
    // upgrade corp features
	ns.corporation.unlockUpgrade("Smart Supply");
	ns.corporation.levelUpgrade("Smart Storage");
	ns.corporation.levelUpgrade("Smart Storage");
	ns.corporation.levelUpgrade("Smart Storage");
	ns.corporation.levelUpgrade("Smart Storage");
	ns.corporation.levelUpgrade("DreamSense");
	// upgrade employee stats
	ns.corporation.levelUpgrade("Nuoptimal Nootropic Injector Implants");
	ns.corporation.levelUpgrade("Speech Processor Implants");
	ns.corporation.levelUpgrade("Neural Accelerators");
	ns.corporation.levelUpgrade("FocusWires");
}

const cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];

const upgradeList = [
	// lower priority value -> upgrade faster
	{ prio: 2, name: "Project Insight" },
	{ prio: 2, name: "DreamSense" },
	{ prio: 4, name: "ABC SalesBots" },
	{ prio: 4, name: "Smart Factories" },
	{ prio: 4, name: "Smart Storage" },
	{ prio: 8, name: "Neural Accelerators" },
	{ prio: 8, name: "Nuoptimal Nootropic Injector Implants" },
	{ prio: 8, name: "FocusWires" },
	{ prio: 8, name: "Speech Processor Implants" },
	{ prio: 8, name: "Wilson Analytics" },
];

const researchList = [
	// lower priority value -> upgrade faster
	{ prio: 10, name: "Overclock" },
	{ prio: 10, name: "uPgrade: Fulcrum" },
	{ prio: 3, name: "uPgrade: Capacity.I" },
	{ prio: 4, name: "uPgrade: Capacity.II" },
	{ prio: 10, name: "Self-Correcting Assemblers" },
	{ prio: 21, name: "Drones" },
	{ prio: 4, name: "Drones - Assembly" },
	{ prio: 10, name: "Drones - Transport" },
	{ prio: 26, name: "Automatic Drug Administration" },
	{ prio: 10, name: "CPH4 Injections" },
];