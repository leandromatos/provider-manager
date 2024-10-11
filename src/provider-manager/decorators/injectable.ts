import 'reflect-metadata'

/**
 * A decorator used to mark a class as injectable. It stores metadata about
 * the constructor's parameters to allow for dependency injection.
 *
 * @returns A class decorator.
 */
export const Injectable = (): ClassDecorator => {
  return (constructor: object) => {
    const paramTypes = Reflect.getMetadata('design:paramtypes', constructor)
    if (paramTypes) Reflect.defineMetadata('design:paramtypes', paramTypes, constructor)
  }
}
