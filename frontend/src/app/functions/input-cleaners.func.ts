import {CreateAndUpdateData} from '../services/data/data.service';
import isBlank from 'is-blank';

export function setEmptyInputToNull<Type>(input: CreateAndUpdateData<Type>) {
  for (let key in input) {
    input[key] = isBlank(input[key]) ? null : input[key];
  }
  return input;
}
