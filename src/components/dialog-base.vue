<template>
<div class="my-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <slot name="title"></slot>
        <button type="button" class="close" aria-label="Close" @click="$emit('close')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button type="button" @click="$emit('close')"  class="btn btn-default">Close</button>
          <button type="button" @click="$emit('action')" class="btn btn-primary">{{actionLabel}}</button>
        </slot>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
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
</style>
<script>
export default {
	props:['actionLabel'],
}
</script>
