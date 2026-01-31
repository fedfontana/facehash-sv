<script lang="ts">
	import { Facehash, Avatar, AvatarImage, AvatarFallback } from '$lib/index.js';

	const testNames = [
		'facehash',
		'john@example.com',
		'alice',
		'Bob Smith',
		'Charlie Brown',
		'diana@test.org',
		'eve.johnson',
		'frank_123',
		'grace_hopper'
	];

	const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
</script>

<svelte:head>
	<title>Facehash Svelte Demo</title>
</svelte:head>

<main>
	<h1>Facehash Svelte Demo</h1>

	<section>
		<h2>Basic Facehash Components</h2>
		<p>Same string = same face. Always.</p>
		<div class="grid">
			{#each testNames as name}
				<div class="card">
					<Facehash {name} size={80} />
					<!-- <Facehash {name} size={80} {colors} /> -->
					<span class="name">{name}</span>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2>Variants</h2>
		<div class="row">
			<div class="demo">
				<Facehash name="gradient" size={100} variant="gradient" {colors} />
				<span>gradient (default)</span>
			</div>
			<div class="demo">
				<Facehash name="solid" size={100} variant="solid" {colors} />
				<span>solid</span>
			</div>
		</div>
	</section>

	<section>
		<h2>3D Intensity</h2>
		<div class="row">
			<div class="demo">
				<Facehash name="test" size={80} intensity3d="none" {colors} />
				<span>none</span>
			</div>
			<div class="demo">
				<Facehash name="test" size={80} intensity3d="subtle" {colors} />
				<span>subtle</span>
			</div>
			<div class="demo">
				<Facehash name="test" size={80} intensity3d="medium" {colors} />
				<span>medium</span>
			</div>
			<div class="demo">
				<Facehash name="test" size={80} intensity3d="dramatic" {colors} />
				<span>dramatic</span>
			</div>
		</div>
	</section>

	<section>
		<h2>Avatar with Image Fallback</h2>
		<p>When image fails to load, Facehash shows as fallback.</p>
		<div class="row">
			<div class="demo">
				<Avatar style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden;">
					<AvatarImage src="/nonexistent.jpg" alt="User" />
					<AvatarFallback name="John Doe" facehashProps={{ colors }} />
				</Avatar>
				<span>Image failed → Facehash</span>
			</div>
			<div class="demo">
				<Avatar style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden;">
					<AvatarImage src="/nonexistent.jpg" alt="User" />
					<AvatarFallback name="Alice Smith" facehash={false} />
				</Avatar>
				<span>Image failed → Initials</span>
			</div>
		</div>
	</section>

	<section>
		<h2>API Endpoint</h2>
		<p>Try the avatar API: <a href="/api/avatar?name=test">/api/avatar?name=test</a></p>
		<div class="row">
			<img src="/api/avatar?name=john" alt="John avatar" width="80" height="80" />
			<img src="/api/avatar?name=alice&variant=solid" alt="Alice avatar" width="80" height="80" />
			<img src="/api/avatar?name=bob&showInitial=false" alt="Bob avatar" width="80" height="80" />
		</div>
	</section>
</main>

<style>
	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: #1f2937;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #374151;
	}

	section {
		margin-bottom: 3rem;
	}

	p {
		color: #6b7280;
		margin-bottom: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 1.5rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.name {
		font-size: 0.75rem;
		color: #6b7280;
		text-align: center;
		word-break: break-all;
	}

	.row {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.demo span {
		font-size: 0.875rem;
		color: #6b7280;
	}

	a {
		color: #3b82f6;
	}

	img {
		border-radius: 50%;
	}
</style>
