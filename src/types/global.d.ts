declare module '*.module.css' {
  const styles: {
    [name: string]: string;
  }

  export default styles
}

declare module '*.png' {
  const path: string

  export default path
}

declare module 'bind-methods' {
  const bindMethods: (obj: unknown) => void;

  export default bindMethods
}

declare module 'get-ext' {
  const getExt: (path: string) => string;

  export default getExt
}
