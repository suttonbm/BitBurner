export function mergeIntervals(A) {
    A.sort(compareInterval);

    let result = []
    let currentMin = A[0][0];
    let currentMax = A[0][1];

    for (let i=1; i<A.length; i++) {
        if (A[i][0] <= currentMax) {
            currentMax = Math.max(currentMax, A[i][1]);
        } else {
            result.push([currentMin, currentMax]);
            currentMin = A[i][0];
            currentMax = A[i][1];
        }
    }
    result.push([currentMin, currentMax]);

    return result;
}

function compareInterval(a, b) {
    if (a[0] < b[0]) { return -1; }
    else if (a[0] > b[0]) { return 1; }
    else { return 0; }
}