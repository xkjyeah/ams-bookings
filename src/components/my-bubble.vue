<template>
  <span class="my-bubble">
    <slot></slot>
  </span>
</template>

<style>
.my-bubble {
  border-radius: 0.5em;
  padding: 0.5em;
  background-color: #DDD;
  margin: 0.25em;
  white-space: nowrap;
  display: inline-block;
}
</style>
