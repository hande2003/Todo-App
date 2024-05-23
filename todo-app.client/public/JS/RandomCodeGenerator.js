let RandomCode = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < 5; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return result;
}

export default RandomCode;