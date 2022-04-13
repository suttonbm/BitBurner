/** @param {NS} ns **/

const saveCash = 0;
const repayTimeLimit = 600;

export async function main(ns) { 
    ns.disableLog('sleep');
    ns.disableLog('getServerMoneyAvailable');

    // Identify base rate for constants in hacknet production
    ns.print("Getting base rate for hacknet production");
    let baseRate = await getBaseRate(ns);

    while (true) {
        let upgradeList = [];

        ns.print("Checking if another node will still meet ROI target");
        let nodeCost = ns.hacknet.getPurchaseNodeCost();
        if (nodeCost / baseRate < repayTimeLimit ) {
            ns.print("Buying node...");
            while (cash(ns) < nodeCost) {
                ns.print(`Have ${cash(ns)}, need ${nodeCost}.`);
                await ns.sleep(5000);
            }
            let i = ns.hacknet.purchaseNode();
        }

        // Iterate over owned nodes and identify upgrades that conform to ROI expectations
        for (let i=0; i<ns.hacknet.numNodes(); i++) {
            // Get curent node stats
            let stats = ns.hacknet.getNodeStats(i);

            // Get cost and upgraded production for purchasing a level
            let lvlCost = ns.hacknet.getLevelUpgradeCost(i, 1);
            let lvlUpgradeRate = getFutureRate(baseRate, stats.level+1, stats.ram, stats.cores);

            // Get cost and upgraded production for purchasing ram
            let ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
            let ramUpgradeRate = getFutureRate(baseRate, stats.level, stats.ram+1, stats.cores);

            // Get cost and upgraded production for purchasing a core
            let coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
            let coreUpgradeRate = getFutureRate(baseRate, stats.level, stats.ram, stats.cores+1);

            // Check each upgrade option for ROI expectations
            if (lvlCost / (lvlUpgradeRate - stats.production) < repayTimeLimit) {
                upgradeList.push([i, lvlCost, ns.hacknet.upgradeLevel]);
            }
            if (ramCost / (ramUpgradeRate - stats.production) < repayTimeLimit) {
                upgradeList.push([i, ramCost, ns.hacknet.upgradeRam]);
            }
            if (coreCost / (coreUpgradeRate - stats.production) < repayTimeLimit) {
                upgradeList.push([i, coreCost, ns.hacknet.upgradeCore]);
            }
        }

        // No further upgrades conform to ROI expectations
        if (upgradeList.length === 0) {
            ns.tprint("Finished all hacknet purchases meeting ROI target.  Exiting.");
            return;
        }
        ns.tprint(`Identified ${upgradeList.length} upgrades meeting ROI target.`);
        
        // Sort upgrade options by cost, then purchase the cheapest.
        upgradeList.sort(sortUpgrades);
        await buyUpgrade(ns, ...upgradeList[0]);

        await ns.sleep(1000);
    }
}

function sortUpgrades(a, b) {
    if (a[1]<b[1]) {
        return -1;
    } else if (a[1]>b[1]) {
        return 1;
    } else {
        return 0;
    }
}

async function buyUpgrade(ns, nodeId, cost, callback) {
    while (cash(ns) <= cost) {
        ns.print(`Have ${cash(ns)}, need ${cost}.`);
        await ns.sleep(5000);
    }
    return callback(nodeId, 1);
}

function cash(ns) {
    return ns.getServerMoneyAvailable("home") - saveCash;
}

function ramMult(x) {
    return Math.pow(1.035, x-1);
}

function coreMult(x) {
    return (x+5) / 6;
}

function getFutureRate(baseRate, level, ram, cores) {
    return baseRate * level * ramMult(ram) * coreMult(cores);
}

async function getBaseRate(ns) {
    let cost = ns.hacknet.getPurchaseNodeCost();
    while (cash(ns) < cost) {
        await ns.sleep(5000);
    }
    let i = ns.hacknet.purchaseNode();
    return ns.hacknet.getNodeStats(i).production / (ramMult(1) * coreMult(1));
}
