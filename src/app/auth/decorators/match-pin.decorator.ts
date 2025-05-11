import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    // Ambil nama properti terkait (contoh: 'password')
    const [relatedPropertyName] = args.constraints;
    // Ambil nilai properti terkait dari objek DTO (contoh: password)
    const relatedValue = (args.object as { pin: string })[relatedPropertyName];
    // Bandingkan nilai properti yang sedang divalidasi (repeatPassword) dengan nilai password
    return value === relatedValue;
  }
}

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
