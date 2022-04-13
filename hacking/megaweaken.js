/** @param {NS} ns **/

import * as utils from "./utils.js";

let gap = 50;
let loopDelay = 100;

export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("getServerMaxRam");

	let fh =  ns.formulas.hacking;
	let target;
	if (ns.args[0] && ns.serverExists(ns.args[0])) {
		ns.tprint(`Using specified target ${ns.args[0]}`);
		target = ns.args[0];
	} else {
		ns.tprint("Invalid target");
		return;
	}

	// Start min threads needed to hack X% of server's total money
	let weakThreads = 5000;

	while (true) {
		//ns.tprint(`Spawning attack thread against ${target}`);
		ns.run("treehack.js", 1);
		await utils.runThreadPool(ns, "runWeaken.js", target, 1, weakThreads, gap);
		await ns.sleep(loopDelay);
	}
}