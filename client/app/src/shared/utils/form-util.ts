import { FieldValidatorResult, FieldValidatorsResult } from '../components/component-model';
import { isEmpty, isEqualText } from './util';
import { FieldValidatorConfig, FieldValidatorType } from '../shared-model';
export function requiredValidator(config: FieldValidatorConfig): FieldValidatorResult {
  const { field = '', label, value, errorMessage = `${field || label} is required` } = config;
  return {
    field,
    errorMessage,
    value,
    valid: !isEmpty(value),
  };
}

export function equalValidator(config: FieldValidatorConfig): FieldValidatorResult {
  const {
    field = '',
    label,
    value,
    targetField,
    targetFieldLabel,
    targetFieldValue,
    errorMessage = `${field || label} and ${targetField || targetFieldLabel} are not equal`,
  } = config;
  return {
    field,
    errorMessage,
    value,
    valid: !isEqualText(value, targetFieldValue),
  };
}

export function minValidator(config: FieldValidatorConfig): FieldValidatorResult {
  const {
    field = '',
    label,
    value,
    targetValue,
    errorMessage = `${field || label} should follow the pattern`,
  } = config;
  return {
    field,
    errorMessage,
    value,
    valid: isEmpty(value) || Number(value) >= Number(targetValue),
  };
}

export function maxValidator(config: FieldValidatorConfig): FieldValidatorResult {
  const {
    field = '',
    label,
    value,
    targetValue,
    errorMessage = `${field || label} should be smaller than ${targetValue}`,
  } = config;
  return {
    field,
    errorMessage,
    value,
    valid: isEmpty(value) || Number(value) <= Number(targetValue),
  };
}

export function minLengthValidator(config: FieldValidatorConfig): FieldValidatorResult {
  const {
    field = '',
    label,
    value,
    targetValue,
    errorMessage = `${field || label} should be shorter than ${targetValue}`,
  } = config;
  return {
    field,
    errorMessage,
    value,
    valid: isEmpty(value) || ('' + value).length >= Number(targetValue),
  };
}

export function maxLengthValidator(config: FieldValidatorConfig): FieldValidatorResult {
  const {
    field = '',
    label,
    value,
    targetValue,
    errorMessage = `${field || label} should be longer than ${targetValue}`,
  } = config;
  return {
    field,
    errorMessage,
    value,
    valid: isEmpty(value) || ('' + value).length <= Number(targetValue),
  };
}

export function patternValidator(config: FieldValidatorConfig): FieldValidatorResult {
  const {
    field = '',
    label,
    value,
    targetValue,
    errorMessage = `${field || label} should follow the pattern`,
  } = config;
  const re = new RegExp(targetValue as string | RegExp, 'g');
  const valid = isEmpty(value) || re.test('' + value);
  return {
    field,
    errorMessage,
    value,
    valid,
  };
}

export function updateValidatorConfig(
  configs: FieldValidatorConfig[],
  targetConfig: FieldValidatorConfig,
): FieldValidatorConfig[] {
  return configs.map((c) => ({ ...c, ...targetConfig }));
}

export function validate(configs: FieldValidatorConfig[]): FieldValidatorsResult {
  let valid = true;
  const resultMap = new Map<string, FieldValidatorResult[]>();
  const errorMessages: string[] = [];
  configs.forEach((config) => {
    const { field = '', type } = config;
    let result;
    switch (type) {
      case FieldValidatorType.equal:
        result = equalValidator(config);
        break;
      case FieldValidatorType.min:
        result = minValidator(config);
        break;
      case FieldValidatorType.max:
        result = maxValidator(config);
        break;
      case FieldValidatorType.minLength:
        result = minLengthValidator(config);
        break;
      case FieldValidatorType.maxLength:
        result = maxLengthValidator(config);
        break;
      case FieldValidatorType.pattern:
        result = patternValidator(config);
        break;
      default:
        result = requiredValidator(config);
        break;
    }
    if (valid) {
      valid = result.valid;
    }
    if (!result.valid) {
      errorMessages.push(result.errorMessage);
    }
    const results = resultMap.get(field) || [];
    results.push(result);
    resultMap.set(field, results);
  });
  const re = {
    resultMap,
    valid,
    errorMessages,
  };
  // console.log(re);
  return re;
}
