function newMaze(x, y) {
    /* Gist: 
    maze[y][x][borders]
    1. Define  x*y grid with borders all filled.
    2. choose a cell at random and knock down one of its borders at random
    3. set the cell next to knocked down and repeat step 2
    */
    // Establish variables and starting grid
    //num rows= y
    //num cols= x
    var totalCells = x * y;
    var cells = new Array();
    var unvis = new Array();
    for (var i = 0; i < y; i++) {
        cells[i] = new Array();
        unvis[i] = new Array();
        for (var j = 0; j < x; j++) {
            cells[i][j] = [0, 0, 0, 0];
            unvis[i][j] = true;
        }
    }
    //Now, entire grid is empty
    // Set a random position to start from
    var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
    var path = [currentCell];
    unvis[currentCell[0]][currentCell[1]] = false;
    var visited = 1;

    // Loop through all available cell positions
    while (visited < totalCells) {
        // Determine neighboring cells
        var maybe = [
            [currentCell[0] - 1, currentCell[1], 0, 2],
            [currentCell[0], currentCell[1] + 1, 1, 3],
            [currentCell[0] + 1, currentCell[1], 2, 0],
            [currentCell[0], currentCell[1] - 1, 3, 1]
        ];
        //maybe[index][y coord][x coord][boundary current shares with it][boundary it shares with current]
        // 0_
        //3|_|1
        //  2
        var neighbors = new Array();

        // Determine if each neighboring cell is in game grid, and whether it has already been checked
        for (var l = 0; l < 4; l++) {
            if (maybe[l][0] > -1 && // y value of the neighbor inside the maze
            maybe[l][0] < y && // y value of the neighbor inside the maze
            maybe[l][1] > -1 && // x value of the neighbor inside the maze
            maybe[l][1] < x && // x value of the neighbor inside the maze
            unvis[maybe[l][0]][maybe[l][1]]) // cell not yet visited
            {
                neighbors.push(maybe[l]);
            }
        }

        // If at least one active neighboring cell has been found
        if (neighbors.length) {
            // Choose one of the neighbors at random
            next = neighbors[Math.floor(Math.random() * neighbors.length)];

            // Remove the wall between the current cell and the chosen neighboring cell
            cells[currentCell[0]][currentCell[1]][next[2]] = 1;
            cells[next[0]][next[1]][next[3]] = 1;

            // Mark the neighbor as visited, and set it as the current cell
            unvis[next[0]][next[1]] = false;
            visited++;
            currentCell = [next[0], next[1]];
            path.push(currentCell);
        }
        // Otherwise go back up a step and keep going
        else {
            console.log('nope');
            currentCell = path.pop();
        }
        console.log(currentCell);
    }
    return cells;
}