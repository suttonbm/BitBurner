/** @param {NS} ns **/

export const serverList = (ns, current="home", s = new Set()) => {

	let connections = ns.scan(current);
	let next = connections.filter(c => !s.has(c));
	next.forEach(n => {
		s.add(n);
		return serverList(ns, n, s);
	});

	s.delete("home");
	return Array.from(s.keys());
}

export const countHacks = (ns) => {

	let n = 0;
	if (ns.fileExists("BruteSSH.exe")) { n += 1; }
	if (ns.fileExists("FTPCrack.exe")) { n += 1; }
	if (ns.fileExists("relaySMTP.exe")) { n += 1; }
	if (ns.fileExists("HTTPWorm.exe")) { n += 1; }
	if (ns.fileExists("SQLInject.exe")) { n += 1; }
	return n;
}

export const hackRam = (ns) => {return ns.getScriptRam("hack.js"); }
export const weakRam = (ns) => {return ns.getScriptRam("weaken.js"); }
export const growRam = (ns) => {return ns.getScriptRam("grow.js"); }

export async function runThreadPool(ns, script, target, threads, ...args) {
	//ns.tprint(`Launching ${threads} threaded ${script} against ${target}...`);

	if (!ns.fileExists(script)) {
		return;
	}

	let seed = Math.floor(Math.random() * 1000000000);
	let scriptRam = ns.getScriptRam(script);
	
	let launched = 0;
	while (launched < threads) {
		for (const server of serverList(ns)) {
			if (!ns.hasRootAccess(server)) {
				//ns.tprint(`No root access on ${server}.`);
				continue;
			} else if (launched >= threads) {
				return;
			}

			let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server) - 1;
			if (freeRam < 2) {
				continue;
			} else if (freeRam > (threads-launched) * scriptRam) {
				//ns.tprint(`Launching remaining threads on ${server}.`);
				ns.exec(script, server, (threads-launched), target, ...args, seed);
				return;
			} else {
				let capacity = Math.floor(freeRam / scriptRam);
				if (capacity < 1) {
					continue;
				}
				//ns.tprint(`Launching ${capacity} threads on ${server}.`);
				ns.exec(script, server, capacity, target, ...args, seed + 1);
				launched += capacity;
			}
		}
		await ns.sleep(1000);
	}
}