<template>
  <dialog-base @close="$emit('close')" action-label="Send Message" @action="sendSMS">
    <div slot="title">
      Send SMS
    </div>
    <div>
      <label>
        Send to:
        <my-bubble v-for="(recipient, index) in recipients" :key="recipient">
          <recipient-select :value="recipient" @input="recipients[index] = $event"></recipient-select>
          <button type="button" class="btn btn-link btn-xs" @click="recipients.splice(index, 1)">
            &times;
          </button>
        </my-bubble>
        <recipient-select :key="recipients.length" value="" @input="newRecipient($event)"></recipient-select>
      </label>
      <textarea class="form-control" v-model="reply"></textarea>
      {{reply.length}}
    </div>
  </dialog-base>
</template>
<style>
	.my-modal .modal-body textarea {
		height: 40vh;
	}
</style>
<script>
import axios from 'axios';

export default {
	props:['open', 'booking'],
  components: {
    RecipientSelect: require('./recipient-select.vue'),
    MyBubble: require('./my-bubble.vue'),
    DialogBase: require('./dialog-base.vue')
  },
	data() {
		return {
			reply: '',
      recipients: [],
		}
	},
  created() {
    let booking = this.booking;

    if (!booking) return;

    this.reply = [
`${booking.pickupTime.substr(0, 16)}`,
`${booking.pickupLocation} to ${booking.dropoffLocation}`,
`${booking.twoWay !== '-' ? booking.twoWay : '1-way' }`,
`Pt ${booking.patientName}`,
booking.wheelchairStretcher,
booking.oxygenRate && (+booking.oxygenRate) && `O2@${booking.oxygenRate}L/m`,
`Prec: ${booking.precautions}`,
`Acc by ${booking.accompanyingPassengers}`,
`Contact: ${booking.contactPhone}`
    ].filter(x => x)
      .join('\n')
      .trim()
      .replace(/orange valley nursing home/ig, 'OVNH') // some "intelligent" substitutions :)
  },
	methods: {
    newRecipient(who) {
      if (this.recipients.indexOf(who) == -1) {
        this.recipients.push(who)
      }
    },
    sendSMS() {
      var resp = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();

      axios.post('https://enquiry.ambulanceservice.com.sg/sms', {
        id_token: resp.id_token,
        body: this.reply.trim(),
        to: this.recipients,
      })
      .then(() => {
        this.$emit('close')
        this.$emit('sent-sms', {
          booking: this.booking,
          body: this.reply.trim(),
          to: this.recipients,
          timestamp: new Date().toISOString()
        })
      })
    }
	}
}
</script>
