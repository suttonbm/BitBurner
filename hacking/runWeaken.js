/** @param {NS} ns **/
import * as utils from "utils.js";

// Args: target, wknthreads, gap

export async function main(ns) {
	await utils.runThreadPool(ns, "weaken.js", ns.args[0], ns.args[1]);
	await ns.sleep(ns.args[2]);
	await utils.runThreadPool(ns, "weaken.js", ns.args[0], ns.args[1]);
}