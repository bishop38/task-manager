const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Привязка к пользователю
});

module.exports = mongoose.model('Task', taskSchema);