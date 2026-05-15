<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';
	import type { Project } from '$lib/data/projects';

	let { project, isOpen, onClose }: { project: Project | null, isOpen: boolean, onClose: () => void } = $props();

	let modalRef = $state<HTMLElement>();
	let backdropRef = $state<HTMLElement>();
	let frameRef = $state<HTMLElement>();

	$effect(() => {
		if (isOpen && modalRef) {
			const html = document.documentElement;
			const body = document.body;
			html.style.overflow = 'hidden';
			body.style.overflow = 'hidden';
			
			const tl = gsap.timeline();
			
			tl.fromTo(backdropRef, 
				{ opacity: 0, backdropFilter: 'blur(0px)' }, 
				{ opacity: 1, backdropFilter: 'blur(20px)', duration: 0.6, ease: 'power2.out' }
			)
			.fromTo(frameRef,
				{ 
					y: 50,
					opacity: 0, 
					scale: 0.95
				},
				{ 
					y: 0,
					opacity: 1, 
					scale: 1, 
					duration: 0.8, 
					ease: 'power4.out'
				},
				'-=0.4'
			);
		} else {
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
		}
	});

	function handleClose() {
		gsap.to(frameRef, { 
			y: 30,
			opacity: 0, 
			duration: 0.4, 
			ease: 'power2.in',
			onComplete: onClose 
		});
		gsap.to(backdropRef, { opacity: 0, duration: 0.3 });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;
		if (e.key === 'Escape') handleClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && project}
	<div 
		bind:this={modalRef}
		class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
		role="dialog"
		aria-modal="true"
		data-lenis-prevent
	>
		
		<!-- Backdrop -->
		<div 
			bind:this={backdropRef}
			class="fixed inset-0 bg-black/80 backdrop-blur-md z-0"
			onmousedown={handleClose}
			data-lenis-prevent
		></div>
		
		<div 
			bind:this={frameRef}
			class="relative w-full max-w-6xl max-h-[90vh] bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl flex flex-col md:flex-row shadow-2xl overflow-hidden z-10"
			onmousedown={(e) => e.stopPropagation()}
		>
			<!-- Left: The Visual -->
			<div class="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-black">
				<img src={project.image} alt={project.title} class="absolute inset-0 w-full h-full object-cover opacity-80" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
			</div>

			<!-- Right: Technical Specs -->
			<div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar overscroll-behavior-contain" style="overscroll-behavior: contain;" data-lenis-prevent>
				<div class="mb-10">
					<div class="inline-block px-3 py-1 bg-cyber/10 border border-cyber/30 rounded-full text-[10px] font-mono text-cyber uppercase tracking-widest mb-6">
						Engineering Case Study
					</div>
					<h2 class="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6 text-[var(--text-primary)]">
						{project.title.toUpperCase()}
					</h2>
					<p class="text-[var(--text-secondary)] text-sm leading-relaxed">
						{project.description}
					</p>
				</div>

				<!-- Data Grid -->
				<div class="grid grid-cols-1 gap-8 mb-10">
					<div class="space-y-4">
						<h4 class="text-[10px] font-mono uppercase text-[var(--text-secondary)] tracking-[0.3em] opacity-50">Stack.Deployment</h4>
						<div class="flex flex-wrap gap-2">
							{#each project.tags as tag}
								<div class="px-4 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-cyber/50">
									{tag}
								</div>
							{/each}
						</div>
					</div>

					<div class="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] relative group transition-all hover:bg-cyber/[0.02]">
						<h4 class="text-[10px] font-mono uppercase text-[var(--text-secondary)] tracking-[0.3em] opacity-50 mb-4">Quality_Metric</h4>
						<div class="space-y-3">
							<div class="flex justify-between text-[10px] font-mono">
								<span class="text-[var(--text-secondary)]">PERFORMANCE_INDEX</span>
								<span class="text-cyber">98%</span>
							</div>
							<div class="h-1 bg-black/20 dark:bg-white/10 rounded-full overflow-hidden">
								<div class="h-full bg-cyber w-[98%] shadow-[0_0_10px_#00ff9d]"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Primary Link -->
				<div class="mt-auto pt-8 border-t border-[var(--glass-border)] flex flex-col sm:flex-row gap-4">
					<a href={project.link} target="_blank" class="flex-1 py-4 bg-cyber text-black text-center font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 rounded-xl">
						View Project <Icon icon="lucide:external-link" class="w-4 h-4" />
					</a>
					<a href={project.github} target="_blank" class="px-6 py-4 border border-[var(--glass-border)] rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all">
						<Icon icon="lucide:github" class="w-6 h-6" />
					</a>
				</div>
			</div>

			<!-- Exit Button -->
			<button 
				onclick={handleClose}
				class="absolute top-6 right-6 z-40 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-black/20 rounded-full backdrop-blur-md"
			>
				<Icon icon="lucide:x" class="w-6 h-6" />
			</button>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 255, 157, 0.2);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 255, 157, 0.5);
	}
</style>
