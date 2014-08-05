;(function(win, ng, undefined){

  var ngApp = ng.module('project', [ 'ngRoute','ngNavbar', 'ngPie', 'ngTable' ]);

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
  
  ngApp.controller('AnalyticsCtrl', function($scope, $routeParams, $location, $http){
    var currentPage = $routeParams.page;

    if(!currentPage)$location.path('/analytics/overview');

    $scope.chapter = "三角形的中线";

    $scope.isActive = function(exp){
      var regex = new RegExp('^'+ exp + '$');
      return regex.test(currentPage);
    };

    $scope.switchChapter = function(ori){
      $scope.chapter = ori ? "三角形" : "三角形的中线";
    };

    $scope.data = { name: '' };



  });

})(window, window.angular);
