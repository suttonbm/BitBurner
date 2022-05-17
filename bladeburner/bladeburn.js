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
    "Overclock": {"prio": 1, "max": 90},
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
    ns.bladeburner.getContractNames(); // Will error out if not BB

    while (true) {
        await ns.sleep(10);
        await checkBlackOps(ns, ns.bladeburner);
        await doBestAction(ns, ns.bladeburner);
        let c = await doUpgrades(ns, ns.bladeburner);
        while (ns.bladeburner.getSkillPoints() > c) {
            c = await doUpgrades(ns, ns.bladeburner);
        }
    }
}

async function checkBlackOps(ns, bb) {
    let ops = bb.getBlackOpNames();
    for (let i=0; i<ops.length; i++) {
        let curRank = bb.getRank();
        let opRank = bb.getBlackOpRank(ops[i]);
        let opChance = bb.getActionEstimatedSuccessChance("blackop", ops[i])[0];
        if (bb.getActionCountRemaining("blackop", ops[i]) != 1) {
            ns.tprint(`Black op ${ops[i]} is already completed (${bb.getActionCountRemaining("blackop", ops[i])}).`);
            continue;
        }
        if (curRank > opRank && opChance > 0.90) {
            ns.tprint(`Attempting Black Op ${ops[i]}...`);
            await doAction(ns, "blackop", ops[i]);
        }
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
    // Todo: consider best city for an action, as success depends on location.

    // First check city chaos and mitigate if necessary
    if (bb.getCityChaos(bb.getCity()) > 50) {
        ns.tprint(`Chaos out of range in ${bb.getCity()}. Starting diplomacy.`);
        while (bb.getCityChaos(bb.getCity()) > 10) {
            await doAction(ns, "general", "Diplomacy");
        }
        return;
    }
    // Next check stamina and recover if low
    if (staminaPct(ns) < 0.5) {
        ns.tprint("Stamina low, regenerating.");
        while (staminaPct(ns) < 0.95) {
            await doAction(ns, "general", "Hyperbolic Regeneration Chamber");
        }
        return;
    }
    // Otherwise do highest rep gain action
    let actionList = [];
    bb.getContractNames().forEach(elt => actionList.push(["contract", elt]));
    bb.getOperationNames().forEach(elt => actionList.push(["operation", elt]));
    let bestAction = [];
    let bestActionRepGain = -1;
    let bestActionLevel = -1;
    let bestCity = bb.getCity();
    for (let c=0; c<cities.length; c++) {
        bb.switchCity(cities[c]);
        for (let i=0; i<actionList.length; i++) {
            if (actionList[i][1] == "Raid") {
                continue;
            }
            if (bb.getActionCountRemaining(...actionList[i]) < 10) {
                ns.tprint(`Action ${actionList[i][1]} depleted.`);
                continue;
            }
            //ns.bladeburner.setActionAutolevel();
            for (let lvl=1; lvl<=bb.getActionMaxLevel(...actionList[i]); lvl++) {
                let baseRep = bb.getActionRepGain(...actionList[i], lvl);
                //ns.tprint(`Base rep gain for ${actionList[i][1]} at level ${lvl} is ${baseRep}`);
                let successChc = bb.getActionEstimatedSuccessChance(...actionList[i])[0];
                //ns.tprint(`Success rate for ${actionList[i][1]} at level ${lvl} is ${successChc}`);
                let actionTime = bb.getActionTime(...actionList[i]);
                //ns.tprint(`Action time for ${actionList[i][1]} at level ${lvl} is ${actionTime}`);
                let repGain = baseRep * successChc / actionTime;
                //ns.tprint(`Rep gain for ${actionList[i][1]} at level ${lvl} is ${repGain}`);
                if (repGain > bestActionRepGain && successChc > 0.5) {
                    bestActionRepGain = repGain;
                    bestAction = actionList[i];
                    bestActionLevel = lvl;
                    bestCity = cities[c];
                }
            }
        }
    }
    if (bestAction.length>0 && bestActionRepGain>0) {
        ns.tprint(`Starting ${bestAction[0]} ${bestAction[1]} at level ${bestActionLevel}`);
        if (bb.getActionCurrentLevel(...bestAction) != bestActionLevel) {
            bb.setActionAutolevel(...bestAction, false);
            bb.setActionLevel(...bestAction, bestActionLevel);
        }
        bb.switchCity(bestCity);
        await doAction(ns, ...bestAction);
        return;
    }
    // IFF no other actions available, Raid
    if (bb.getActionCountRemaining("operation", "Raid") > 0) {
        ns.tprint("Starting Raid.");
        await doAction(ns, "operation", "Raid");
        return;
    }
    // IFF no actions available, incite violece
    ns.tprint("No other actions available, inciting violence.");
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
            return minCost;
        }
    }

    return Infinity;
}