// src/ia/components/ChatMessage.jsx

import { memo } from "react";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const parseLinks = (text) => {
    const parts = text.split(URL_REGEX);
    return parts.map((part, i) => {
        if (URL_REGEX.test(part)) {
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-80 break-all"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

export const ChatMessage = memo(({ message }) => {
    const isUser = message.from === "user";
    const isError = message.isError;
    const isLoading = message.isLoading;

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
                ? "bg-blue-500 text-white"
                : isError
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}>

                {!isUser && (
                    <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs">🤖</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm whitespace-pre-wrap break-words ${isLoading ? 'animate-pulse' : ''}`}>
                                {parseLinks(message.text)}
                            </div>
                            {isLoading && (
                                <div className="flex gap-1 mt-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isUser && (
                    <div className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
});