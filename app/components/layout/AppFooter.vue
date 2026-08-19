<script setup lang="ts">
/** Minimal footer with attribution and a data-source credit. */
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-hairline">
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6"
    >
      <p>&copy; {{ year }} Book Discovery</p>
      <p>
        Powered by the
        <a
          href="https://developers.google.com/books"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-primary hover:underline"
        >
          Google Books API
        </a>
      </p>
    </div>
  </footer>
</template>
