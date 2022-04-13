/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMoneyAvailable");
	
	let target = ns.args[0];
	while (true) {
		ns.print(`Current cash on hand: ${ns.nFormat(ns.getServerMoneyAvailable(target), "$0.000a")}`);
		ns.print(`Current security level: ${ns.getServerSecurityLevel(target)}`);
		await ns.sleep(10000);
	}
}