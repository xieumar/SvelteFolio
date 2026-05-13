<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';
	import type { Project } from '$lib/data/projects';

	let { project, isOpen, onClose }: { project: Project | null, isOpen: boolean, onClose: () => void } = $props();

	let modalRef: HTMLElement;
	let backdropRef: HTMLElement;
	let frameRef: HTMLElement;
	let scannerRef: HTMLElement;

	$effect(() => {
		if (isOpen && modalRef) {
			document.body.style.overflow = 'hidden';
			
			const tl = gsap.timeline();
			
			tl.fromTo(backdropRef, 
				{ opacity: 0, backdropFilter: 'blur(0px)' }, 
				{ opacity: 1, backdropFilter: 'blur(40px)', duration: 1, ease: 'power2.out' }
			)
			.fromTo(frameRef,
				{ 
					z: -1000, 
					rotateX: 45, 
					rotateY: -30, 
					opacity: 0, 
					scale: 0.5 
				},
				{ 
					z: 0, 
					rotateX: 0, 
					rotateY: 0, 
					opacity: 1, 
					scale: 1, 
					duration: 1.2, 
					ease: 'elastic.out(1, 0.75)' 
				},
				'-=0.8'
			);

			// Scanning Line Loop
			gsap.to(scannerRef, {
				top: '100%',
				duration: 2.5,
				repeat: -1,
				ease: 'none'
			});
		} else {
			document.body.style.overflow = 'auto';
		}
	});

	function handleClose() {
		gsap.to(frameRef, { 
			scale: 0.8, 
			opacity: 0, 
			rotateX: -20, 
			duration: 0.5, 
			ease: 'power2.in',
			onComplete: onClose 
		});
		gsap.to(backdropRef, { opacity: 0, duration: 0.4 });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') handleClose();
	}
</script>

{#if isOpen && project}
	<div 
		bind:this={modalRef}
		class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 perspective-[2000px]"
		role="dialog"
		aria-modal="true"
	>
		<window onkeydown={handleKeydown} />
		
		<!-- Backdrop -->
		<div 
			bind:this={backdropRef}
			class="absolute inset-0 bg-theme/95"
			onmousedown={handleClose}
		>
			<div class="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
		</div>
		
		<div 
			bind:this={frameRef}
			class="relative w-full max-w-7xl h-full max-h-[90vh] bg-theme/80 border border-cyber/30 rounded-[1rem] flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,255,157,0.1)] overflow-hidden"
			onmousedown={(e) => e.stopPropagation()}
			style="transform-style: preserve-3d;"
		>
			<!-- HUD CORNERS -->
			<div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber z-30"></div>
			<div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber z-30"></div>
			<div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber z-30"></div>
			<div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber z-30"></div>

			<!-- Left: The Visual -->
			<div class="w-full md:w-3/5 h-full relative border-r border-white/10 group overflow-hidden">
				<img src={project.image} alt={project.title} class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" />
				
				<!-- Scanning Line -->
				<div bind:this={scannerRef} class="absolute top-0 left-0 w-full h-[2px] bg-cyber/50 shadow-[0_0_15px_#00ff9d] z-20"></div>
				
				<!-- HUD Overlay -->
				<div class="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-10">
					<div class="flex justify-between items-start">
						<div class="font-mono text-[10px] text-cyber uppercase tracking-[0.4em] opacity-60">
							ProjectID // 0{project.id} <br />
							Status // Deployed_
						</div>
						<div class="font-mono text-[10px] text-[var(--text-secondary)] text-right">
							LAT: 51.5074 <br />
							LNG: 0.1278
						</div>
					</div>
					<div class="h-32 w-[1px] bg-gradient-to-b from-transparent via-cyber/40 to-transparent"></div>
				</div>
			</div>

			<!-- Right: Technical Specs -->
			<div class="w-full md:w-2/5 p-8 md:p-12 flex flex-col bg-theme/40 backdrop-blur-xl overflow-y-auto scrollbar-hide">
				<div class="mb-12">
					<div class="inline-block px-3 py-1 bg-cyber/10 border border-cyber/30 rounded text-[10px] font-mono text-cyber uppercase tracking-widest mb-6">
						Engineering Specification
					</div>
					<h2 class="text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-6">
						{project.title.toUpperCase()}
					</h2>
					<p class="text-slate font-mono text-sm leading-relaxed border-l-2 border-white/10 pl-6">
						{project.description}
					</p>
				</div>

				<!-- Data Grid -->
				<div class="grid grid-cols-1 gap-6 mb-12">
					<div class="space-y-4">
						<h4 class="text-[10px] font-mono uppercase text-[var(--text-secondary)] tracking-[0.3em]">Module Stack</h4>
						<div class="flex flex-wrap gap-2">
							{#each project.tags as tag}
								<div class="px-3 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs font-mono text-[var(--text-primary)] flex items-center gap-2 group hover:border-cyber transition-colors">
									<div class="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse"></div>
									{tag}
								</div>
							{/each}
						</div>
					</div>

					<div class="p-6 rounded-2xl bg-cyber/5 border border-cyber/20 relative overflow-hidden">
						<div class="absolute top-0 right-0 p-4 font-mono text-[8px] text-cyber/30">V.1.0.4</div>
						<h4 class="text-xs font-mono text-cyber mb-4">Integrity Check</h4>
						<div class="space-y-3">
							<div class="flex justify-between text-[10px] font-mono">
								<span class="text-white/60 uppercase">Performance</span>
								<span class="text-cyber">98%</span>
							</div>
							<div class="h-1 bg-[var(--glass-bg)] rounded-full">
								<div class="h-full bg-cyber w-[98%] shadow-[0_0_10px_#00ff9d]"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Primary Link -->
				<div class="mt-auto flex gap-4">
					<a href={project.link} class="flex-1 py-5 bg-cyber text-obsidian text-center font-bold font-mono text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
						Execute <Icon icon="lucide:terminal" class="w-4 h-4" />
					</a>
					<a href={project.github} class="w-16 h-16 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all">
						<Icon icon="lucide:github" class="w-6 h-6" />
					</a>
				</div>
			</div>

			<!-- Exit Command -->
			<button 
				onclick={handleClose}
				class="absolute top-8 right-8 z-40 p-2 text-[var(--text-secondary)] hover:text-cyber transition-colors group flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
			>
				Close [ESC] <Icon icon="lucide:x" class="w-4 h-4 group-hover:rotate-90 transition-transform" />
			</button>
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
