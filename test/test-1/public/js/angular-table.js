;(function(win, ng, undefined){

angular.module('ngTable', [])
 
  .directive('ngTable', function($rootScope) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {},
      controller: function($scope, $element, $location, $http, $attrs) {
        $scope.columns = [ '#', '三角形三边定理' ];
        for(var i=0;i<50;i++){
          $scope.columns.push('三角形三边定理' + i);
        }
       
        $http.get('/stats/individuals?chapterId=c01&roomId=r02').success(function(data){
          $scope.data = data;
        }).error(function(){
          var data = [];
          for(var i=0;i<50;i++){
            var d = {};
            for(var j=0;j<50;j++){
              d[ 'chapter-' + j ] ='chapter-' + j;
            }
            console.log(d);
            data.push(d);
          }
          $scope.data = data;
        });
      },
      templateUrl: '/templates/ng-table.html',
      replace: true
    };
  })

})(window, angular);