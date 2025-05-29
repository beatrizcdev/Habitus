const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const login = async (emailOuCpf: string, senha: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emailOuCpf, senha }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao fazer login');
  }

  return await response.json();
};