module.exports = (() => {
    class Round { //构造函数
        constructor(canvas){
            this.r = Math.floor(Math.random() * 8) + 8; //圆的半径
            this.diam = this.r * 2; //直径
            //随机圆坐标位置
            let x = this.fnRandom(0,canvas.width - this.r);
            this.x = x < this.r ? this.r : x;
            let y = this.fnRandom(0,canvas.height - this.r);
            this.y = y < this.r ? this.r : y;
            //随机圆移动速度
            let speed = this.fnRandom(2,4) / 10;
            this.speedX = this.fnRandom(0,4) > 2.5 ? speed : -speed;
            this.speedY = this.fnRandom(0,4) > 2.5 ? speed : -speed;
            //颜色
            this.color = "#eee";
        }
        //绘制函数
        draw(ctx){
            ctx.fillStyle = this.color; //填充颜色
            ctx.beginPath(); //开始绘制
            ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,true);//绘制圆
            ctx.closePath();//
            ctx.fill();
        }
        //移动
        move(canvas){
            if(this.x > canvas.width - this.r){
                this.speedX *= -1;
            }else if(this.x < this.r){
                this.speedX *= -1;
            }
            this.x += this.speedX;

            if(this.y > canvas.height - this.r){
                this.speedY *= -1;
            }else if(this.y < this.r){
                this.speedY *= -1;
            }
            this.y += this.speedY;
        }
        //随机数
        fnRandom(min,max){
            return Math.floor((max - min) * Math.random() + min + 1);
        }
    }
    //初始化数据库存放到数组中
    let initRound = (Round,canvas,allRound) => {
        for(let i = 0;i < 16; i++){
            var obj = new Round(canvas);
            allRound.push(obj);// 
        }
    }
    //绘制的每个圆的移动
    let roundMove = (canvas,ctx,dxdy,allRound) =>{
        ctx.clearRect(0,0,canvas.width,canvas.height);//清除
        allRound.forEach((round,index) => {
            round.draw(ctx);
            round.move(canvas);
            dxdy[index] = {
                dx:round.x,
                dy:round.y,
                dr:round.r,
                dvx:round.speedX,
                dvy:round.speedYs
            }
            let dx = dxdy[index].dx,
                dy = dxdy[index].dy;
            for(let j = 0;j < index; j++){
                console.log(index);
                let sx = dxdy[j].dx,
                    sy = dxdy[j].dy,
                    l = Math.sqrt((dx - sx) * (dx - sx) + (dy - sy) * (dy - sy)),
                    c = 1 / l * 7 - 0.0008,
                    o = c > 0.03 ? 0.02 : c; //透明度值
                ctx.strokeStyle = 'rgba(0,0,0,' + o + ')';
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(dx,dy);
                ctx.lineTo(sx,sy);
                ctx.closePath();
                ctx.stroke();
            }
        })
        //调用动画函数
        window.requestAnimationFrame(() => {
            roundMove(canvas,ctx,dxdy,allRound);
        })
    }

    return {
        Round:Round,
        initRound:initRound,
        roundMove:roundMove
    }
})();