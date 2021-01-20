//set parameters
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 25,
  right: 50,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed("chart", true);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

  d3.csv("data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);
}

function makeAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))

  return circlesGroup;
}

function renderText(circleText, newXScale, chosenXAxis) {

  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circleText;
}

function updateToolTip(chosenXAxis, circlesGroup) {

  var label;
  
  if (chosenXAxis === "poverty") {
    label = "Poverty (%)";
    }
  else  {
    label = "Household Income";
    }
  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, -0])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>Lacks healthcare: ${d.healthcare}`);
        });
  
  circlesGroup.call(toolTip);
  
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  });

  return circlesGroup;

  }

// Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {

// Step 1: Parse Data/Cast as numbers
// ==============================
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    console.log(data);
    });

    // Step 2: Create scale functions
    // ==============================

  var xLinearScale = xScale(stateData, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.healthcare)])
    .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .classed("stateCircle", true)

    //create text within circles
  var circleText = chartGroup.selectAll(".stateText")
      .data(stateData)
      .enter()
      .append("text")
      .classed("stateText", true)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("font-size", "10px")
      .text(function(d) { return d.abbr })

  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .classed("active", true)
    .text("Poverty (%)")
    .attr("value", "poverty")
    .attr("font-weight", "bold")
    .classed("aText", true);

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .text("Household Income (Median)")
    .attr("value", "income")
    .attr("font-weight", "bold")
    .classed("inactive", true)
    .classed("aText", true);

   













































