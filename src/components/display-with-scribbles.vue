<template>
  <div class="display-with-scribbles">
    <slot></slot>

    <div v-if="scribble">
      <input :type="type" v-if="type != 'textarea'"
        :value="value"
        @input="input"
        />
      <textarea v-else
        :value="value"
        @input="input">
      </textarea>
    </div>
  </div>
</template>
<script>

export default {
  props: ['type', 'scribble', 'field'],
  data() {
    return {
      value: null
    }
  },
  created() {
    this.$watch(() => this.scribble && this.scribble[this.field], (v) => {
      this.value = v;
    }, {immediate: true});
  },
  methods: {
    input(e) {
      this.changed(e);
      this.$emit('input', e.target.value)
    },
    changed(e) {
      this.$emit('changed', {
        field: this.field,
        value: e.target.value
      })
    },
  }
}

</script>
<style>
.display-with-scribbles textarea,
.display-with-scribbles input[type="text"] {
  background: transparent;
  border: solid 1px #ddd;
  width: 100%;
}
</style>
