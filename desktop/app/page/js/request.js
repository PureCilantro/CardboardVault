async function request(endpoint, method = 'GET', password = '', body = {}) {
    try {
        const options = {
            method: method,
            headers: {
                'password': password
            },
        };
        
        const bodyStr = JSON.stringify(body);
        
        if (method === 'POST') {
            options.body = bodyStr;
            options.headers['Content-Type'] = 'application/json';
        }

        const url = `https://localhost:50010/${endpoint}`;
        const response = await fetch(url, options);
        
        const json = await response.json();
        return json;
    } catch (err) {
        throw new Error(`Error en la petición: ${err.message}`);
    }
}