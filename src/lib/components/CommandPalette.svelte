<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';
	import { theme } from '$lib/theme.svelte';
	import { projects, type Project } from '$lib/data/projects';

	let isOpen = $state(false);
	let searchTerm = $state('');
	let selectedIndex = $state(0);
	let modalRef: HTMLElement | undefined = $state();
	let inputRef: HTMLInputElement | undefined = $state();

	const actions = [
		{ id: 'theme', title: 'Switch Theme', icon: 'lucide:sun', action: () => theme.toggle() },
		{ id: 'resume', title: 'Download Resume', icon: 'lucide:download', action: () => window.open('#', '_blank') },
		{ id: 'contact', title: 'Get in Touch', icon: 'lucide:mail', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
	];

	type Item = (Project & { type: 'project' }) | (typeof actions[0] & { type: 'action' });
	
	let filteredItems = $derived.by((): Item[] => {
		const term = searchTerm.toLowerCase();
		const matchedProjects = projects.filter(p => 
			p.title.toLowerCase().includes(term) || p.tags.some(t => t.toLowerCase().includes(term))
		).map(p => ({ ...p, type: 'project' as const }));
		
		const matchedActions = actions.filter(a => 
			a.title.toLowerCase().includes(term)
		).map(a => ({ ...a, type: 'action' as const }));

		return [...matchedActions, ...matchedProjects];
	});

	function togglePalette() {
		isOpen = !isOpen;
		if (isOpen) {
			selectedIndex = 0;
			setTimeout(() => inputRef?.focus(), 10);
			if (modalRef) {
				gsap.fromTo(modalRef, 
					{ scale: 0.95, opacity: 0 }, 
					{ scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' }
				);
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			togglePalette();
		}

		if (!isOpen) return;

		if (e.key === 'Escape') {
			togglePalette();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredItems.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
		} else if (e.key === 'Enter') {
			const item = filteredItems[selectedIndex];
			if (item) executeItem(item);
		}
	}

	function executeItem(item: Item) {
		if (item.type === 'action') {
			item.action();
		} else if (item.type === 'project') {
			const el = document.getElementById('projects');
			el?.scrollIntoView({ behavior: 'smooth' });
		}
		togglePalette();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if isOpen}
	<div 
		class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-obsidian/60 backdrop-blur-sm"
		onmousedown={togglePalette}
		role="button"
		tabindex="-1"
	>
		<div 
			bind:this={modalRef}
			class="w-full max-w-2xl glass rounded-2xl overflow-hidden shadow-2xl border border-white/10"
			onmousedown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<!-- Search Input -->
			<div class="flex items-center px-6 py-4 border-b border-white/10">
				<Icon icon="lucide:search" class="w-5 h-5 text-slate mr-4" />
				<input 
					bind:this={inputRef}
					bind:value={searchTerm}
					placeholder="Search projects, actions, or type 'help'..."
					class="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-slate font-sans"
				/>
				<div class="flex items-center gap-1">
					<kbd class="px-2 py-1 rounded bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[10px] text-[var(--text-secondary)] font-mono uppercase">ESC</kbd>
				</div>
			</div>

			<!-- Results -->
			<div class="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
				{#if filteredItems.length > 0}
					{#each filteredItems as item, i}
						<button 
							class="w-full flex items-center justify-between p-4 rounded-xl transition-all text-left
								{i === selectedIndex ? 'bg-cyber/10 border border-cyber/30' : 'hover:bg-[var(--glass-bg)] border border-transparent'}"
							onmousemove={() => selectedIndex = i}
							onclick={() => executeItem(item)}
						>
							<div class="flex items-center gap-4">
								<div class="w-10 h-10 rounded-lg flex items-center justify-center 
									{item.type === 'project' ? 'bg-[var(--glass-bg)]' : 'bg-cyber/20 text-cyber'}">
									<Icon icon={item.type === 'project' ? 'lucide:layers' : item.icon} class="w-5 h-5" />
								</div>
								<div>
									<div class="font-bold text-sm {i === selectedIndex ? 'text-cyber' : 'text-white'}">
										{item.title}
									</div>
									<div class="text-xs text-slate">
										{item.type === 'project' ? 'View Project Details' : 'System Command'}
									</div>
								</div>
							</div>
							
							{#if i === selectedIndex}
								<div class="flex items-center gap-2 text-[10px] font-mono text-cyber uppercase tracking-widest">
									Press <kbd class="px-1 py-0.5 rounded bg-cyber/20 border border-cyber/30">Enter</kbd>
								</div>
							{/if}
						</button>
					{/each}
				{:else}
					<div class="p-12 text-center">
						<Icon icon="lucide:search-x" class="w-12 h-12 text-slate mx-auto mb-4 opacity-20" />
						<p class="text-slate italic">No results found for "{searchTerm}"</p>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-6 py-3 bg-[var(--glass-bg)] border-top border-[var(--glass-border)] flex items-center justify-between">
				<div class="flex items-center gap-4 text-[10px] text-slate font-mono uppercase tracking-wider">
					<div class="flex items-center gap-1">
						<kbd class="px-1 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd> Navigate
					</div>
					<div class="flex items-center gap-1">
						<kbd class="px-1 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd> Select
					</div>
				</div>
				<div class="text-[10px] text-cyber/40 font-mono uppercase tracking-tighter">
					Velocity v1.0.0
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
