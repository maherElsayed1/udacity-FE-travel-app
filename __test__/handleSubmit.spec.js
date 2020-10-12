import { handleSubmit } from "../src/client/js/app";

describe('Testing the submit functionality', () => {
    test('Testing the handleSubmit() function', () => {
        expect(handleSubmit).toBeDefined();
    });
    test('It should return true as handleSubmit is a function', () => {
        expect(typeof handleSubmit).toBe('function');
    });
});
