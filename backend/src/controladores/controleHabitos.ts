import cron from 'node-cron'
import { resetarHabitosDiarios } from './habitos'

// Agendar todos os dias às 00:00
cron.schedule('0 0 * * *', async () => {
    try {
        await resetarHabitosDiarios()
    } catch (erro) {
        console.error('Erro ao resetar hábitos:', erro)
    }
}) 