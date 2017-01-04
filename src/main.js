import * as firebase from 'firebase';
import _ from 'lodash';
import Vue from 'vue/dist/vue';
import VueResource from 'vue-resource';
import App from './components/app.vue';
import * as filters from './utils/filters'
import moment from 'moment';
import assert from 'assert';

 firebase.initializeApp({
    apiKey: "AIzaSyDsiq9OIO0yTi2cgLbAjiTtWdKmo7HNBPE",
    authDomain: "ams-bookings.firebaseapp.com",
    databaseURL: "https://ams-bookings.firebaseio.com",
    storageBucket: "ams-bookings.appspot.com",
    messagingSenderId: "245600362111"
});

window.gapiPromise = new Promise((resolve) => {
  window.checkAuth = function() {
    var clientId = '245600362111-fc5u997g7sfch54jclqtmo6i8f2bm0ok.apps.googleusercontent.com';
    var apiKey = 'AIzaSyDsiq9OIO0yTi2cgLbAjiTtWdKmo7HNBPE';
    var scope = 'https://www.googleapis.com/auth/calendar email';

    var gCredentials = window.localStorage['g-credential'];

    gapi.client.init({
      apiKey,
      clientId, scope
    })
    // .then(() => new Promise(resolve =>
    //   gapi.load('auth2', resolve)
    // ))
    .then(() =>{
      // gapi.auth2.init({
      //   client_id: clientId, scope,
      //   cookie_policy: 'single_host_origin'
      // })
      // .then(() => {

      // })

      gapi.client.load('calendar', 'v3', () => {
        resolve(gapi.auth2.getAuthInstance().isSignedIn.get())
      });
    })
  }
})

document.addEventListener('DOMContentLoaded', () => {
  Vue.use(VueResource);
  Vue.component('myApp', App);

  _.forEach(filters, (f, name) => Vue.filter(name, f))

  var app = new Vue({
    el: '#root',
    template: '<my-app />',
  })
})
