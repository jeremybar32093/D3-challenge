// @TODO: YOUR CODE HERE!

// 1.) Set SVG width, height, and margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// 2.) Set width and height of actual graphic based on margins and width/height of svg
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// 3.) Create an SVG wrapper, append an SVG group that will hold our chart,
//     and shift the latter by left and top margins.
//     SVG will go within div that has class "scatter"
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// 4.) Append an SVG group and translate based on margins defined above
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 5.) Set initial parameters to be used for x and y axes
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

// 6.) Create function used for updating x-scale based on either chosen default or selection from screen
function xScale(demographicData, chosenXAxis) {
    // create x scale
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(demographicData, d => d[chosenXAxis]) * 0.8,
        d3.max(demographicData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// 7.) Create function used for updating y-scale based on either chosen default or selection from screen
function yScale(demographicData, chosenYAxis) {
    // create y scale
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(demographicData, d => d[chosenYAxis])])
        .range([height, 0]);

    return yLinearScale;
}

// 8.) Create function to read in data.csv file
d3.csv("./assets/data/data.csv").then(function(demographicData, err) {
    if (err) throw err;

    // 8a.) Update datatypes to numeric
    demographicData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    // 8b.) Set x and y-axis scale of specific dataset using xScale and yScale functions defined above in steps 6/7
    var xLinearScale = xScale(demographicData, chosenXAxis);
    var yLinearScale = yScale(demographicData, chosenYAxis);

    // 8c.) Create axes on graph object
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // 8d.) Append x and y axis to chart group defined above in step 4
    // x-axis
    chartGroup.append("g")
              .classed("x-axis", true)
              .attr("transform", `translate(0, ${height})`)
              .call(bottomAxis);
    // y axis
    chartGroup.append("g")
              .classed("y-axis", true)
              .call(leftAxis);
    
    // 8e.) Append initial set of circles in scatter plot
    var circlesGroup = chartGroup.selectAll("circle")
                                 .data(demographicData)
                                 .enter()
                                //  .append("circle")
                                //  .classed("stateCircle", true)
                                //  .attr("cx", d => xLinearScale(d[chosenXAxis]))
                                //  .attr("cy", d => yLinearScale(d[chosenYAxis]))
                                //  .attr("r", 10);

    circlesGroup.append("circle")
                .classed("stateCircle", true)
                .attr("cx", d => xLinearScale(d[chosenXAxis]))
                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                .attr("r", 10);

    circlesGroup.append("text")
                .attr("dx", d => xLinearScale(d[chosenXAxis]))
                .attr("dy", d => yLinearScale(d[chosenYAxis]) + 2)
                .text(function(d) {
                    // console.log(d.abbr);
                    return d.abbr;
                  })
                .style("font-size","8px")
                .classed("stateText", true)

    // 8f.) Append state abbreviations as data labels to scatter circles
    // var dataLabelsGroup = chartGroup.selectAll("text")
    //           .data(demographicData)
    //           .enter()
              // circlesGroup.append("text")
              // .text(function(d) {
              //   // console.log(d.abbr);
              //   return d.abbr;
              // })

              
              // .attr("dx", d => xLinearScale(d[chosenXAxis]))
              // .attr("dy", d => yLinearScale(d[chosenYAxis]))
              // .classed("stateText", true)
              
              // .style("color","red")
              // .attr("font-size", "10");
            //   .attr("font-weight", "bold");

    // 8g.) Add axis labels
    // x axis - translate to middle of screen, bottom of graph itself plus 20
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var xAxisLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", chosenXAxis) // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    // append y axis
    var yAxisLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText active", true)
    .text("Lacks Healthcare (%)");
                

}).catch(function(error) {
    console.log(error);
});


