;(function(win, ng, undefined){

angular.module('ngTable', [])
 
  .directive('ngTable', function($rootScope) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {},
      controller: function($scope, $element, $location, $http, $attrs) {
        $scope.columns = [ '#', 'ID', 'Chapter', 'User' ];
       
        $http.get('/stats/individuals?chapterId=c01&roomId=r02').success(function(data){
          $scope.data = data;
        }).error(function(){

        });
      },
      templateUrl: '/templates/ng-table.html',
      replace: true
    };
  })

})(window, angular);