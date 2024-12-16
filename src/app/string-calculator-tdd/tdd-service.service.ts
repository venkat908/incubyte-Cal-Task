"use strict";
import { Injectable } from '@angular/core';
import { NumberInput } from './numberInput.model'; // Assuming NumberInput is imported here

@Injectable({
  providedIn: 'root'
})
export class TddServiceService {

  add(numbers: string | any): number {
    let components = this.getComponents(numbers);
    let delimiter = components.delimiter;
    numbers = components.numbers;

    if (!numbers) return 0;

    // Split the string by the delimiter (newlines and commas), ensuring multiple delimiters are handled
    let values = numbers.split(delimiter);

    let sum = 0;
    let invalidValues: number[] = [];

    // Process each value
    for (let value of values) {
      let numberValue = parseInt(value, 10);  // Explicit base 10 parsing
      if (isNaN(numberValue)) {
        continue;  // Skip if the value is not a valid number
      }

      if (numberValue < 0) {
        invalidValues.push(numberValue);
      } else {
        sum += numberValue > 1000 ? 0 : numberValue; // Ignore numbers > 1000
      }
    }

    // Handle negative values
    if (invalidValues.length) {
      throw new Error('No negative values are allowed: ' + invalidValues.join(', '));
    }

    return sum || 0;  // If sum is 0, ensure the result is 0
  }

  // Get components: delimiter and numbers
  getComponents(input: string | any): NumberInput {
    let num = input;
    let delimiter = /[\n,]+/; // Default delimiters: newline and comma, one or more times
    let numbers = num;

    if (num.startsWith('//')) {
      // Custom delimiter: e.g., "//;\n1;2"
      delimiter = new RegExp(this.escapeRegExp(num.split('\n')[0].substr(2))); // Capture custom delimiter
      numbers = num.split('\n').slice(1).join('\n'); // Remove the delimiter definition
    }

    return new NumberInput(delimiter, numbers);
  }

  // Escape special characters in delimiter string for regex
  escapeRegExp(regExpString: string): string {
    regExpString = regExpString.replace(/[\-\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    return regExpString.replace('][', '|').replace(/\[|\]/g, '');
  }
}
