/** @param {NS} ns **/

import * as utils from "utils.js";

let hackPct = 0.5;
let gap = 50;
let loopDelay = 2000;

export async function prepareServer(ns, target) {
	// Ensure target is properly prepared
	let cashLimit = ns.getServerMaxMoney(target) * 0.9;
	let secLimit = ns.getServerMinSecurityLevel(target) + 5;

	ns.tprint(`Preparing ${target} for hacking...`);
	ns.tprint(`Target cash on hand: ${ns.nFormat(cashLimit, "$0.000a")}`);
	ns.tprint(`Current cash on hand: ${ns.nFormat(ns.getServerMoneyAvailable(target), "$0.000a")}`);
	ns.tprint(`Target server security level: ${secLimit}`);
	ns.tprint(`Current security level: ${ns.getServerSecurityLevel(target)}`);

	if (ns.getServerSecurityLevel(target) > secLimit) {
		// Start min threads needed to reduce security to target
		let threads = Math.ceil((ns.getServerSecurityLevel(target) - secLimit) / 0.05);
		await utils.runThreadPool(ns, "weaken.js", target, threads);
		await ns.sleep(ns.getWeakenTime(target) + 1000);
	} else if (ns.getServerMoneyAvailable(target) < cashLimit) {
		// Start max threads needed to grow pool to target and weaken to ensure security is addressed
		let growAmt = 1 / ((ns.getServerMoneyAvailable(target) + 1) / cashLimit);
		let gthreads = Math.ceil(1.1 * ns.growthAnalyze(target, growAmt, 1));
		let wthreads = Math.ceil((ns.getServerSecurityLevel(target) + 0.004*gthreads - secLimit) / 0.05);
		await utils.runThreadPool(ns, "weaken.js", target, wthreads);
		await utils.runThreadPool(ns, "grow.js", target, gthreads);
		await ns.sleep(ns.getWeakenTime(target) + 1000);
	}

	ns.tprint(`Finished preparing ${target}...`);
	ns.tprint(`Target cash on hand: ${ns.nFormat(cashLimit, "$0.000a")}`);
	ns.tprint(`Current cash on hand: ${ns.nFormat(ns.getServerMoneyAvailable(target), "$0.000a")}`);
	ns.tprint(`Target server security level: ${secLimit}`);
	ns.tprint(`Current security level: ${ns.getServerSecurityLevel(target)}`);
	ns.tprint(`Current hacking % per thread: ${ns.hackAnalyze(target)}`);
	ns.tprint(`Current hack likelihood: ${ns.hackAnalyzeChance(target)}`);
}

export function findBestTarget(ns) {
	
	// Identify highest cash/sec target to hack
	let bestTarget;
	let bestTargetCashPerSecond = 0;
	let hacks = utils.countHacks(ns);
	ns.tprint(`Currently have ${hacks} port hacking programs.`);

	ns.tprint("Seeking best hacking target...");
	for (const server of utils.serverList(ns)) {
		if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) {
			continue;
		}
		if (ns.getServerMaxMoney(server) < 10000) {
			continue;
		}

		let cashLimit = ns.getServerMaxMoney(server) * 0.9;
		let cashPerSecond = ns.hackAnalyze(server) * ns.hackAnalyzeChance(server) * cashLimit / ns.getHackTime(server);
		//ns.tprint(`Hacking rate for ${server} is ${ns.nFormat(cashPerSecond, "$0.000a")}.`);

		if (cashPerSecond > bestTargetCashPerSecond && ns.getServerNumPortsRequired(server) <= hacks) {
			bestTarget = server;
			bestTargetCashPerSecond = cashPerSecond;
		}
	}

	ns.tprint(`Best target is ${bestTarget} at ${ns.nFormat(bestTargetCashPerSecond, "$0.000a")} per second!`);
	
	return bestTarget;
}

export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("scan");

	let target;
	target = findBestTarget(ns);
	if (ns.args[1] && ns.serverExists(ns.args[1])) {
		ns.tprint("Using specified target " + ns.args[1]);
		target = ns.args[1];
	}
	while ((ns.getServerMoneyAvailable(target) < (ns.getServerMaxMoney(target) * 0.9)) || (ns.getServerSecurityLevel(target) > (ns.getServerMinSecurityLevel(target) + 5))) {
		await prepareServer(ns, target);
	}

	// Get hacking process times for the target
	let ht = ns.getHackTime(target);
	let wt = ns.getWeakenTime(target);
	let gt = ns.getGrowTime(target);

	// Get wait times for spawning hack processes
	let ww_gap = Math.ceil(2 * gap);
	let wg_gap = Math.ceil(wt - gt + gap - ww_gap);
	let h_gap = Math.ceil(wt - ht - gap - ww_gap - wg_gap);

	// Start min threads needed to hack X% of server's total money
	let hackThreads = Math.floor(hackPct / ns.hackAnalyze(target));
	let growThreads = Math.ceil(3 * ns.growthAnalyze(target, 1/(1-hackPct), 1));
	let weakThreads = Math.ceil((hackThreads + growThreads) / 12);

	ns.run("batchMonitor.js", 1, target);

	while (true) {
		//ns.tprint(`Spawning attack thread against ${target}`);
		ns.run("treehack.js", 1);
		await utils.runThreadPool(ns, "runAttack.js", target, 1, weakThreads, growThreads, hackThreads, ww_gap, wg_gap, h_gap);
		await ns.sleep(loopDelay);
	}
}