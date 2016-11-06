(function(){
  angular
  .module('FontsApp').constant('jdFontselectConfig', {
    googleApiKey: 'AIzaSyDsXH0e36tnmTKXR3zbLOwM01iztXu28iE'
  })
  .controller('SiteController', function($http, $state, Flash){
    var self = this;
    var rootUrl = 'http://localhost:3000'
    // var rootUrl = 'https://spaced-out-backend.herokuapp.com'

    this.signup = function(user) {
      console.log(user);
      return $http({
        url: `${rootUrl}/users`,
        method: 'POST',
        data: {user: user}
      })
      .then(function(response) {
        // $state.go('profile', {url: '/profile'});
        // console.log('self', self);
        console.log(response);
      })
      .catch(function(err) {
        console.log(err);
      })
    }

    this.login = function(user) {
      return $http({
        url: `${rootUrl}/users/login`,
        method: 'POST',
        data: {user: user}
      })
      .then(function(response) {
        console.log(response);
        self.user = response.data.user;
        self.id = response.data.user.id;
        // console.log(self.user);
        console.log('token >>>', response.data.token);
        localStorage.setItem('token', JSON.stringify(response.data.token))
            $state.go('profile', {url: '/profile', user: response.data.user})
      })
      .catch(function(err) {
        console.log(err);
      })
    }

    $http.get(`${rootUrl}/users`)
    .then(function(response) {
      console.log(response);
      self.users = response.data.users;
    })

    this.showFavorites = function(id) {
      console.log(id);
      return $http({
        url: `${rootUrl}/users/${id}/fav_fonts`,
        method: 'GET'
      })
      .then(function(response) {
        console.log(response);
        self.fonts = response.data.fonts;
      })
    }

    this.addToFavorites = function(font, user_id) {
      var newFont = font.replace(/['"]+/g, '').split(',');
      var fontObj = {
        font_family: newFont[0],
        category: newFont[1].replace(/\s/g, ''),
        origin: newFont[2].replace(/\s/g, ''),
      };
      console.log(fontObj);
      console.log('font', newFont);
      return $http({
        url: `${rootUrl}/users/${user_id}/fav_fonts`,
        method: 'POST',
        data: {fav_font: fontObj}
      })
      .then(function(response) {
        console.log(response);
        return response;
      })
      .then(function(response){
        self.fonts.push(fontObj)
      })
      .catch(function(err) {
        console.log(err);
      })
    }

    this.deleteFavorite = function(user_id, fav_font_id, index) {
      console.log('user: ', user_id, 'font: ', fav_font_id);
      console.log('index>>', index);
      return $http({
        url: `${rootUrl}/users/${user_id}/fav_fonts/${fav_font_id}`,
        method: 'DELETE',
        // data: {fav_font: fontObj}
      })
      .then(function(response) {
        console.log(response);
        return response;
      })
      .then(function(response) {
        // console.log(self.fonts);
        self.fonts.splice(index, 1);
      })
      .catch(function(err) {
        console.log(err);
      })
    }

    this.updatePass = function(user_id, newInfo) {
      return $http({
        url: `${rootUrl}/users/${user_id}`,
        method: 'PATCH',
        data: {pass: newInfo}
      })
      .then(function(response) {
        self.newInfo = {};
        $state.go('profile', {url: '/profile', user: response.data.user});
        console.log(response);
      })
      .catch(function(err) {
        console.log(err);
      })
    }

    this.logout = function(user) {
      console.log('logout>>>', user);
      self.user = null;
      localStorage.removeItem('token')
      $state.go('home', {url: '/'})
    }

    this.newInfo = {};

    //Flash stuff here
    function passAlert(msg){
      var id = Flash.create('success', msg, 7000, {class: 'flashAlert'}, true);
    }

    function failAlert(msg){
      var id = Flash.create('danger', msg, 7000, {class: 'flashAlert'}, true);
    }

    function infoAlert(msg){
      var id = Flash.create('info', msg, 7000, {class: 'flashAlert'}, true);
    }

    function warnAlert(msg){
      var id = Flash.create('warning', msg, 7000, {class: 'flashAlert'}, true);
    }
  }); //controller closure
})()
