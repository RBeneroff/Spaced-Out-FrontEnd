(function(){
  angular
  .module('FontsApp').constant('jdFontselectConfig', {
    googleApiKey: 'AIzaSyDsXH0e36tnmTKXR3zbLOwM01iztXu28iE'
  })
  .controller('SiteController', function($http, $state, Flash){
    var self = this;
    // var rootUrl = 'http://localhost:3000'
    var rootUrl = 'https://spaced-out-backend.herokuapp.com'

    this.signup = function(user) {
      console.log(user);
      self.signed = user;
      return $http({
        url: `${rootUrl}/users`,
        method: 'POST',
        data: {user: user}
      })
      .then(function(response) {
        console.log(response);
        if (response.data.status === 200) {
          console.log('success');
          self.success = true;
          self.login(self.signed);
        } else {
          console.log(response)
          if (response.data.user.email_address) {
          failAlert('Registration failed. Email ' + response.data.user.email_address[0]);
        } else if (response.data.user.username) {
          failAlert('Registration failed. Username '+ response.data.user.username[0]);
        }
        }
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
        if (response.data.status == 401){
          failAlert('Unauthorized! Check your username and password!')
          self.user.password = '';
        }
        console.log(response);
        passAlert('<strong>Success!</strong> Hi there, ' + response.data.user.username + '.')
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
        if (response.data.status === 200) {
        self.fonts.push(fontObj);
        }
      })
      .catch(function(err) {
        console.log(err);
      })
    }

    this.deleteFavorite = function(user_id, fav_font_id, index) {
      console.log('user: ', user_id, 'font: ', fav_font_id);
      console.log('index>>', index);
      self.fonts.splice(index, 1);
      return $http({
        url: `${rootUrl}/users/${user_id}/fav_fonts/${fav_font_id}`,
        method: 'DELETE',
      })
      .then(function(response) {
        console.log(response);
        return response;
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
        infoAlert('Password updated!')
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
      self.repeatText = "";
      localStorage.removeItem('token');
      warnAlert('You have been logged out.');
      $state.go('home', {url: '/'});
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
