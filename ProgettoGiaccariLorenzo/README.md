# Progetto d'Esame per il corso di Programmazione Web
Questa è Bilancio Familiare Webapp, una webapp sviluppata nell'a.a. 2023-2024 come progetto d'esame per il corso di Programmazione Web dell'Università degli Studi di Trieste.  
  
## Struttura del Progetto
Il progetto utilizza docker, node.js, mongodb ed express.  
app.js gestisce il lato server dell'applicazione; la directory public/ contiene i vari file html e la directory assets/, che a sua volta contiene css/ per i file .css, img/ per le immagini .png utilizzate da index.html, e js/, che contiene il codice JavaScript.  

## Demo
Il progetto offre una demo per dimostrare le capacità della webapp. Se il database users è vuoto (o inesistente), apparirà un pulsante "Inizia la demo" nell'index.html. Cliccare su quel pulsante crea (se necessario) e riempie i database users e expenses con dei dati di prova. Gli utenti sono "orlando", "sommo_poeta", "certaldese1313" e "Teatrante". Ognuno di questi utenti ha "pass" come password. Di seguito sono riportati i dati di prova nel dettaglio:  
```js
  // user 1
  {
    username: "sommo_poeta",
    password: "pass",
    name: "Dante",
    surname: "Alighieri",
  };

  // user 2
  {
    username: "orlando",
    password: "pass",
    name: "Ludovico",
    surname: "Ariosto",
  };
  
  // user 3
  {
    username: "certaldese1313",
    password: "pass",
    name: "Giovanni",
    surname: "Boccaccio",
  };
  
  // user 4
  {
    username: "Teatrante",
    password: "pass",
    name: "Carlo",
    surname: "Goldoni",
  };

  // expense 1
  {
    date: "2023-12-21",
    description: "Rimborso ad Ariosto",
    category: "Rimborso",
    total_cost: "0",
    users: { Teatrante: "7.93", orlando: "-7.93" },
    host: "Teatrante",
  };

  // expense 2
  {
    date: "2024-01-01",
    description: "Capodanno da paura con gli altri poeti",
    category: "Festa",
    total_cost: "120",
    users: {
      orlando: "50",
      sommo_poeta: "10",
      certaldese1313: "10",
      Teatrante: "50",
    },
    host: "orlando",
  };

  // expense 3
  {
    date: "2024-01-20",
    description: "Rimborso a Dante",
    category: "Rimborso",
    total_cost: "0",
    users: {
      orlando: "20",
      sommo_poeta: "-20",
    },
    host: "orlando",
  };

  // expense 4
  {
    date: "2024-02-02",
    description: "Go-kart con gli altri!!!",
    category: "Go-Kart",
    total_cost: "200",
    users: {
      sommo_poeta: "10",
      certaldese1313: "90",
      orlando: "100",
    },
    host: "sommo_poeta",
  };

  // expense 5
  {
    date: "2024-01-28",
    description: "Cena da Roadhouse tra i ragazzi del quattordicesimo secolo",
    category: "Cena",
    total_cost: "44",
    users: {
      sommo_poeta: "22",
      certaldese1313: "22",
    },
    host: "sommo_poeta",
  };

  // expense 6
  {
    date: "2023-11-10",
    description: "Preso il condizionatore",
    category: "Condominio",
    total_cost: "400.05",
    users: {
      certaldese1313: "304.05",
      Teatrante: "96",
    },
    host: "certaldese1313",
  };

  // expense 7
  {
    date: "2024-03-02",
    description: "Pranzo costoso con Ariosto",
    category: "Pranzo",
    total_cost: "100",
    users: {
      certaldese1313: "50",
      orlando: "50",
    },
    host: "certaldese1313",
  };

  // expense 8
  {
    date: "2024-02-03",
    description: "Ho rimborsato Ariosto offrendogli un caffé",
    category: "Rimborso",
    total_cost: "0",
    users: {
      certaldese1313: "-1.75",
      orlando: "1.75",
    },
    host: "certaldese1313",
  };
```