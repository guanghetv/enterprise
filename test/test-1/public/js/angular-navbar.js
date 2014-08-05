;(function(win, ng, undefined){

angular.module('ngNavbar', [])
 
  .directive('navigation', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {},
      controller: function($scope, $element, $location, $http) {
      	$scope.isActive = function(path){
          var regex = RegExp(path);
      		return regex.test($location.path());
      	};

      	$scope.logout = function(){
      		$http.delete('/session')
      		.error(function(){
      			$location.path('/');
      		});
      	};
      },
      templateUrl: 'templates/navbar.html',
      replace: true
    };
  })

})(window, angular);