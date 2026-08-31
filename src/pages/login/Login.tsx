import {FormEvent, useState} from "react";
import {useNavigate} from 'react-router-dom'
import {useAuth} from "../../features/auth/hooks/useAuth.ts";
import {useAlert} from "../../common/alert/useAlert.ts";


export const Login = () => {
    const {showAlert} = useAlert();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {login, isLoading, isAuthenticated} = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        const {success, error} = await login(email, password)

        if (success) {
            navigate('/building')
        } else {
            setError(error || 'Credenziali non valide')
            showAlert({
                title: 'Error',
                type: "error",
                message: error as string,
            })
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex items-center justify-center gap-3">
                    <img
                        alt="Logo"
                        src="/images/logo.png"
                        className="h-15 w-auto"
                    />
                    <img
                        alt="Logo Name"
                        src="/images/logo_name.png"
                        className="h-10 w-auto"
                    />
                </div>
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-slate-900">
                    Accesso al sistema
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-slate-900">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-slate-900 outline-1 -outline-offset-1 outline-slate-300 placeholder:text-slate-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-slate-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-slate-900 outline-1 -outline-offset-1 outline-slate-300 placeholder:text-slate-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || isAuthenticated}
                            className={`cursor-pointer flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                                isLoading || isAuthenticated ? 'bg-slate-400' : 'bg-primary-500 hover:bg-primary-500'
                            }`}
                        >
                            {isLoading ? 'Accesso in corso...' : 'Accedi'}
                        </button>
                    </div>

                    {!isLoading && isAuthenticated && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-slate-600">
                                Sei gia autenticato nel sistema.{' '}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/building');
                                    }}
                                    className="font-semibold text-primary-600 hover:text-primary-500"
                                >
                                    Vai alla Dashboard
                                </a>
                            </p>
                        </div>
                    )}
                </form>

                <p className="mt-10 text-center text-sm/6 text-slate-500">
                    Credenziali demo: <span className="font-semibold">admin / admin</span>
                </p>
            </div>
        </div>
    )
}
