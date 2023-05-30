import { useReducer, useState } from "react";

type FormState = {
  [key: string]: any;
};

type Validation = {
  rule: (value: any) => boolean;
  message: string;
};

type Validations = {
  [key: string]: Validation[];
};

type FormAction = {
  type: "SET_FIELD_VALUE";
  field: string;
  value: any;
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
};

const useFormValidation = (
  initialState: FormState,
  validations: Validations
) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD_VALUE", field: name, value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.keys(validations).forEach((fieldName) => {
      const fieldValidations = validations[fieldName];

      fieldValidations.forEach((validation) => {
        const { rule, message } = validation;
        const value = formState[fieldName];

        if (!rule(value)) {
          newErrors[fieldName] = message;
        }
      });
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const updateFieldValue = (name: string, value: any) => {
    dispatch({ type: "SET_FIELD_VALUE", field: name, value });
  };

  return {
    formState,
    errors,
    handleChange,
    validateForm,
    updateFieldValue,
  };
};

export default useFormValidation;
