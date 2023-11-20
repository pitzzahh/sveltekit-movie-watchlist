import { areStringsSimilar } from '$lib';
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('similarity-test', () => {
	it('check if ScienceFiction is similar to Science Fiction', () => {
		const firstString = 'ScienceFiction'
		const secondString = 'Science Fiction'
		expect(
			areStringsSimilar(firstString, secondString)
		).toBe(true);
	});
});

describe('similarity-test', () => {
	it('check if Comedy is similar to RomaticComedy', () => {
		const firstString = 'ScienceFiction'
		const secondString = 'Science Fiction'
		expect(
			areStringsSimilar(firstString, secondString)
		).toBe(false);
	});
});

describe('similarity-test', () => {
	it('check if ScienceFiction is similar to Science-Fiction', () => {
		const firstString = 'ScienceFiction'
		const secondString = 'Science-Fiction'
		expect(
			areStringsSimilar(firstString, secondString)
		).toBe(true);
	});
});