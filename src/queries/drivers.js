import * as firebase from 'firebase';
import EventEmitter from 'events';
import _ from 'lodash';

var events = new EventEmitter;
var _query;
var _drivers = [];

var query = () => _query;
var driversCache = () => _drivers;

document.addEventListener('DOMContentLoaded', () => {
  _query = firebase.database().ref('drivers');

  _query.on('value', result => {
    events.emit('value', _(result.val())
      .toPairs()
      .map(([k, v]) => {
        return _.assign(
          {id: k},
          v
        )
      })
      .orderBy(['name', 'id'])
      .value()
    )
  });

  events.on('value', ds => _drivers = ds);
});

export default events;
export {query, driversCache};
