const router = require('express').Router();
const { supabase } = require('../supabaseClient');

// GET /reading-history
router.get('/', async (req, res, next) => {
  try {
    const { userId, bookId } = req.query;
    let query = supabase.from('reading_history').select('*');
    if (userId) query = query.eq('userId', userId);
    if (bookId) query = query.eq('bookId', bookId);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST /reading-history (create or update)
router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    // Try insert, if conflict on (userId, bookId), update
    const { data, error } = await supabase
      .from('reading_history')
      .upsert(payload, { onConflict: 'userId,bookId' })
      .select('*')
      .single();
    if (error) throw error;
    // Can't distinguish 200 vs 201 easily; return 200 for upsert behavior
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /reading-history/:userId/:bookId
router.get('/:userId/:bookId', async (req, res, next) => {
  try {
    const { userId, bookId } = req.params;
    const { data, error } = await supabase
      .from('reading_history')
      .select('*')
      .eq('userId', userId)
      .eq('bookId', bookId)
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

// PUT /reading-history/:userId/:bookId (upsert)
router.put('/:userId/:bookId', async (req, res, next) => {
  try {
    const { userId, bookId } = req.params;
    const payload = { userId, bookId, ...(req.body || {}) };
    const { data, error } = await supabase
      .from('reading_history')
      .upsert(payload, { onConflict: 'userId,bookId' })
      .select('*')
      .single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// DELETE /reading-history/:userId/:bookId
router.delete('/:userId/:bookId', async (req, res, next) => {
  try {
    const { userId, bookId } = req.params;
    const { error } = await supabase
      .from('reading_history')
      .delete()
      .eq('userId', userId)
      .eq('bookId', bookId);
    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
