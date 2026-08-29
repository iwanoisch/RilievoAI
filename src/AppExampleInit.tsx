import {useEffect} from 'react'
import {RootState, useAppDispatch} from "./store/store.ts";
import {start} from "./features/init/slice/initSlice.ts";
import {useSelector} from "react-redux";
import {useInit} from "./features/init/hooks/useInit.ts";

function AppExampleInit() {
    // Esempio con un custom Hook di init
    const {isStarted, setStart} = useInit();

    const init = useSelector((state: RootState) => state.init)
    const dispatch = useAppDispatch();

    useEffect(() => {
        setTimeout(() => {
            dispatch(start(true)); // Imposta start a true all'atterraggio
        }, 5000);
    }, [dispatch]);


    useEffect(() => {
        setTimeout(() => {
            setStart(false)// Imposta start a true all'atterraggio
        }, 7000);
    }, [dispatch, setStart]);


    return (
        <>
            <div className="mx-auto max-w-4xl px-8 py-16 text-center">

                <div className="my-8 space-y-4">
                    <p className="text-xl">
                        Redux state: <span className="font-semibold text-blue-400">
                        {init.start ? 'Started' : 'Not started'}
                    </span>
                    </p>
                    <p className="text-xl">
                        Hook state: <span className="font-semibold text-blue-400">
                        {isStarted ? 'Started' : 'Not started'}
                    </span>
                    </p>
                </div>

            </div>
        </>
    )
}

export default AppExampleInit
