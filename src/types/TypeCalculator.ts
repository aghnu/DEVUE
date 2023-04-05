export type CalculatorPadType = "value" | "function" | "primary" | "special";

export interface CalculatorKey {
  text: string;
  handler: (text: string) => void;
}
