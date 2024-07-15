import { getYear } from 'date-fns/getYear';
import Formula from 'fparser';

const functions = {
  if: (condition: number, ifTrue: number, ifFalse: number) => {
    return condition ? ifTrue : ifFalse
  },
  year: (date: number) => {
    return date ? getYear(date) : undefined
  }
}

export const createFormula = (text: string): Formula => {
  const formula = new Formula(text)
  Object.assign(formula, functions)
  return formula
}
