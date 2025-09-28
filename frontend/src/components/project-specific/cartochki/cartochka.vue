<script setup lang="ts">
defineProps({
  isEditing: {
    type: Boolean
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    default: '#05050b'
  },
  bgColor: {
    type: String,
    default: 'red',
  },
  isFlipped: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'update:subtitle', value: string): void
  (e: 'update:description', value: string): void
  (e: 'save'): void
}>()

function updateTitle(e: Event) {
  emit('update:title', (e.target as HTMLInputElement).value)
}

function updateSubtitle(e: Event) {
  emit('update:subtitle', (e.target as HTMLInputElement).value)
}

function updateDescription(e: Event) {
  emit('update:description', (e.target as HTMLInputElement).value)
}

function handleBlur() {
  emit('save')
}
</script>

<template>
  <div class="cartochka" :style="{color: color}" :class="{'flipped': isFlipped }">
    <div class="cartochka__inner">
      <div class="cartochka__front">
        <div class="cartochka__arc" :style="{'background-color': bgColor}"></div>

        <div class="cartochka__head">
          <h1 v-if="!isEditing" class="cartochka__title" >{{ title }}</h1>
          <input
              v-if="isEditing"
              class="cartochka__title edit-input"
              type="text"
              name="title"
              :value="title"
              @input="updateTitle"
              @blur="handleBlur"
          >
          <h2 v-if="!isEditing" class="cartochka__subtitle">{{ subtitle }}</h2>
          <input
              v-if="isEditing"
              class="cartochka__subtitle edit-input"
              type="text"
              name="subtitle"
              :value="subtitle"
              @input="updateSubtitle"
              @blur="handleBlur"
          >
        </div>

        <div class="cartochka__footer">
          <div class="cartochka__period">
            <span class="cartochka__period_info">GEM</span>
            <span class="cartochka__period_stripes"></span>
            <span class="cartochka__period_info">{{ date }}</span>
          </div>
          <div class="cartochka__sign">uglich<br> homelab</div>
        </div>
      </div>
      <div class="cartochka__back">
        <p v-if="!isEditing" class="cartochka__back-text">{{ description }}</p>
        <textarea
            v-if="isEditing"
            class="cartochka__back-text edit-input"
            name="subtitle"
            :value="description"
            @input="updateDescription"
            @blur="handleBlur"
        />
      </div>
      <div class="cartochka__side-left"></div>
      <div class="cartochka__side-right"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .cartochka {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    border-radius: 6px;
    min-width: 270px;
    max-width: 270px;
    min-height: 410px;
    max-height: 410px;
    height: 410px;
    transition: opacity .3s, transform .3s;
    cursor: default;
    user-select: none;
    touch-action: none;
    perspective: 1100px;

    @media screen and (max-width: 400px) {
      min-height: 500px;
      max-height: 470px;
      min-width: 80%;
      max-width: 80%;
    }

    &.flipped {
      .cartochka__inner {
        transform: rotateY(180deg);
      }
    }

    &__inner {
      width: 100%;
      height: 100%;
      position: relative;
      transition: transform 0.6s;
      transform-style: preserve-3d;
      box-shadow: 0px 4px 15px 15px #0000001a;
    }


    .cartochka__front, .cartochka__back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      background-color: #f6ece0;
      padding: 18px;
      border-radius: 6px;
    }

    &__back {
      transform: rotateY(180deg);
    }

    &__back-text {
      text-align: start;
      margin: 0;
      font-family: "Roboto Mono", monospace;
      font-size: 16px;
      line-height: 16px;
      border: 1px solid transparent;
    }

    .cartochka__side-right, .cartochka__side-left {
      position: absolute;
      top: 0;
      width: 6px;
      height: 100%;
      background: #f6ece0;
      border-radius: 6px;
      transform-origin: center;
      transition: background 0.3s;
    }

    &__side-left {
      left: 0;
      transform: rotateY(90deg);
    }

    &__side-right {
      right: 0;
      transform: rotateY(90deg);
    }

    &__arc {
      height: 205px;
      border-top-left-radius: 50%;
      border-top-right-radius: 50%;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;

      @media screen and (max-width: 400px) {
        height: 245px;
      }
    }

    &__head {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__title {
      text-align: start;
      font-size: 24px;
      line-height: 28px;
      margin: 0;
      font-weight: bold;
      font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
      border: 1px solid transparent;
    }

    &__subtitle {
      text-align: start;
      margin: 0;
      font-family: "Roboto Mono", monospace;
      font-size: 13px;
      line-height: 15px;
      text-transform: uppercase;
      border: 1px solid transparent;

    }

    &__footer {
      margin-top: auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }

    &__period {
      display: flex;
      margin: 0;
      line-height: 11px;
      font-weight: 500;
      font-size: 11px;
      border-style: solid;
      border-width: 1px;
      border-radius: 4px;

      &_stripes {
        width: 20px;
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        background: repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 3px);
      }

      &_info {
        padding: 3px;
      }
    }

    &__sign {
      margin: 0;
      font-family: "EB Garamond", serif;
      text-transform: uppercase;
      line-height: 0.96;
      font-size: 12px;
      letter-spacing: -0.2px;
      text-align: right;
    }
  }

  .edit-input {
    color: inherit;
    background: transparent;
    padding: 0;
    border: 1px dotted;

    &:focus-visible {
      outline: none;
    }
  }
</style>