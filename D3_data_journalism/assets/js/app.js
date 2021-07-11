// @TODO: YOUR CODE HERE!

// 1.) Set SVG width, height, and margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100,
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
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 5.) Set initial parameters to be used for x and y axes
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// 6.) Create function used for updating x-scale based on either chosen default or selection from screen
function xScale(demographicData, chosenXAxis) {
  // 6a.) create x scale
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(demographicData, (d) => d[chosenXAxis]) * 0.8,
      d3.max(demographicData, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([0, width]);

  return xLinearScale;
}

// 7.) Create function used for updating y-scale based on either chosen default or selection from screen
function yScale(demographicData, chosenYAxis) {
  // 7a.) create y scale
  var yLinearScale = d3
    .scaleLinear()
    .domain([0, d3.max(demographicData, (d) => d[chosenYAxis])])
    .range([height, 0]);

  return yLinearScale;
}

// 8.) Function to re-render x axis after selecting a new variable (see event listener below)
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1000).call(bottomAxis);

  return xAxis;
}

// 9.) Function to re-render y axis after selecting a new variable (see event listender below)
function renderYAxis(newYScale, yAxis) {

  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition().duration(1000).call(leftAxis);

  return yAxis;
}

// 10.) Function to update circle positions based on new chosen x-axis
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  // 10a.) Update x location of circles themselves
  circlesGroup
    .transition()
    .attr("cx", (d) => newXScale(d[chosenXAxis]))
    .duration(1000);

  // 10b.) Update x location of each state text label individually
  d3.selectAll("#data-label").each(function () {
    d3.select(this)
      .transition()
      .attr("dx", function (d) {
        return newXScale(d[chosenXAxis]);
      })
      .duration(1000);
  });

  return circlesGroup;
}

// 11.) Function to update circle positions based on new chosen y-axis
function renderCirclesYAxis(circlesGroup, newYScale, chosenYAxis) {
  // 11a.) Update y location of circles themselves
  circlesGroup
    .transition()
    .attr("cy", (d) => newYScale(d[chosenYAxis]))
    .selectAll("text")
    .attr("dy", (d) => newYScale(d[chosenYAxis]))
    .duration(1000);

  // 11b.) Update y location of each state text label individually
  d3.selectAll("#data-label").each(function () {
    d3.select(this)
      .transition()
      .attr("dy", function (d) {
        return newYScale(d[chosenYAxis]);
      })
      .duration(1000);
  });

  return circlesGroup;
}

// 12.) Declare function used for updating circles group with new tooltip
//      Read in both chosen X and Y axes
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // 12a.) Create tooltip
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .html(function (d) {
      // Dynamically update tooltip display based on chosen axis
      var tooltip_html_string;
      var tooltip_x_label;
      var tooltip_y_label;
      // construct initial portion of tooltip based on chosen x label
      if (chosenXAxis === "poverty") {
        tooltip_x_label = `<br>Poverty: ${d.poverty}%`;
      } else if (chosenXAxis === "age") {
        tooltip_x_label = `<br>Age: ${d.age}`;
      } else {
        tooltip_x_label = `<br>Household Income: ${d.income}`;
      }

      // construct second portion of tooltip based on chosen y label
      if (chosenYAxis === "healthcare") {
        tooltip_y_label = `<br>Lacks Healthcare: ${d.healthcare}%`;
      } else if (chosenYAxis === "obesity") {
        tooltip_y_label = `<br>Obese: ${d.obesity}%`;
      } else {
        tooltip_y_label = `<br>Smokes: ${d.smokes}%`;
      }

      // construct full tooltip
      tooltip_html_string = `${d.state}${tooltip_x_label}${tooltip_y_label}`;
      return tooltip_html_string;
    });

  // 12b.) Attach tooltip to circlesGroup
  circlesGroup.call(toolTip);

  // 12c.) Event listeners for hovering over datapoint
  // Show relevant data when user hovers over datapoint
  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data, this);
    })
    // hide tooltip on onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// 13.) Create function to read in data.csv file
d3.csv("./assets/data/data.csv")
  .then(function (demographicData, err) {
    if (err) throw err;

    // 13a.) Update datatypes to numeric
    demographicData.forEach(function (data) {
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

    // 13b.) Set x and y-axis scale of specific dataset using xScale and yScale functions defined above in steps 6/7
    var xLinearScale = xScale(demographicData, chosenXAxis);
    var yLinearScale = yScale(demographicData, chosenYAxis);

    // 13c.) Create axes on graph object
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // 13d.) Append x and y axis to chart group defined above in step 4
    // x-axis
    var xAxis = chartGroup
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    // y axis
    var yAxis = chartGroup.append("g").classed("y-axis", true).call(leftAxis);

    // 13e.) Append initial set of circles in scatter plot
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(demographicData)
      .enter();

    circlesGroup
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
      .attr("r", 10);

    circlesGroup
      .append("text")
      .attr("id", "data-label")
      .attr("dx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("dy", (d) => yLinearScale(d[chosenYAxis]) + 2)
      .text(function (d) {
        // console.log(d.abbr);
        return d.abbr;
      })
      .style("font-size", "8px")
      .classed("stateText", true);

    // 13f.) Logic to add tooltip - for some reason, had to recreate/rebind circlesGroup for it to work properly
    var circlesGroup = chartGroup.selectAll("circle").data(demographicData);
    updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // 13g.) Add axis labels
    // x axis - translate to middle of screen, bottom of graph itself plus 20
    var labelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var xAxisLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var xAxisLabel2 = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (Median)");

    var xAxisLabel3 = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Household Income (Median)");

    // append y axis
    var yLabelsGroup = chartGroup.append("g");

    var yAxisLabel = yLabelsGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("aText active y-axis-label", true)
      .text("Lacks Healthcare (%)");

    var yAxisLabel2 = yLabelsGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("aText inactive y-axis-label", true)
      .text("Obese (%)");

    var yAxisLabel3 = yLabelsGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("aText inactive y-axis-label", true)
      .text("Smokes (%)");

    // 13h.) x axis labels event listener
    labelsGroup.selectAll("text").on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(demographicData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          // xAxisLabel1 = poverty, 2 = age, 3 = household income
          xAxisLabel.classed("active", true).classed("inactive", false);
          xAxisLabel2.classed("active", false).classed("inactive", true);
          xAxisLabel3.classed("active", false).classed("inactive", true);
        } else if (chosenXAxis === "age") {
          xAxisLabel.classed("active", false).classed("inactive", true);
          xAxisLabel2.classed("active", true).classed("inactive", false);
          xAxisLabel3.classed("active", false).classed("inactive", true);
        } else {
          xAxisLabel.classed("active", false).classed("inactive", true);
          xAxisLabel2.classed("active", false).classed("inactive", true);
          xAxisLabel3.classed("active", true).classed("inactive", false);
        }
      }

      // Update tooltip based on both chosen X and Y axes
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    });

    // 13i.) y-axis label event listener
    chartGroup.selectAll(".y-axis-label").on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        // replaces chosenYAxis with value
        chosenYAxis = value;
        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(demographicData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCirclesYAxis(
          circlesGroup,
          yLinearScale,
          chosenYAxis
        );

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          // xAxisLabel1 = poverty, 2 = age, 3 = household income
          yAxisLabel.classed("active", true).classed("inactive", false);
          yAxisLabel2.classed("active", false).classed("inactive", true);
          yAxisLabel3.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "obesity") {
          yAxisLabel.classed("active", false).classed("inactive", true);
          yAxisLabel2.classed("active", true).classed("inactive", false);
          yAxisLabel3.classed("active", false).classed("inactive", true);
        } else {
          yAxisLabel.classed("active", false).classed("inactive", true);
          yAxisLabel2.classed("active", false).classed("inactive", true);
          yAxisLabel3.classed("active", true).classed("inactive", false);
        }
      }

      // Update tooltip based on both chosen X and Y axes
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
