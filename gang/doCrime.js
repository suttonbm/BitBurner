/** @param {NS} ns */

const crimes = [
	{name: "Shoplift", time: 2e3, money: 15e3, karma: 0.1, totalXp: 4},
	{name: "Rob Store", time: 60e3, money: 400e3, karma: 0.5, totalXp: 30+45+45},
	{name: "Mug", time: 4e3, money: 36e3, karma: 0.25, totalXp: 3+3+3+3},
	{name: "Larceny", time: 90e3, money: 800e3, karma: 1.5, totalXp: 45+60+60},
	{name: "Deal Drugs", time: 10e3, money: 120e3, karma: 0.5, totalXp: 5+5+10},
	{name: "Bond Forgery", time: 300e3, money: 4.5e6, karma: 0.1, totalXp: 100+150+15},
	{name: "Traffick Arms", time: 40e3, money: 600e3, karma: 1, totalXp: 20+20+20+20+40},
	{name: "Homicide", time: 3e3, money: 45e3, karma: 3, totalXp: 2+2+2+2},
	{name: "Grand Theft Auto", time: 80e3, money: 1.6e6, karma: 5, totalXp: 20+20+20+80+40},
	{name: "Kidnap", time: 120e3, money: 3.6e6, karma: 6, totalXp: 80+80+80+80+80},
	{name: "Assassination", time: 300e3, money: 12e6, karma: 10, totalXp: 300+300+300+300},
	{name: "Heist", time: 600e3, money: 120e6, karma: 15, totalXp: 450+450+450+450+450+450},
];

export async function main(ns) {
	while (ns.heart.break() > -54000) {
		let c = findBestCrime(ns, 'karma');
		await doCrime(ns, c);
	}
}

function findBestCrime(ns, priority='karma') {
	let bestRate = 0;
	let bestCrime = '';
	for (let i=0; i<crimes.length; i++) {
		let rate = ns.getCrimeChance(crimes[i].name) * crimes[i][priority] / crimes[i].time;
		if (rate > bestRate) {
			bestRate = rate;
			bestCrime = crimes[i].name;
		}
	}
	return bestCrime;
}

async function doCrime(ns, c) {
	ns.commitCrime(c);
	while (ns.isBusy()) {
		await ns.sleep(10);
	}
}