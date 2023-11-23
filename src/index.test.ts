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
		const response = checkSimilarity(firstString, secondString);
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
		const response = checkSimilarity(firstString, secondString, false, 1);
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
		const response = checkSimilarity(firstString, secondString);
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
		const response = checkSimilarity(firstString, secondString);
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
		const response = checkSimilarity(firstString, secondString);
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
	const firstString = 'action';
	const expected = 'Action';
	it(`check if ${firstString} is converted to pascal case ${expected}`, async () =>
		expect(toPascalCase(firstString)).toBe(expected));
});

describe('pascal-case-test', () => {
	const firstString = 'fantasy';
	const expected = 'Fantasy';
	it(`check if ${firstString} is converted to pascal case ${expected}`, async () =>
		expect(toPascalCase(firstString)).toBe(expected));
});

describe('pascal-case-test', () => {
	const firstString = 'romantic-comedy';
	const expected = 'RomanticComedy';
	it(`check if ${firstString} is converted to pascal case ${expected}`, async () =>
		expect(toPascalCase(firstString)).toBe(expected));
});

describe('pascal-case-test', () => {
	const firstString = 'romantic comedy';
	const expected = 'RomanticComedy';
	it(`check if ${firstString} is converted to pascal case ${expected}`, async () =>
		expect(toPascalCase(firstString)).toBe(expected));
});

describe('pascal-case-test', () => {
	const firstString = 'romantic_comedy';
	const expected = 'RomanticComedy';
	it(`check if ${firstString} is converted to pascal case ${expected}`, async () =>
		expect(toPascalCase(firstString)).toBe(expected));
});

describe('pascal-case-test', () => {
	const firstString = 'RomanticComedy';
	const expected = 'RomanticComedy';
	it(`check if ${firstString} is converted to pascal case ${expected}`, async () =>
		expect(toPascalCase(firstString)).toBe(expected));
});

