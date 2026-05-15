<template>
  <AntSelect>
    <slot></slot>
    <template #suffixIcon>
      <IconDown />
    </template>
  </AntSelect>
</template>

<script setup>
import { Select as AntSelect } from 'ant-design-vue'
</script>