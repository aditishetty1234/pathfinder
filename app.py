from flask import Flask, render_template, request, jsonify
import heapq

app = Flask(__name__)

def dijkstra(nodes, edges, start, end):
    graph = {node: [] for node in nodes}

    for edge in edges:
        u = edge["from"]
        v = edge["to"]
        w = int(edge["weight"])

        graph[u].append((v, w))
        graph[v].append((u, w))

    dist = {node: float('inf') for node in nodes}
    prev = {node: None for node in nodes}

    dist[start] = 0

    pq = [(0, start)]

    while pq:
        d, u = heapq.heappop(pq)

        if u == end:
            break

        for v, w in graph[u]:
            nd = d + w

            if nd < dist[v]:
                dist[v] = nd
                prev[v] = u
                heapq.heappush(pq, (nd, v))

    if dist[end] == float('inf'):
        return {"distance": "No Path", "path": []}

    path = []
    cur = end

    while cur:
        path.append(cur)
        cur = prev[cur]

    path.reverse()

    return {"distance": dist[end], "path": path}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/run", methods=["POST"])
def run():
    data = request.json

    result = dijkstra(
        data["nodes"],
        data["edges"],
        data["start"],
        data["end"]
    )

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)