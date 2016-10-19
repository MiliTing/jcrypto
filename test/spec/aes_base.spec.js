module.exports = [
    {
        name: 'Base AES, english text',
        params: {plainText: 'You can do anything, but not everything.'}
    },
    {
        name: 'Base AES, russian text',
        params: {plainText: 'Быть энтузиасткой сделалось ее общественным положением, и иногда, когда ей даже того не хотелось, она, чтобы не обмануть ожиданий людей, знавших ее, делалась энтузиасткой.'}
    },
    {
        name: 'Base AES, empty text',
        params: {plainText: ''}
    },
    {
        name: 'Base AES, some special characters',
        params: {plainText: '!@#$%^&*()_+'}
    },

];
