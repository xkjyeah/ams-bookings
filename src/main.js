import * as firebase from 'firebase';
import _ from 'lodash';
import Vue from 'vue/dist/vue';
import App from './components/app.vue';
import * as filters from './utils/filters'
import moment from 'moment';

 firebase.initializeApp({
    apiKey: "AIzaSyDsiq9OIO0yTi2cgLbAjiTtWdKmo7HNBPE",
    authDomain: "ams-bookings.firebaseapp.com",
    databaseURL: "https://ams-bookings.firebaseio.com",
    storageBucket: "ams-bookings.appspot.com",
    messagingSenderId: "245600362111"
});

document.addEventListener('DOMContentLoaded', () => {
  Vue.component('myApp', App);

  _.forEach(filters, (f, name) => Vue.filter(name, f))

  var app = new Vue({
    el: '#root',
    template: '<my-app />',
  })
})
