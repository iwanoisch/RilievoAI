import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {start} from "../slice/initSlice.ts";

export const useInit = () => {
    const dispatch = useAppDispatch()
    const isStarted = useAppSelector((state) => state.init.start);

    return {
        isStarted,
        setStart: (value: boolean) => dispatch(start(value)),
    };
};
