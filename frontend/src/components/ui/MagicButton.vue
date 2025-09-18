<script setup lang="ts">
</script>

<template>
  <button class="glass-btn" type="button">Magic Button</button>
</template>

<style>
:root{
  --glass-bg: rgb(192 192 192 / 18%);
  --glass-bg-2: rgb(6 5 5 / 8%);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-shadow: 0 8px 30px rgba(10, 10, 10, 0.12);
  --glass-accent: rgba(0, 122, 255, 0.95);
  --glass-text: #200b0b;
  --glass-radius: 12px;
  --glass-padding: 10px 18px;
  --glass-font-size: 15px;
  --glass-transition: 280ms cubic-bezier(.2, .9, .2, 1);
}
</style>

<style scoped>
.glass-btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: var(--glass-padding);
  font-size: var(--glass-font-size);
  line-height: 1;
  font-weight: 600;
  font-family: -apple-system, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--glass-text);

  border: 1px solid transparent;
  border-radius: var(--glass-radius);
  background:
      linear-gradient(180deg, var(--glass-bg) 0%, var(--glass-bg-2) 100%);
  box-shadow: var(--glass-shadow);
  cursor: pointer;
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%); /* Safari */
  transition: var(--glass-transition);
  -webkit-tap-highlight-color: transparent;

  /* тонкая "подсветка" обводки сверху — создаёт эффект стекла */
  outline: none;
  position: relative;
}

/* внутренний отблеск (псевдоэлемент) */
.glass-btn::before{
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.04));
  mix-blend-mode: overlay;
  opacity: 0.9;
}

/* тонкая контурная линия (высветление по краю) */
.glass-btn::after{
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.35);
  opacity: 0.9;
}

/* Hover — лёгкое поднятие и усиление контраста */
.glass-btn:hover{
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(10,10,10,0.18);
  background:
      linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.06));
}

/* Active — нажатие (имитация физической кнопки) */
.glass-btn:active{
  transform: translateY(0);
  box-shadow: 0 6px 20px rgba(10,10,10,0.12);
  background:
      linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
}

/* focus-visible — доступность: кольцо фокуса аккуратно и в стиле системы */
.glass-btn:focus-visible{
  box-shadow: 0 10px 30px rgba(0,122,255,0.18), 0 2px 6px rgba(10,10,10,0.08);
  border: 1px solid rgba(0,122,255,0.55);
}

/* Disabled */
.glass-btn:disabled,
.glass-btn[disabled]{
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Accent variant: цветной (apple blue) */
.glass-btn--accent{
  color: white;
  --glass-bg: linear-gradient(180deg, rgba(0,122,255,0.95), rgba(0,102,215,0.96));
  background: var(--glass-bg);
  box-shadow: 0 10px 30px rgba(0,122,255,0.18);
}
.glass-btn--accent::before,
.glass-btn--accent::after{ opacity: 0.12; }

/* Dark theme tweaks (пример) */
@media (prefers-color-scheme: dark){
  :root{
    --glass-bg: rgba(18,18,20,0.28);
    --glass-bg-2: rgba(10,10,12,0.12);
    --glass-border: rgba(255,255,255,0.06);
    --glass-text: #f3f6f9;
    --glass-shadow: 0 8px 30px rgba(0,0,0,0.6);
  }
}

/* Fallback: если браузер не поддерживает backdrop-filter — сделать более плотную полупрозрачную заливку */
@supports not ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))){
  .glass-btn{
    background:
        linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06));
    /* чуть больше тени для компенсации */
    box-shadow: 0 12px 40px rgba(10,10,10,0.18);
  }
  @media (prefers-color-scheme: dark){
    .glass-btn{
      background:
          linear-gradient(180deg, rgba(18,18,20,0.42), rgba(10,10,12,0.18));
      box-shadow: 0 12px 40px rgba(0,0,0,0.7);
    }
  }
}

/* Уважение к пользователю: если он выключил анимации */
@media (prefers-reduced-motion: reduce){
  .glass-btn{
    transition: none;
  }
}
</style>