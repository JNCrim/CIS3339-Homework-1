<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  rowKey: {
    type: String,
    default: '_id'
  }
})
</script>

<template>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
        >
          {{ column.label }}
        </th>

        <th v-if="$slots.actions">Action</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="row in rows"
        :key="row[rowKey]"
      >
        <td
          v-for="column in columns"
          :key="column.key"
        >
          {{ row[column.key] }}
        </td>

        <td v-if="$slots.actions">
          <slot name="actions" :row="row" />
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<style scoped>
.table-container {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  margin-top: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

@media (max-width: 600px) {
  th,
  td {
    padding: 8px;
    white-space: nowrap;
  }
}
</style>