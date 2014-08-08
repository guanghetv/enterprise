;(function(win, ng, undefined){

  var ngApp = ng.module('project', [ 'ngRoute','ngNavbar', 'd3Pie','d3Lesson' ,'ngTable' ]);

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
    $scope.chapters = [];
    if(!currentPage)$location.path('/analytics/overview');

    $http.get('http://0.0.0.0:3000/apps?type=chapter').success(function(data){
      $scope.chapter = data[0].appId;
      $scope.chapters = data;
    });

    $http.get('/stats/rooms/?chapterId=c01&roomId=r02').success(function(){

    }).error(function(){
      var data = {
        "chapter":{
          "chapterId":"c01",
          "chapterTitle":"三角形"
        },
        "lessons":[
          {
            "lesson":{
              "lessonId"    : "l01",
              "lessonTitle": "三角形的角平分线"
            },
            "stats":{
              "FinishCount":"25",
              "VideoRatio":"78",
              "QuizRatio":"69"
            }
          }
        ]
      };

      $scope.lesson = data['lessons'][0].lesson;
      $scope.stats = data['lessons'][0].stats;


    });

    $scope.isActive = function(exp){
      var regex = new RegExp('^'+ exp + '$');
      return regex.test(currentPage);
    };
    $scope.switchLesson = function(ori){

    };
    //set default pie .
    $scope.pie = 'pie-2';
    $scope.activePie = function($ev){
      var pie = $($ev.target).closest('d3-pie');
      $('d3-pie').removeClass('pie-active');
      pie.addClass('pie-active');
      $scope.pie = pie.attr('id');
    };

  });

})(window, window.angular);
