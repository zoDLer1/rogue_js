/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class Game
{
    player = null;
    enemies = [];
    init()
    {
        const fieldsContainer = document.querySelector('.field');
        const gameWindow = document.querySelector('.field-box');
        gameWindow.focus();
        this.camera = new Camera(fieldsContainer);
        this.map = new Map(fieldsContainer, this);
        gameWindow.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    setCameraPosition()
    {
        this.camera.setCoords(this.player.x * -this.player.tile.sizeX, this.player.y * -this.player.tile.sizeY);
    }
    onKeyDown(event)
    {
        // key codes
        // d - 68
        // a - 65
        // w - 87
        // s - 83
        // space - 32
        const moveDirectionsOffsets = {
            68: [1, 0],
            65: [-1, 0],
            87: [0, -1],
            83: [0, 1]
        };
        if ([68, 65, 87, 83, 32].includes(event.keyCode))
        {
            let isMoved = false;
            let isAttaked = false;
            if (event.keyCode === 32)
            {
                isAttaked = this.player.attackOverview();
            }
            else
            {
                isMoved = this.map.moveObject(this.player, ...moveDirectionsOffsets[event.keyCode]);
                this.setCameraPosition();
            }
            // если игрок не сдвинутся или не атаковал это не считается ходом
            if (isMoved || isAttaked)
            {
                for (const enemy of this.enemies)
                {
                    enemy.update();
                }
            }
        }
    }
    // если игрок умирает начинаем игру заново
    removePlayer()
    {
        location.reload();
    }
    removeEnemy(target)
    {
        this.enemies = this.enemies.filter(enemy => !(enemy === target));
        if (this.enemies.length === 0)
        {
            location.reload();
        }
    }
    setEnemy(enemy)
    {
        this.enemies.push(enemy);
    }
    setPlayer(player)
    {
        this.player = player;
        this.setCameraPosition();
    }
}
