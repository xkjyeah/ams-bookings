import * as firebase from 'firebase';
import _ from 'lodash';
import Vue from 'vue/dist/vue';
import Dialog from './components/dialogue.vue';
import Calendar from './components/calendar.vue';
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
  Vue.component('replyDialogue', Dialog);
  Vue.component('datePicker', Calendar);

  _.forEach(filters, (f, name) => Vue.filter(name, f))

  var app = new Vue({
    el: '#root',
    data: {
      user: null,
      bookings: [],
      currentBooking: null,
      replyDialogueOpen: false,
      orderBy: 'pickupTime',
      order: 'asc',
      now: null,

      dateRangeType: 'future',
      dateRange: null,
    },
    computed: {
      sortedBookings() {
        return _.orderBy(this.bookings, this.orderBy, [this.order])
      }
    },
    watch: {
      dateRangeType() {
        this.reload();
      }
    },
    methods: {
      updateMonth() {
        this.now = new Date().setHours(0,0,0,0);
      },
      reload(){
        var query = firebase.database().ref('bookings')
          .orderByChild(this.orderBy)

        if (this.dateRangeType === 'future') {
          query = query.startAt(
            moment(this.now).startOf('day').toISOString()
          )
        } else {
          if (!this.dateRange || this.dateRange.length !== 2) {
            return;
          }
          var min = _.minBy(this.dateRange, x => x.valueOf()).toISOString()
          var max = _.maxBy(this.dateRange, x => x.valueOf()).clone().add(1, 'day').toISOString()

          query = query.startAt(min).endAt(max)
        }

        // FIXME: set the date range
        query.once('value')
        .then(bookings => {
          this.bookings = _(bookings.val())
            .toPairs()
            .map(([key, booking]) => {
              booking.id=key;
              booking.cancelled = booking.cancelled || false;
              return booking
            })
            .value();
        })
      },
      login(){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider)
      },
      logout() {
        firebase.auth().signOut();
      },
      cancel($event, booking) {
        booking.cancelled = $event.target.checked;
        firebase.database()
        .ref(`bookings/${booking.id}/cancelled`)
        .set(booking.cancelled)
      },
      reply(booking){
        this.currentBooking=booking;
        this.replyDialogueOpen=true;
      },
      toggleOrder(column) {
        if (this.orderBy === column) {
          this.order = (this.order === 'desc') ?
            'asc' : 'desc';
        } else {
          this.orderBy = column;
        }
      },
      formatTimePast: filters.formatTimePast,
      formatTime: filters.formatTime,
      updateDateRange(range) {
        this.dateRange = range;
        this.reload();
      }
    },
    created() {
      this.updateMonth();
      firebase.auth().onAuthStateChanged((user) => {
        this.user = user;
        this.reload();
      });
    },
  })
})
