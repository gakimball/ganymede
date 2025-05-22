import sexp from 'sexp';

type SExpValue = string | number | boolean | Date | SExpValue[];
type SExpFunction = (...args: Array<SExpValue | SExpFunction>) => SExpValue
type SExpScope = Record<string, SExpValue | SExpFunction | undefined>

const evaluate = (expr: SExpValue, scope: SExpScope = {}) => {
  if (!Array.isArray(expr)) {
    return expr
  }

  const [fn, ...args] = expr.map(item => {
    if (typeof item === 'string' && scope[item]) {
      return scope[item]!
    }

    return item
  })

  if (typeof fn !== 'function') {
    throw new Error(`Expected ${String(expr[0])} to be a function`)
  }

  return fn(...args)
}

export const execFormula = (input: string) => {
  return evaluate(
    sexp(input, {
      translateSymbol: value => `Symol(${value})`,
    })
  )
}
