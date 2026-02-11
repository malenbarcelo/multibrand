function getDevSession(req) {

    const url = req.get('host')

    // get session for dev    
    if (url.includes('localhost:') && !req.session.userLogged) {
        
        req.session.branch = {
            id: 1,
            branch: 'Argentina',
            pos_suffix: 'AR',
            id_currencies: 1
        }
        
        req.session.userLogged = {
            first_name: 'Malén',
            last_name: 'Barceló',
            user_name: 'mbarcelo',
            id_users_categories: 1
        }
    }
}

module.exports = { getDevSession }

