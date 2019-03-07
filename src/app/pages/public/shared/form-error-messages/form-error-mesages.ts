export const formErrorMessages = {
    'name':[
      { type: 'required', message: 'Qual o seu nome?' },
      { type: 'minlength', message: 'Necessário mínimo de 3 caracteres' },
      { type: 'maxlength', message: 'Não exceda 40 caracteres' },
      { type: 'pattern', message: 'Use somente letras' }
    ],
    'email':[
      { type: 'required', message: 'Insira um email inválido' },
      { type: 'email', message: 'Insira um email com formato inválido' }
    ],
    'password':[
      { type: 'required', message: 'Defina sua senha de acesso' },
      { type: 'minlength', message: 'Necessário mínimo de 4 caracteres' }
    ]
}