# feature-flags
> Simple feature flags

`@justintout/feature-flags` exports a singleton `Features` that allows you to manage boolean feature flags.

## Installation

```
npm i @justintout/feature-flags
```

## Usage 

```typescript
import { Features } from '@justintout/feature-flags';

Features.add(
    {name: 'debugMode', enabled: false, onToggled: (_) => console.info('debug mode has been enabled!')}
);

Features.listen();

if (Features.enabled('debugMode')) {
    console.info('debug mode is enabled!');
}

Features.toggle('debugMode');
```

### Features

Features are objects with a `name` that track a boolean `enabled` value. Features can carry an optional `description`. 

Features can be "dynamic" by providing a `ToggleFunction` in `onToggled`. The `onToggled` function will run whenever the feature is toggled. The `onToggled` function will not run when the feature is initially added.

### Add features 

Features are added with `Features.add()`. Adding a feature with an existing name will overwrite the feature. 

```
> Features.add({name: 'debugMode', enabled: false});
```

### Enabled feature

Test if a feature is enabled with `Features.enabled()`. This returns the current state of the feature. This returns `false` if the feature doesn't exist.

```
> Features.enabled('debugMode');
false
```

### Toggle features

Features are toggled with `Features.toggle()`. This returns the new state of the feature. 

Features that don't exist can not be toggled. `Features.toggle()` will silently return `false`.

```
> Features.toggle('debugMode');
true
```

### Features status

Get the state of all features with `Features.status()`. This returns an object with added features as keys and their current state as values. 

```
> Features.status();
{ debugMode: true }
```

### Toggle features across the global scope

It may be helpful to be able to toggle features outside of the package itself. Calling `Features.listen()` will add a function `toggleFeature()` to global scope. This would allow a debug page to change feature settings on the fly.

Passing `false` will remote `toggleFeatures()`.

``` 
> Features.listen();
undefined
> global.toggleFeature('debugMode');
true
```

## Contributing

Pull requests are welcome. 