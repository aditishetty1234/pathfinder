function drawGraph(path=[]){

let c=document.getElementById("graphCanvas")
let ctx=c.getContext("2d")

c.width=c.offsetWidth
c.height=700

ctx.clearRect(0,0,c.width,c.height)

let pos={}
let centerX=c.width/2
let centerY=c.height/2
let radius=250

nodes.forEach((n,i)=>{

let angle=(2*Math.PI*i)/nodes.length

pos[n]={
x:centerX+radius*Math.cos(angle),
y:centerY+radius*Math.sin(angle)
}

})

/* DRAW EDGES */
edges.forEach(e=>{

let a=pos[e.from]
let b=pos[e.to]

ctx.beginPath()
ctx.moveTo(a.x,a.y)
ctx.lineTo(b.x,b.y)
ctx.strokeStyle="#1f4f7d"
ctx.lineWidth=2
ctx.stroke()

ctx.fillStyle="#8ab6ff"
ctx.font="18px Arial"
ctx.textAlign="center"
ctx.fillText(e.weight,(a.x+b.x)/2,(a.y+b.y)/2)

})

/* HIGHLIGHT PATH */
for(let i=0;i<path.length-1;i++){

let a=pos[path[i]]
let b=pos[path[i+1]]

ctx.beginPath()
ctx.moveTo(a.x,a.y)
ctx.lineTo(b.x,b.y)
ctx.strokeStyle="yellow"
ctx.lineWidth=5
ctx.stroke()

}

/* DRAW NODES */
nodes.forEach(n=>{

let x=pos[n].x
let y=pos[n].y

ctx.beginPath()
ctx.arc(x,y,35,0,2*Math.PI)
ctx.fillStyle="#00ffd0"
ctx.fill()

let text=n
let size=16

if(text.length>8) size=12
if(text.length>12) size=10
if(text.length>16) size=8

ctx.fillStyle="black"
ctx.font="bold "+size+"px Arial"
ctx.textAlign="center"
ctx.textBaseline="middle"
ctx.fillText(text,x,y)

})

}