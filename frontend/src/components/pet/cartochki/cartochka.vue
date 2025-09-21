<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
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
  }
})
</script>

<template>
  <div class="cartochka" :style="{color: color}">
    <div class="cartochka__arc" :style="{'background-color': bgColor}"></div>

    <div class="cartochka__head">
      <h1 class="cartochka__title">{{ title }}</h1>
      <h2 class="cartochka__subtitle">{{ subtitle }}</h2>
    </div>

    <div class="cartochka__footer">
      <div class="cartochka__period">
        <span class="cartochka__period_info">TCH</span>
        <span class="cartochka__period_stripes"></span>
        <span class="cartochka__period_info">{{ startDate }} - {{ endDate }}</span>
      </div>
      <div class="cartochka__sign">uglich<br> homelab</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .cartochka {
    display: flex;
    flex-direction: column;
    background-color: #ffeacd;
    padding: 18px;
    border-radius: 6px;
    min-width: 270px;
    max-width: 270px;
    min-height: 410px;
    max-height: 410px;
    box-shadow: 0px 4px 15px 15px #0000001a;
    transition: .3s;

    &__arc {
      height: 215px;
      border-top-left-radius: 50%;
      border-top-right-radius: 50%;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      background: red;
    }

    &__head {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__title {
      text-align: start;
      font-size: 24px;
      line-height: 24px;
      margin: 0;
    }

    &__subtitle {
      text-align: start;
      margin: 0;
      font-family: "Roboto Mono", monospace;
      font-size: 13px;
      line-height: 15px;
      text-transform: uppercase;
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
</style>