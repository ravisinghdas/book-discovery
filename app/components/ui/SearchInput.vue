<script setup lang="ts">
/**
 * SearchInput — the white pill search field from the reference design.
 *
 * Presentational and controlled via v-model. Debouncing is intentionally NOT
 * here — it lives in useBookSearch so the timing rule sits next to the fetch
 * logic. This component just owns the icon, clear button, and focus behaviour.
 */
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    autofocus?: boolean
  }>(),
  {
    placeholder: 'Search by title, author, or genre...',
    autofocus: false
  }
)

const inputRef = ref<HTMLInputElement | null>(null)

function clear() {
  model.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <div class="relative w-full">
    <!-- Search icon -->
    <span
      class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-5 w-5"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </span>

    <input
      ref="inputRef"
      v-model="model"
      type="search"
      :placeholder="placeholder"
      :autofocus="autofocus"
      role="searchbox"
      aria-label="Search for books"
      autocomplete="off"
      class="w-full rounded-full border border-hairline bg-white py-3.5 pl-12 pr-12 text-base text-ink shadow-sm outline-none transition-shadow placeholder:text-muted focus:border-primary focus:shadow-md focus:ring-2 focus:ring-primary/30"
    />

    <!-- Clear button -->
    <button
      v-if="model"
      type="button"
      aria-label="Clear search"
      class="absolute inset-y-0 right-3 my-auto grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-slate-100 hover:text-ink"
      @click="clear"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>
