const router = require('express').Router();
const { supabase } = require('../supabaseClient');

// GET /reviews
router.get('/', async (req, res, next) => {
  try {
    const { userId, bookId, limit = 20, offset = 0 } = req.query;
    let query = supabase.from('reviews').select('*');
    if (userId) query = query.eq('userId', userId);
    if (bookId) query = query.eq('bookId', bookId);
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

// POST /reviews
router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase
      .from('reviews')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /reviews/:reviewId
router.get('/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewId', reviewId)
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

// PATCH /reviews/:reviewId
router.patch('/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const payload = req.body;
    const { data, error } = await supabase
      .from('reviews')
      .update(payload)
      .eq('reviewId', reviewId)
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

// DELETE /reviews/:reviewId
router.delete('/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('reviewId', reviewId);
    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
