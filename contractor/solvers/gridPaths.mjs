export function findPaths(L, W, grid=null) {
    // Handle "simple" input for Paths in Grid I
    if (!grid) {
        grid = [];
        grid.length = L;
        for (let i=0; i<grid.length; i++) {
            grid[i] = [];
            grid[i].length = W;
            grid[i].fill(0);
        }
    }

    //console.log(JSON.stringify(grid));
    let result = initGrid(grid);
    //console.log(JSON.stringify(result));
    for (let i=1; i<grid.length; i++) {
        for (let j=1; j<grid[0].length; j++) {
            if (grid[i][j] === 0) {
                result[i][j] = result[i-1][j] + result[i][j-1];
            }
        }
    }
    //console.log(JSON.stringify(result));
    return result.at(-1).at(-1);
}

function initGrid(M) {
    let result = [];
    result.length = M.length;

    let fill = 1;
    for (let i=0; i<M.length; i++) {
        result[i] = [];
        result[i].length = M[0].length;
        result[i].fill(0);

        if (M[i][0] == 1) {
            fill = 0;
        }
        result[i][0] = fill;
    }
    fill = 1;
    for (let j=0; j<M[0].length; j++) {
        if (M[0][j] == 1) {
            fill = 0;
        }
        result[0][j] = fill;
    }
    return result;
}