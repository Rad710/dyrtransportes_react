import axios from "axios"
import { saveAs } from "file-saver"

const getDatabaseBackup = async () => {
    const url = `${import.meta.env.VITE_API_URL}/database_backup`

    const result = await axios.get(url, { responseType: 'blob' })
        .then(function (response) {
            const { data } = response

            const timestamp = new Date().toISOString().replace(/[-:.]/g, '_');

            const blob = new Blob([data], { type: 'application/octet-stream' });
            saveAs(blob, `backup_${timestamp}.db`);

        }).catch(function (error) {
            alert('No se pudo descargar el archivo')
            return error
        })

    return result
}

export {
    getDatabaseBackup
}