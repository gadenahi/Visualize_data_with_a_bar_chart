
const w = 500;
const h = 400;
const padding = 50;
const DATA_FILE_PATH = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

d3.json(DATA_FILE_PATH, function(error, dataoriginal) {
  let timeparser = d3.timeParse("%Y-%m-%d");
  let format = d3.timeFormat("%Y");
  let dataset = dataoriginal.data.map(function(d) {
    return {date:timeparser(d[0]), value:d[1]}
  })
  
  const xScale = d3.scaleTime()
                   .domain([d3.min(dataset, (d) => d.date), d3.max(dataset, (d) => d.date)])
                   .range([padding, w - padding]);   
  
  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset, (d) => d.value)])
                   .range([h - padding, padding]);  
  
  const svg = d3.select("body")
                .append("svg")
                .attr("class", 'svg-graph')
                .attr("width", w)
                .attr("height", h)

  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("data-date", (d, i) => dataoriginal.data[i][0])
     .attr("data-gdp", (d, i) => d.value)
     .attr("x", (d, i) => xScale(d.date))  
     .attr("y", (d, i) => yScale(d.value)) 
     .attr("width", 2)
     .attr("height", (d, i) => d.value/60)  
     .attr("class", "bar")
     .attr("fill", "blue")
     .on("mouseover", function(d, i) {
      d3.select(".js_toolTip")
        .html(dataoriginal.data[i][0] + "<br>" + d.value + "Billions")
        .style("display", "inline-block")
        .style("top", yScale(d.value) + "px")
        .style("left", xScale(d.date) + 500 + "px")
        .attr("id", "tooltip")
        .attr("data-date", dataoriginal.data[i][0]) 
      d3.select(this)
        .attr("fill", "white")
 
  })
     .on("mouseout", function(d, i) {
      d3.select(".js_toolTip")
        .style("display", "none")    
      d3.select(this)
        .attr("fill", "blue")
  })
  
  svg.append("text")
     .attr("class", "y-label")
     .text("Gross Domestic")
     .attr("x", -200)
     .attr("y", 70)
     .attr("transform", "rotate(-90)")
  
  svg.append("text")
     .attr("class", "x-label")
     .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
     .attr("x", w/2 -100)
     .attr("y", h)
     .attr("font-size", "12" + "px")
  
  const xAxis = d3.axisBottom(xScale)
                  .tickFormat(format)
  
  const yAxis = d3.axisLeft(yScale)

  svg.append("g")
     .attr("transform", "translate(0," + (h-padding) + ")")
     .attr("id", "x-axis")
     .call(xAxis)

  svg.append("g")
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + ", 0)")
     .call(yAxis)
  
})