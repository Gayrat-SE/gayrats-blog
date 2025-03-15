'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

declare global {
    interface Window {
        TelegramLoginWidget: {
            dataOnauth: (user: any) => void;
        };
    }
}

export default function SignIn() {
    useEffect(() => {
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'gayratsblog_bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '8');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-userpic', 'false');
        script.setAttribute('data-callback-url', 'http://127.0.0.1:3000');
        script.async = true;

        // Add script to document
        const container = document.getElementById('telegram-login-container');
        if (container) {
            container.innerHTML = ''; // Clear previous content
            container.appendChild(script);
        }

        // Set up auth handler
        window.TelegramLoginWidget = {
            dataOnauth: (user) => {
                signIn('credentials', {
                    telegramData: JSON.stringify(user),
                    callbackUrl: '/',
                });
            },
        };

        return () => {
            // Cleanup
            if (container) {
                container.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Sign in to your blog
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Use Telegram to authenticate
                    </p>
                </div>
                <div id="telegram-login-container" className="mt-8 flex justify-center">
                    {/* Telegram login widget will be inserted here */}
                </div>
            </div>
        </div>
    );
} 