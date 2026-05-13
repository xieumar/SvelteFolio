<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let cursorOuter: HTMLDivElement;
	let cursorInner: HTMLDivElement;
	let isHovering = $state(false);
	let isClicking = $state(false);

	onMount(() => {
		const xToOuter = gsap.quickTo(cursorOuter, "x", { duration: 0.3, ease: "power3" });
		const yToOuter = gsap.quickTo(cursorOuter, "y", { duration: 0.3, ease: "power3" });
		const xToInner = gsap.quickTo(cursorInner, "x", { duration: 0.05 });
		const yToInner = gsap.quickTo(cursorInner, "y", { duration: 0.05 });

		const moveCursor = (e: MouseEvent) => {
			xToOuter(e.clientX);
			yToOuter(e.clientY);
			xToInner(e.clientX);
			yToInner(e.clientY);
		};

		const handleMouseEnter = () => isHovering = true;
		const handleMouseLeave = () => isHovering = false;
		const handleMouseDown = () => isClicking = true;
		const handleMouseUp = () => isClicking = false;

		window.addEventListener('mousemove', moveCursor);
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);

		const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
		interactiveElements.forEach(el => {
			el.addEventListener('mouseenter', handleMouseEnter);
			el.addEventListener('mouseleave', handleMouseLeave);
		});

		return () => {
			window.removeEventListener('mousemove', moveCursor);
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	});
</script>

<div 
	bind:this={cursorOuter}
	class="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-cyber rounded-full pointer-events-none z-[9999] transition-transform duration-300
		{isHovering ? 'scale-150 bg-cyber/10' : 'scale-100'} 
		{isClicking ? 'scale-90' : ''}"
></div>

<div 
	bind:this={cursorInner}
	class="fixed top-0 left-0 w-1 h-1 -ml-0.5 -mt-0.5 bg-cyber rounded-full pointer-events-none z-[9999]
		{isHovering ? 'opacity-0' : 'opacity-100'}"
></div>

<style>
	:global(body) {
		cursor: none;
	}
	:global(a, button, input, [role="button"]) {
		cursor: none !important;
	}
</style>
