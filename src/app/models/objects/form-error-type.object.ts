export const formErrorTypes = {
    email: [
        { type: 'required' },
        { type: 'email' }
    ],
    password: [
        { type: 'required' },
        { type: 'minlength' },
        { type: 'maxlength' }
    ],
    birthdate: [
        { type: 'required' },
        { type: 'matDatepickerParse' },
        { type: 'matDatepickerMax' },
        { type: 'matDatepickerMin' }
    ],
    education: [
        { type: 'required' }
    ],
    name: [
        { type: 'required' },
        { type: 'minlength' },
        { type: 'maxlength' },
        { type: 'pattern' }
    ],
    occupation: [
        { type: 'required' }
    ],
};
