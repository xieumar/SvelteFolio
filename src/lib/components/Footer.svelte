<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="py-12 px-4 border-t border-white/5 bg-theme">
	<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
		<div class="flex items-center gap-2">
			<div class="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
				<span class="text-white font-mono text-[10px]">V</span>
			</div>
			<span class="text-slate text-sm font-medium">© {year} Velocity Terminal.</span>
		</div>

		<div class="flex items-center gap-6 text-sm text-slate">
			<div class="flex items-center gap-2">
				<span class="text-[10px] uppercase tracking-widest">Built with</span>
				<span class="text-white font-bold">Svelte 5</span>
			</div>
		</div>
	</div>
</footer>
