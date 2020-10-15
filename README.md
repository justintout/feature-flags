# feature-flags
> Simple feature flags

`feature-enabled` exports a singleton `Features` that allows you to manage boolean feature flags.

## Installation

```
npm i feature-enabled
```

## Usage 

```typescript
import { Features } from '@justintout/feature-flags';

Features.add(
    {name: 'debugMode', enabled: false, onToggled: (_) => console.info('debug mode has been enabled!')}
);

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

## Contributing

Pull requests are welcome. 