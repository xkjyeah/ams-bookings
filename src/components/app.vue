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
          <tr :class="{cancelled: booking.cancelled, 'is-odd': (index % 2)}">
            <td :title="formatTime(booking.createdAt)">
              {{formatTimePast(booking.createdAt, now)}} ago
            </td>
            <td>
                {{booking.pickupTime | formatTime}}
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
                  @change="cancel($event,booking)"
                  :checked="booking.cancelled">Cancelled
              </label>
            </td>
            <td>
              <button @click="startScribbling(booking)"
                  class="btn btn-default">
                Scribble
              </button>
            </td>
          </tr>

          <tr :class="{'is-odd': (index % 2)}"
              v-if="booking.scribbles">
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

export default {
  components: {
    DisplayWithScribbles,
    DatePicker: Calendar,
    ReplyDialogue: ReplyDialog
  },
  data() {
    return {
      user: null,
      bookings: [],
      currentBooking: null,
      replyDialogueOpen: false,
      filterBy: 'pickupTime',
      orderBy: 'pickupTime',
      order: 'asc',
      now: null,
      today: null,

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

      // FIXME: set the date range
      query.once('value')
      .then(bookings => {
        this.bookings = _(bookings.val())
          .toPairs()
          .map(([key, booking]) => {
            booking.id=key;
            booking.cancelled = booking.cancelled || false;
            booking.scribbles = booking.scribbles || null;
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
    }, 2000, {trailing: true, leading: false})
  },
  created() {
    this.updateMonth();
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      this.reload();
    });
  },
}
</script>

<style lang="scss">
.table.table-striped-custom thead tr {
  background-color: rgb(77, 208, 225);
  td {
    color: black;
  }
}
.table.table-striped-custom tbody {
  tr.is-odd {
    background-color: rgb(224, 247, 250);
  }
  td {
    color: black;
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
