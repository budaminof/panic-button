(function() {
  'use strict';

  angular.module('panic')
  .directive('areaChart', directive)

  function directive () {
    return {
      scope: {},
      template: '<div google-chart chart="areaChart"></div>',
      controller: controller,
    }

    function controller ($scope, $rootScope, ChartFactory) {
      var i = 0;
      var lectureId = ChartFactory.lectureId
      $scope.className = 'class'

      $rootScope.$on(lectureId, function (event, data) {
        var students = Object.keys(data).length
        var timeStamp = [];
        var g = 0 ;
        var u = 1;
        var d = 0 ;
        var tf = 0;
        for (var user in data ) {
          for (var i = 0; i < data[user].length; i++) {

            if (i > 0) {
              var dif = (new Date(data[user][i - 1].created_at).getTime() - new Date(data[user][i].created_at).getTime()) % 6000 )
             if(dif > 0 );
                ts = dif
            }
            if (data[user][0]) {
              u--
            } if (data[user][i-1] == 1) {
              d--
            } if (data[user][i-1] == 3) {
              g--
            }
            switch (data[user][i].status_id) {
              case 1:
                d++
                break;
              case 2:
               u++
               break;
              case 3:
                g++
                break;
            }

            d = d/students * 100;
            u = u/students * 100;
            g = g/students * 100;

          }
          // areaChart.data.rows.push({c: [{v: time }, {v: d}, {v: u}, {v: g}] })
        }
      })

      var areaChart = {};
      areaChart.type = "AreaChart";
      areaChart.displayed = false;
      areaChart.data = {};
      areaChart.data.rows = []

      areaChart.data.rows.push({c: [{v: "Lecture start"},{v: 0},{v: 100},{v: 0} ] })

      areaChart.data.cols = [
          {id: "month",label: "Month",type: "string"},
          {id: "DaFuq",label: "I don't get it",type: "number"},
          {id: "NoVote",label: "Undecided",type: "number"},
          {id: "GotIt",label: "I got it",type: "number"},
        ];
      areaChart.options = {
        "title": $scope.className,
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
          "title": "Percent class",
          "gridlines": {
            "count": 5
          }
        },
        "hAxis": {
          "title": "Time",
          "scaleType": 'log'

        }
      };
      $scope.areaChart = areaChart;

    }
  }


}());
