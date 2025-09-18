<template>
  <div class="table-wrapper">
    <table class="glass-table">
      <thead>
      <tr>
        <th :key="num">N</th>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td>{{ index }}</td>
        <td v-for="col in columns" :key="col.key">
          {{ col.render ? col.render(row[col.key], row) : row[col.key] }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
    // каждый столбец: { key: 'name', label: 'Name', render: (value, row) => ... }
  },
});
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  padding: 1rem;
}

.glass-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.glass-table th,
.glass-table td {
  padding: 0.75rem 1rem;
  text-align: left;
}

.glass-table thead {
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.glass-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>
