<template>
  <select @input="$emit('input', $event.target.value)" :value="value">
    <option disabled value="" selected>Select a recipient...</option>
    <option disabled value="">-------------</option>
    <option :value="recipient.telephone" v-for="recipient of recipients">{{recipient.name}}</option>
  </select>
</template>

<script>
import {driversCache, default as drivers} from '../queries/drivers';

export default {
  props: ['value'],
  data() {
    return {
      recipients: driversCache()
    }
  },
  created() {
    drivers.on('value', drivers => this.recipients = drivers)
  }
}
</script>
