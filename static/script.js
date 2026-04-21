let nodes = []
let edges = []

function refresh() {

let ids = ["from", "to", "start", "end"]

ids.forEach(id => {
let s = document.getElementById(id)
s.innerHTML = ""

nodes.forEach(n => {
let op = document.createElement("option")
op.value = n
op.textContent = n
s.appendChild(op)
})
})

renderNodes()
renderEdges()
drawGraph()
}

function addNode() {

let node = document.getElementById("node").value.trim().toUpperCase()

if (node && !nodes.includes(node)) {
nodes.push(node)
refresh()
}

document.getElementById("node").value = ""
}

function deleteNode(name) {

nodes = nodes.filter(n => n !== name)
edges = edges.filter(e => e.from !== name && e.to !== name)

refresh()
}

function renderNodes() {

let box = document.getElementById("nodes")

box.innerHTML = nodes.map(n =>
`<div class="item">${n}
<button class="del" onclick="deleteNode('${n}')">✖</button>
</div>`
).join("")
}

function addEdge() {

let from = document.getElementById("from").value
let to = document.getElementById("to").value
let weight = document.getElementById("weight").value

if (from && to && weight) {

edges.push({
from: from,
to: to,
weight: weight
})

refresh()
document.getElementById("weight").value = ""
}
}

function deleteEdge(index) {

edges.splice(index, 1)
refresh()
}

function renderEdges() {

let box = document.getElementById("edges")

box.innerHTML = edges.map((e, i) =>
`<div class="item">
${e.from} → ${e.to} (${e.weight})
<button class="del" onclick="deleteEdge(${i})">✖</button>
</div>`
).join("")
}

function runAlgo() {

fetch('/run', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
nodes: nodes,
edges: edges,
start: document.getElementById("start").value,
end: document.getElementById("end").value
})
})
.then(res => res.json())
.then(data => {

document.getElementById("distance").innerHTML =
"Shortest Distance : " + data.distance

document.getElementById("path").innerHTML =
"Path : " + data.path.join(" → ")

drawGraph(data.path)

})
}

function drawGraph(path = []) {

let c = document.getElementById("graphCanvas")
let ctx = c.getContext("2d")

c.width = c.offsetWidth
c.height = 700

ctx.clearRect(0, 0, c.width, c.height)

let pos = {}
let centerX = c.width / 2
let centerY = c.height / 2
let radius = 250

nodes.forEach((n, i) => {

let angle = (2 * Math.PI * i) / nodes.length

pos[n] = {
x: centerX + radius * Math.cos(angle),
y: centerY + radius * Math.sin(angle)
}

})

edges.forEach(e => {

let a = pos[e.from]
let b = pos[e.to]

ctx.beginPath()
ctx.moveTo(a.x, a.y)
ctx.lineTo(b.x, b.y)
ctx.strokeStyle = "#1f4f7d"
ctx.lineWidth = 2
ctx.stroke()

ctx.fillStyle = "#8ab6ff"
ctx.font = "18px Arial"
ctx.textAlign = "center"
ctx.fillText(e.weight, (a.x + b.x) / 2, (a.y + b.y) / 2)

})

for (let i = 0; i < path.length - 1; i++) {

let a = pos[path[i]]
let b = pos[path[i + 1]]

ctx.beginPath()
ctx.moveTo(a.x, a.y)
ctx.lineTo(b.x, b.y)
ctx.strokeStyle = "yellow"
ctx.lineWidth = 5
ctx.stroke()
}

nodes.forEach(n => {

let x = pos[n].x
let y = pos[n].y

ctx.beginPath()
ctx.arc(x, y, 35, 0, 2 * Math.PI)
ctx.fillStyle = "#00ffd0"
ctx.fill()

let text = n
let size = 16

if (text.length > 8) size = 12
if (text.length > 12) size = 10
if (text.length > 16) size = 8

ctx.fillStyle = "black"
ctx.font = "bold " + size + "px Arial"
ctx.textAlign = "center"
ctx.textBaseline = "middle"
ctx.fillText(text, x, y)

})

}

document.addEventListener("DOMContentLoaded", () => {

document.getElementById("node").addEventListener("keydown", e => {
if (e.key === "Enter") addNode()
})

document.getElementById("weight").addEventListener("keydown", e => {
if (e.key === "Enter") addEdge()
})

document.getElementById("end").addEventListener("keydown", e => {
if (e.key === "Enter") runAlgo()
})

})