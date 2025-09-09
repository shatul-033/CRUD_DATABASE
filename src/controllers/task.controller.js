const { pool } = require('../db');

const listTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql, params;
    if (req.user.role === 'admin') {
      sql = 'SELECT t.*, u.username, u.email FROM tasks t JOIN users u ON t.user_id = u.id' + (status ? ' WHERE t.status = ?' : '');
      params = status ? [status] : [];
    } else {
      sql = 'SELECT t.* FROM tasks t WHERE t.user_id = ?' + (status ? ' AND t.status = ?' : '');
      params = status ? [req.user.id, status] : [req.user.id];
    }
    const [rows] = await pool.query(sql, params);
    res.json({ tasks: rows });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ message: 'title required' });

    const [result] = await pool.query('INSERT INTO tasks (user_id, title, description, status) VALUES (?,?,?,?)', [req.user.id, title, description || '', status || 'pending']);
    const [taskRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Task created', task: taskRows[0] });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Task not found' });
    const task = rows[0];
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Task not found' });
    const task = rows[0];
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const { title, description, status } = req.body;
    const upd = await pool.query('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title || task.title, description || task.description, status || task.status, id]);
    const [updatedRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task updated', task: updatedRows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Task not found' });
    const task = rows[0];
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listTasks, createTask, getTask, updateTask, deleteTask };
