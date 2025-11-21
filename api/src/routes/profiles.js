const router = require('express').Router();
const { supabase } = require('../supabaseClient');

// GET /profiles
router.get('/', async (req, res, next) => {
  try {
    const { username, limit = 20, offset = 0 } = req.query;
    let query = supabase.from('profiles').select('*');
    if (username) {
      query = query.ilike('username', `%${username}%`);
    }
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

// POST /profiles
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .insert(body)
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    if (err.code === '23505') {
      err.status = 409;
    }
    next(err);
  }
});

// GET /profiles/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
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

// PATCH /profiles/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
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

// DELETE /profiles/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
