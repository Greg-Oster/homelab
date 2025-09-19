<script setup lang="ts">

  const props = defineProps({
    name: { type:String, required: true},
    count: { type: Number, required: true },
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
    <span class="tag-list-item__count">-{{ count }}</span>
  </div>
</template>

<style scoped lang="scss">
  .tag-list-item {
    display: flex;
    justify-content: space-between;
    padding: 6px;
    transition: background .1s;
    border-radius: 15px;
    position: relative;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);

      .tag-list-item__action {
        opacity: 1;
      }

      .tag-list-item__count {
        right: 35px;
      }
    }

    &__action {
      transition: opacity .1s;
      padding: 2px;
      opacity: 0;

      &:hover {
        cursor: pointer;
      }
    }

    &__count {
      transition: 0.1s;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(159, 10, 10, 0.69);
      font-weight: 600;
      font-size: 14px;
    }
  }
</style>