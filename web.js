function Web(sketch, nodesPerRing, numRings) {
  this.sketch = sketch;
  this.nodes = [];
  this.edges = [];
  this.nodesPerRing = nodesPerRing;
  this.numRings = numRings;
}

Web.prototype.map = function(v, vi, vx, ri, rx) {
  const vd = Math.abs(vx - vi);
  const vr = Math.abs(v - vi);
  const rd = Math.abs(rx - ri);
  return ((vr / vd) * rd) + ri;
};

Web.prototype.generate = function() {
  this.nodes = [];
  const dim = Math.min(this.sketch.width, this.sketch.height * .8);
  const maxDiam = dim / 2;
  const minDiam = dim / 20;
  for (let r = 0; r < this.numRings; r += 1) {
    for (let n = 0; n < this.nodesPerRing; n += 1) {
      const d = this.map(r, 0, this.numRings - 1, minDiam, maxDiam);
      const a = Math.PI * 2 * n / this.nodesPerRing
      const node = new Node(a, d, 0.01 * (r % 2 ? 1 : -1),  2);
      this.nodes.push(node);
    }
  }

  const edgeList = [];
  for (let i = 0; i < this.nodes.length; i += 1) {
    edgeList.push(i);
  }

  this.edges = this.nodes.map((n, i) => {
    const nodeEdges = edgeList.filter((v) => {
      return (v % this.nodesPerRing === i % this.nodesPerRing) ||
        Math.abs(v - i) === 1 ||
        Math.abs(v - i) === this.nodesPerRing - 1;
    });
    n.setEdges(nodeEdges);
    return nodeEdges;
  });
}

Web.prototype.draw = function() {
  this.sketch.fill(0);
  this.sketch.stroke(0, 0, 0, 50);
  this.sketch.strokeWeight(1);
  this.sketch.translate(this.sketch.width / 2, this.sketch.height / 2);
  for (let r = 0; r < this.numRings; r += 1) {
    for (let n = 0; n < this.nodesPerRing; n += 1) {
      const i = r * this.nodesPerRing + n;
      this.nodes[i].draw(this.sketch);
    }
  }

  for (let i = 0; i < this.edges.length; i += 1) {
    const edge = this.edges[i];
    const n1 = this.nodes[i].getPos();
    for (let j = 0; j < edge.length; j += 1) {
      const n2 = this.nodes[edge[j]].getPos();
      this.sketch.line(n1.x, n1.y, n2.x, n2.y);
    }
  }
}

function Node(a, d, rs, r) {
  this.a = a;
  this.d = d;
  this.rs = rs;
  this.r = r;
  this.edges = [];
  this.age = 0;
}

Node.prototype.setEdges = function(edges) {
  this.edges = edges;
}

Node.prototype.getPos = function() {
  const x = Math.cos(this.a + this.age) * this.d;
  const y = Math.sin(this.a + this.age) * this.d;
  return { x, y };
}

Node.prototype.draw = function(sketch) {
  const x = Math.cos(this.a + this.age) * this.d;
  const y = Math.sin(this.a + this.age) * this.d;
  sketch.ellipse(x, y, this.r, this.r);
  this.age += this.rs;
}