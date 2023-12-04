/* eslint-disable no-unused-vars */
class Camera
{
    width = 1024;
    height = 640;
    xOffset = 50;
    yOffset = 80;
    constructor(element)
    {
        this.element = element;
    }
    setCoords(x, y)
    {
        let left =  x + this.width / 2;
        let top =  y + this.height / 2;
        if (top > 0)
        {
            top = 0;
        }
        else if (top < -this.height + this.yOffset)
        {
            top = -this.height + this.yOffset;
        }
        if (left > 0)
        {
            left = 0;
        }
        else if (left < -this.width + this.xOffset)
        {
            left = -this.width + this.xOffset;
        }
        this.element.style.top = top + 'px';
        this.element.style.left = left + 'px';
    }
}
