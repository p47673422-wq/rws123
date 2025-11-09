const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

(async () => {
  // Ensure a fetch implementation is available (Node 18+ has global fetch)
  let fetchFn = globalThis.fetch;
  if (!fetchFn) {
    try {
      const mod = await import('node-fetch');
      fetchFn = mod.default || mod;
    } catch (e) {
      console.error('No fetch available. Install node-fetch or run on Node 18+');
      process.exit(1);
    }
  }

  const resp = await fetchFn(`${baseUrl}/api/push/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload: { title: 'Thanks for installing', body: 'We appreciate your support!', url: '/' } })
  });
  const json = await resp.json();
  console.log('Result', json);
})();
