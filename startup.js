/** @param {NS} ns **/
export async function main(ns) {
	// Initialize:
	
	// Copy treehack to n00dles
	ns.scp("treehack.js", "n00dles");
	// Gain root on n00dles
	ns.nuke("n00dles");
	// Start treehack on n00dles
	ns.exec("treehack.js", "n00dles");
	// Copy hacknet to foodnstuff
	ns.scp("hacknet.js", "foodnstuff");
	// Run hacknet on foodnstuff
	ns.exec("hacknet.js", "foodnstuff");
	// Copy buyserver to foodnstuff
	ns.scp("buyserver.js", "foodnstuff");
	// Run buyserver on foodnstuff
	ns.exec("buyserver.js", "foodnstuff");
	// If we have formulas, run batch on n00dles
	// Otherwise, run batch_start_specified on n00dles
	await runHack(ns, "n00dles");

	// Loop continuously every 30 minutes:
	while (true) {
		await ns.sleep(30*60*1000);
		
		// If there is sufficient memory, run contractor.
		if (!ns.isRunning("contractor.js", "home")) {
			let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
			let contractorRam = ns.getScriptRam("contractor.js");
			if (freeRam < contractorRam) {
				ns.exec("contractor.js", "home");
			}
		}
		
		// If there is sufficient memory, run stock script.
		if (!ns.isRunning("HODL.js", "home")) {
			let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
			let stockRam = ns.getScriptRam("HODL.js");
			if (freeRam < stockRam) {
				ns.exec("HODL.js", "home");
			}
		}

		// TODO: Figure out how to deal with corporation.

		// Kill current batch and restart to ensure optimal target selected
		await runHack(ns);
	}
	
}

async function runHack(ns, target="") {
	ns.scriptKill("batch.js", "home");
	ns.scriptKill("batch_start.js", "home");
	if (ns.fileExists("Formulas.exe", "home")) {
		ns.exec("batch.js", "home", 1, target);
	} else {
		ns.exec("batch_start.js", "home", 1, target);
	}
}