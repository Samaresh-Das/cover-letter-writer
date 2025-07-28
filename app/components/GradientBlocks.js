import React from 'react'

const GradientBlocks = () => {
    return (

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.35),transparent)] blur-3xl" />
            <div className="absolute top-0 -right-40 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.25),transparent)] blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.25),transparent)] blur-3xl" />
        </div>

    )
}

export default GradientBlocks