/** @param {NS} ns **/

export async function main(ns) {
    ns.disableLog('ALL');
    while (true) {
        await ns.sleep(10);
        if (ns.gang.canRecruitMember()) {
            ns.gang.recruitMember(String(Math.floor(Math.random()*1e6)));
        }
        doActions(ns);
        doAscend(ns);
    }
}

function doActions(ns) {
    let members = ns.gang.getMemberNames();
    let gangInfo = ns.gang.getGangInformation();
    for (let i=0; i<members.length; i++) {
        if (gangInfo.respectGainRate < gangInfo.wantedLevelGainRate || gangInfo.respect < gangInfo.wantedLevel) {
            ns.gang.setMemberTask(members[i], "Vigilante Justice");
            continue;
        }
        let memberInfo = ns.gang.getMemberInformation(members[i]);
        if (memberInfo.cha + memberInfo.def + memberInfo.dex + memberInfo.hack + memberInfo.str < 500) {
            ns.gang.setMemberTask(members[i], "Terrorism");
        } else {
            let tasks = ns.gang.getTaskNames();
            let bestTask = "Mug People";
            let bestRatio = 1;
            for (let j=0; j<tasks.length; j++) {
                let taskInfo = ns.gang.getTaskStats(tasks[j]);
                let repRate = ns.formulas.gang.respectGain(gangInfo, memberInfo, taskInfo);
                let wantRate = ns.formulas.gang.wantedLevelGain(gangInfo, memberInfo, taskInfo);
                let cashRate = ns.formulas.gang.moneyGain(gangInfo, memberInfo, taskInfo);
                if (wantRate == 0) {
                    continue;
                }
                if (repRate / wantRate < 1) {
                    continue;
                }
                if (cashRate * repRate / wantRate > bestRatio) {
                    bestRatio = cashRate * repRate / wantRate;
                    bestTask = tasks[j];
                }
            }

            ns.gang.setMemberTask(members[i], bestTask);
        }
    }
}

function doAscend(ns) {
    let members = ns.gang.getMemberNames();
    for (let i=0; i<members.length; i++) {
        let memberInfo = ns.gang.getMemberInformation(members[i]);
        ns.print(`Member ${members[i]} has total EXP of ${memberInfo.hack_exp + memberInfo.str_exp + memberInfo.def_exp + memberInfo.dex_exp + memberInfo.cha_exp}`);
        if (memberInfo.str_exp > 2000 && memberInfo.def_exp > 2000 && memberInfo.dex_exp > 2000) {
            ns.print(`Ascending ${members[i]}`);
            ns.gang.ascendMember(members[i]);
            ns.gang.purchaseEquipment(members[i], "Baseball Bat");
            ns.gang.purchaseEquipment(members[i], "Katana");
            ns.gang.purchaseEquipment(members[i], "Glock 18C");
        }
    }
}
