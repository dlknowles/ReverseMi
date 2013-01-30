function Disk(player, size, x, y) {
    var darkColor = '#000000',
        lightColor = '#ffffff';

    this.x = x;
    this.y = y;
    this.size = size;

    if (player == 1) {
        this.fillColor = darkColor; // player 1 is dark
        this.strokeColor = lightColor;
    }
    else if (player == 2) {
        this.fillColor = lightColor; // player 2 is light
        this.strokeColor = darkColor;
    }
    else {
        throw 'invalid player selection ' + player;
    }
}

Disk.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
