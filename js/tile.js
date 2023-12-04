/* eslint-disable no-unused-vars */
class Tile
{
    sizeX = 50;
    sizeY = 50;
    constructor(object)
    {
        this.object = object;
        this.element = document.createElement('div');
    }
    setCoords()
    {
        this.element.style.top = this.object.y * this.sizeX + 'px';
        this.element.style.left = this.object.x * this.sizeY + 'px';
    }
    render(parent)
    {
        this.element.classList.add(...['tile', this.object.tileName].filter(value => value));
        this.setCoords();
        parent.appendChild(this.element);
    }
    destroy()
    {
        this.element.parentElement.removeChild(this.element);
    }
}
class EntityTile extends Tile
{
    flip(to)
    {
        this.element.style.transform = `scale(${to}, 1)`;
    }
    viewHealthBar()
    {
        this.bar = document.createElement('div');
        this.bar.className = 'health';
        this.updateHealthBar();
        this.element.appendChild(this.bar);
    }
    updateHealthBar()
    {
        this.bar.style.width = (this.object.healthPoints  / this.object.maxHelthPoints) * 100 + '%';
    }
    render(parent)
    {
        this.viewHealthBar();
        super.render(parent);
    }
}
