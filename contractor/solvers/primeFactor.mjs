export function primeFactor(x) {
    let A = [];
    let R = x;
    let p = 2;
    while (p <= x/2) {
        while (R % p === 0) {
            A.push(p);
            R = R / p;
        }
        p++;
    }
    if (R > 1) {
        A.push(R);
    }
    return Math.max(...A);
}

function getPrimesUpTo(x) {
    let A = new Array(Math.floor(x));
    for (let i=2; i<Math.sqrt(x); i++) {
        if (!A[i]) {
            let j = i * i;
            while (j < x) {
                A[j] = true;
                j = j + i;
            }
        }
    }
    let result = [];
    for (let i=2; i<A.length; i++) {
        if (!A[i]) {
            result.push(i);
        }
    }
    return result;
}