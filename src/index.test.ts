import { areStringsSimilar } from '$lib';
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('similarity-test', () => {
	it('check if ScienceFiction is similar to Science Fiction', async () => {
		const firstString = 'ScienceFiction'
		const secondString = 'Science Fiction'
		const response = areStringsSimilar(firstString, secondString)
		expect(response).toBe(true);
	});
});

describe('similarity-test', () => {
	it('check if Comedy is similar to RomaticComedy', async () => {
		const firstString = 'ScienceFiction'
		const secondString = 'Science Fiction'
		const response = areStringsSimilar(firstString, secondString)
		expect(response).toBe(false);
	});
});

describe('similarity-test', () => {
	it('check if ScienceFiction is similar to Science-Fiction', async () => {
		const firstString = 'ScienceFiction'
		const secondString = 'Science-Fiction'
		const response = areStringsSimilar(firstString, secondString)
		expect(response).toBe(true);
	});
});

describe('similarity-test', () => {
	it('check if Great movie similar to Test Movie 5', async () => {
		const firstString = ' Great Movie'
		const secondString = 'Test Movie 5'
		const response = areStringsSimilar(secondString, firstString)
		expect(response).toBe(false);
	});
});