const router = require('express').Router();
const { supabase } = require('../supabaseClient');

// GET /follows
router.get('/', async (req, res, next) => {
  try {
    const { followerId, followeeId } = req.query;
    let query = supabase.from('follows').select('*');
    if (followerId) query = query.eq('followerId', followerId);
    if (followeeId) query = query.eq('followeeId', followeeId);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST /follows
router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase
      .from('follows')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// PATCH /follows/:followId
router.patch('/:followId', async (req, res, next) => {
  try {
    const { followId } = req.params;
    const payload = req.body;
    const { data, error } = await supabase
      .from('follows')
      .update(payload)
      .eq('followId', followId)
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

// DELETE /follows/:followId
router.delete('/:followId', async (req, res, next) => {
  try {
    const { followId } = req.params;
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('followId', followId);
    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
