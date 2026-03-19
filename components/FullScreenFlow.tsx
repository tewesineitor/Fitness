import React, { ReactNode, useEffect } from 'react';
import { AppContext } from '../contexts';

interface FullScreenFlowProps {
  children: ReactNode;
}

const FullScreenFlow: React.FC<FullScreenFlowProps> = ({ children }) => {
    const { dispatch } = React.useContext(AppContext)!;

    useEffect(() => {
        dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: false });
        // On unmount, ensure the nav is visible again.
        return () => {
            dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true });
        };
    }, [dispatch]);

    return (
        <div className="fixed inset-0 z-20 animate-fade-in-up">
            {/* 
              The explicit background div has been removed.
              This container is now transparent, allowing the animated gradient 
              from the main body to show through, ensuring perfect visual 
              consistency across all app screens.
            */}
            <div className="relative z-10 h-full w-full max-w-3xl mx-auto flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default FullScreenFlow;