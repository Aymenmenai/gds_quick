import LogoLoading from '@/components/design/logo-loading';
import React from 'react';

const Loading = () => {
    return (
        <div className='bg-black/40 absolute top-0 left-0 w-screen h-screen z-10  flex justify-center items-center'>
            <LogoLoading/>
        </div>
    );
}

export default Loading;
