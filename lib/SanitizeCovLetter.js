function sanitizeCoverLetter(text) {
    return text
        // Remove markdown bold, italics
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        // Remove standalone bullet markers
        .replace(/^\s*[-*•⭐]+/gm, '')
        // Remove repeated star or dash borders
        .replace(/^[\*\-_=]{3,}$/gm, '')
        // Remove random emoji stars
        .replace(/[⭐🌟✨💫🔥🚀🎯]/g, '')
        // Trim extra newlines or spaces
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

export default sanitizeCoverLetter;