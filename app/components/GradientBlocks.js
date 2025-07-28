import React from 'react'

const GradientBlocks = () => {
    return (
        <div>
            {/* Top Blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                {/* Violet Top Left */}
                <div className="absolute top-[-10%] left-[-15%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.35),transparent)] blur-3xl" />

                {/* Blue Top Right */}
                <div className="absolute top-[-5%] right-[-20%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.25),transparent)] blur-3xl" />

                {/* Pink Bottom Center */}
                <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.25),transparent)] blur-3xl" />
            </div>
        </div>
    )
}

export default GradientBlocks