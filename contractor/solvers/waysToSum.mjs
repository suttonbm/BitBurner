export function waysToSum(x) {
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