import isBlank from 'is-blank';

export interface GenericValidatorFunctions {
    validate: () => boolean;
}

export abstract class GenericValidator {
    private valid: boolean;
}

export class Validator<T> extends GenericValidator implements GenericValidatorFunctions {
    constructor(private _value: T, private _required: boolean) {
        super();
    }

    get value(): T {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
    }

    get required(): boolean {
        return this._required;
    }

    set required(value: boolean) {
        this._required = value;
    }

    public validate(): boolean {
        if(this.required) {
            // Field is required -> may not be blank but has to be valid
            return !this.isBlank() && this.validate();
        }
        // Field not is required -> may be blank and not valid or not blank and valid
        return this.isBlank() ? true : this.validate();
    }

    isBlank(): boolean {
        return isBlank(this.value);
    }
}
