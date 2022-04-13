/** @param {NS} ns **/
import * as utils from "utils.js";

export async function main(ns) {
	while (true) {
		await dotreehack(ns);
		await ns.sleep(1000);
	}
}

export async function dotreehack(ns) {
	ns.disableLog("scan");
	ns.disableLog("scp");
	ns.disableLog("brutessh");
	ns.disableLog("ftpcrack");
	ns.disableLog("relaysmtp");
	ns.disableLog("httpworm");
	ns.disableLog("sqlinject");
	for (const server of utils.serverList(ns)) {
		let ports = 0;
		await ns.scp("hack.js", "home", server);
		await ns.scp("weaken.js", "home", server);
		await ns.scp("grow.js", "home", server);
		await ns.scp("utils.js", "home", server);
		await ns.scp("batch_start.js", "home", server);
		await ns.scp("runAttack.js", "home", server);
		await ns.scp("batch.js", "home", server);
		await ns.scp("treehack.js", "home", server);
		await ns.scp("runWeaken.js", "home", server);
		if (ns.fileExists("BruteSSH.exe", "home")) {
			//ns.tprint("Opening SSH...");
			ns.brutessh(server);
			ports += 1;
		}
		if (ns.fileExists("FTPCrack.exe", "home")) {
			//ns.tprint("Opening FTP...");
			ns.ftpcrack(server);
			ports += 1;
		}
		if (ns.fileExists("relaySMTP.exe", "home")) {
			//ns.tprint("Opening SMTP...");
			ns.relaysmtp(server);
			ports += 1;
		}
		if (ns.fileExists("HTTPWorm.exe", "home")) {
			//ns.tprint("Opening HTTP...");
			ns.httpworm(server);
			ports += 1;
		}
		if (ns.fileExists("SQLInject.exe", "home")) {
			//ns.tprint("Opening SQL...");
			ns.sqlinject(server);
			ports += 1;
		}
		if (ports >= ns.getServerNumPortsRequired(server)) {
			//ns.tprint(`Gaining ROOT on ${server}...`);
			ns.nuke(server);
		}
		
		let file = ns.ls(server).find(f => f.endsWith(".cct"));
		if (file) {
			ns.print(`Contract ${file} found on ${server}.`);
		}
	}
}