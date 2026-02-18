import React from 'react';

const Background = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[#000000]">
                {/* Blob 1 - Green */}
                <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob bg-green-900"></div>
                {/* Blob 2 - Emerald */}
                <div className="absolute top-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000 bg-emerald-900"></div>
                {/* Blob 3 - Teal */}
                <div className="absolute bottom-[-30%] left-[10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000 bg-teal-900"></div>
                {/* Blob 4 - Lime (Accent) */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-6000 bg-lime-900"></div>
            </div>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        </div>
    );
};

export default Background;
