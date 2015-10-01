var svg = d3.select("#viewer");
var graph, curgraph, fixedlist = undefined;
var colorScale = d3.scale.linear().domain([-1.0,1.0]).range(['rgb(215,25,28)','rgb(253,174,97)','rgb(255,255,191)','rgb(166,217,106)','rgb(26,150,65)']);

var svgBounds = document.getElementById("viewer").getBoundingClientRect(),
    xAxisSize = 100,
    yAxisSize = 60;

var width = svgBounds.right - svgBounds.left;
var height = svgBounds.bottom - svgBounds.top;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);


function setupGraph(){
    force
        .nodes(curgraph.nodes)
        .links(curgraph.links)
        .start();

    var link = svg.select("#links").selectAll(".link")
        .data(curgraph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width",2);

    var node = svg.select("#nodes").selectAll(".node")
        .data(curgraph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function(d){return colorScale(d.security);})
        .on("dblclick",updateCenter)
        .call(force.drag);

    node.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
        link.attr("x1", function(d) {
            return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) {
            return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
}

function updateCenter(d){
    d.px = width/2;
    d.py = height/2;
    d.fixed = true;
    if(fixedlist!=undefined) fixedlist.fixed = false;
    fixedlist = d;



    force.resume();
}

function selectCenter(name){
    for(var i = 0; i < graph.nodes.length; ++i){
        if(graph.nodes[i].name == name){
            updateCenter(graph.nodes[i]);
        }
    }
}



d3.json("data/jovemap.json", function(error, mapgraph) {
    if (error) throw error;
    graph = mapgraph;
    curgraph = graph;
    setupGraph();
    selectCenter("E2AX-5");
});