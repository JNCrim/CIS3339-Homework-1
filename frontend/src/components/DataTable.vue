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
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
</style>