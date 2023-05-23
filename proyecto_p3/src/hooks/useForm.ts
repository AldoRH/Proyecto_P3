import { useState } from "react"

const useForm = (initialState: any) => {
    const [state, setState] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState((state: any) => ({ ...state, [e.target.name] : e.target.value }));
    }

    return [
        state,
        handleChange
    ];
}

export default useForm;