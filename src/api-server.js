const express = require('express'); // Načti knihovnu Express
const app = express(); // Vytvoř aplikaci

const PORT = process.env.PORT || 3001; // Port, na kterém server poběží

// Middleware pro zpracování JSON dat
app.use(express.json());

// Jednoduchý endpoint pro testování API
app.get('/api', (req, res) => {
  res.json({ message: 'Ahoj, API funguje!' });
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
