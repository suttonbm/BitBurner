export function makeIPs(s) {
    const ret = [];
    for (let a = 1; a <= 3; ++a) {
        for (let b = 1; b <= 3; ++b) {
            for (let c = 1; c <= 3; ++c) {
                for (let d = 1; d <= 3; ++d) {
                    if (a + b + c + d === s.length) {
                        const A = parseInt(s.substring(0, a), 10);
                        const B = parseInt(s.substring(a, a + b), 10);
                        const C = parseInt(s.substring(a + b, a + b + c), 10);
                        const D = parseInt(s.substring(a + b + c, a + b + c + d), 10);
                        if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                            const ip = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");
                            if (ip.length === s.length + 3) {
                                ret.push(ip);
                            }
                        }
                    }
                }
            }
        }
    }
    return ret;
}