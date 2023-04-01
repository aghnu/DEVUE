export type CalculatorPadType = 'value' | 'function' | 'primary';

export interface CalculatorKey {
    text: string,
    type: CalculatorPadType,
    handler: () => void
}