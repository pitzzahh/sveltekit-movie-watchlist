<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;

	const invoices = [
		{
			invoice: 'INV001',
			paymentStatus: 'Paid',
			totalAmount: '$250.00',
			paymentMethod: 'Credit Card'
		},
		{
			invoice: 'INV002',
			paymentStatus: 'Pending',
			totalAmount: '$150.00',
			paymentMethod: 'PayPal'
		},
		{
			invoice: 'INV003',
			paymentStatus: 'Unpaid',
			totalAmount: '$350.00',
			paymentMethod: 'Bank Transfer'
		},
		{
			invoice: 'INV004',
			paymentStatus: 'Paid',
			totalAmount: '$450.00',
			paymentMethod: 'Credit Card'
		},
		{
			invoice: 'INV005',
			paymentStatus: 'Paid',
			totalAmount: '$550.00',
			paymentMethod: 'PayPal'
		},
		{
			invoice: 'INV006',
			paymentStatus: 'Pending',
			totalAmount: '$200.00',
			paymentMethod: 'Bank Transfer'
		},
		{
			invoice: 'INV007',
			paymentStatus: 'Unpaid',
			totalAmount: '$300.00',
			paymentMethod: 'Credit Card'
		}
	];

	$: ({ movies } = data);
</script>

<Table.Root>
	<Table.Caption>A list of your movie list.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Title</Table.Head>
			<Table.Head>Runtime</Table.Head>
			<Table.Head>Rating</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each invoices as invoice, i (i)}
			<Table.Row>
				<Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
				<Table.Cell>{invoice.paymentStatus}</Table.Cell>
				<Table.Cell>{invoice.paymentMethod}</Table.Cell>
				<Table.Cell class="text-right">{invoice.totalAmount}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>