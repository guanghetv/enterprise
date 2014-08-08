;(function(win, ng, undefined){
angular.module('d3Pie', [])
  .directive('d3Pie', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {
        value: '@'
      },
      controller: function($scope, $element, $location, $http, $attrs) {
        var width = +$attrs.width || 0,
          height = +$attrs.height || 0,
          max = +$attrs.max || 100,
          value = +$attrs.value || 0,
          twoPi = 2 * Math.PI,
          progress = 0,
          formatPercent = d3.format(".0%");

        var arc = d3.svg.arc()
            .startAngle(0)
            .innerRadius(80)
            .outerRadius(100);

        var svg = d3.select($element.get(0)).append("svg")
            .attr("width", width)
            .attr("height", height);


        var warpper = svg.append("g")
            .attr('fill', '#fff')
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        var title = svg.append("g")
            .append("text")
            .attr('dx', "7em")
            .attr("dy", "15em")
            .attr("text-anchor", "middle")
            .text($attrs.text);

        var meter = warpper.append("g")
            .attr("class", "pie-inner");

        meter.append("path")
            .attr("class", "background")
            .attr("d", arc.endAngle(twoPi));

        var foreground = meter.append("path")
            .attr("class", "foreground");

        var text = meter.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em");

        var animate = function(percentage){
          var i = d3.interpolate(progress, percentage);
          d3.select($element.get(0))
            .transition()
            .delay(300)
            .duration(800)
            .tween("progress", function () {
              return function (t) {
                  progress = i(t);
                  foreground.attr("d", arc.endAngle(twoPi * progress));
                  text.text(formatPercent(progress));
              };
          });
        }; 
        animate(value / max);

        $attrs.$observe('value', function(v) {
           /// do what is needed with passedId
           animate(v / max);
         });
      },
      template: ''
    };
  })

})(window, angular);