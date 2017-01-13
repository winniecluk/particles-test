var width = 800;
var height = 500;
var midpoint_x = width / 2;

var bucket_level = 0;
var bucket_width = 100;
var bucket_height = 200;

var particle_radius = 6;
var particle_color = 'blue'

var svg = 
    d3
        .select('body')
        .append('svg')
            .attr('width', width)
            .attr('height', height);

svg
    .append('rect')
        .attr('width', width)
        .attr('height', height)
    .on('ontouchstart' in document ? 'touchmove' : 'mousemove', particle);

function particle() {
    svg
        .insert('circle')
            .attr('cx', midpoint_x)
            .attr('cy', 20)
            .attr('r', particle_radius)
        .transition()
            .duration(3000)
            .attr('cx', midpoint_x + (Math.random() * ( bucket_width - particle_radius)  ) - ( bucket_width / 2))
            .attr('cy', 0.5 * height - particle_radius)
            .attr('r', particle_radius)
            .remove();
    
    if (bucket_level < bucket_height) bucket_level++; 

    svg
        .insert('rect')
            .attr('x', midpoint_x - ( bucket_width / 2) - particle_radius / 2)
            .attr('y', height / 2 - bucket_level + particle_radius)
            .attr('width', bucket_width + particle_radius )
            .attr('height', bucket_level  )
            .style('fill', 'blue')

    d3.event.preventDefault();
}
