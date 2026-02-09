import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from './app/store';

type Props = {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>
}