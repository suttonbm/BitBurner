/** @param {NS} ns **/

import * as utils from "./utils.js";

let hackPct = 0.5;
let gap = 50;
let loopDelay = 500;

export async function prepareServer(ns, target) {
	let fh =  ns.formulas.hacking;

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
		await ns.sleep(fh.weakenTime(ns.getServer(target), ns.getPlayer()) + 1000);
	} else if (ns.getServerMoneyAvailable(target) < cashLimit) {
		// Start max threads needed to grow pool to target and weaken to target.
		let growAmt = 1 / ((ns.getServerMoneyAvailable(target) + 1) / cashLimit);
		let gthreads = Math.ceil(1.1 * ns.growthAnalyze(target, growAmt, 1));
		let wthreads = Math.ceil((ns.getServerSecurityLevel(target) + 0.004*gthreads - secLimit) / 0.05);
		await utils.runThreadPool(ns, "weaken.js", target, wthreads);
		await utils.runThreadPool(ns, "grow.js", target, gthreads);
		await ns.sleep(fh.weakenTime(ns.getServer(target), ns.getPlayer()) + 1000);
	}

	ns.tprint(`Finished preparing ${target}...`);
	ns.tprint(`Target cash on hand: ${ns.nFormat(cashLimit, "$0.000a")}`);
	ns.tprint(`Current cash on hand: ${ns.nFormat(ns.getServerMoneyAvailable(target), "$0.000a")}`);
	ns.tprint(`Target server security level: ${secLimit}`);
	ns.tprint(`Current security level: ${ns.getServerSecurityLevel(target)}`);
	ns.tprint(`Current hacking % per thread: ${fh.hackPercent(ns.getServer(target), ns.getPlayer())}`);
	ns.tprint(`Current hack likelihood: ${fh.hackChance(ns.getServer(target), ns.getPlayer())}`);
}

export function findBestTarget(ns) {
	let fh =  ns.formulas.hacking;
	
	// Identify highest cash/sec target to hack
	let bestTarget;
	let bestTargetCashPerSecond = 0;

	ns.tprint("Seeking best hacking target...");
	for (const server of utils.serverList(ns)) {
		if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) {
			continue;
		}
		if (ns.getServerMaxMoney(server) < 10000) {
			continue;
		}

		let cashLimit = ns.getServerMaxMoney(server) * 0.9;
		let secLimit = ns.getServerMinSecurityLevel(server) + 5;
		let p = ns.getPlayer();
		let s = ns.getServer(server);
		s.moneyAvailable = cashLimit;
		s.hackDifficulty = secLimit;
		let cashPerSecond = fh.hackChance(s, p) * fh.hackPercent(s, p) * cashLimit / fh.hackTime(s, p);
		ns.print(`Hacking rate for ${server} is ${ns.nFormat(cashPerSecond, "$0.000a")}.`);

		if (cashPerSecond > bestTargetCashPerSecond) {
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

	let fh =  ns.formulas.hacking;
	let target = findBestTarget(ns);
	if (ns.args[0] && ns.serverExists(ns.args[0])) {
		ns.tprint(`Using specified target ${ns.args[0]}`);
		target = ns.args[0];
	}
	await prepareServer(ns, target);

	// Get hacking process times for the target
	let ht = fh.hackTime(ns.getServer(target), ns.getPlayer());
	let wt = fh.weakenTime(ns.getServer(target), ns.getPlayer());
	let gt = fh.growTime(ns.getServer(target), ns.getPlayer());

	// Get wait times for spawning hack processes
	let ww_gap = Math.ceil(2 * gap);
	let wg_gap = Math.ceil(wt - gt + gap - ww_gap);
	let h_gap = Math.ceil(wt - ht - gap - ww_gap - wg_gap);

	// Start min threads needed to hack X% of server's total money
	let s = ns.getServer(target);
	let p = ns.getPlayer();
	let hackThreads = Math.floor(hackPct / fh.hackPercent(s,p));
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