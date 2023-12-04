/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class BaseObject
{
    tileName = null;
    constructor (x, y, map)
    {
        this.x = x;
        this.y = y;
        this.tile = this.setTile();
        this.map = map;
    }
    setTile()
    {
        return new Tile(this);
    }
    renderField(parent)
    {
        this.tile.render(parent);
    }
    destroy()
    {
        this.tile.destroy();
    }
}
class Floor extends BaseObject {}
class Wall extends BaseObject
{
    tileName = 'tileW';
}
class GameObject extends BaseObject
{
    setStandsOn(object)
    {
        this.standsOn = object;
    }
    renderField(parent)
    {
        this.standsOn.renderField(parent);
        super.renderField(parent);
    }
}
class Item extends GameObject
{
    useTo(object){}
}
class Sword extends Item
{
    tileName = 'tileSW';
    powerUp = 5;
    useTo(object)
    {
        object.upPower(this.powerUp);
    }
}
class Potion extends Item
{
    tileName = 'tileHP';
    healValue = 20;
    useTo(object)
    {
        object.heal(this.healValue);
    }
}
class Entity extends GameObject
{
    powerPoints = 0;
    get maxHelthPoints()
    {
        return 0;
    }
    update(){}
    constructor(x, y, map)
    {
        super(x, y, map);
        this.healthPoints = this.maxHelthPoints;
    }
    setTile()
    {
        return new EntityTile(this);
    }
    moveTo(object)
    {
        const flipDirection = object.x - this.x;
        if (flipDirection)
        {
            this.tile.flip(object.x - this.x);
        }
        this.x = object.x;
        this.y = object.y;
        this.setStandsOn(object);
        this.tile.setCoords();
    }
    getDamage(hp)
    {
        const newHp = Math.max(this.healthPoints - hp, 0);
        this.healthPoints = newHp;
        if (newHp === 0)
        {
            this.map.destroyObj(this);
        }
        this.tile.updateHealthBar();
    }
    attack(obj)
    {
        obj.getDamage(this.powerPoints);
    }
}
class Enemy extends Entity
{
    powerPoints = 10;
    get maxHelthPoints()
    {
        return 20;
    }
    tileName = 'tileE';
    lastSeenPlayer = null;
    stalkingPlayer = null;
    overviewRange = 4;
    destroy()
    {
        super.destroy();
        this.map.game.removeEnemy(this);
    }
    constructor(x, y, map)
    {
        super(x, y, map);
        map.game.setEnemy(this);
        this.initNewRoute();
    }
    findPlayer(overview)
    {
        for (const obj of overview)
        {
            if (this.checkPlayer(obj))
            {
                return obj;
            }
        }
    }
    checkPlayer(obj)
    {
        return obj instanceof Player;
    }
    inOverviewRange(x, y)
    {
        return (!(Math.abs(this.x - x) >= this.overviewRange) && !(Math.abs(this.y - y) >= this.overviewRange));
    }
    initNewRoute()
    {
        this.route = this.map.getRandomPath(this.x, this.y);
        this.currectStep = 0;
    }
    stalkPlayer(player)
    {
        this.route = this.map.getPath(this.x, this.y, player.x, player.y);
        this.overviewRange = 5;
        this.currectStep = 0;
        this.stalkingPlayer = player;
        this.lastSeenPlayer = [player.x, player.y];
    }
    lostPlayer()
    {
        const [toX, toY] = this.lastSeenPlayer;
        this.route = this.map.getPath(this.x, this.y, toX, toY);
        this.lastSeenPlayer = null;
        this.stalkingPlayer = null;
        this.overviewRange = 4;
    }
    followRoute()
    {
        if (this.stalkingPlayer && this.route.length === 1)
        {
            this.attack(this.stalkingPlayer); // если игрок поблизости атакует его
            return;
        }
        const [toX, toY] = this.route[this.currectStep];
        const isMoved = this.map.moveObject(this, toX - this.x, toY - this.y);
        this.currectStep++;
        // если дошёл до конца маршрута или не смог продолжить
        // движение по текущему генерирует новый
        if (this.currectStep === this.route.length || !isMoved)
        {
            this.initNewRoute();
        }
    }
    update()
    {
        // ищет игрока
        const overview = this.map.getOverview(this.x, this.y, this.inOverviewRange.bind(this), this.checkPlayer);
        const player = this.findPlayer(overview);

        if (player)
        {
            this.stalkPlayer(player); // если нашёл игрока выстранивает маршрут к нему
        }
        if (!player && this.lastSeenPlayer) // если потерял игрока идет в последнее место где его видел
        {
            this.lostPlayer();
        }
        this.followRoute(); // следует заданному маршруту
    }
}
class Player extends Entity
{
    get maxHelthPoints()
    {
        return 100;
    }
    attackRange = 2;
    powerPoints = 10;
    tileName = 'tileP';
    constructor(x, y, map)
    {
        super(x, y, map);
        map.game.setPlayer(this);
    }
    upPower(pw)
    {
        this.powerPoints += pw;
    }
    destroy()
    {
        super.destroy();
        this.map.game.removePlayer();
    }
    useItem(item)
    {
        item.useTo(this);
    }
    heal(hp)
    {
        this.healthPoints = Math.min(this.healthPoints + hp, this.maxHelthPoints);
        this.tile.updateHealthBar();
    }
    checkEnemy(obj)
    {
        return obj instanceof Enemy;
    }
    findEnemies(overview)
    {
        const enemies = [];
        for (const obj of overview)
        {
            if(this.checkEnemy(obj))
            {
                enemies.push(obj);
            }
        }
        return enemies;
    }
    // атакует всех врагов по близости
    attackOverview()
    {
        const overview = this.map.getOverview(this.x, this.y, (x, y) => (!(Math.abs(this.x - x) >= this.attackRange) && !(Math.abs(this.y - y) >= this.attackRange)));
        const enemies = this.findEnemies(overview);
        for (const enemy of enemies)
        {
            this.attack(enemy);
        }
        return Boolean(enemies.length);
    }
    moveTo(object)
    {
        if (object instanceof Item)
        {
            this.useItem(object);
            object.destroy();
            object = object.standsOn;
        }
        super.moveTo(object);
    }
}
