import Formula from 'fparser';
import { DatabaseField, DatabaseFieldType } from '../types/database';
import { logger } from './logger';
import { getYear } from 'date-fns/getYear';

const functions = {
  if: (condition: number, ifTrue: number, ifFalse: number) => {
    return condition ? ifTrue : ifFalse
  },
  year: (date: number) => {
    return date ? getYear(date) : undefined
  }
}

export const parseFormulaDef = (input: string): DatabaseField => {
  const [fieldName, ...rest] = input.split(' ')
  const formulaText = rest.join(' ')
  let formula
  let error

  try {
    formula = new Formula(formulaText)
    Object.assign(formula, functions)
  } catch (err) {
    logger.warn('Error parsing formula', {
      formula: formulaText,
      error: err,
    })
    error = `Error parsing this formula\n\n${formulaText}\n\n${(err as Error).message}`
  }

  return {
    name: fieldName,
    type: DatabaseFieldType.FORMULA,
    formula,
    error,
  }
}
