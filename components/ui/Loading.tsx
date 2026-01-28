import React from 'react';

interface LoadingProps {
    /**
     * Size of the loading spinner.
     * @default 'md'
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * Text to display below the spinner.
     */
    text?: string;
    /**
     * Whether to show fullscreen overlay.
     * @default false
     */
    fullScreen?: boolean;
}

export default function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
    const spinnerClass = `loading loading-spinner loading-${size}`;

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100 bg-opacity-80">
                <div className="flex flex-col items-center gap-4">
                    <span className={spinnerClass}></span>
                    {text && <p className="text-secondary font-semibold animate-pulse">{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <span className={spinnerClass}></span>
            {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
        </div>
    );
}
