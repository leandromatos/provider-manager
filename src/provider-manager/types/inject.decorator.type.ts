/**
 * Represents metadata about a constructor parameter that is used for dependency injection.
 */
export type Metadata = {
  /**
   * The index of the parameter in the constructor's argument list.
   */
  parameterIndex: number

  /**
   * The identifier of the dependency to inject, which can be a class name or a string identifier.
   */
  identifier: string
}
