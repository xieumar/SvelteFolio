<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { theme } from '$lib/theme.svelte';

	let isScrolled = $state(false);

	onMount(() => {
		window.addEventListener('scroll', () => {
			isScrolled = window.scrollY > 50;
		});
	});

	const navLinks = [
		{ name: 'Work', href: '#projects' },
		{ name: 'Contact', href: '#contact' }
	];
</script>

<nav class="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 transition-all duration-500 {isScrolled ? 'pt-4' : 'pt-8'}">
	<div class="flex items-center gap-8 px-6 py-3 rounded-full border transition-all duration-500 shadow-2xl
		{isScrolled ? 'glass border-[var(--glass-border)]' : 'bg-[var(--glass-bg)] backdrop-blur-md border-[var(--glass-border)]'}">
		
		<a href="/" class="text-xl font-bold tracking-tighter flex items-center gap-2 group">
			<div class="w-8 h-8 rounded-lg bg-cyber flex items-center justify-center group-hover:rotate-12 transition-transform">
				<span class="text-[var(--text-primary)] text-base font-bold">Z</span>
			</div>

		</a>

		<div class="hidden md:flex items-center gap-6">
			{#each navLinks as link}
				<a href={link.href} class="text-sm font-medium text-[var(--text-secondary)] hover:text-cyber transition-colors tracking-wide">{link.name}</a>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<button 
				class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate hover:text-white transition-all"
				onclick={() => theme.toggle()}
				aria-label="Toggle Theme"
			>
				<Icon icon={theme.current === 'light' ? 'lucide:moon' : 'lucide:sun'} class="w-4 h-4" />
			</button>

			<button 
				class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate hover:text-white transition-all"
				onclick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
			>
				<Icon icon="lucide:search" class="w-4 h-4" />
				<div class="flex items-center gap-1 opacity-50">
					<kbd class="text-[9px] font-mono">⌘</kbd>
					<kbd class="text-[9px] font-mono">K</kbd>
				</div>
			</button>
		</div>
	</div>
</nav>
