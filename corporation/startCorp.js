/** @param {NS} ns **/

export async function main(ns) {
	ns.disableLog("ALL");

	if (!ns.getPlayer().hasCorporation) {
		ns.print("Creating corporation and purchasing initial upgrades.");
		ns.corporation.createCorporation("UmbrellaCorp");
		// Perform corporation exploit
		doExploit(ns);
	}
}

function doExploit(ns) {
	// Purchase API upgrades
	let x = Object.keys(document.getElementsByClassName("jss3")[0]);
	document.getElementsByClassName("jss3")[0][x].children.props.player.corporation.unlockUpgrades[7] = 1;
	document.getElementsByClassName("jss3")[0][x].children.props.player.corporation.unlockUpgrades[8] = 1;
	
	// Exploit public valuation
	ns.corporation.goPublic(1);
	ns.corporation.buyBackShares(1);
	document.getElementsByClassName("jss3")[0][x].children.props.player.corporation.immediatelyUpdateSharePrice();
}