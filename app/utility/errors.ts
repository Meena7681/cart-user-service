import { ValidationError, validate } from "class-validator";

export const AppValidationError = async (
  input: any
): Promise<ValidationError[] | false> => {
  const error = await validate(input, {
    AppValidationError: { target: true },
  });
  if (error.length) {
    return error;
  }
  return false;
};
