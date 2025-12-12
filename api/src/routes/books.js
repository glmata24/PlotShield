const router = require('express').Router();
const { supabase } = require('../supabaseClient');

// GET /books
router.get('/', async (req, res, next) => {
  try {
    const { author, genre, limit = 20, offset = 0 } = req.query;
    let query = supabase.from('books').select('*');
    if (author) query = query.eq('author', author);
    if (genre) query = query.eq('genre', genre);
    const start = Number(offset) || 0;
    const end = start + (Number(limit) || 20) - 1;
    query = query.range(start, end);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST /books
router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase
      .from('books')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /books/:bookId
router.get('/:bookId', async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('book_id', bookId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).end();
      throw error;
    }
    if (!data) return res.status(404).end();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PATCH /books/:bookId
router.patch('/:bookId', async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const payload = req.body;
    const { data, error } = await supabase
      .from('books')
      .update(payload)
      .eq('book_id', bookId)
      .select('*')
      .single();
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).end();
      throw error;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// DELETE /books/:bookId
router.delete('/:bookId', async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('book_id', bookId);
    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
