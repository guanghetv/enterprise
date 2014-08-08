;(function(win, ng, undefined){

angular.module('d3Lesson', [])
 
  .directive('d3Lesson', function($rootScope) {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {},
      controller: function($scope, $element, $location, $http, $attrs) {
        var width = +$attrs.width || 0;
        var height = +$attrs.height || 0;

        var svg = d3.select($element.get(0))
          .append('svg')
          .attr('width', "100%")
          .attr('height', '100%')
          .attr('class', 'lesson-detail');

        var example = svg.append('g')

        var rect1 = example.append('rect')
          .attr('width',30)
          .attr('height',30)
          .attr('fill', '#ccc')
          .attr('x', '30%')
          .attr('y', 10)

        var text1 = example.append('text')
          .attr('dx','33%')
          .attr('dy',32)
          .text('课程完成比例')

        var rect2 = example.append('rect')
          .attr('width',30)
          .attr('height',30)
          .attr('fill', '#ccc')
          .attr('x', '60%')
          .attr('y', 10)

        var text2 = example.append('text')
          .attr('dx','63%')
          .attr('dy',32)
          .text('正在学习此课的学生')

        var content1 = svg.append('g')

        for(var i=0;i<28;i++){
          content1.append('rect')
            .attr('width',30)
            .attr('height',30)
            .attr('fill', '#ccc')
            .attr('x', i * 40)
            .attr('y', 100)
        }

        var content2 = svg.append('g')

        for(var i=0;i<28;i++){
          content2.append('rect')
            .attr('width',30)
            .attr('height',30)
            .attr('fill', '#ccc')
            .attr('x', i * 40)
            .attr('y', 180)
        }



      },
      template: '',
      replace: true
    };
  })

})(window, angular);