<template>
<table class="calendar" :class="{disabled: disabled}">
  <caption>
    <button @click="addMonth(-1)">&lt;</button>
    {{monthMoment.format('MMMM')}}
    <button @click="addMonth(1)">&gt;</button>
  </caption>
  <thead>
    <tr>
      <th v-for="t in 7">{{days[t - 1]}}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="week in weeks">
      <td v-for="day in week.days"
          @click="dateClicked(day)"
          :class="{
            'is-primary': day.isPrimary,
            'is-today': day.isToday,
            'is-selected': day.isSelected
          }">
        <template v-if="day.number">
          {{day.number}}
        </template>
      </td>
    </tr>
  </tbody>
</table>
</template>
<style lang="scss">
.calendar {
  td, th {
    text-align: center;
  }
  caption {
    text-align: center;
  }

  &.disabled {
    opacity: 0.5;
  }
}
.calendar td {
  cursor: pointer;
  width: 2em;

  &:hover {
    background-color: #DDD;
  }

  &.is-primary {
    color: #000;
  }
  &:not(.is-primary) {
    color: #ccc;
  }
  &.is-today {
    border: solid 1px red;
  }
  &.is-selected {
    background-color: #CCC;
  }
}
</style>
<script>
import moment from 'moment';

export default {
  props: ['month', 'today', 'disabled'],
  data() {
    return {
      monthMoment: moment(),
      selectedDays: []
    }
  },
  watch: {
    month() {
      this.monthMoment = moment(this.month)
    },
  },
  computed: {
    todayMoment() {
      return moment(this.today);
    },
    days() {
      return 'M,T,W,T,F,S,S'.split(',')
    },
    startDay() {
      var m = this.monthMoment.clone().startOf('month')

      // sunday is always zero
      var day = (m.day() - 1 + 7) % 7
      m.subtract(day, 'day')

      return m;
    },
    weeks() {
      return _.range(0,5).map(weeknum => ({
        days: _.range(0,7).map(day => {
          var m = this.startDay.clone().add(weeknum * 7 + day, 'day')

          return {
            number: m.date(),
            moment: m,
            isPrimary: m.isSame(this.monthMoment, 'month'),
            isToday: m.isSame(this.todayMoment, 'day'),
            isSelected: this.isSelected(m),
          }
        })
      }))
    }
  },
  methods: {
    isSelected(day) {
      if (!this.selectedDays || !this.selectedDays.length) {
        return false;
      } else if (this.selectedDays.length == 1) {
        return this.selectedDays[0].isSame(day, 'date');
      } else if (this.selectedDays.length == 2) {
        var min = _.minBy(this.selectedDays, x => x.valueOf())
        var max = _.maxBy(this.selectedDays, x => x.valueOf())

        return min.valueOf() <= day.valueOf() &&
          day.valueOf() <= max.valueOf()
      }
    },
    dateClicked(dt) {
      if (this.disabled) return;

      this.selectedDays.push(dt.moment);

      /* Handle the multiple date selection problem */
      if (this.selectedDays.length >= 3) {
        this.selectedDays = this.selectedDays.slice(2, this.selectedDays.length)
      }

      this.$emit('dateClicked', dt);
      this.$emit('daterange_changed', this.selectedDays);
    },
    addMonth(n) {
      if (this.disabled) return;
      this.monthMoment = this.monthMoment.clone().add(n, 'month');
    }
  }
}
</script>
