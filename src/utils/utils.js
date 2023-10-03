
const resetFormData = (formData, setFormData, fechaCreacion) => {
    const resetFormData = {}
    for (const field in formData) {
        resetFormData[field] = ''
    }
    setFormData({ ...resetFormData, fechaCreacion: fechaCreacion.toISOString().slice(0, 10) })
}

const resetFormStyle = (inputStyles, setInputStyles) => {
    const defaultStyles = {};

    for (const field in inputStyles) {
        defaultStyles[field] = { color: 'indigo', variant: 'surface' };
    }

    setInputStyles(defaultStyles)
}


export {
    resetFormData, resetFormStyle
}