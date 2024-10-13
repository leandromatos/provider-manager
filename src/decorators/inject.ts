import 'reflect-metadata'

import { Metadata, Provider } from '@/types'

/**
 * A decorator used to inject dependencies into constructor parameters.
 *
 * @typeParam T - The type of the provider.
 * @param identifier - The provider or string identifier to inject.
 * @returns A parameter decorator.
 */
export const Inject: <T>(identifier: Provider<T> | string) => ParameterDecorator =
  identifier => (target, propertyKey, parameterIndex) => {
    const existingInjects = (Reflect.getMetadata('design:injects', target) as Metadata[]) || []
    const id = typeof identifier === 'string' ? identifier : identifier.name
    existingInjects.push({
      parameterIndex,
      identifier: id,
    })
    Reflect.defineMetadata('design:injects', existingInjects, target)
  }
