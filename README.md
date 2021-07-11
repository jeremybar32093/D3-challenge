# D3-challenge

This repository uses [D3](https://d3js.org/) to read in a dataset and create a dynamic scatterplot. The interactivity on the scatterplot includes the ability to update the plot based on selecting available fields to use for both the X and Y axes.

When the user selects and X or Y axis value, the plot will automically update, and will resemble the following:
![images](images/7-animated-scatter.gif)


Additionally, the [d3-tip.js](https://github.com/caged/d3-tip) plugin was used to create tooltips. These tooltips will show underlying data values when hovering over individual datapoints within the plot, and will resemble the following:
![images](images/8-tooltip.gif)

**NOTE:** Since this file uses JavaScript to read in a CSV file (dataset that is used for the plot) it  must be run via a web server.   
