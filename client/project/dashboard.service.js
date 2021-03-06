(function() {
  'use strict';

  angular.module('panic')
  .factory('dashboardService', dashboardFactory);

 dashboardFactory.$inject = [
    '$log',
     '$http',
     '$state',
     '$window',
     'API_URL'
  ];

  function dashboardFactory ($log, $http, $state, $window, API_URL) {
    var getParticipants = function () {
      return $http.get(API_URL).then(function (res){
        return $http.get(res.data.participations)
      })
    }

    var POST_CLASSES_ENDPOINTS = $http.get(API_URL).then(function (res){
      return res.data.classes.post
    })

    var _classes = {};
    _classes._teaching = [];
    _classes._attending = [];

    var _previousPage;

    var dashboardFactory = {
      getClasses: getClasses,
      getLectures: getLectures,
      addClass: addClass,
      addLecture: addLecture,
      setPreviousPage: setPreviousPage,
      getPreviousPage: getPreviousPage,
      startLecture: startLecture,
      endLecture: endLecture,
      currentLecture: currentLecture,
      addParticipant: addParticipant,
      deleteParticipant: deleteParticipant
    }

    return dashboardFactory

    function getClasses(){
      return getParticipants().then(function(res){
        _classes._teaching = [];
        _classes._attending = [];
        for (var i = 0; i < res.data.length; i++) {
          if(res.data[i].attributes.instructor){
            _classes._teaching.push(res.data[i]);
          } else {
            _classes._attending.push(res.data[i]);
          }
        }
        return _classes;
        }).catch(function (err){
          return err;
        })
    }

    function getLectures (classId, url) {
      return $http.get(url).then(function (res) {
        for (var i = 0; i < _classes._teaching.length; i++) {
          if (_classes._teaching[i].attributes.id == classId) {
          _classes._teaching[i].attributes.lectures = res.data;
          return   _classes._teaching[i]
          }
        }
        for (var i = 0; i < _classes._attending.length; i++) {
          if (_classes._attending[i].attributes.id == classId){
            _classes._attending[i].attributes.lectures = res.data;
            return _classes._attending[i]
          }
        }
      })
    }

    function addClass(newClass) {
      return POST_CLASSES_ENDPOINTS.then(function (res){
        return $http.post(res, newClass)
        .then(function(res){
          _classes._teaching.push(res.data)
          return _classes
        })
      })
    }

    function addLecture (newLecture, url) {
      return $http.post(url, newLecture)
      .then(function (res) {
        return res.data;
      })
    }

    function setPreviousPage (classId) {
      _previousPage = classId;
      return
    }

    function getPreviousPage () {
      return _previousPage
    }

    function startLecture (url) {
      return $http.post(url).then(function (res) {
        return res
      })
    }

    function endLecture (url) {
      var newUrl = API_URL + '/lectures/'+ url +'/stop'
      return $http.post(newUrl).then(function (res){
        return res
      })
    }

    function currentLecture(lectureId){
      var newUrl = API_URL + '/lectures/'+ lectureId
      return $http.get(newUrl).then(function (res){
        return res.data;
      })
    }

    function addParticipant(url, newParticipant){
      return $http.post(url, newParticipant).then(function(res){
        return res
      })
    }

    function deleteParticipant (url){
      return $http.delete(url).then(function(res){
        return res
      })
    }

  }
}());
