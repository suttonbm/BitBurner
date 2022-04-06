export function waysToSum2(x) {
    if (x <= 1) {
        return 0;
    } else if (x == 2) {
        return 1;
    } else {
        let result = 1;
        let n = x-2;
        for (n; n>1; n--) {
            if ((x / n) < 2) {
                result = result + 1 + waysToSum(x - n);
            } else {
                result = result + 1 + Math.floor(x/n) * waysToSum(n);
            }
        }
        return result;
    }
}

export function waysToSum(x) { 
    const ways = [1];
    ways.length = x + 1;
    ways.fill(0, 1);
    for (let i = 1; i < x; ++i) {
        for (let j = i; j <= x; ++j) {
            ways[j] += ways[j - i];
        }
    }
    return ways[x];
}
