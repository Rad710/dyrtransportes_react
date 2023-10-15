const resetFormStyle = (inputStyles, setInputStyles) => {
    const defaultStyles = {};

    for (const field in inputStyles) {
        defaultStyles[field] = { color: 'indigo', variant: 'surface' };
    }

    setInputStyles(defaultStyles)
}


export {
    resetFormStyle
}