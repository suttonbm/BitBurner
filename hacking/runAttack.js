/** @param {NS} ns **/
import * as utils from "utils.js";

// Args: target, wknthreads, growthreads, hackthreads, wwgap, wggap, hgap

export async function main(ns) {
	await utils.runThreadPool(ns, "weaken.js", ns.args[0], ns.args[1]);
	await ns.sleep(ns.args[4]);
	await utils.runThreadPool(ns, "weaken.js", ns.args[0], ns.args[1]);
	await ns.sleep(ns.args[5]);
	await utils.runThreadPool(ns, "grow.js", ns.args[0], ns.args[2]);
	await ns.sleep(ns.args[6]);
	await utils.runThreadPool(ns, "hack.js", ns.args[0], ns.args[3]);
}