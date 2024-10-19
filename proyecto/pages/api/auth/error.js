export default function handler(req, res) {
    // Handle the error logic here
    res.status(500).json({ error: 'An error occurred.' });
  }
  