<template>
  <dialog-base @close="$emit('close')" action-label="Send Message">
    <div slot="title">
      SMS Log
    </div>
    <div slot="footer">
      <button @click="$emit('close')" class="btn btn-default">
        Close
      </button>
    </div>
    <div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th style="width: 25%">Date</th>
            <th style="width: 15%">Recipient</th>
            <th style="width: 60%">Message</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in messages">
            <td>
              {{filters.formatTime(message.timestamp)}}
            </td>
            <td>
              <template v-for="tel in message.to">
                {{revLookup(tel)}}<br/>
              </template>
            </td>
            <td>
              {{message.body}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </dialog-base>
</template>
<style>
	.my-modal .modal-body textarea {
		height: 40vh;
	}
</style>
<script>
import {driversCache, default as drivers} from '../queries/drivers';
import * as filters from '../utils/filters';

export default {
	props:['booking'],
  components: {
    RecipientSelect: require('./recipient-select.vue'),
    MyBubble: require('./my-bubble.vue'),
    DialogBase: require('./dialog-base.vue')
  },
  computed: {
    messages() {
      return _(this.booking.messages)
        .values()
        .orderBy('timestamp', 'desc')
        .value()
    }
  },
  data() {
    return {
      drivers: driversCache(),
      filters
    }
  },
  methods: {
    revLookup(tel) {
      let match = this.drivers.find(x => x.telephone === tel);
      return match ? match.name : tel;
    },
  },
  created() {
    drivers.on('value', ds => this.drivers = ds);
  },
}
</script>
