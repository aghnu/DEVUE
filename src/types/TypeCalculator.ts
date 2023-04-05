export type CalculatorPadType = "value" | "function" | "primary" | "special";

export interface CalculatorKey {
  text: string;
  type: CalculatorPadType;
  handler: (text: string) => void;
}
