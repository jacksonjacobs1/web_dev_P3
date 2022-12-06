import * as d3 from 'd3';
import * as hb from 'd3-hexbin';
import React, { useRef } from 'react';

export default function Plot(props) {
  const chart = useRef();
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select('#svgchart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.scaleLinear().domain([0, 250]).range([0, width]);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  var Tooltip = d3
    .select('#svgchart')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px');

  var mouseover = function (d) {
    Tooltip.style('opacity', 1);
    d3.select(this).style('stroke', 'black').style('opacity', 1).style('r', 9);
  };

  var mousemove = function (d) {
    console.log(d3.select(this)._groups[0][0].getAttribute('comment'));
    Tooltip.html(d3.select(this)._groups[0][0].getAttribute('comment'));
  };

  var mouseleave = function (d) {
    Tooltip.style('opacity', 0);
    d3.select(this).style('stroke', 'none').style('opacity', 0.8).style('r', 3);
  };
  // Add Y axis
  var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  svg
    .append('text')
    .attr('class', 'x label')
    .attr('text-anchor', 'end')
    .attr('x', width)
    .attr('y', height - 6)
    .text('Tempo');

  svg
    .append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'end')
    .attr('y', 6)
    .attr('dy', '.75em')
    .attr('transform', 'rotate(-90)')
    .text('Danceability');
  // Add dots
  svg
    .append('g')
    .selectAll('dot')
    .data(props.data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return x(d.x);
    })
    .attr('cy', function (d) {
      return y(d.y);
    })
    .attr('comment', function (d) {
      return d.name;
    })
    .attr('r', 3)
    .style('fill', '#69b3a2')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);

  return <div id="svgchart" ref={chart} style={{ padding: 50 }}></div>;
}
