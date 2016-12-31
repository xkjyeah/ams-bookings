<template>
  <div>
    <div v-if="!user">
      <button @click="login">
        Login
      </button>
    </div>
    <div v-else>
      Logged in as {{user.email}}
      <button @click="logout">
        Logout
      </button>
    </div>
    <div class="r">
      <div class="c">
        <h2>Date Range</h2>
        <button class="btn btn-primary date-range-type" :class="{active: filterBy == 'pickupTime'}"
          @click="filterBy = 'pickupTime'">
          Pick-up Time
        </button>
        <button class="btn btn-primary date-range-type" :class="{active: filterBy == 'createdAt'}"
          @click="filterBy = 'createdAt'">
          Submission Time
        </button>
        <br/><Br/>
        <button class="btn btn-primary date-range-type" :class="{active: dateRangeType == 'future'}"
          @click="dateRangeType = 'future'">
          Today + Future
        </button>
        <button class="btn btn-primary date-range-type" :class="{active: dateRangeType == 'custom'}"
          @click="dateRangeType = 'custom'">
          Custom
        </button>
      </div>
      <div class="c">
        <date-picker :month="today" :today="today" :disabled="dateRangeType !== 'custom'"
          @daterange_changed="updateDateRange"></date-picker>
      </div>
    </div>

    <table class="table table-striped-custom">
      <thead>
        <tr>
          <th></th>
          <th class="sortable" :class="{active: orderBy == 'createdAt'}" @click="toggleOrder('createdAt')">Created At</th>
          <th class="sortable" :class="{active: orderBy == 'pickupTime'}" @click="toggleOrder('pickupTime')">Pickup Time</th>
          <th>Patient Details</th>

          <th>Pickup Location</th>
          <th>Drop-off Location</th>
          <th>One/Two-Way</th>
          <th>Wheelchair Stretcher</th>
          <th>Oxygen Rate</th>
          <th>Patient Weight</th>

          <th>Contact Person &amp; Details </th>

          <th>Precautions</th>

          <th>Accompanying Passengers</th>
          <th>Appointment Time</th>
          <th>Cancel</th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        <template v-for="(booking, index) in sortedBookings">
          <tr :class="{cancelled: booking.cancelled, read: booking.read, 'is-odd': (index % 2)}"
              :key="booking.id + '-first'">
            <td @click="read(booking, !booking.read)" class="read-cell">
              {{booking.read ? '\u00a0' : '\u2709'}}
            </td>
            <td :title="formatTime(booking.createdAt)">
              {{formatTimePast(booking.createdAt, now)}} ago
            </td>
            <td>
                {{filters.formatTime(booking.pickupTime)}}
            </td>
            <td>
              {{booking.patientName}},<br>
              {{booking.patientGender}}
              ({{booking.patientNric}})
            </td>

            <td>
              {{booking.pickupLocation}}
            </td>
            <td>
              {{booking.dropoffLocation}}
            </td>
            <td>
              {{booking.twoWay}}
            </td>
            <td>
              {{booking.wheelchairStretcher}}
            </td>
            <td>
              {{booking.oxygenRate}}
            </td>
            <td>
              {{booking.patientWeight}}
            </td>

            <td>
              {{booking.contactPerson}}
              {{booking.contactPhone}}
              {{booking.contactEmail}}
            </td>

            <td>
              {{booking.precautions}}
            </td>

            <td>
              {{booking.accompanyingPassengers}}
            </td>
            <td>
              {{booking.appointmentTime}}
            </td>

            <td>
              <label>
                <input type="checkbox"
                  @change="cancel(booking, $event.target.checked)"
                  v-model="booking.cancelled">Cancelled
                {{booking.cancelled}}
              </label>
              <a v-if="booking.googleCalendarId"
                  @click="goToCalendar(booking)">
                <img src="static/img/calendar-icon.png" width="16" height="16"/>
              </a>
            </td>
            <td>
              <button @click="startScribbling(booking)"
                  class="btn btn-default">
                <i class="glyphicon glyphicon-pencil"></i>
              </button>
            </td>
          </tr>

          <tr :class="{'is-odd': (index % 2)}"
              v-if="booking.scribbles"
              :key="booking.id + '-second'">>
            <td>
            </td>
            <td>
            </td>
            <td colspan="2">
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="pickupTime">
              </display-with-scribbles>
            </td>
            <!-- <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="patientName">
              </display-with-scribbles>
            </td> -->

            <td colspan="2">
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="pickupLocation">
              </display-with-scribbles>
            </td>
            <!-- <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="dropoffLocation">
              </display-with-scribbles>
            </td> -->
            <td colspan="4">
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="twoWay">
              </display-with-scribbles>
            </td>
            <!-- <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="wheelchairStretcher">
              </display-with-scribbles>
            </td>
            <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="oxygenRate">
              </display-with-scribbles>
            </td>
            <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="patientWeight">
              </display-with-scribbles>
            </td> -->

            <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="contactPerson">
              </display-with-scribbles>
            </td>

            <td colspan="3">
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="precautions">
              </display-with-scribbles>
            </td>

            <!-- <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="accompanyingPassengers">
              </display-with-scribbles>
            </td>
            <td>
              <display-with-scribbles
                  type="textarea"
                  :scribble="booking.scribbles"
                  @changed="updateScribble(booking, $event.field, $event.value)"
                  field="appointmentTime">
              </display-with-scribbles>
            </td> -->
            <td>
            </td>
            <td>
              <button @click="stopScribbling(booking)"
                  class="btn btn-danger">
                Delete scribbles
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <reply-dialogue :open="replyDialogueOpen"
      :booking="currentBooking"
      @close="replyDialogueOpen=false"></reply-dialogue>
  </div>
</template>
<script>
import moment from 'moment';
import _ from 'lodash';
import * as firebase from 'firebase';
import DisplayWithScribbles from './display-with-scribbles.vue';
import ReplyDialog from './dialogue.vue';
import Calendar from './calendar.vue';
import * as filters from '../utils/filters'
import assert from 'assert';

export default {
  components: {
    DisplayWithScribbles,
    DatePicker: Calendar,
    ReplyDialogue: ReplyDialog
  },
  data() {
    return {
      user: null,
      credential: null,
      query: null,

      bookings: [],
      currentBooking: null,
      replyDialogueOpen: false,
      filterBy: 'pickupTime',
      orderBy: 'pickupTime',
      order: 'asc',
      now: null,
      today: null,

      filters: {
        ...filters
      }, /* Convenience methods */

      dateRangeType: 'future',
      dateRange: null,
    }
  },
  computed: {
    sortedBookings() {
      return _.orderBy(this.bookings, this.orderBy, [this.order])
    }
  },
  watch: {
    dateRangeType() {
      this.reload();
    },
    filterBy() {
      this.reload();
    },
    'credential.accessToken'(at) {
      gapiPromise.then(() => gapi.auth.setToken({access_token: at}))
    },
    query(newValue, oldValue) {
      if (oldValue) oldValue.off();

      // FIXME: set the date range
      newValue.on('value', (bookings) => {
        this.bookings = _(bookings.val())
          .toPairs()
          .map(([key, booking]) => {
            booking.id=key;
            booking.read = booking.read || false;
            booking.cancelled = booking.cancelled || false;
            booking.scribbles = booking.scribbles || null;
            return booking
          })
          .value();
      })
    }
  },
  methods: {
    updateMonth() {
      this.today = new Date().setHours(0,0,0,0);
      this.now = Date.now();
    },
    reload(){
      var query = firebase.database().ref('bookings')
        .orderByChild(this.filterBy)

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

      // Handover the new query to the watcher
      this.query = query;
    },
    login(){
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      firebase.auth().signInWithRedirect(provider)
    },
    logout() {
      firebase.auth().signOut();
    },
    read(booking, result) {
      booking.read = result;

      /* update firebase */
      firebase.database()
      .ref(`bookings/${booking.id}/read`)
      .set(booking.read)
    },
    cancel(booking, result) {
      console.log(result);
      booking.cancelled = result;

      /* update firebase */
      firebase.database()
      .ref(`bookings/${booking.id}/cancelled`)
      .set(booking.cancelled)

      /* update google calendar */
      if (booking.googleCalendarId) {
        gapi.client.calendar.events.patch({
          calendarId: 'primary',
          eventId: booking.googleCalendarId
        }, {
          status: booking.cancelled ? 'cancelled' : 'confirmed'
        })
        .then(response => {
          assert(response.status === 200)
          return JSON.parse(response.body)
        })
      }
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
    },
    startScribbling(booking) {
      booking.scribbles = booking.scribbles || {};
    },
    stopScribbling(booking) {
      if (_.values(booking.scribbles).every(x => !x) ||
          confirm("You have data in your scribbles! Are you sure you want to delete them?")) {
        booking.scribbles = null;

        this.syncTasks = this.syncTasks || {}
        this.syncTasks[booking.id] = booking;
        this.syncScribbles();
      }
    },
    updateScribble(booking, field, value) {
      booking.scribbles[field] = value;

      // Sync tasks ... :(
      this.syncTasks = this.syncTasks || {}
      this.syncTasks[booking.id] = booking;
      this.syncScribbles();
    },
    syncScribbles: _.throttle(function () {
      /* Sync the scribbles with firebase */
      if (!this.syncTasks) {
        return;
      }
      _.forEach(this.syncTasks, (task, id) => {
        firebase.database()
        .ref(`bookings/${id}/scribbles`)
        .set(task.scribbles)
      })

      this.syncTasks = {}
    }, 2000, {trailing: true, leading: false}),
    goToCalendar(booking) {
      gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: booking.googleCalendarId
      })
      .then(response => {
        assert(response.status === 200)
        return JSON.parse(response.body)
      })
      .then(response => {
        console.log(response);
        //window.location.href = response.htmlLink;
      })
    }
  },
  created() {
    this.updateMonth();
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      this.reload();
    });

    if (window.localStorage['g-credential']) {
      try {
        this.credential = JSON.parse(window.localStorage['g-credential'])
      } catch (err) {}
    }

    firebase.auth().getRedirectResult().then((result) => {
      if (result.credential) {
        this.credential = result.credential;
        window.localStorage['g-credential'] = JSON.stringify(this.credential);
      }
    })
  },
}
</script>

<style lang="scss">
.table.table-striped-custom thead tr {
  background-color: rgb(77, 208, 225);
  td {
    color: black;
  }
  th.sortable:hover {
    background-color: #DDD;
  }
}
.table.table-striped-custom tbody {
  tr.is-odd {
    background-color: rgb(224, 247, 250);
  }
  tr:not(.read) td {
    font-weight: bold;
    font-style: italic;
  }
  tr {
    td {
      color: black;
    }

    &.cancelled {
      td {
        text-decoration: line-through;
        color: #888;
      }
    }
  }
  td.read-cell:hover {
    background-color: #DDD;
    cursor: pointer;
  }
}

.r {
  flex-direction: row;
  display: inline-flex;
  .c {
    flex: 0 0 auto;
  }
}
.date-range-type {
  width: 10em;
}
</style>
