;(function(win, ng, undefined){

  var ngApp = ng.module('project', [ 'ngRoute','ngNavbar']);

  ngApp.config(function($routeProvider){
    $routeProvider
      .when('/', {
      	controller: 'HomeCtrl',
      	templateUrl: 'templates/home.html'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'templates/login.html'
      })
      .when('/messages', {
      	controller: 'HomeCtrl',
      	templateUrl: 'templates/home.html'
      })
      .when('/settings', {
      	controller: 'HomeCtrl',
      	templateUrl: 'templates/home.html'
      });

    $routeProvider
      .when('/analytics', {
        controller: 'AnalyticsCtrl',
        templateUrl: 'templates/analytics.html'
      })
      .when('/analytics/:page', {
        controller: 'AnalyticsCtrl',
        templateUrl: 'templates/analytics.html'
      })

    $routeProvider
      .when('/:app', {
        controller: 'LearnCtrl',
        templateUrl: 'templates/list.html'
      })
      .when('/:app/:chapter', {
        controller: 'LearnCtrl',
        templateUrl: 'templates/chapter.html'
      })
      .when('/:app/:chapter/:lesson', {
        controller: 'LearnCtrl',
        templateUrl: 'templates/lesson.html'
      })
      .when('/:app/:chapter/:lesson/:activity', {
        controller: 'LearnCtrl',
        templateUrl: 'templates/list.html'
      });



      $routeProvider.otherwise({
        redirectTo: '/'
      });
  });

  ngApp.controller('LoginCtrl', function($scope, $location){
  	$(document.body).addClass('login');
  	$scope.login = function(){
  		$location.path('/');
  	};
  });

  ngApp.controller('HomeCtrl', function($scope){
  	$(document.body).removeClass('login');
        $scope.apps = [
      { name: 'Math', describe: 'Math Describe' },
      { name: 'English', describe: 'English Describe' }
    ];
  });

  ngApp.controller('LearnCtrl', function($scope,$compile, $location, $routeParams, $log){
    $scope.chapters = [
      { name: 'Chapter-1', describe: 'Chapter Describe' },
      { name: 'Chapter-2', describe: 'Chapter Describe' }
    ];

    $scope.layers = [
      { name: 'Layer-1', describe: 'layer describe', lessons: {
          main: [
            { name: 'lesson-1', img: '' },
            { name: 'lesson-2', img: '' }

          ],
          extra: [
            { name: 'lesson-3', img: '' }
          ]
        }
      },
      { name: 'Layer-2', describe: 'layer describe', lessons: {
          main: [
            { name: 'lesson-1', img: '' },
            { name: 'lesson-2', img: '' }

          ],
          extra: [
            { name: 'lesson-3', img: '' }
          ]
        }
      }
    ];

    $scope.app = $routeParams.app;
    $scope.chapter = $routeParams.chapter;
    $scope.dialogs = [
      { role: 'teather', content: 'Hi' },
      { role: 'student', content: 'Hi' }
    ];

    $scope.options = [
      { text: 'A' },
      { text: 'B' },
      { text: 'C' }
    ];

    $scope.makeAnswer = function(){
      $scope.dialogs.push({ role: (+new Date) % 2 == 0 ? 'student': 'teather', content: new Date });
    };
  });
  
  ngApp.controller('AnalyticsCtrl', function($scope, $routeParams){
    var currentPage = $routeParams.page;
    console.log(currentPage);
    $scope.isActive = function(exp){
      var regex = new RegExp('^'+ exp + '$');
      return regex.test(currentPage);
    };

    $scope.data =   [];
    $scope.columns = ["#"];

    for(var i=0;i<30;i++){
      var d = { '#' : "学生" + i };
      $scope.columns.push('三角形的高 '+i);
      for(var j=0;j<30;j++){
        d['三角形的高 ' + j] = j;
      }
      $scope.data.push(d);
    }
    console.log($scope.data);
  });

})(window, window.angular);
