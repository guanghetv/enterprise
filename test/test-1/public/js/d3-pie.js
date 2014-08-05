;(function(win, ng, undefined){
angular.module('ngPie', [])
  .directive('pie', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {},
      controller: function($scope, $element, $location, $http, $attrs) {
        console.log();
        var width = +$attrs.width || 0,
          height = +$attrs.height || 0,
          max = +$attrs.max,
          value = +$attrs.value,
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
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        var title = svg.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr('dx', "7em")
            .attr("dy", "15em")
            .attr('class', "word")
            .text('完成此课的人数');

        var meter = warpper.append("g")
            .attr("class", "progress-meter");

        meter.append("path")
            .attr("class", "background")
            .attr("d", arc.endAngle(twoPi));

        var foreground = meter.append("path")
            .attr("class", "foreground");

        var text = meter.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em");

        var i = d3.interpolate(progress, value / max);
        progress = i(1);
        foreground.attr("d", arc.endAngle(twoPi * progress));
        text.text(formatPercent(progress));

        d3.transition().tween("progress", function() {
          return function(t) {
            
          };
        });

      },
      template: ''
    };
  })

})(window, angular);