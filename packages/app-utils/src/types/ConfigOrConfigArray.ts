export type ConfigOrConfigArray<
  T extends unknown[] | unknown,
  O
> = T extends Array<unknown> ? O[] : O;
