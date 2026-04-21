import { useState, useRef, useEffect } from "react";

const models = [
    { label: "LLaMA 3.1 8B Instant ⚡", value: "llama-3.1-8b-instant", speed: "fastest" },
    { label: "LLaMA 3.3 70B", value: "llama-3.3-70b-versatile", speed: "smart" },
    { label: "GPT OSS 20B", value: "openai/gpt-oss-20b", speed: "balanced" },
];

export default function CustomDropdown({ model, setModel }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = models.find(m => m.value === model) || models[0];

    return (
        <div className="relative w-full max-w-sm text-sm z-30" ref={dropdownRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="w-full text-left bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-lg flex justify-between items-center outline-none transition-all duration-200 hover:border-gray-400"
            >
                {selected?.label || "Select Model"}
                <svg
                    className={`w-5 h-5 ml-2 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <ul className="absolute w-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white text-gray-800 shadow-lg z-50 py-1">
                    {models.map((m) => (
                        <li
                            key={m.value}
                            onClick={() => {
                                setModel(m.value);
                                setOpen(false);
                            }}
                            className={`px-4 py-2.5 cursor-pointer transition-colors duration-150 flex justify-between items-center ${model === m.value ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"
                                }`}
                        >
                            <span>{m.label}</span>
                            <span className={`text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-md font-medium ${model === m.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{m.speed}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
