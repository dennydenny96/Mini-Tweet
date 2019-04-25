const User= require('../models').User

function findName(UserId){
    return new Promise((resolve, reject) => {
        User.findByPk(UserId)
            .then((data) => {
                resolve(data.username)
            })
            .catch(err => {
                reject(err)
            })
      })
}
module.exports = findName