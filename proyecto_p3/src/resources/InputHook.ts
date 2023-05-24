export type InputHook<T> = [
    T,
    (e: React.ChangeEvent<HTMLInputElement>) => void,
    boolean,
    string,
    (newValue: T) => void
  ];