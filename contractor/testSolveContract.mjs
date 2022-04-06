import { codingContractTypesMetadata } from "./test/contracttypes.mjs";
import { solveContract } from "./solveContract.mjs";

main();

function main() {
    let testsPerContract = 100;
    for (let i=2; i<codingContractTypesMetadata.length; i++) {
        let contractType = codingContractTypesMetadata[i].name;
        let failed = false;
        let skipped = 0;

        console.log("-----------------------------------------");
        console.log(`Running tests for ${contractType}...`);
        console.log("-----------------------------------------");

        let successCnt = 0;
        for (let j=0; j<testsPerContract; j++) {
            let contractData = codingContractTypesMetadata[i].gen();
            let test = solveContract(contractType, contractData);
            if (test === undefined) {
                skipped++;
                continue;
            }
            test = cleanResponse(test);

            if (codingContractTypesMetadata[i].solver(contractData, test)) {
                successCnt++;
            } else {
                console.log(`    Failed test for "${contractType}"`);
                console.log(`        Contract input: ${JSON.stringify(contractData)}`);
                console.log(`        Solver response: ${test}`);
                console.log(`        Correct response: ${codingContractTypesMetadata[i].answer(contractData)}`);
                failed = true;
            }
        }

        console.log(`    Successfully finished ${successCnt} tests for ${contractType}`);
        console.log(`    Skipped ${skipped} tests for "${contractType}"`);
        if (failed) {
            return;
        }
    }
}

// Checks whether an array is a 2D array.
// For this, a 2D array is an array which contains only other arrays.
// If one element in the array is a number or string, it is NOT a 2D array
function is2DArray(arr) {
    if (arr.constructor !== Array) {
      return false;
    }
    return arr.every((e) => {
      return e.constructor === Array;
    });
}

function cleanResponse(test) {
    if (is2DArray(test)) {
        const answerComponents = [];
        for (let i = 0; i < test.length; ++i) {
          answerComponents.push(["[", test[i].toString(), "]"].join(""));
        }
        return answerComponents.join(",");
    } else {
        return String(test);
    }
}