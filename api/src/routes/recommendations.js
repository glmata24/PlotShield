const router = require('express').Router();
const { supabase } = require('../supabaseClient');

// GET /recommendations
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.query;
    let query = supabase.from('recommendations').select('*');
    if (userId) query = query.eq('userId', userId);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST /recommendations
router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase
      .from('recommendations')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /recommendations/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('recommendationId', id)
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

// PATCH /recommendations/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase
      .from('recommendations')
      .update(payload)
      .eq('recommendationId', id)
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

// DELETE /recommendations/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('recommendationId', id);
    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
