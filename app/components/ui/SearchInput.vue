<script setup lang="ts">
/**
 * SearchInput — the pill search field.
 * Presentational, controlled via v-model. Shows a spinner while `loading`, and
 * a clear (×) button once there is text. Debouncing lives in useBookSearch.
 */
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    loading?: boolean
  }>(),
  {
    placeholder: 'Search by title, author, or genre…',
    loading: false,
  },
)
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3.5 shadow-sm transition hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20"
  >
    <!-- Search icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      class="h-5 w-5 shrink-0 text-content-subtle"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" stroke-linecap="round" />
    </svg>

    <!-- Input -->
    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      aria-label="Search for books"
      autocomplete="off"
      class="min-w-0 flex-1 bg-transparent text-base text-content placeholder:text-content-subtle focus:outline-none"
    />

    <!-- Spinner or clear -->
    <span class="flex shrink-0 items-center">
      <svg
        v-if="loading"
        class="h-5 w-5 animate-spin text-primary"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
      </svg>
      <button
        v-else-if="model"
        type="button"
        aria-label="Clear search"
        class="rounded-full p-1 text-content-subtle transition hover:bg-surface-raised hover:text-content"
        @click="model = ''"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
        </svg>
      </button>
    </span>
  </div>
</template>
