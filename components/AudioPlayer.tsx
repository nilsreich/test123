'use client'; // Diese Komponenten sind interaktiv und laufen im Browser

import React, { useRef, useEffect, useState } from 'react';

const AudioPlayer = ({ src }: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => setDuration(audio.duration);
        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
        };
    }, []);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
            <audio ref={audioRef} src={src} className="hidden"></audio>
            <div className="flex items-center gap-4">
                <button onClick={togglePlayPause} className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition-transform hover:scale-105 active:scale-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        {isPlaying ? (
                            <path fillRule="evenodd" d="M5.25 7.5A2.25 2.25 0 0 0 3 9.75v4.5A2.25 2.25 0 0 0 5.25 16.5h3A2.25 2.25 0 0 0 10.5 14.25v-4.5A2.25 2.25 0 0 0 8.25 7.5h-3Zm9 0A2.25 2.25 0 0 0 12 9.75v4.5A2.25 2.25 0 0 0 14.25 16.5h3A2.25 2.25 0 0 0 19.5 14.25v-4.5A2.25 2.25 0 0 0 17.25 7.5h-3Z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        )}
                    </svg>
                </button>
                <div className="flex-1">
                    <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-400">
                        <p>Erklärung anhören</p>
                        <div>
                            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                        <div style={{ width: `${progress}%` }} className="h-2 rounded-full bg-sky-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer