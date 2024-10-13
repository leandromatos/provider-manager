/**
 * Represents a class constructor that can be instantiated with any number of arguments.
 *
 * @typeParam T - The type of the class instance being created.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- We must use any here to allow for any type of arguments
export type Constructor<T> = new (...args: any[]) => T

/**
 * Represents a factory function that returns an instance of the specified type.
 *
 * @typeParam T - The type of the instance returned by the factory.
 */
export type Factory<T> = () => T

/**
 * Represents a provider, which can either be a class constructor or a factory function.
 *
 * @typeParam T - The type of the instance provided by the provider.
 */
export type Provider<T> = Constructor<T> | Factory<T>
