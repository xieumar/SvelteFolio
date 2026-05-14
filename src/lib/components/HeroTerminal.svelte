<script lang="ts">
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';

	let terminalRef: HTMLDivElement;
	let contentRef: HTMLDivElement;
	let inputRef: HTMLInputElement;

	let history: { type: 'input' | 'output' | 'system', text: string }[] = $state([]);
	let inputValue = $state('');
	let isBooting = $state(true);

	const bootSequence = [
		"Welcome to Zee's Portfolio",
		"Type help for available commands"
	];

	const commands: Record<string, string[]> = {
		'help': [
			'Available commands:',
			'  about    - Learn more about me',
			'  skills   - View technical stack',
			'  clear    - Clear terminal output',
			'  sudo     - ???'
		],
		'about': [
			'Hi, I\'m Zee.',
			'I engineer high-performance web applications focusing on immersive user experiences.',
			'Based in the digital realm.'
		],
		'skills': [
			'> Frontend: SvelteKit, TypeScript, TailwindCSS',
			'> Motion: GSAP, Three.js, WebGL',
			'> Backend: Node.js, Rust, PostgreSQL'
		],
		'sudo': [
			'Permission denied. This incident will be reported.'
		]
	};

	onMount(async () => {
		// Terminal Entrance Animation
		gsap.fromTo(terminalRef, 
			{ y: 50, opacity: 0, rotateX: 10, transformPerspective: 1000 }, 
			{ y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: 'expo.out', delay: 0.8 }
		);

		// Boot sequence simulation
		for (const line of bootSequence) {
			history = [...history, { type: 'system', text: line }];
			await new Promise(r => setTimeout(r, 300));
			await tick();
			if (contentRef) contentRef.scrollTop = contentRef.scrollHeight;
		}
		
		isBooting = false;
		// focus input
		tick().then(() => {
			if (inputRef) inputRef.focus();
		});
	});

	async function handleCommand(e: KeyboardEvent) {
		if (e.key === 'Enter' && inputValue.trim() !== '') {
			const cmd = inputValue.trim().toLowerCase();
			history = [...history, { type: 'input', text: `zee@velocity:~$ ${cmd}` }];
			
			if (cmd === 'clear') {
				history = [];
			} else if (commands[cmd]) {
				for (const line of commands[cmd]) {
					history = [...history, { type: 'output', text: line }];
				}
			} else {
				history = [...history, { type: 'output', text: `Command not found: ${cmd}. Type 'help' for available commands.` }];
			}
			
			inputValue = '';
			
			// scroll to bottom
			await tick();
			if (contentRef) {
				contentRef.scrollTop = contentRef.scrollHeight;
			}
		}
	}
</script>

<div bind:this={terminalRef} class="w-full h-[400px] rounded-2xl glass border border-white/10 overflow-hidden flex flex-col shadow-2xl shadow-cyber/5 relative group cursor-text">
	<!-- Title Bar -->
	<div class="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center gap-2 cursor-default">
		<div class="w-3 h-3 rounded-full bg-red-500/80"></div>
		<div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
		<div class="w-3 h-3 rounded-full bg-green-500/80"></div>
		<div class="ml-auto text-[10px] font-mono text-slate uppercase tracking-widest">interactive_session.exe</div>
	</div>

	<!-- Content -->
	<div bind:this={contentRef} class="p-6 flex-1 overflow-y-auto font-mono text-sm leading-relaxed space-y-2 scrollbar-hide" onclick={() => inputRef?.focus()}>
		{#each history as line}
			<div class:text-cyber={line.type === 'system'} class:text-white={line.type === 'input'} class:text-slate={line.type === 'output'} class="whitespace-pre-wrap">
				{line.text}
			</div>
		{/each}

		{#if !isBooting}
			<div class="flex items-center text-white mt-2">
				<span class="text-cyber mr-2">zee@velocity:~$</span>
				<input 
					bind:this={inputRef}
					bind:value={inputValue}
					onkeydown={handleCommand}
					type="text" 
					class="bg-transparent border-none outline-none flex-1 text-white placeholder-slate/30"
					spellcheck="false"
					autocomplete="off"
				/>
			</div>
		{/if}
	</div>
	
	<!-- Glow effect on hover -->
	<div class="absolute -inset-px bg-gradient-to-tr from-cyber/0 via-cyber/0 to-cyber/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
