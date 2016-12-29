<template>
<form class="my-modal" tabindex="-1" role="dialog" v-show="open">
{{open}}
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" aria-label="Close" 
			@click="closeDialogue"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Send Reply</h4>
      </div>
      <div class="modal-body">
        <textarea class="form-control" v-model="reply"></textarea>
		
		
      </div>
      <div class="modal-footer">
        <button type="button" @click="closeDialogue"  class="btn btn-default">Close</button>
        <button type="button" @click="sendMessage" class="btn btn-primary">Send Message</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</form><!-- /.modal -->
</template>
<style>
	.my-modal {
		position: fixed;
		top:0;
		left:0;
		bottom:0;
		right:0;
		background-color: rgba(0,0,0,0.5);
	}
	.my-modal .modal-body textarea {
		height: 40vh;
	}
</style>
<script>
export default {
	props:['open', 'booking'],
	data() {
		return {
			reply: '',
		}
	}, 
	methods:{
		closeDialogue(){
			this.$emit('close');
		},
		sendMessage(){
			
		},
	}
}
</script>
