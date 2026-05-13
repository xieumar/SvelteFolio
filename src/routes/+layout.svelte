<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Lenis from 'lenis';
	import { theme } from '$lib/theme.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';

	let { children } = $props();

	$effect(() => {
		// Initialize theme class
		document.documentElement.classList.toggle('light', theme.current === 'light');

		const lenis = new Lenis();

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Developer Portfolio | The Velocity Terminal</title>
</svelte:head>

<main class="min-h-screen selection:bg-cyber selection:text-obsidian text-[var(--text-primary)]">
	<Navbar />
	<CommandPalette />
	{@render children()}
</main>
