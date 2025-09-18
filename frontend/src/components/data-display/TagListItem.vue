<script setup lang="ts">

  const props = defineProps({
    name: { type:String, required: true},
  })

  const emit = defineEmits<{
    delete: [name: string]
  }>()

  const handleDelete = () => {
    console.log('delete')
    emit('delete', props.name)
  }
</script>

<template>
  <div class="tag-list-item">
    <span class="tag-list-item__name">{{ name }}</span>
    <span class="tag-list-item__action" @click="handleDelete">X</span>
  </div>
</template>

<style scoped lang="scss">
  .tag-list-item {
    display: flex;
    justify-content: space-between;
  }
</style>