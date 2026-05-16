<script lang="ts">
	import Icon from '@iconify/svelte';
	const year = new Date().getFullYear();

	const socials = [
		{ name: 'GitHub', icon: 'mdi:github', href: 'https://github.com/xieumar' },
		{ name: 'LinkedIn', icon: 'mdi:linkedin', href: 'https://linkedin.com/in/zainab-umar-ibrahim-48929b1ba/' },
		{ name: 'Twitter', icon: 'ri:twitter-x-fill', href: 'https://twitter.com/xiaoma0_' }
	];

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<footer class="py-20 bg-theme px-6 border-t border-[var(--glass-border)]">
	<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
		<!-- Left: Identity -->
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-cyber flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.1)] hover:scale-105 transition-transform duration-500">
					<span class="text-obsidian text-xl font-bold">Z</span>
				</div>
				<h2 class="text-2xl font-bold text-[var(--text-primary)] tracking-tighter">Zainab</h2>
			</div>
			<p class="text-[var(--text-secondary)] text-sm max-w-xs font-medium leading-relaxed opacity-80">
				Building the next generation of web interfaces with precision, logic, and style.
			</p>
		</div>

		<!-- Right: Links & Legal -->
		<div class="flex flex-col md:items-end gap-6">
			<div class="flex gap-8">
				{#each socials as social}
					<a 
						href={social.href} 
						target="_blank" 
						class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-semibold tracking-tight border-b border-transparent hover:border-cyber/50 pb-1"
					>
						{social.name}
					</a>
				{/each}
			</div>
			
			<div class="flex flex-col md:items-end gap-2">
				<div class="flex items-center gap-4 text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">
					<span>© {year} Velocity Terminal</span>
					<span class="hidden md:inline w-1 h-1 rounded-full bg-cyber/30"></span>
				</div>
				
				<button 
					onclick={scrollToTop}
					class="text-[10px] font-mono text-cyber/60 hover:text-cyber transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group mt-2"
				>
					Return_to_Origin <Icon icon="lucide:arrow-up" class="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
				</button>
			</div>
		</div>
	</div>
</footer>
