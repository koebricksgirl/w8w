import { z } from "zod"
import { tool } from "@langchain/core/tools"

function calculateSum(a: number, b: number) {
  return a + b;
}

function calculateProduct(a: number, b: number) {
  return a * b;
}

function calculatePower(base: number, exponent: number) {
  return Math.pow(base, exponent);
} 

export const tools = [
  tool(
    async (input: any) => {
      const { a, b } = input;
      const result = calculateSum(a, b);
      console.log(`Sum calculation: ${a} + ${b} = ${result}`);
      return String(result)
    },
    {
      name: "sum",
      description: "Calculate the sum of two numbers",
      schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
      }),
    }
  ),

  tool(
    async (input: any) => {
      const { a, b } = input;
      const result = calculateProduct(a, b);
      console.log(`Multiply calculation: ${a} × ${b} = ${result}`);
      return String(result);
    },
    {
      name: "multiply",
      description: "Multiply two numbers",
      schema: z.object({ a: z.number(), b: z.number() }),
    }
  ),

  tool(
    async (input: any) => {
      const { base, exponent } = input;
      const result = calculatePower(base, exponent);
      console.log(`Power calculation: ${base}^${exponent} = ${result}`);
      return String(result);
    },
    {
      name: "power",
      description: "Raise base to an exponent",
      schema: z.object({ base: z.number(), exponent: z.number() }),
    }
  ),
];
