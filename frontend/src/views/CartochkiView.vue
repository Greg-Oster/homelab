<script setup lang="ts">
import Cartochka from "../components/pet/cartochki/cartochka.vue";
import {computed, ref} from "vue";
import { usePointer } from '@vueuse/core'

const xStart = ref(0);
const { x } = usePointer()
const rIsDragging = ref(false);

const deltaX = computed(() => {
  if (rIsDragging.value) {
    return x.value - xStart.value;
  } else {
    return 0;
  }
})
const cCardDeviation = computed(() => {
  return (270 - Math.abs(deltaX.value)) / 270;
})
const cSwipeProgress = computed(() => {
  if (1 - cCardDeviation.value < 1) {
    return 1 - cCardDeviation.value;
  } else {
    return 1;
  }
})
const cIsSwipedOff = computed(() => {
  return cSwipeProgress.value > 0.6;
})
const cTranslateX = computed(() => {
  if (rIsDragging.value) {
    return `transform: translateX(${deltaX.value}px); transition: 0s;`;
  }
  return ''
})

const cOpacity = computed(() => {
  if (rIsDragging.value) {
    return `opacity: ${cCardDeviation.value};`;
  }

  return ''
})
const cReverseOpacity = computed(() => {
  if (rIsDragging.value) {
    return `opacity: ${1 - cCardDeviation.value}; transition: 0s;`;
  }

  return ''
})
const cScaleNextCard = computed(() => {
  if (rIsDragging.value) {
    return `scale: ${.9 + cSwipeProgress.value / 10};`;
  }

  return ''
})

const cDynamicStyle = computed(() => {
  return cTranslateX.value + cOpacity.value;
})
const cDynamicStyleNext = computed(() => {
  return cReverseOpacity.value + cScaleNextCard.value;
})


const handleMouseDown = () => {
  rIsDragging.value = true;
  xStart.value = x.value;
}
const handleMouseUp = () => {
  GetNextCart()
  rIsDragging.value = false;
}
const GetNextCart = () => {
  if (cIsSwipedOff.value) {
    turnTheWheel()
  } else {
    console.log('do nothing')
  }
}

const turnTheWheel = () => {
  const currentActiveIndex = cartochkiData.value.findIndex(item => item.isTop);
  const deckLength = cartochkiData.value.length;

  const newActiveIndex =
      currentActiveIndex === -1 || currentActiveIndex >= deckLength - 1
          ? 0
          : currentActiveIndex + 1;

  const newNextIndex =
      newActiveIndex + 1 < deckLength ? newActiveIndex + 1 : 0;

  cartochkiData.value = cartochkiData.value.map((item, index) => ({
    ...item,
    isTop: index === newActiveIndex,
    isNext: index === newNextIndex,
  }));
};


const cartochkiData = ref([
  {
    title: 'Believe',
    color: '#000',
    bgColor: '#ff8888',
    startDate: '22 сент.',
    endDate: '28 сент.',
    subtitle: 'Think greater than your environment',
    isTop: true,
    isNext: false,
  },
  {
    title: 'Embrace reality',
    color: '#000',
    bgColor: '#5d707c',
    startDate: '22 сент.',
    endDate: '28 сент.',
    subtitle: 'Be bored',
    isTop: false,
    isNext: true,
  },
  {
    title: 'Strategy',
    subtitle: 'Step back',
    color: '#000',
    bgColor: '#3edc38',
    startDate: '22 сент.',
    endDate: '28 сент.',
    isTop: false,
    isNext: false,
  },
])

</script>

<template>
<!--  <h1 class="test">{{cIsSwipedOff}}</h1>-->
  <div class="cartochki-view" @pointerup="handleMouseUp">
    <div class="cartochki-view__container">
      <Cartochka
          v-for="cart in cartochkiData"
          :title="cart.title"
          :color="cart.color"
          :bg-color="cart.bgColor"
          :end-date="cart.endDate"
          :start-date="cart.startDate"
          :subtitle="cart.subtitle"
          @pointerdown ="handleMouseDown"
          :class="[
              {'top-cartochka': cart.isTop},
              {'next-cartochka': !cart.isTop && cart.isNext},
              {'bottom-cartochka': !cart.isTop && !cart.isNext},
          ]"
          :style="cart.isTop ? cDynamicStyle : cart.isNext ? cDynamicStyleNext : ''"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .test {
    position: absolute;
    left: 20px;
    top: 20px;
  }

  .cartochki-view {
    display: flex;
    flex: 1;
    height:100vh;
    align-items: center;

    &__container {
      display: flex;
      flex: 1;
      justify-content: center;
    }
  }

  .next-cartochka {
    position: absolute;
    z-index: -1;
    scale: .9;
  }

  .bottom-cartochka {
    //transition: .2s;
    opacity: 0;
    position: absolute;
    z-index: -2;
    scale: .9;
  }
</style>