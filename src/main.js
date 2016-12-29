
import * as firebase from 'firebase';
import _ from 'lodash';
import Vue from 'vue/dist/vue';
import Dialog from './dialogue.vue';

 firebase.initializeApp({
    apiKey: "AIzaSyDsiq9OIO0yTi2cgLbAjiTtWdKmo7HNBPE",
    authDomain: "ams-bookings.firebaseapp.com",
    databaseURL: "https://ams-bookings.firebaseio.com",
    storageBucket: "ams-bookings.appspot.com",
    messagingSenderId: "245600362111"
});

document.addEventListener('DOMContentLoaded', () => {
	Vue.component('replyDialogue', Dialog);
	var app = new Vue({
		el: '#root',
		data: {
			user: null,
			bookings: [],
			currentBooking: null,
			replyDialogueOpen: false
				
		},
		created(){
			this.reload();
		},
		methods:{
			reload(){
				firebase.database().ref('bookings').once('value')
				.then(bookings => {
					this.bookings = _(bookings.val())
						.toPairs()
						.map(([key, booking]) => {
							booking.id=key;
							booking.noted=booking.noted || false;
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
			noted($event, booking) {
				booking.noted = $event.target.checked;
				firebase.database()
				.ref(`bookings/${booking.id}/noted`)
				.set(booking.noted)
			},
			reply(booking){
				this.currentBooking=booking;
				this.replyDialogueOpen=true;
			}
			
		},
		created() {
			firebase.auth().onAuthStateChanged((user) => {
				this.user = user; 
				this.reload();
			});
		}
	})
})

