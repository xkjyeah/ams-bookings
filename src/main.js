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
    assert(gapi)
    gapi.client.load('calendar', 'v3', () => resolve(gapi));
  }
  if (typeof gapi !== 'undefined') {
    gapi.client.load('calendar', 'v3', () => resolve(gapi));
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
