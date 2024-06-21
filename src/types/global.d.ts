declare module '*.module.css' {
  const styles: {
    [name: string]: string;
  }

  export default styles
}

declare module 'bind-methods' {
  const bindMethods: (obj: unknown) => void;

  export default bindMethods
}
