;(function(win, ng, undefined){

angular.module('ngTable', [])
 
  .directive('ng-table', function() {
    return {
      restrict: 'AC',
      transclude: true,
      scope: {},
      controller: function($scope, $element, $location, $http) {
        
      },
      templateUrl: 'templates/navbar.html',
      replace: true
    };
  })

})(window, angular);