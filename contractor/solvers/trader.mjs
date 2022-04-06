export function doTrades(A, k) {
    A = removeDuplicates(A);
    let minVals = getMinima(A);
    let maxVals = getMaxima(A);
    let pairA = minVals.map((e,i) => { return [e, maxVals[i]]; });
    return maxTrades(pairA, Math.min(k, pairA.length));
}

function removeDuplicates(A) {
    let result = [];
    result.push(A[0]);
    for (let i=1; i<A.length; i++) {
        if (A[i] != result.at(-1)) {
            result.push(A[i]);
        }
    }
    return result;
}

function maxTrades(A, k, n=0, m=A.length) {
    if (k <= 0) {
        return 0;
    } else if (k === 1) {
        return bestOne(A, n, m);
    } else {
        let best = -1;
        for (let i=n+1; i<=m-k+1; i++) {
            let test = bestOne(A, n, i) + maxTrades(A, k-1, i, m);
            if (test > best) {
                best = test;
            }
        }
        return best;
    }
}

function spread(A, n, m) {
    return A[m][1] - A[n][0];
}

function bestOne(A, n=0, m=A.length) {
    let best = -1;
    for (let i=n; i<m; i++){
        for (let j=i; j<m; j++) {
            let x = spread(A,i,j);
            if (x > best) {
                best = x;
            }
        }
    }

    return best;
}

function getMinima(A) {
    let result = [];
    if (A[0] < A[1]) {
        result.push(A[0]);
    }
    for (let i=1; i<A.length-1; i++) {
        if (A[i] < A[i-1] && A[i] <= A[i+1]) {
            result.push(A[i]);
        }
    }
    return result;
} 

function getMaxima(A) {
    let result = [];
    for (let i=1; i<A.length-1; i++) {
        if (A[i] > A[i-1] && A[i] >= A[i+1]) {
            result.push(A[i]);
        }
    }
    if (A[A.length-1] > A[A.length-2]) {
        result.push(A[A.length-1]);
    }
    return result;
}