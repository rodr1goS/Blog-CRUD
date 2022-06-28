module.exports = {
    post({data, errorArray}) {
        const filters = [{
            type: (!data.title || !data.description || !data.content),
            error: { message: 'Preencha todos os campos' }
        }, {
            type: (data.title.length > 25),
            error: { message: 'O titulo pode conter apenas 25 caracteres' }
        }, {
            type: (data.description.length > 1600),
            error: { message: 'A descrição está ultrapassando o limite de 1600 caracteres' }
        }, {
            type: (data.content.length > 10900),
            error: { message: 'O conteúdo do post ultrapassou o limite de 10900 caracteres' }
        }]

        filters.forEach((filter, __) => {
            if (filter.type) {
                errorArray.push(filter.error)
            }
        });
    },

    user({data, errorArray, minLength, maxLength}) {
        const re = /\S+@\S+\.\S+/;

        const filters = [{
            type: (!data.name || !data.password || !data.email || !data.repassword),
            error: { message: 'Preencha todos os campos.' }
        }, {
            type: (!re.test(data.email)),
            error: { message: 'Email inválido.' }
        }, {
            type: (data.name.length > maxLength || data.email.length > maxLength),
            error: { message: `Os valores estão excedendo o limite de ${maxLength} caracteres.` }
        }, {
            type: (data.name.length < minLength || data.email.length < minLength),
            error: { message: `Os valorem precisam ter no minimo ${minLength} caracteres.` }
        }, {
            type: (data.password.length < 5),
            error: { message: 'A senha precisa ter no minimo 5 caracteres.' }
        }, {
            type: ((data.repassword.length || data.password.length) != data.password.length || (data.repassword || data.password) != data.password),
            error: { message: 'As senhas digitadas precisam ser iguais!' }
        }];

        filters.forEach(function (filter, __) {
            if (filter.type) {
                errorArray.push(filter.error)
            }
        });
    },
    category({data, errorArray}) {
        const filters = [{
            type: (!data.name || !data.slug),
            error: { message: 'Preencha todos os campos' }
        }, {
            type: (data.slug.indexOf(' ') != -1),
            error: { message: 'O slug não pode conter espaços' }
        }, {
            type: (data.slug != String(data.slug).toLowerCase()),
            error: { message: 'O slug não pode utilizar/conter caracteres maiusculos' }
        }, {
            type: (data.name.length > 20),
            error: { message: 'O nome da categoria ultrapassou o limite de 20 caracteres' }
        }, {
            type: (data.slug.length > 20),
            error: { message: 'O slug ultrapassou o limite de 20 caracteres' }
        }]
        
        filters.forEach(function (filter, __) {
            if (filter.type) {
                errorArray.push(filter.error)
            }
        });
    }
}

