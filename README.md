# Provider Manager 📦

[![npm](https://img.shields.io/npm/v/@leandromatos/provider-manager?style=flat-square)](https://www.npmjs.com/package/@leandromatos/provider-manager)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/leandromatos/provider-manager/publish-package.yaml?style=flat-square&label=build)](https://github.com/leandromatos/provider-manager/actions/workflows/publish-package.yaml)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/leandromatos/provider-manager/docs.yaml?style=flat-square&label=docs)](https://github.com/leandromatos/provider-manager/actions/workflows/docs.yaml)
[![Codecov](https://img.shields.io/codecov/c/github/leandromatos/provider-manager?style=flat-square)](https://github.com/leandromatos/provider-manager)
[![GitHub](https://img.shields.io/github/license/leandromatos/provider-manager?style=flat-square)](https://github.com/leandromatos/provider-manager/blob/main/LICENSE)

**Provider Manager** is a lightweight dependency injection container designed to manage class constructors and factory functions. It allows you to register and resolve dependencies easily and supports both class-based providers and factory-based providers, giving you flexibility in how you handle your dependencies.

## Installation

Install the package using yarn or any other package manager:

```bash
yarn add @leandromatos/provider-manager
```

## Features

- Register providers using class constructors or factory functions.
- Resolve dependencies using string identifiers or directly via class constructors or factory functions.
- Automatic dependency resolution with `@Inject`.
- Simple and intuitive API for managing dependencies.

## Decorators

### `@Injectable`

The `@Injectable` decorator marks a class or factory function as a provider that can be managed by the `ProviderManager`. Without this decorator, the `ProviderManager` will not be able to handle the class or factory.

```ts
@Injectable()
class Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`)
  }
}
```

In this example, `Logger` is marked as `@Injectable`, which allows it to be registered and resolved by the `ProviderManager`.

### `@Inject`

The `@Inject` decorator injects dependencies into the constructor of a class-based provider. It tells `ProviderManager` what dependencies should be resolved when creating a class instance.

```ts
@Injectable()
class UserService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(ConfigService) private readonly configService: Config
  ) {}
}
```

In this example, the `UserService` class depends on `Logger` and `ConfigService`. The `@Inject` decorator ensures that when `UserService` is resolved, `Logger` and `ConfigService` will be automatically injected.

## Usage

Here’s a basic example that demonstrates how to use `ProviderManager` to register and resolve different types of providers.

### Example: Basic Setup

```ts
import { Inject, Injectable, ProviderManager } from '@leandromatos/provider-manager'

// A factory-based provider
type Config = {
  appName: string
  version: string
}

@Injectable()
const ConfigService = (): Config => ({
  appName: 'MyApp',
  version: '1.0.0',
})

// A class-based provider
@Injectable()
class Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`)
  }
}

// A class-based provider
@Injectable()
class DatabaseConnection {
  constructor(private connectionString: string) {}

  connect(): void {
    console.log(`Connected to database: ${this.connectionString}`)
  }
}

// A class-based provider with dependencies
@Injectable()
class UserService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(ConfigService) private readonly configService: Config
  ) {}

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name} for ${this.configService.appName}`)
  }
}
```

### Registering Providers

You can register providers using constructors, factories, or string identifiers. Below, we'll demonstrate registering various types of providers:

#### Class-based Provider

A class-based provider is a simple class that can be instantiated by the `ProviderManager`.

```ts
@Injectable()
class Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`)
  }
}

// Register a class-based provider
providerManager.registerProvider(Logger)
```

#### Factory-based Provider with String Identifier

A factory-based provider is a function that returns an instance of a class or object. You can assign a custom string identifier for later retrieval when using a factory.

```ts
@Injectable()
class DatabaseConnection {
  constructor(private connectionString: string) {}

  connect(): void {
    console.log(`Connected to database: ${this.connectionString}`)
  }
}

// Register a factory-based provider with a string identifier
providerManager.registerProvider(() => new DatabaseConnection('postgresql://main-database:5432'), 'MAIN_DATABASE')
```

#### Factory-based Provider without Identifier

You can also register a factory-based provider without using an identifier. In this case, the function itself acts as the identifier.

```ts
type Config = {
  appName: string
  version: string
}

@Injectable()
const ConfigService = (): Config => ({
  appName: 'MyApp',
  version: '1.0.0',
})

// Register a factory-based provider without an identifier
providerManager.registerProvider(ConfigService)
```

#### Class-based Provider with Dependencies

When you have a class-based provider that depends on other providers, you can use the `@Inject` decorator to inject these dependencies.

```ts
@Injectable()
class UserService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(ConfigService) private readonly configService: Config
  ) {}

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name} for ${this.configService.appName}`)
  }
}

// Register a class-based provider with dependencies
providerManager.registerProvider(UserService)
```

### Resolving Providers

Once the providers are registered, you can resolve them through the `ProviderManager` using either their constructor, factory, or string identifier.

#### Resolving a Class-based Provider

```ts
const logger = providerManager.get(Logger)
logger.log('Hello from Logger')
```

#### Resolving a Factory-based Provider with String Identifier

```ts
const mainDatabaseConnection = providerManager.get('MAIN_DATABASE')
mainDatabaseConnection.connect()
```

#### Resolving a Factory-based Provider without Identifier

```ts
const configService = providerManager.get(ConfigService)
console.log(configService.appName) // Output: MyApp
```

#### Resolving a Class-based Provider with Dependencies

When you resolve a class-based provider with dependencies, the `ProviderManager` automatically injects the necessary dependencies.

```ts
const userService = providerManager.get(UserService)
userService.createUser('John Doe')
```

### Example Summary

Here's a summary example that demonstrates registering and resolving multiple types of providers:

```ts
const providerManager = new ProviderManager()

providerManager
  .registerProvider(Logger) // Class-based provider
  .registerProvider(() => new DatabaseConnection('postgresql://main-database:5432'), 'MAIN_DATABASE') // Factory-based provider with identifier
  .registerProvider(() => new DatabaseConnection('postgresql://another-database:5432'), 'ANOTHER_DATABASE') // Factory-based provider with identifier
  .registerProvider(ConfigService) // Factory-based provider without identifier
  .registerProvider(UserService) // Class-based provider with dependencies

// Resolve providers
const logger = providerManager.get(Logger)
const mainDatabaseConnection = providerManager.get('MAIN_DATABASE')
const anotherDatabaseConnection = providerManager.get('ANOTHER_DATABASE')
const configService = providerManager.get(ConfigService)
const userService = providerManager.get(UserService)

// Using resolved services
logger.log('Application started')
mainDatabaseConnection.connect()
anotherDatabaseConnection.connect()
console.log(`App Name: ${configService.appName}`)
userService.createUser('John Doe')
```

## API

### `registerProvider<T>(provider: Constructor<T> | Factory<T>, identifier?: Constructor<T> | string): this`

Registers a provider (either a class constructor or a factory) in the `ProviderManager`.

- **provider**: The provider to register (constructor or factory).
- **identifier**: An optional string or constructor to identify the provider. If not provided, the class name is used for constructors.

### `get<T>(identifier: string | Provider<T>): T`

Retrieves a provider instance by its string identifier, constructor, or factory.

- **identifier**: The identifier (string or provider) to resolve.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
