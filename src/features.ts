interface Feature {
    name: string;
    enabled: boolean;
    description?: string;
    onToggled?: ToggleFunction;
}

type ToggleFunction = (enabled: boolean) => any;

class FeatureFlags {
    private static instance: FeatureFlags;
    private _features: {[name in string]: Feature} = {};
    constructor() {
        if (FeatureFlags.instance) return FeatureFlags.instance;
        FeatureFlags.instance = this;
        return FeatureFlags.instance;
    }
    add(...feature: Array<Feature>) {
        for (let f of feature) {
            FeatureFlags.instance._features[f.name] = f;
        }
    }
    /**
     * Returns the state of all features 
     */
    status(): {[name in string]: boolean} {
        const status: {[name in string]: boolean} = {};
        Object.entries(this._features).forEach((f) => {
            status[f[0]] = f[1].enabled;
        });
        return status;
    }

    /**
     * Returns true if the named feature is enabled. Makes no promises
     * that a given feature actually exists.
     */
    enabled(name: string): boolean {
        return this._features[name]?.enabled ?? false;
    }

    /**
     * Toggles the named feature. Features that do not 
     * actually exist can not be toggled.
     * @returns whether the named feature is enabled. 
     *          Always returns false for features that 
     *          do not exist.
     */
    toggle(name: string): boolean {
        if (this._features[name] === undefined) return false;
        this._features[name].enabled = !this._features[name].enabled;
        if (this._features[name].onToggled !== undefined) {
            this._features[name].onToggled!(this._features[name].enabled);
        }
        return this._features[name].enabled;
    }

    /**
     * Adds a `toggleFeature()` function to global scope.
     */
    listen(start?: boolean): void {
        if (start === false) {
            FeatureFlags.instance.removeListener();
            return;
        }
        FeatureFlags.instance.attachListener();
    }

    private attachListener() {
        if (typeof window !== 'undefined') {
            window.toggleFeature = (name: string) => {
                FeatureFlags.instance.toggle(name);
            }
        }
        if (typeof global !== 'undefined') {
            global.toggleFeature = (name: string) => {
                FeatureFlags.instance.toggle(name);
            }
        }
    }

    private removeListener() {
        if (typeof window !== 'undefined') {
            delete window.toggleFeature;
        }
        if (typeof global !== 'undefined') {
            delete global.toggleFeature;
        }
    }
}

export const Features = new FeatureFlags();

declare global {
    namespace NodeJS {
        interface Global {
            toggleFeature?: (name: string) => void;
        }
    }
    interface Window {
        toggleFeature?: (name: string) => void; 
    }
}
