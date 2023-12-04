/* eslint-disable no-unused-vars */
class Graph
{
    constructor(rows, cols, fields)
    {
        this.rows = rows;
        this.cols = cols;
        this.fields = fields;
    }
    // осуществляет поиск по алгоритму BFS
    breadthFirstSearch(
        startX,
        startY,
        iCallback = () => true,
        breakCallBack = () => false,
    )
    {
        const fieldsSearchCoords = [];
        const came_from = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        came_from[startY][startX] = null;
        const queue = [[startX, startY]];
        while(queue.length)
        {
            const [currentX, currentY] = queue.shift();
            const neighbors = [
                [currentX + 1, currentY],
                [currentX - 1, currentY],
                [currentX, currentY + 1],
                [currentX, currentY - 1],
            ];
            for (const [nx, ny] of neighbors)
            {
                if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && !came_from[ny][nx] && iCallback(this.fields[ny][nx], nx, ny))
                {
                    came_from[ny][nx] = [currentX, currentY];
                    fieldsSearchCoords.push([nx, ny]);
                    queue.push([nx, ny]);
                    if(breakCallBack(this.fields[ny][nx], nx, ny))
                    {
                        queue.length = 0;
                        break;
                    }
                }
            }
        }
        return [fieldsSearchCoords, came_from];
    }
    // осуществляет поиск по маршрута исходя данных поиска BFS (came_from)
    getPathTo(startX, startY, toX, toY, came_from)
    {
        let [currentX, currentY] = came_from[toY][toX];
        const path = [[toX, toY]];
        while (startX !== currentX || startY !== currentY)
        {
            path.push([currentX, currentY]);
            let [x, y] = came_from[currentY][currentX];
            currentX = x;
            currentY = y;
        }
        return path;
    }
}
