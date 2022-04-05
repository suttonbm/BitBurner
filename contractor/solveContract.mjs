import { arrayJump } from "./solvers/arrayJump.mjs";
import { makeIPs } from "./solvers/makeIP.mjs";
import { mergeIntervals } from "./solvers/mergeIntervals.mjs";
import { primeFactor } from "./solvers/primeFactor.mjs";
import { spiralize } from "./solvers/spiralize.mjs";
import { getMaxSubarray } from "./solvers/subarrayMaxSum.mjs";
import { doTrades } from "./solvers/trader.mjs";
import { waysToSum } from "./solvers/waysToSum.mjs";


export function solveContract(contractType, contractData) {
    switch (contractType) {
        case "Find Largest Prime Factor":
            return primeFactor(contractData);
        case "Subarray with Maximum Sum":
            return getMaxSubarray(contractData);
        case "Total Ways to Sum":
            return waysToSum(contractData);
        case "Spiralize Matrix":
            return spiralize(contractData);
        case "Array Jumping Game":
            return arrayJump(contractData);
        case "Merge Overlapping Intervals":
            return mergeIntervals(contractData);
        case "Generate IP Addresses":
            return undefined; // Not implemented
        case "Algorithmic Stock Trader I":
            return doTrades(contractData, 1);
        case "Algorithmic Stock Trader II":
            return doTrades(contractData, contractData.length);
        case "Algorithmic Stock Trader III":
            return doTrades(contractData, 2);
        case "Algorithmic Stock Trader IV":
            return doTrades(contractData[1], contractData[0]);
        case "Minimum Path Sum in a Triangle":
            return undefined; // Not implemented
        case "Unique Paths in a Grid I":
            return undefined; // Not implemented
        case "Unique Paths in a Grid II":
            return undefined; // Not implemented
        case "Sanitize Parentheses in Expression":
            return undefined; // Not implemented
        case "Find All Valid Math Expressions":
            return undefined; // Not implemented
        default:
            return; // No data specified
    }
}