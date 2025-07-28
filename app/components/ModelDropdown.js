import { useState, useRef, useEffect } from "react";


const models = [
    { label: "Mistral Nemo free 1.37B", value: "mistralai/mistral-nemo:free" },
    { label: "DeepSeek V3 217B", value: "deepseek/deepseek-chat-v3-0324:free" },
    { label: "DeepSeek: R1 36B", value: "deepseek/deepseek-r1:free" },
    { label: "Mistral Small 3.1 24B", value: "mistralai/mistral-small-3.1-24b-instruct:free" },
];

export default function CustomDropdown({ model, setModel }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = models.find(m => m.value === model);

    return (
        <div className="relative w-full max-w-sm text-sm z-30" ref={dropdownRef}>
            <label className="text-muted mb-1 block">
                Choose AI Model <span className="text-xs text-muted/70 text-gray-400">({models[0].label} is default)</span>
            </label>


            <button
                onClick={() => setOpen(prev => !prev)}
                className="w-full text-left bg-surface/70 backdrop-blur-md border border-primary/30 text-text px-4 py-2 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
                {selected?.label || "Select Model"}
                <svg
                    className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <ul
                    className="absolute w-full mt-2 max-h-48 overflow-y-auto rounded-lg border border-primary/20 bg-surface/80 backdrop-blur-md text-text shadow-xl z-50"
                >
                    {models.map((m, i) => (
                        <li
                            key={m.value}
                            onClick={() => {
                                setModel(m.value);
                                setOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-primary/20 ${model === m.value ? "bg-primary/10 font-semibold" : ""
                                }`}
                        >
                            {m.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
