"use strict";
import { Injectable } from '@angular/core';
import { NumberInput } from "./numberInput.model";

@Injectable({
  providedIn: 'root'
})
export class TddServiceService {

  add(numbers: string | any): number {
    let components = this.getComponents(numbers);
    let delimiter = components.delimiter;
    numbers = components.numbers;

    if (!numbers) return 0; 
    let values = numbers.split(delimiter);
    let sum = 0;
    let invalidValues: number[] = [];

    // Process each value
    for (let value of values) {
      let numberValue = parseInt(value);
      if (numberValue < 0) {
        invalidValues.push(numberValue);
      } else {
        sum += numberValue > 1000 ? 0 : numberValue; 
      }
    }

    // Handle negative values
    if (invalidValues.length) {
      throw new Error('No negative values are allowed: ' + invalidValues.join(', '));
    }

    return sum || 0;
  }

  // Get components: delimiter and numbers
  getComponents(input: string | any): NumberInput {
    let num = input;
    let delimiter = /,|\n/; // Default delimiters (comma and newline)
    let numbers = num;

    if (num.startsWith('//')) {
      // Custom delimiter: e.g., "//;\n1;2"
      delimiter = new RegExp(this.escapeRegExp(num.split('\n').shift()?.substr(2) || ','));
      numbers = num.replace(/^\/\/.+\n/, '');
    }

    return new NumberInput(delimiter, numbers);
  }

  // Escape special characters in delimiter string for regex
  escapeRegExp(regExpString: string): string {
    regExpString = regExpString.replace(/[\-\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    return regExpString.replace('][', '|').replace(/\[|\]/g, '');
  }
}
