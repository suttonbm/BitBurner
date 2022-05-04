/** @param {NS} ns **/

const cities = ["Sector-12", "Aevum", "Ishima", "New Tokyo", "Chongqing", "Volhaven"];

const skillRank = {
    "Blade's Intuition": {"prio": 1, "max": Infinity},
    "Cloak": {"prio": 1, "max": 25},
    "Marksman": {"prio": 0, "max": 1},
    "Weapon Proficiency": {"prio": 0, "max": 1},
    "Short-Circuit": {"prio": 1, "max": 25},
    "Digital Observer": {"prio": 1, "max": Infinity},
    "Tracer": {"prio": 0, "max": 1},
    "Overclock": {"prio": 1, "max": 99},
    "Reaper": {"prio": 1, "max": Infinity},
    "Evasive System": {"prio": 1, "max": Infinity},
    "Datamancer": {"prio": 0, "max": 1},
    "Cyber's Edge": {"prio": 0, "max": 1},
    "Hands of Midas": {"prio": 0, "max": 1},
    "Hyperdrive": {"prio": 1, "max": 10},
  }

// TODO: Handle other actions being manually specified *IF* simulacrum not purchased.
// TODO: Handle if we have access to bladeburner.

export async function main(ns) {
    while (true) {
        await ns.sleep(10);
        await goToBestCity(ns, ns.bladeburner);
        await checkBlackOps(ns, ns.bladeburner);
        await doBestAction(ns, ns.bladeburner);
        await doUpgrades(ns, ns.bladeburner);
    }
}

async function checkBlackOps(ns, bb) {
    let ops = bb.getBlackOpNames();
    for (let i=0; i<ops.length; i++) {
        let curRank = bb.getRank();
        let opRank = bb.getBlackOpRank();
        let opChance = bb.getActionEstimatedSuccessChance("blackop", ops[i]);
        if (curRank > opRank && opChance > 0.90) {
            ns.print(`Attempting Black Op ${ops[i]}...`);
            doAction(ns, "blackop", ops[i]);
        }
    }
}

async function goToBestCity(ns, bb) {
    let bestCity = bb.getCity();
    let bestPop = bb.getCityEstimatedPopulation(bestCity);
    for (let i=0; i<cities.length; i++) {
        let thisPop = bb.getCityEstimatedPopulation(cities[i]);
        if (thisPop > bestPop) {
            bestPop = thisPop;
            bestCity = cities[i];
        }
    }
    if (bestCity != bb.getCity()) {
        ns.print(`Highest population in ${bestCity}.  Traveling there.`);
        bb.switchCity(bestCity);
    }
}

function staminaPct(ns) {
    let a = ns.bladeburner.getStamina();
    return a[0] / a[1];
}

async function doAction(ns, type, name) {
    let waitTime = ns.bladeburner.getActionTime(type, name);
    if (ns.bladeburner.startAction(type, name)) {
        await ns.sleep(waitTime + 10);
    }
}

async function doBestAction(ns, bb) {
    // First check city chaos and mitigate if necessary
    if (bb.getCityChaos(bb.getCity()) > 50) {
        ns.print(`Chaos out of range in ${bb.getCity()}. Starting diplomacy.`);
        await doAction(ns, "general", "Diplomacy");
        return;
    }
    // Next check stamina and recover if low
    if (staminaPct(ns) < 0.5) {
        ns.print("Stamina low, regenerating.");
        await doAction(ns, "general", "Hyperbolic Regeneration Chamber");
        return;
    }
    // Otherwise do highest rep gain action
    let actionList = [];
    bb.getContractNames().forEach(elt => actionList.append(["contract", elt]));
    bb.getOperationNames().forEach(elt => actionList.append(["operation", elt]));
    let bestAction = [];
    let bestActionRepGain = -1;
    let bestActionLevel = -1;
    for (let i=0; i<actionList.length; i++) {
        if (actionList[i][1] == "Raid") {
            continue;
        }
        if (bb.getActionCountRemaining(...actionList[i]) < 10) {
            continue;
        }
        //ns.bladeburner.setActionAutolevel();
        for (let lvl=1; lvl<=bb.getActionMaxLevel(...actionList[i]); lvl++) {
            let repGain = bb.getActionRepGain(...actionList[i], lvl) * bb.getActionEstimatedSuccessChance(...actionList[i]) / bb.getActionTime(...actionList[i]);
            if (repGain > bestActionRepGain) {
                bestActionRepGain = repGain;
                bestAction = actionList[i];
                bestActionLevel = lvl;
            }
        }
    }
    if (bestAction.length>0 && bestActionRepGain>0) {
        ns.print(`Starting ${bestAction[0]} ${bestAction[1]} at level ${bestLvl}`);
        await doAction(ns, ...bestAction);
        return;
    }
    // IFF no other actions available, Raid
    if (bb.getActionCountRemaining("Raid") > 0) {
        ns.print("Starting Raid.");
        await doAction(ns, "operation", "Raid");
        return;
    }
    // IFF no actions available, incite violece
    ns.print("No other actions available, inciting violence.");
    await doAction(ns, "general", "Incite Violence");
}

async function doUpgrades(ns, bb) {
    // Get upgrade list
    // Ranked priority of upgrades based on what is available, up to specified max
    let minCost = Infinity;
    let minCostSkill = "";
    for (var skill of Object.keys(skillRank)) {
        if (skillRank[skill]["prio"] == 0) {
            continue;
        }
        if (bb.getSkillLevel(skill) >= skillRank[skill]["max"]) {
            continue;
        }

        let cost = bb.getSkillUpgradeCost(skill);
        if (cost <= minCost) {
            minCost = cost;
            minCostSkill = skill;
        }
    }

    if (minCost < Infinity && minCostSkill != "") {
        if (bb.upgradeSkill(minCostSkill)) {
            ns.print(`Upgraded skill ${minCostSkill}.`);
        }
    }

    return;
}