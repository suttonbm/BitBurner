/** @param {NS} ns **/
export async function main(ns) {
	ns.run("buyserver.js", 1);
	ns.run("hacknet.script", 1);
	//ns.run("HODL.js", 1);
	while (true) {
		let seed = Math.floor(Math.random() * 100000000);
		ns.run("treehack.js", 1);
		if (ns.getHackingLevel() < 20) {
			ns.run("basichack.script", 400, "n00dles");
		} else if (ns.getHackingLevel() < 100) {
			ns.run("basichack.script", 400, "joesguns");
		} else if (ns.getHackingLevel() < 200) {
			if (ns.fileExists("Formulas.exe", "home")) {
				ns.run("batch.js", 1);
			} else {
				ns.run("batch_start.js", 1, seed);
			}
		} else if (ns.getHackingLevel() < 500) {
			if (ns.fileExists("Formulas.exe", "home")) {
				ns.scriptKill("batch_start.js", "home");
				ns.run("batch.js", 1);
			} else {
				ns.run("batch_start.js", 1, seed);
			}
		} else {
			if (ns.fileExists("Formulas.exe", "home")) {
				ns.scriptKill("batch_start.js", "home");
				ns.run("batch.js", 1, seed);
			} else {
				ns.run("batch_start.js", 1, seed);
			}
		}
		await ns.sleep(600000);
	}
}