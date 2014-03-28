var width = 900,
    height = 600;

var nodeHeight = 50,
    nodeWidth = 100;

var height2 = height - 40;

var barColor = "#C9D5E6";
var barHighlightColor = "#3F6FB8";
var textColor = "#333333";
var textHighlightColor = "#FFFFFF";

var nodes, links;

var xScale, yScale;

var waterNodes;

var MM_Data;

var tree = d3.layout.tree()
            .separation(separation)
            .size([width, height-150]);


var svg = d3.select("div.main").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(0,40)");

//d3.select(self.frameElement).style("height", height + "px");


d3.json("data/epitree.json", function(error, root) {

  nodes = tree.nodes(root);
  links = tree.links(nodes);

  makeEpiTree();

});


d3.json("data/mmdata.json", function(data) {
  MM_Data = data;
});


d3.select(".epitree").on("click", makeEpiTree);
d3.select(".waterfall").on("click", function() {makeWaterfall("Initiations")});
d3.select(".mm").on("click", makeMM);


function makeEpiTree() {

  d3.selectAll("svg").remove();

  svg = d3.select("div.main").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(0,70)");

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", elbow);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; })

  node.append("rect")
      .attr({
        x: -nodeWidth/2, 
        y:-nodeHeight/2, 
        height: nodeHeight, 
        width: nodeWidth,
        fill: "#eeeeee",
        stroke: "#000000",
        "vector-effect": "non-scaling-stroke"
      })

  node.on("mouseover", mouseover).on("mouseout", mouseout);
  node.on("click", function(d) { makeWaterfall(d.nodeName)});

  node.append("text")
      .attr("font-size", "14px")
      .attr("class", "boxLabel")
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .text(function(d) { return d.nodeName; });

  node.append("text")
      .attr("font-size", "12px")
      .attr("dx", nodeWidth/2)
      .attr("dy", nodeHeight/2+10)
      .attr("fill", "#666666")
      .style("text-anchor", "end")
      .style("dominant-baseline", "middle")
      .text(function(d) { return d.size; });

};


function makeWaterfall(terminal) {
  d3.selectAll("svg").remove();

  svg = d3.select("div.main").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var terminalNode = $.grep(nodes, function(v) {
   return v.nodeName === terminal;});
  
  var curNode = terminalNode[0];
  curNode.percent = null;
  waterNodes = [curNode];

  while ("parent" in curNode) {
    smallSize = curNode.size;
    bigSize = curNode.parent.size;
    
    curNode = curNode.parent;
    curNode.percent = smallSize/bigSize;

    waterNodes.push(curNode);
  }

  console.log(waterNodes);

  waterNodes.sort(function(a,b) {return d3.descending(a.size, b.size); });


  xScale = d3.scale.ordinal()
               .domain(d3.range(waterNodes.length))
               .rangeRoundBands([0, width], 0.4);

  yScale = d3.scale.linear()
             .domain([0, d3.max(waterNodes, function(d) {return d.size})])
             .range([0, height2-40]); 

  var groups =svg.selectAll("g")
                .data(waterNodes)
                .enter().append("g").on("mouseover", mouseover2).on("mouseout", mouseout2);

  groups.append("rect")
    .attr({
      x:      function(d, i) {return xScale(i)},
      y:      function(d) {return height2 - yScale(d.size)},
      class: "displayed",
      width:  xScale.rangeBand(),
      height: function(d) {return yScale(d.size)},
      fill:   barColor
     });

  groups.append("text")
     .text(function(d) {return d.nodeName})
     .attr({
      fill:   textColor,
      "text-anchor": "middle",
      "font-size":  "14px", 
      "font-weight": "bold",
      "font-family": "sans-serif",
      x:      function(d, i) {return xScale(i) + xScale.rangeBand()/2},
      y:      function(d) {return height2 + 20}  
     });

  groups.append("text")
     .text(function(d) {return d.size})
     .attr({
      fill:   textColor,
      class: "size",
      "text-anchor": "middle",
      "font-size":  "14px", 
      "font-weight": "bold",
      "font-family": "sans-serif",
      x:      function(d, i) {return xScale(i) + xScale.rangeBand()/2},
      y:      function(d) {return height2 - yScale(d.size) + 20}  
     });

  groups.append("rect")
      .attr({
      x:      function(d, i) {return xScale(i)},
      y:      0,
      class:  "overlay", 
      width:  xScale.rangeBand(),
      height: height2,
      fill:   "white",
      "fill-opacity": 0
    });

};


function makeMM() {

  console.log(MM_Data);

  d3.selectAll("svg").remove();

  var offset = 20;

  xScale = d3.scale.ordinal()
               .domain(d3.range(MM_Data.colNames.length+1))
               .rangeRoundBands([0, width-2*offset], 0.02);

  yScale = d3.scale.ordinal()
             .domain(d3.range(MM_Data.rowNames.length+1))
             .rangeRoundBands([0, height-2*offset], 0.02);

  svg = d3.select("div.main").append("svg")
             .attr("width", width)
             .attr("height", height);

  var cell = svg.selectAll(".colHead")
                 .data(MM_Data.colNames)
                 .enter().append("g")
                 .attr("class", "colHead")
                 .attr("transform", function(d,i) {return "translate(" + (xScale(i+1)+offset) + "," + offset + ")";})

  cell.append("rect")
       .attr({
        x:      0,
        y:      0,
        width:  xScale.rangeBand(),
        height: yScale.rangeBand(),
        fill:   barColor,
        stroke: "gray" 
       })

  cell.append("text")
        .attr("x", xScale.rangeBand()/2)
        .attr("y", yScale.rangeBand()/2)
        .attr("font-size", "24px")
        .attr("class", "boxLabel")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .text(function(d) { return d; });


  var cell = svg.selectAll(".rowHead")
                 .data(MM_Data.rowNames)
                 .enter().append("g")
                 .attr("class", "rowHead")
                 .attr("transform", function(d,i) {return "translate(" + offset + "," + (yScale(i+1)+offset) + ")";})

  cell.append("rect")
       .attr({
        x:      0,
        y:      0,
        width:  xScale.rangeBand(),
        height: yScale.rangeBand(),
        fill:   barColor,
        stroke: "gray" 
       })

  cell.append("text")
        .attr("x", xScale.rangeBand()/2)
        .attr("y", yScale.rangeBand()/2)
        .attr("font-size", "24px")
        .attr("class", "boxLabel")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .text(function(d) { return d; });


var MM_cells = [];

for (i=0; i<MM_Data.data.length; i++) {
  for (j=0; j<MM_Data.data[i].length; j++) {
    MM_Data.data[i][j].x = offset + xScale(i+1);
    MM_Data.data[i][j].y = offset + yScale(j+1);
    MM_cells.push(MM_Data.data[i][j]);
  }
}

var cell = svg.selectAll(".cell")
               .data(MM_cells)
               .enter().append("g")
               .attr("class", ".cell")
               .attr("transform", function(d,i) {return "translate(" + (d.x) + "," + (d.y) + ")";})
               .on("mouseover", mouseoverCell)
               .on("mouseout", mouseoutCell);

cell.append("rect")
     .attr({
      x:      0,
      y:      0,
      width:  xScale.rangeBand(),
      height: yScale.rangeBand(),
      fill:   "#EEEEEE",
      stroke: "gray" 
     })

cell.append("text")
      .attr("x", xScale.rangeBand()/2)
      .attr("y", yScale.rangeBand()/2)
      .attr("font-size", "24px")
      .attr("class", "boxLabel")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .text(function(d) { return d.value; });
    
}



function separation(a, b) {
  return a.parent == b.parent ? 1 : 1.4;
}

function elbow(d) {
  return "M" + d.source.x + "," + d.source.y
      + "v" + (d.target.y-d.source.y)/2 + "H" + (d.target.x) + "v" + (d.target.y-d.source.y)/2;
}

function mouseover() {
    d3.select(this).select("rect")
      .transition().duration(25).attr("fill", barHighlightColor);
    
    d3.select(this).select("text.boxLabel")
      .transition().duration(25).attr("fill", "white") //.attr("font-weight", "bold");

    var infobox = d3.select("div.info");
    infobox.selectAll("p").remove();

    if ("keyInfo" in d3.select(this).datum()) {

        //infobox.style("background-color", barColor);

        for (i=0; i < d3.select(this).datum().keyInfo.length; i++) {
          infobox.append("p").text(d3.select(this).datum().keyInfo[i]);
        } 
    }
  };

function mouseout() {
    d3.select(this).select("rect")
      .transition().duration(50).attr("fill", "#eeeeee");

    d3.select(this).select("text.boxLabel")
      .transition().duration(50).attr("fill", "black") //.attr("font-weight", "normal");

    d3.select("div.info").style("background-color","white");
    d3.select("div.info").selectAll("p").remove();
  };


function mouseover2() {

    var percentFormat = d3.format(".0%");

    d3.select(this).select("rect.displayed")
        .transition().duration(0).attr("fill", barHighlightColor);
    d3.select(this).select("text.size")
      .transition().duration(0).attr("fill", textHighlightColor);

    // print percent decrease from parent
    if ("parent" in d3.select(this).datum() && d3.select(this).datum().parent.percent !== null) {
      //print arrow 
      d3.select(this).append("path")
        .attr("d", function(d) {return "M" + (xScale(d.depth-1) + xScale.rangeBand() + 15) + ","
                       + (height2 - yScale(d.parent.size)) + 
                       "H" + (xScale(d.depth) + xScale.rangeBand()/2) +
                       "V" + (height2 - yScale(waterNodes[d.depth].size) - 60)})
        .attr("stroke", "#777777")
        .attr("stroke-width", ".6px")
        .attr("class", "arrowDown")
        .attr("fill", "none");

      d3.select(this).append("text")
        .text(function(d) {return percentFormat(d.parent.percent)})
        .attr({
            fill:   "#888888",
            "class": "tempPercent",
            "text-anchor": "middle",
            "font-size":  "12px", 
            "font-family": "sans-serif",
            x: function(d) {return xScale(d.depth) + xScale.rangeBand()/2 + 2},
            y: function(d) {return height2 - yScale(d.size) - 40}   
        });
    };

  };

function mouseout2() {
    d3.select(this).select("rect.displayed")
      .transition().duration(100).attr("fill", barColor)
    d3.select(this).select("text.size")
      .transition().duration(100).attr("fill", textColor)
    d3.select(this).selectAll("text.tempPercent")
      .transition().duration(100).remove();
    d3.select(this).selectAll("path.arrowDown")
      .transition().duration(100).remove();
  };


  function mouseoverCell() {
    
    var data = d3.select(this).datum();
    var h = 200;
    var w = 150;


    d3.select(this).select("rect")
      .transition().duration(25).attr("fill", "#CCCCCC");

    d3.select("div.info").append("p").text("Patients: " + data.value);

    
    var xScale2 = d3.scale.ordinal()
                .domain(d3.range(data.age.length))
                .rangeRoundBands([0, w], 0.05);

    var yScale2 = d3.scale.linear()
                .domain([0, data.value])
                .range([0, h]); 

    var svg = d3.select("div.info").append("svg")    
                .attr("width", w)
                .attr("height", h);

    console.log(data.age)

    var groups = svg.selectAll("g")
                  .data(data.age)
                  .enter().append("g");

    groups.append("rect")
      .attr({
        x:      function(d, i) {return xScale2(i)},
        y:      function(d) {return h - yScale2(d)},
        width:  xScale2.rangeBand(),
        height: function(d) {return yScale2(d)},
        fill:   barHighlightColor,
        });

    // groups.append("text")
    //  .text(function(d) {return Math.floor(d[1])})
    //  .attr({
    //   fill:   barColor,
    //   "text-anchor": "middle",
    //   "font-size":  "12px", 
    //   "font-family": "sans-serif",
    //   x:      function(d, i) {return xScale2(i) + xScale.rangeBand2()/2},
    //   y:      function(d) {return h - yScale2(d[1]) + 20}  
    //  });

  }


  function mouseoutCell() {
    d3.select(this).select("rect")
      .transition().duration(25).attr("fill", "#EEEEEE");
    
    d3.select("div.info").selectAll("p").remove();
    d3.select("svg").remove();
  }