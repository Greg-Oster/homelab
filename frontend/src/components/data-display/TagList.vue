<script setup lang="ts">
import TagListItem from "./TagListItem.vue";

defineProps({
  list: {
    type: Array<any>,
    required: true,
  },
})

const emit = defineEmits<{
  delete: [name: string]
}>()


const handleDelete = (name: string) => {
  emit('delete', name)
}
</script>

<template>
  <div class="tag-list">
    <div class="tag-list__list glass-container">
      <slot></slot>
      <TagListItem v-for="item in list.reverse()" :name="item.name" :count="item.count" :key="item" @delete="handleDelete"/>
    </div>
  </div>

</template>

<style scoped lang="scss">
  .tag-list {
    display: flex;
    flex-direction: column;
    min-height: 0;
    gap: 10px;

    &__list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: scroll;
      padding: 5px;
    }
  }
</style>