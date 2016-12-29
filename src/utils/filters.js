import moment from 'moment';

export function formatTime(t) {
    return moment(t).utcOffset(480).format('DD MMM YYYY, HH:mm')
}

export function formatTimePast(t, now) {
  return moment.duration(moment(now).valueOf() - moment(t).valueOf(), 'ms')
    .humanize()
}
