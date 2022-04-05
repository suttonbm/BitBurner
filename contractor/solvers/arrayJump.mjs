export function arrayJump(A) {
    let result = new Array(A.length);
    result.fill(1,0,Math.min(A.length, A[0]+1));
    for (let i=1; i<A.length; i++) {
        if (!result[i] || A[i]===0) {
            continue;
        }
        result.fill(1,i,Math.min(A.length, i+A[i]+1))
    }
    if (!result[A.length-1]) {
        return 0;
    }
    return 1;
}