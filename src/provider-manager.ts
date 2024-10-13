import 'reflect-metadata'

import { Constructor, Factory, Metadata, Provider } from '@/types'

/**
 * A class responsible for managing dependencies and resolving them through
 * a provider system. Providers can be class constructors or factories.
 */
export class ProviderManager {
  private dependencies: Map<string, Provider<unknown>> = new Map()

  /**
   * Registers a provider in the container. The provider can be a class or a factory.
   *
   * @typeParam T - The type of the provider.
   * @param provider - The class or factory function to register.
   * @param identifier - An optional identifier for the provider. If not provided,
   * the class name will be used for classes. Factories require an explicit identifier.
   * @returns The current instance of the ProviderManager for chaining.
   * @throws Error if a factory is registered without an identifier.
   */
  registerProvider<T>(provider: Constructor<T> | Factory<T>, identifier?: Constructor<T> | string): this {
    const id = this.getProviderIdentifier(identifier || provider)
    this.dependencies.set(id, provider)

    return this
  }

  /**
   * Retrieves an instance of the provider from the container.
   *
   * @typeParam T - The type of the provider.
   * @param identifier - The string identifier or the provider constructor/factory.
   * @returns An instance of the provider.
   * @throws Error if the provider is not registered.
   */
  get<T>(identifier: string | Provider<T>): T {
    const id = this.getProviderIdentifier(identifier)
    const provider = this.dependencies.get(id)
    if (!provider) throw new Error(`Dependency not registered: ${id}`)

    return this.resolveProvider(provider) as T
  }

  /**
   * Resolves the identifier for a provider, either from its constructor, factory, or a string.
   *
   * @typeParam T - The type of the provider.
   * @param provider - The provider or its identifier.
   * @returns The identifier of the provider.
   * @throws Error if the provider is invalid or a factory is registered without a string identifier.
   */
  private getProviderIdentifier<T>(provider: Provider<T> | string): string {
    if (this.isString(provider)) return provider
    if (this.isConstructor(provider)) return provider.name
    if (this.isFactory(provider)) throw new Error('Factories must be registered with an explicit string identifier')
    throw new Error('Invalid provider type')
  }

  /**
   * Resolves a provider, either by instantiating a class or invoking a factory function.
   *
   * @typeParam T - The type of the provider.
   * @param provider - The provider to resolve.
   * @returns The resolved instance of the provider.
   * @throws Error if the provider is of an invalid type.
   */
  private resolveProvider<T>(provider: Provider<T>): T {
    if (this.isConstructor(provider)) return this.resolveConstructor(provider)
    if (this.isFactory(provider)) return this.resolveFactory(provider)
    throw new Error('Invalid provider')
  }

  /**
   * Checks if a given value is a string.
   *
   * @param provider - The value to check.
   * @returns `true` if the value is a string, otherwise `false`.
   */
  private isString(provider: unknown): provider is string {
    return typeof provider === 'string'
  }

  /**
   * Checks if a provider is a constructor.
   *
   * @typeParam T - The type of the provider.
   * @param provider - The provider to check.
   * @returns `true` if the provider is a constructor, otherwise `false`.
   */
  private isConstructor<T>(provider: Provider<T>): provider is Constructor<T> {
    return typeof provider === 'function' && provider.prototype !== undefined
  }

  /**
   * Resolves a constructor-based provider by instantiating it and injecting any dependencies.
   *
   * @typeParam T - The type of the provider.
   * @param provider - The class constructor to resolve.
   * @returns The instantiated provider.
   */
  private resolveConstructor<T>(provider: Constructor<T>): T {
    const params = this.getConstructorParams<T>(provider)

    return new provider(...params)
  }

  /**
   * Checks if a provider is a factory function.
   *
   * @typeParam T - The type of the provider.
   * @param provider - The provider to check.
   * @returns `true` if the provider is a factory, otherwise `false`.
   */
  private isFactory<T>(provider: Provider<T>): provider is Factory<T> {
    return typeof provider === 'function' && provider.prototype === undefined
  }

  /**
   * Resolves a factory-based provider by invoking the factory function.
   *
   * @typeParam T - The type of the provider.
   * @param provider - The factory function to resolve.
   * @returns The result of the factory function.
   */
  private resolveFactory<T>(provider: Factory<T>): T {
    return provider()
  }

  /**
   * Retrieves the constructor parameters for a provider by inspecting the metadata
   * injected via the `Inject` decorator.
   *
   * @typeParam T - The type of the provider.
   * @param constructor - The class constructor for which to retrieve parameters.
   * @returns An array of resolved constructor parameters.
   */
  private getConstructorParams<T>(constructor: Constructor<T>): Array<T> {
    const injects: Metadata[] = Reflect.getMetadata('design:injects', constructor) || []
    const sortedInjects = injects.sort((a, b) => a.parameterIndex - b.parameterIndex)

    return sortedInjects.map(inject => this.get(inject.identifier))
  }
}
