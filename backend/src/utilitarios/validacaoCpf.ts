export function validarCPF(cpf: string): boolean {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) return false;

    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpfLimpo[i - 1]) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpfLimpo[i - 1]) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo[10])) return false;

    return true;
}