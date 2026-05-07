import mongoose from 'mongoose';

const biomeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  color: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  polygon_coords: { 
    type: [[Number]], 
    default: [],
    validate: {
      validator: function(coords) {
        return coords.length >= 3; 
      },
      message: 'Un polígono necesita al mínimo 3 puntos'
    }
  },
  center_x: { type: Number },
  center_y: { type: Number },
  min_x: { type: Number },
  max_x: { type: Number },
  min_y: { type: Number },
  max_y: { type: Number },
  
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  creatures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Biome', biomeSchema);