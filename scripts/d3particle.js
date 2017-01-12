var width = 800;
var height = 500;

var svg = 
    d3
        .select("body")
        .append("svg")
            .attr("width", width)
            .attr("height", height);

svg
    .append("rect")
        .attr("width", width)
        .attr("height", height)
    .on("ontouchstart" in document ? "touchmove" : "mousemove", particle);

function particle() {
    svg
        .insert("circle", "rect")
            .attr("cx",   (width/2))
            .attr("cy", 20)
            .attr("r", 5)
        .transition()
            .duration(3000)
            .attr("cx", (width/2) +  Math.random() * (width/8) - Math.random() * (width/16))
            .attr("cy", 0.5 * height)
            .attr("r", 8)
            .remove();

    d3.event.preventDefault();
}
