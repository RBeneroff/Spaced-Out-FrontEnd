(function(){
  angular
  .module('FontsApp').constant('jdFontselectConfig', {
    googleApiKey: 'AIzaSyDsXH0e36tnmTKXR3zbLOwM01iztXu28iE'
  })
  .controller('SiteController', function($http, $state){
    var self = this;
    var rootUrl = 'http://localhost:3000'

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

    // $http.get(`${rootUrl}/users/${self.id}/fav_fonts`)
    // .then(function(response) {
    //   console.log(response);
    //   // self.user = response.data.user;
    // })

    this.addToFavorites = function(font, user_id) {
      // self.user = response.data.user;
    //  var newFont = font.replace
    console.log('user-id', user_id);
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

  }); //controller closure
})()
