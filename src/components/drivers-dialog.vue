<template>
  <dialog-base @close="$emit('close')">
    <div slot="title">
      Manage Phone Numbers
    </div>
    <div slot="footer">
      <button type="button" @click="$emit('close')"  class="btn btn-default">Close</button>
    </div>
    <div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Driver</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="driver in combinedDrivers" :key="driver.id"
            :class="{'is-invalid': !filters.isValid(driver)}">
            <td><input type="text" v-model="driver.name"
              @blur="trySave(driver)" /></td>
            <td><input type="tel" v-model="driver.telephone"
              @blur="trySave(driver)" /></td>
            <td>
              <button type="button" class="btn btn-default" @click="deleteDriver(driver)">
                <i class="glyphicon glyphicon-minus"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">
              <button type="button" class="btn btn-default" @click="addDriver">
                <i class="glyphicon glyphicon-plus"></i>
              </button>
            </td>
        </tfoot>
      </table>
    </div>
  </dialog-base>
</template>
<style lang="scss">
.is-invalid {
  td {
    background-color: #FDD;
  }
}
</style>
<script>
import {driversCache, default as drivers} from '../queries/drivers';
import {query as driversQuery} from '../queries/drivers';
import _ from 'lodash';

export default {
	props: ['open', 'booking'],
  components: {
    DialogBase: require('./dialog-base.vue')
  },
	data() {
		return {
      rawDrivers: driversCache(),
      draftDrivers: [],
      query: '',
      filters: {
        isValid(driver) {
          // Hard code Singapore number first
          return driver.name &&
            /^\+65[0-9]{8}$/.test(driver.telephone);
        },
        fixTelephone(driver) {
          if (/^[0-9]{8}$/.test(driver.telephone)) {
            driver.telephone='+65' + driver.telephone;
          }
        }
      }
		}
	},
	methods:{
    deleteDriver(driver) {
      driversQuery().child(driver.id).remove()
    },
    addDriver(driver) {
      this.draftDrivers.push({name: '', telephone: ''});
    },
    trySave(driver) {
      this.filters.fixTelephone(driver)
      if (this.filters.isValid(driver)) {
        if (!driver.id) {
          driver.id = driversQuery().push().key
        }
        driversQuery().child(driver.id).update(driver)
      }
    }
	},
  created() {
    drivers.on('value', drivers => this.rawDrivers = drivers);
  },
  computed: {
    combinedDrivers() {
      let draftedDriverIds = _.keyBy(this.draftDrivers.filter(d => d.id), 'id')
      let driversById = _.keyBy(this.rawDrivers, 'id')

      let drivers = this.rawDrivers.filter(d => !draftedDriverIds[d.id])
      let draftDrivers = this.draftDrivers.map(d => d.id ? driversById[d.id] : d)

      return drivers.concat(draftDrivers);
    }
  }
}
</script>
