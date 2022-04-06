export function findTrianglePath(A) {
    let flat = A[0];
    for (let i=1; i<A.length; i++) {
        flat = collapse(flat, A[i]);
    }
    return Math.min(...flat);
}

// A0 is level n
// A1 is level n-1
function collapse(A0, A1) {
    let result = [];
    for (let i=0; i<A1.length; i++) {
        if (i == 0) {
            result.push(A0[0] + A1[i]);
        } else if (i == A1.length-1) {
            result.push(A0.at(-1) + A1.at(-1));
        } else {
            result.push(Math.min(A1[i] + A0[i-1], A1[i] + A0[i]));
        }
    }
    return result;
}