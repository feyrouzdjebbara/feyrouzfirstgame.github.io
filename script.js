const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width =window.innerWidth;
canvas.height =window.innerHeight; 

const collitioncanvas = document.getElementById('collision');
const collitionctx = collitioncanvas.getContext('2d');
collitioncanvas.width =window.innerWidth;
collitioncanvas.height =window.innerHeight; 


let timeToNextRaven =0;
let revenInterval =800;
let lastTime =0;
let score=0;
let gameOver=false;

ctx.font='50px Impact';
 let ravens=[];
class Raven{
    constructor(){
        this.spriteWidth= 271;
        this.spriteHeight=194;
        this.sizeModifier=Math.random()*0.6+0.4;
        this.width=this.spriteWidth*this.sizeModifier;
        this.height=this.spriteHeight*this.sizeModifier;
        this.x=canvas.width;
        this.y=Math.random()*(canvas.height-this.height);
        this.directionX=Math.random()*5+3;
        this.directiony=Math.random()*5-2.5;
        this.markedForDeletion=false;
        this.image=new Image();
        this.image.src="raven.png";
        this.frame=0;
        this.maxFrame=4;
        this.timeSinceFlap=0;
        this.frameInterval=Math.random()*50+50;
        this.randomColors=[Math.floor(Math.random()*255),Math.floor(Math.random()*255),
            Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
        this.color='rgb('+this.randomColors[0]+','+this.randomColors[1]+','+
        this.randomColors[2]+')';
        this.hasTrail=Math.random()>0.5;
        
       
    }
    update(deltaTime){
        if(this.y<0 || this.y>canvas.height-this.height){
            this.directiony=this.directiony*-1;
        }
        this.x-=this.directionX;
        this.y+=this.directiony;
        if(this.x <0-this.width)this.markedForDeletion=true;
        this.timeSinceFlap+=deltaTime;
        if(this.timeSinceFlap>this.frameInterval){
            if(this.frame>this.maxFrame)this.frame=0;
            else this.frame++;
            this.timeSinceFlap=0;
            if(this.hasTrail){
                for(let i=0;i<5;i++){
                particles.push(new Particle(this.x,this.y,this.width,this.color));
            }}
           
        }
       if(this.x<0-this.width)gameOver=true;
    }
    draw(){

        collitionctx.fillStyle=this.color;
        collitionctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0, this.spriteWidth,this.spriteHeight,
            this.x,this.y,this.width,this.height);
    }
}

let explotions=[];
class Explotion{
    constructor(x,y,size){
        this.image=new Image();
        this.image.src="boom.png";
        this.spriteWidth=200;
        this.spriteHeight=179;
        this.size=size;
        this.x=x;
        this.y=y;
        this.frame=0;
        this.sound=new Audio;
        this.sound.src="boom.wav";
        this.timeSinceLastFrame=0;
        this.frameInterval=200;
        this.markedForDeletion=false;
    }
    update(deltaTime){
        if(this.frame===0)this.sound.play();
        this.timeSinceLastFrame +=deltaTime;
        if (this.timeSinceLastFrame>this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame=0;
            if(this.frame>5)this.markedForDeletion=true;
        }
    }
    draw(){
      
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,
             this.spriteHeight, this.x,this.y -this.size,this.size,this.size);
    
    }

}

let particles=[];
class Particle{
    constructor(x,y,size,color){
        this.size=size;
        this.x=x+this.size/2+Math.random()*50-25;
        this.y=y+this.size/3;
        this.radius=Math.random()*this.size/10;
        this.maxRadius=Math.random()*20+15;
        this.markedForDeletion=false;
        this.speedX=Math.random()*1+3;
        this.color=color;

    }

    update(){
        this.x +=this.speedX;
        this.radius+=0.3;
        if(this.radius>this.maxRadius-5)this.markedForDeletion=true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha=1-this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
}
function DrawScore(){
    ctx.fillStyle='black';
    ctx.fillText('score: '+score,100,80);
    ctx.fillStyle='white';
    ctx.fillText('score: '+score,105,80);
    
}

function DrawGameOver(){
    ctx.textAlign="center"
    ctx.fillStyle='black';
    ctx.fillText('GAME OVER, your score is '+score,canvas.width/2,canvas.height/2);
    ctx.fillStyle='white';
    ctx.fillText('GAME OVER, your score is '+score,(canvas.width/2)+5,
    (canvas.height/2)+5);
    
}
function DrawGOwner(){
    ctx.textAlign="center"
    ctx.fillStyle='black';
    ctx.fillText("Feyrouz's games's ",2350,80);
    ctx.fillStyle='white';
    ctx.fillText("Feyrouz's games's ",2355,85);

    
}
window.addEventListener('click' ,function(e){
    const detectPixelColor= collitionctx.getImageData(e.x,e.y,1,1);
    const pc =detectPixelColor.data;
    ravens.forEach(object=>{
   if(object.randomColors[0]===pc[0]&&object.randomColors[1]===pc[1]&&
    object.randomColors[2]===pc[2]){
        object.markedForDeletion=true;
        score++;
        explotions.push(new Explotion(object.x,object.y+110,object.width));
    }
    });
});

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collitionctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime=timestamp-lastTime;
    lastTime=timestamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven>revenInterval){
        ravens.push(new Raven());
        timeToNextRaven=0;
        ravens.sort(function(a,b){
          return a.width-b.width;
        });
    };
   DrawScore();
   DrawGOwner();
    [...explotions,...particles,...ravens].forEach(object => object.update(deltaTime));
    [...explotions,...particles,...ravens].forEach(object => object.draw());
    particles=particles.filter(object =>!object.markedForDeletion);
    ravens=ravens.filter(object =>!object.markedForDeletion);
    explotions=explotions.filter(object =>!object.markedForDeletion);
    particles=particles.filter(object =>!object.markedForDeletion);
    if(!gameOver)requestAnimationFrame(animate);
    else DrawGameOver();
}
animate(0);