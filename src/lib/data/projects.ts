export interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	link: string;
	github: string;
	color: string;
}

export const projects: Project[] = [
	{
		id: '1',
		title: 'Nexus Intelligence',
		description: 'A real-time AI analytics platform built with SvelteKit and RxJS.',
		tags: ['SvelteKit', 'TypeScript', 'Tailwind', 'AI'],
		image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
		link: '#',
		github: '#',
		color: '#00ff9d'
	},
	{
		id: '2',
		title: 'Quantum Ledger',
		description: 'Decentralized financial dashboard with high-fidelity WebGL visualizations.',
		tags: ['Three.js', 'Solidity', 'Svelte', 'WebGL'],
		image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
		link: '#',
		github: '#',
		color: '#3b82f6'
	},
	{
		id: '3',
		title: 'Velocity OS',
		description: 'A terminal-inspired personal operating system for the browser.',
		tags: ['Svelte', 'Rust', 'WASM', 'Tailwind'],
		image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800',
		link: '#',
		github: '#',
		color: '#a855f7'
	},
	{
		id: '4',
		title: 'Aether Cloud',
		description: 'Next-generation cloud infrastructure monitoring tool.',
		tags: ['Go', 'SvelteKit', 'PostgreSQL', 'Docker'],
		image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
		link: '#',
		github: '#',
		color: '#f97316'
	}
];
