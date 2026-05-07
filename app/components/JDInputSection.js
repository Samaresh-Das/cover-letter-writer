"use client";

import { useState } from 'react';

export default function JDInputSection({ jd, setJd }) {
    const [jdLink, setJdLink] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchJDFromLink = async () => {
        if (!jdLink.trim()) return;
        setLoading(true);

        try {
            const res = await fetch('/api/fetch-jd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: jdLink.trim() }),
            });

            const data = await res.json();

            if (data.jd) {
                setJd(data.jd);
            } else {
                alert('Could not extract JD: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            alert('Error fetching JD');
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <input
                    type="text"
                    placeholder="Paste JD Share Link here"
                    maxLength={500}
                    className="w-full p-2 border rounded bg-white text-black"
                    value={jdLink}
                    onChange={(e) => setJdLink(e.target.value)}
                />
                <div className="text-right text-xs text-slate-500 mt-1">{jdLink?.length || 0}/500</div>
            </div>
            <button
                onClick={fetchJDFromLink}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
                {loading ? 'Fetching...' : 'Fetch JD from Link'}
            </button>

            <div>
                <textarea
                    placeholder="Or paste JD manually here"
                    value={jd}
                    maxLength={15000}
                    onChange={(e) => setJd(e.target.value)}
                    className="w-full min-h-[200px] p-2 border rounded bg-white text-black"
                />
                <div className="text-right text-xs text-slate-500 mt-1">{jd?.length || 0}/15000</div>
            </div>
        </div>
    );
}
