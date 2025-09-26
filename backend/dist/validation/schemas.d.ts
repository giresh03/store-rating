import Joi from 'joi';
export declare const registerSchema: Joi.ObjectSchema<any>;
export declare const loginSchema: Joi.ObjectSchema<any>;
export declare const createUserSchema: Joi.ObjectSchema<any>;
export declare const updatePasswordSchema: Joi.ObjectSchema<any>;
export declare const createStoreSchema: Joi.ObjectSchema<any>;
export declare const ratingSchema: Joi.ObjectSchema<any>;
export declare const userFiltersSchema: Joi.ObjectSchema<any>;
export declare const storeFiltersSchema: Joi.ObjectSchema<any>;
export declare const validate: (schema: Joi.ObjectSchema) => (req: any, res: any, next: any) => any;
export declare const validateQuery: (schema: Joi.ObjectSchema) => (req: any, res: any, next: any) => any;
//# sourceMappingURL=schemas.d.ts.map