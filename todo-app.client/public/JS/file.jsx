function capitalize(sentence) {
    if (!sentence) return sentence;  // Return empty string if input is empty

    // Split the sentence into words
    let words = sentence.split(' ');

    // Capitalize the first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    // Join the words back into a sentence
    return words.join(' ');
}

export default capitalize;