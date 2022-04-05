export function spiralize(M) {
    let result = [];
    let x1 = 0;
    let y1 = 0;
    let x2 = M[0].length-1;
    let y2 = M.length-1; 
    let ptr_x = -1;
    let ptr_y = 0;
    
    while (x1 <= x2 && y1 <= y2) {
        //console.log(`X Limits: ${x1}, ${x2}`);
        //console.log(`Y Limits: ${y1}, ${y2}`);
        //console.log(`Pointer: ${ptr_x}, ${ptr_y}`);
        // Right
        if (ptr_x <= x1 && ptr_y == y1) {
            //console.log("Right");
            for (let i=x1; i<=x2; i++) {
                ++ptr_x;
                //console.log(`Pointer: ${M[ptr_y][ptr_x]}`);
                result.push(M[ptr_y][ptr_x]);
            }
            ++y1;
            continue;
        }
        // Down
        else if (ptr_x == x2 && ptr_y <= y1) {
            //console.log("Down");
            for (let i=y1; i<=y2; i++) {
                ++ptr_y;
                //console.log(`Pointer: ${M[ptr_y][ptr_x]}`);
                result.push(M[ptr_y][ptr_x]);
            }
            --x2;
            continue;
        }
        // Left
        else if (ptr_x >= x2 && ptr_y == y2) {
            //console.log("Left");
            for (let i=x2; i>=x1; i--) {
                ptr_x--;
                //console.log(`Pointer: ${M[ptr_y][ptr_x]}`);
                result.push(M[ptr_y][ptr_x]);
            }
            --y2;
            continue;
        }
        // Up
        else if (ptr_x == x1 && ptr_y >= y2) {
            //console.log("Up");
            for (let i=y2; i>=y1; i--) {
                ptr_y--;
                //console.log(`Pointer: ${M[ptr_y][ptr_x]}`);
                result.push(M[ptr_y][ptr_x]);
            }
            ++x1;
            continue;
        }
        else { break; }
    }
    return result;
}