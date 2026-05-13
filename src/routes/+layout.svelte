<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Lenis from 'lenis';

	let { children } = $props();

	$effect(() => {
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

<main class="min-h-screen selection:bg-cyber selection:text-obsidian">
	{@render children()}
</main>
