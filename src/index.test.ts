import { areStringsSimilar as checkSimilarity, toPascalCase } from '$lib';
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('similarity-test', () => {
	const firstString = 'ScienceFiction';
	const secondString = 'Science Fiction';
	const expected = true;
	it(`check if ${firstString} is ${
		expected ? 'similar' : 'not similar'
	} to ${secondString}`, async () => {
		const response = checkSimilarity(firstString, secondString, true);
		expect(response).toBe(expected);
	});
});

describe('similarity-test', () => {
	const firstString = 'Comedy';
	const secondString = 'RomaticComedy';
	const expected = false;
	it(`check if ${firstString} is ${
		expected ? 'similar' : 'not similar'
	} to ${secondString}`, async () => {
		const response = checkSimilarity(firstString, secondString, true, 1);
		expect(response).toBe(expected);
	});
});

describe('similarity-test', () => {
	const firstString = 'ScienceFiction';
	const secondString = 'Science-Fiction';
	const expected = true;
	it(`check if ${firstString} is ${
		expected ? 'similar' : 'not similar'
	} to ${secondString}`, async () => {
		const response = checkSimilarity(firstString, secondString, true);
		expect(response).toBe(expected);
	});
});

describe('similarity-test', () => {
	const firstString = 'ScienceFiction';
	const secondString = 'Action';
	const expected = false;
	it(`check if ${firstString} is ${
		expected ? 'similar' : 'not similar'
	} to ${secondString}`, async () => {
		const response = checkSimilarity(firstString, secondString, true);
		expect(response).toBe(expected);
	});
});

describe('similarity-test', () => {
	const firstString = 'Action';
	const secondString = 'Romance';
	const expected = false;
	it(`check if ${firstString} is ${
		expected ? 'similar' : 'not similar'
	} to ${secondString}`, async () => {
		const response = checkSimilarity(firstString, secondString, true);
		expect(response).toBe(expected);
	});
});

describe('similarity-test', () => {
	const firstString = 'Great Movie';
	const secondString = 'Test Movie 5';
	const expected = false;
	it(`check if ${firstString} is ${
		expected ? 'similar' : 'not similar'
	} to ${secondString}`, async () => {
		const response = checkSimilarity(firstString, secondString);
		expect(response).toBe(expected);
	});
});

describe('similarity-test', () => {
	const firstString = 'Loki Season 1';
	const secondString = 'Loki Season 2';
	const expected = false;
	it(`check if ${firstString} is ${
		expected ? 'similar' : 'not similar'
	} to ${secondString}`, async () => {
		const response = checkSimilarity(firstString, secondString);
		expect(response).toBe(expected);
	});
});

describe('pascal-case-test', () => {
	it("check if 'action' is converted to pascal case 'Action'", async () =>
		expect(toPascalCase('action')).toBe('Action'));
});

describe('pascal-case-test', () => {
	it("check if 'fantasy' is converted to pascal case 'Fantasy'", async () =>
		expect(toPascalCase('fantasy')).toBe('Fantasy'));
});

describe('pascal-case-test', () => {
	it("check if 'romantic-comedy' is converted to pascal case 'RomanticComedy'", async () =>
		expect(toPascalCase('romantic-comedy')).toBe('RomanticComedy'));
});
