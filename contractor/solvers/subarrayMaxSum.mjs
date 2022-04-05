export function getMaxSubarray(A) {
    let positiveIDs = [];
    for (let i = 0; i<A.length; i++) {
        if (A[i] > 0) {
            positiveIDs.push(i);
        }
    }

    if (positiveIDs.length === 0) {
        return Math.max(...A);
    }

    let maxSum = 0;
    for (const i of positiveIDs) {
        for (const j of positiveIDs) {
            let sum = arraySum(A.slice(i,j+1));
            if (sum > maxSum) {
                maxSum = sum;
            }
        }
    }
    return maxSum;
}

function arraySum(A) {
    return A.reduce((pv, cv) => pv + cv, 0);
}