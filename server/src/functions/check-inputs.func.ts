import isBlank from 'is-blank';

// eslint-disable-next-line
export function keyIsSetAndNotEmpty<T extends object, U extends keyof T>(obj: T, key: U): boolean {
    if (key in obj) {
        if (!isBlank(obj[key])) {
            return true;
        }
    }
    return false;
}

// eslint-disable-next-line
export function objectHasRequiredAndNotEmptyKeys<T extends object, U extends keyof T>(obj: T, keys: U[]): boolean {
    const notEmptyOrUnsetArray: boolean[] = keys.map((el) => keyIsSetAndNotEmpty(obj, el));
    const d = notEmptyOrUnsetArray.find(el => !el);
    return d == undefined;
}

// eslint-disable-next-line
export function checkKeysAreNotEmptyOrNotSet<T extends object>(obj: T, allowedKeys: string[]): boolean {
    const notEmptyOrNotSet = Object.keys(obj).map(el => {
        if (allowedKeys.includes(el)) {
            const value = obj[el as keyof object];// eslint-disable-line
            if (value != '') {
                return true; // key set and value not empty
            }
            return false; // key set and value empty
        }
        return true; // key not set
    });

    const d = notEmptyOrNotSet.find(el => !el);
    return d == undefined;
}
