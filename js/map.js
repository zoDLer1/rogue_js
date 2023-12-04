/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
class Map
{
    fields = [];
    roomsConfig = {
        min: 5,
        max: 10,
        size: [3, 8]
    };
    corridorsConfig = {
        min: 3,
        max: 5,
    };
    rows = 24;
    cols = 40;
    swordsCount = 2;
    enemiesConunt = 10;
    potionsConunt = 10;
    constructor(container, game)
    {
        this.game = game;
        this.generateMap(); // генерируем карту и блекджеком и прочим
        this.renderMap(container); // отрисовываем карту
    }
    renderMap(parent)
    {
        for (let y = 0; y < this.rows; y++)
        {
            for (let x = 0; x < this.cols; x++)
            {
                this.fields[y][x].renderField(parent);
            }
        }
    }
    generateMap()
    {
        this.fields = [];
        for (let y = 0; y < this.rows; y++)
        {
            this.fields.push([]);
            for (let x = 0; x < this.cols; x++)
            {
                this.fields[y].push(new Wall(x, y, this));
            }
        }
        this.genegateRooms();
        this.generateCorridors();
        this.deleteUnreachableZones();
        this.generatePlayer();
        this.generatePotions();
        this.generateSwords();
        this.generateEnemies();
    }
    genegateRooms()
    {
        const numRooms = Math.floor(Math.random() * (this.roomsConfig.max - this.roomsConfig.min + 1)) + this.roomsConfig.min;
        const [minRoomSize, maxRoomSize] = this.roomsConfig.size;
        for (let i = 0; i < numRooms; i++)
        {
            const roomWidth = Math.floor(Math.random() * maxRoomSize) + minRoomSize;
            const roomHeight = Math.floor(Math.random() * maxRoomSize) + minRoomSize;
            const startX = Math.floor(Math.random() * (this.cols - roomWidth - 1)) + 1;
            const startY = Math.floor(Math.random() * (this.rows - roomHeight - 1)) + 1;
            for (let x = startX; x < startX + roomWidth; x++)
            {
                for (let y = startY; y < startY + roomHeight; y++)
                {
                    this.fields[y][x] = this.getFieldInstance(Floor, x, y);
                }
            }
        }
    }
    generateCorridors()
    {
        const numVerticalCorridors = Math.floor(Math.random() * (this.corridorsConfig.max - this.corridorsConfig.min + 1)) + this.corridorsConfig.min;
        const numHorizontalCorridors = Math.floor(Math.random() * (this.corridorsConfig.max - this.corridorsConfig.min + 1)) + this.corridorsConfig.min;
        for (let i = 0; i < numVerticalCorridors; i++)
        {
            const corridorY = Math.floor(Math.random() * (this.rows - 1)) + 1;
            for (let x = 0; x < this.cols; x++)
            {
                this.fields[corridorY][x] = this.getFieldInstance(Floor, x, corridorY);
            }
        }
        for (let i = 0; i < numHorizontalCorridors; i++)
        {
            const corridorX = Math.floor(Math.random() * (this.cols - 1)) + 1;
            for (let y = 0; y < this.rows; y++)
            {
                this.fields[y][corridorX] =  this.getFieldInstance(Floor, corridorX, y);
            }
        }
    }
    generateEnemies()
    {
        for (let i = 0; i < this.enemiesConunt; i++)
        {
            const [x, y] = this.getRandomEmptyField();
            this.fields[y][x] = this.getFieldInstance(Enemy, x, y, Floor);
        }
    }
    generatePotions()
    {
        for (let i = 0; i < this.potionsConunt; i++)
        {
            const [x, y] = this.getRandomEmptyField();
            this.fields[y][x] = this.getFieldInstance(Potion, x, y, Floor);
        }
    }
    generatePlayer()
    {
        const [x, y] = this.getRandomEmptyField();
        this.fields[y][x] = this.getFieldInstance(Player, x, y, Floor);
    }
    generateSwords()
    {
        for (let i = 0; i < this.swordsCount; i++)
        {
            const [x, y] = this.getRandomEmptyField();
            this.fields[y][x] = this.getFieldInstance(Sword, x, y, Floor);
        }
    }
    deleteUnreachableZones()
    {
        // Ищем первую свободную клетку
        let startX = 0;
        let startY = 0;
        for (let y = 0; y < this.rows; y++)
        {
            for (let x = 0; x < this.cols; x++)
            {
                if (this.fields[y][x] instanceof Floor)
                {
                    startX = x;
                    startY = y;
                    break;
                }
            }
            if (startX !== 0 || startY !== 0)
            {
                break;
            }
        }
        // Помечаем все достижимые клетки с использованием BFS
        const graph = new Graph(this.rows, this.cols, this.fields);
        const [emptyFields, visited] = graph.breadthFirstSearch(startX, startY, (field) => field instanceof Floor);
        this.emptyFields = emptyFields;
        // Заполняем все недостижимые клетки стенами
        for (let y = 0; y < this.rows; y++)
        {
            for (let x = 0; x < this.cols; x++)
            {
                if (this.fields[y][x] instanceof Floor && !visited[y][x])
                {
                    this.fields[y][x] = new Wall(x, y, this);
                }
            }
        }
    }
    getRandomEmptyField(removeField = true)
    {
        const index = Math.floor(Math.random() * this.emptyFields.length);
        if (removeField)
        {
            return this.emptyFields.splice(index, 1)[0];
        }
        return this.emptyFields[index];
    }
    getFieldInstance(className, x, y, standsOn = null)
    {
        const instance = new className(x, y, this);
        if (standsOn)
        {
            const standsOnInstance = new standsOn(x, y, this);
            instance.setStandsOn(standsOnInstance);
        }
        return instance;
    }
    getOverview(startX, startY, rangeCallback, breakCallBack = () => false)
    {
        const graph = new Graph(this.rows, this.cols, this.fields);
        const [fieldsSearchCoords] = graph.breadthFirstSearch(startX, startY,
            (obj, x, y) =>  !(obj instanceof Wall) && rangeCallback(x, y),
            (obj) => breakCallBack(obj)
        );
        return fieldsSearchCoords.map(([x, y]) => this.fields[y][x]);
    }
    getRandomPath(startX, startY)
    {
        const [toX, toY] = this.getRandomEmptyField(false);
        return this.getPath(startX, startY, toX, toY);
    }
    getPath(startX, startY, toX, toY)
    {
        const graph = new Graph(this.rows, this.cols, this.fields);
        const [f, cf] = graph.breadthFirstSearch(startX, startY, (obj) => !(obj instanceof Wall), (obj, x, y) => toX === x && toY === y);
        const path = graph.getPathTo(startX, startY, toX, toY, cf);
        return path.reverse();
    }
    destroyObj(obj)
    {
        this.fields[obj.y][obj.x] = obj.standsOn;
        obj.destroy();
    }
    moveObject(obj, offsetX, offsetY)
    {
        const moveToX = offsetX + obj.x;
        const moveToY = offsetY + obj.y;
        // выход за границы поля
        const xInMap = 0 <= moveToX && moveToX < this.cols;
        const yInMap = 0 <= moveToY && moveToY < this.rows;
        if(xInMap && yInMap)
        {
            // можно пройти
            const moveToObj = this.fields[moveToY][moveToX];
            if (!(moveToObj instanceof Wall) && !(moveToObj instanceof Entity))
            {
                this.fields[obj.y][obj.x] = obj.standsOn;
                obj.moveTo(this.fields[moveToY][moveToX]);
                this.fields[moveToY][moveToX] = obj;
                return true;
            }
        }
        return false;
    }
}
