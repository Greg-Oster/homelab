<script setup lang="ts">
import Cartochka from "../components/project-specific/cartochki/cartochka.vue";
import { computed, ref, onMounted } from "vue";
import {useFetch} from "../composables/useFetch.ts";
import CartichkiBtn from "../components/project-specific/cartochki/CartichkiBtn.vue";

const target = ref<HTMLElement | null>(null)
const CLICK_THRESHOLD = 5;

const xStart = ref(0);
const yStart = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const prevX = ref(0);
const prevY = ref(0);
const rIsDragging = ref(false);

const deltaX = computed(() => rIsDragging.value ? currentX.value - xStart.value : 0);
const deltaY = computed(() => rIsDragging.value ? currentY.value - yStart.value : 0);
const cPointerMoveDirection = computed< 'left' | 'right' | 'up' | 'down' | 'stationary' | null>(() => {
  if (!rIsDragging.value) return null;

  const dx = currentX.value - prevX.value;
  const dy = currentY.value - prevY.value;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  const threshold = 0; // порог в пикселях, чтобы игнорировать дребезг

  if (absDx < threshold && absDy < threshold) {
    return 'stationary';
  }

  // выбираем направление по доминирующей оси
  if (absDx >= absDy) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
});

// удобные boolean-помощники (если хочешь использовать в шаблоне/классах)
const cIsMovingLeft  = computed(() => cPointerMoveDirection.value === 'left');
const cIsMovingRight = computed(() => cPointerMoveDirection.value === 'right');
const cIsMovingUp    = computed(() => cPointerMoveDirection.value === 'up');
const cIsMovingDown  = computed(() => cPointerMoveDirection.value === 'down');
const cIsStationary  = computed(() => cPointerMoveDirection.value === 'stationary');

const cCardDeviation = computed(() => (270 - Math.abs(deltaX.value)) / 270);

const cSwipeProgress = computed(() => Math.min(1, 1 - cCardDeviation.value));
const cIsSwipedOff = computed(() => cSwipeProgress.value > 0.5);

const cTranslateX = computed(() => {
      if (!rIsFlatView.value) {
        return rIsDragging.value
            ? `transform: translate(${deltaX.value}px, ${deltaY.value}px) rotate(${deltaX.value / 15}deg); transition: 0s;`
            : ''
      } else {
        return rIsDragging.value
            ? `transform: translate(${deltaX.value}px); transition: 0s;`
            : ''
      }
    }
);

const cOpacity = computed(() => {
  return rIsDragging.value ? `opacity: ${cCardDeviation.value};` : ''
});

const cReverseOpacity = computed(() =>
    rIsDragging.value ? `opacity: ${1 - cCardDeviation.value + 0.8}; transition: 0s;` : ''
);

const cPrevOpacity = computed(() =>
    rIsDragging.value ? `opacity: ${0.8 - (1 - cCardDeviation.value)}; transition: 0s;` : ''
);

const cScaleNextCard = computed(() =>
    rIsDragging.value ? `scale: ${0.9 + cSwipeProgress.value / 10};` : ''
);
const cScalePrevCard = computed(() =>
    rIsDragging.value ? `scale: ${0.9 - cSwipeProgress.value / 10};` : ''
);

const cScaleActiveCard = computed(() => {
  if (rIsFlatView.value) {
    return rIsDragging.value
        ? `scale: ${1 - cSwipeProgress.value/ 10};`
        : ''
  }
});
const cTransformNextCard = computed(() => {
  if (rIsFlatView.value) {
    return rIsDragging.value
        ? `transform: translate(${deltaX.value}px); transition: 0s;`
        : ''
  }
});
const cTransformPrevCard = computed(() => {
  if (rIsFlatView.value) {
    return rIsDragging.value
        ? `transform: translate(${deltaX.value}px); transition: 0s;`
        : ''
  }
});

const cDynamicStyle = computed(() => cTranslateX.value + cOpacity.value + cScaleActiveCard.value);
const cDynamicStyleNext = computed(() => cReverseOpacity.value + cScaleNextCard.value + cTransformNextCard.value);
const cDynamicStylePrev = computed(() => cPrevOpacity.value + cScalePrevCard.value + cTransformPrevCard.value);

// 👉 обработчики pointer events
const rPointedDownCartId = ref(-1)
function handlePointerDown(e: PointerEvent, cart: any) {
  rIsDragging.value = true;
  xStart.value = e.clientX;
  yStart.value = e.clientY;
  currentX.value = e.clientX;
  currentY.value = e.clientY;
  prevX.value = e.clientX;
  prevY.value = e.clientY;

  rPointedDownCartId.value = cart.id;
}

function handlePointerMove(e: PointerEvent) {
  if (!rIsDragging.value) return;
  prevX.value = currentX.value;
  prevY.value = currentY.value;
  currentX.value = e.clientX;
  currentY.value = e.clientY;
}

function handlePointerUp() {
  if (!rIsDragging.value) return;

  const dx = currentX.value - xStart.value;
  const dy = currentY.value - yStart.value;

  // если движение почти нулевое — кликаем
  if (Math.abs(dx) < CLICK_THRESHOLD && Math.abs(dy) < CLICK_THRESHOLD) {
    handleCardClick();
  } else if (cIsSwipedOff.value) {
    turnTheWheel();
  }

  rIsDragging.value = false;
  currentX.value = 0;
  currentY.value = 0;
  prevX.value = 0;
  prevY.value = 0;
}

const rToggledCardId = ref(-1)
function handleCardClick() {
  console.log('handleCardClick')

  if (rToggledCardId.value === -1) {
    rToggledCardId.value = rPointedDownCartId.value;
  } else {
    rToggledCardId.value = -1;
  }
}

// 👉 переключение карточек
function turnTheWheel() {
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
}

const cartochkiData = ref<any[]>([])
const setTopNext = (data: any[]) => {
  data[0].isTop = true;
  data[1].isNext = true;
}

onMounted(async () => {
  const cartochki = await useFetch('/notes');
  const enriched = cartochki.map((item: any) => ({
    ...item,
    color: "#000",
    bgColor: '#ff8888',
    isTop: false,
    isNext: false,
  }));
  setTopNext(enriched);
  cartochkiData.value = enriched;
})

const rIsEditing = ref(false)
const handleToggleEdit = () => {
  rIsEditing.value = !rIsEditing.value;
  rIsFlatView.value = !rIsFlatView.value;
}
const cEditBtnText = computed(() => {
  return rIsEditing.value ? 'Submit' : 'Edit';
})
const handleSave = async (cart: any) => {
  console.log('save');
  try {
    const response = await useFetch(`/notes/${cart.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    console.log("✅ Результат:", response);
  } catch (error) {
    console.error("❌ Ошибка запроса:", error);
  }
}

const rIsFlatView = ref(false);
</script>

<template>
  <div
      class="cartochki-view"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
  >
    <div class="cartochki-view__container" :class="{'is-flat': rIsFlatView}">
<!--      <h2 class="test">{{ cPointerMoveDirection }}</h2>-->
      <Cartochka
          ref="target"
          v-for="cart in cartochkiData"
          :key="cart.id"
          :is-editing="rIsEditing"
          :color="cart.color"
          :bg-color="cart.bgColor"
          :date="cart.date"
          :is-flipped="rToggledCardId === cart.id"
          v-model:title="cart.title"
          v-model:subtitle="cart.subtitle"
          v-model:description="cart.description"
          @pointerdown="handlePointerDown($event, cart)"
          @save="handleSave(cart)"
          :class="[
          { 'top-cartochka': rIsEditing ? getActiveCart : cart.isTop },
          { 'next-cartochka': rIsEditing ? getNextCart : !cart.isTop && cart.isNext },
          { 'bottom-cartochka': rIsEditing ? getPrevCart : !cart.isTop && !cart.isNext }
        ]"
          :style="cart.isTop ? cDynamicStyle : cart.isNext ? cDynamicStyleNext : cDynamicStylePrev"
      />
      <CartichkiBtn class="cartochki-view__btn" @click="handleToggleEdit">{{ cEditBtnText }}</CartichkiBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.test {
  position: absolute;
  top: 10px;
  left: 10px;
}
.cartochki-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  align-items: center;
  overflow: hidden;
  width: 100vw;

  &__container {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;

    &.is-flat {
      .top-cartochka {
        position: absolute;
      }

      .next-cartochka {
        opacity: 0.8;
        right: 0;
        z-index: 0;
        scale: 0.9;
      }

      .bottom-cartochka {
        opacity: 0.8;
        left: 0;
        z-index: 0;
        scale: 0.9;
      }
    }
  }

  &__btn {
    position: absolute;
    bottom: 8vh;
  }
}

.top-cartochka {
  touch-action: none; /* важно для тачей */
  user-select: none;
}

.next-cartochka {
  position: absolute;
  z-index: -1;
  scale: 0.9;
}

.bottom-cartochka {
  opacity: 0;
  position: absolute;
  z-index: -2;
  scale: 0.9;
}
</style>
