import { useReducer } from "react";

const formReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.payload.name]: action.payload.value };
    default:
      return state;
  }
};

const useForm = (initialState: any) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "CHANGE", payload: { name, value } });
  };

  return [state, handleChange];
};

export default useForm;
