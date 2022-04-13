/** @param {NS} ns **/
// List of servers to attack
// List of servers to target with basichack
let targets = ['n00dles', 'foodnstuff', 'sigma-cosmetics', 'joesguns', 'hong-fang-tea', 'harakiri-sushi', 'iron-gym', 'zer0', 'CSEC', 'max-hardware', 'nectar-net', 'omega-net', 'neo-net', 'silver-helix', 'phantasy', 'johnson-ortho', 'crush-fitness', 'the-hub', 'comptek', 'netlink', 'avmnite-02h', "I.I.I.I", "catalyst", "summit-uni", "syscore"];

// How much RAM each purchased server will have.
let ram = 32;

export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerMoneyAvailable");

	// Iterator we'll use for our loop
	let n = ns.getPurchasedServers().length;
	ns.print("Currently have " + n + " purchased servers.");

	// Continuously try to purchase servers until we've reached the maximum
	// amount of servers
	ns.tprint("Max servers allowed: " + ns.getPurchasedServerLimit());
	for (let i=0; i < ns.getPurchasedServerLimit(); i++) {
		// Check if we have enough money to purchase a server
		if (ns.serverExists("pserv-" + i)) {
			ns.print(`Server pserv-${i} already purchased.`);
			continue;
		}
		while (true) {
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				// If we have enough money, then:
				//  1. Purchase the server
				//  2. Copy our hacking script onto the newly-purchased server
				//  3. Run our hacking script on the newly-purchased server with 3 threads
				//  4. Increment our iterator to indicate that we've bought a new server
				ns.print(`Attempting to purchase pserv-${i}.`);
				let hostname = ns.purchaseServer("pserv-" + i, ram);
				ns.print(`Purchased new server ${hostname} with ${ram} GB RAM.`);
				break;
			}
			await ns.sleep(1000);
		}
	}

	// Once max servers reached, begin increasing ram and buying larger servers
	while(true) {
		await ns.sleep(10000);
		for (let i=0; i<ns.getPurchasedServerLimit(); i++) {
			let hostname = "pserv-" + i;
			if (!ns.serverExists("pserv-" + i)) {
				continue;
			}
			let currentRam = ns.getServerMaxRam(hostname);
			let newRam = currentRam * 2;
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(newRam)) {
				ns.print(`Upgrading ${hostname} to ${newRam} GB RAM.`);
				ns.killall(hostname);
				ns.deleteServer(hostname);
				hostname = ns.purchaseServer("pserv-" + i, newRam);
			}
		}
	}
}