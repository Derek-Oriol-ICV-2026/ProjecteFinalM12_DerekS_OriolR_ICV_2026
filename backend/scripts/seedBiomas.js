

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const biomeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  description: { type: String, default: '' },
  polygon_coords: { type: [[Number]], default: [] },
  center_x: { type: Number },
  center_y: { type: Number },
  min_x: { type: Number },
  max_x: { type: Number },
  min_y: { type: Number },
  max_y: { type: Number },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

const Biome = mongoose.model('Biome', biomeSchema);

function enrichBiomeData(biome) {
  if (!biome.polygon_coords || biome.polygon_coords.length === 0) {
    return biome;
  }

  const xs = biome.polygon_coords.map(p => p[0]);
  const ys = biome.polygon_coords.map(p => p[1]);
  
  const center_x = (Math.max(...xs) + Math.min(...xs)) / 2;
  const center_y = (Math.max(...ys) + Math.min(...ys)) / 2;
  
  return {
    ...biome,
    center_x,
    center_y,
    min_x: Math.min(...xs),
    max_x: Math.max(...xs),
    min_y: Math.min(...ys),
    max_y: Math.max(...ys),
  };
}

async function seedBiomas() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log(' INICIANDO SEED DE BIOMAS');
    console.log('='.repeat(60));

    console.log('\n Conectando a MongoDB...');
    console.log(`URL: ${MONGO_URI.split('@')[0]}@...`);
    
    await mongoose.connect(MONGO_URI);
    console.log(' Conectado a MongoDB exitosamente');

    console.log('\n Leyendo archivo de biomas...');
    const jsonPath = path.join(__dirname, './biomas_extraidos.json');
    const biomas = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(` ${biomas.length} biomas cargados del archivo`);

    console.log('\n Procesando datos...');
    const enrichedBiomas = biomas.map(enrichBiomeData);
    console.log(' Datos procesados');

    console.log('\n Limpiando biomas antiguos...');
    const deleteResult = await Biome.deleteMany({});
    console.log(` ${deleteResult.deletedCount} biomas eliminados`);

    console.log('\n Insertando biomas...');
    const insertResult = await Biome.insertMany(enrichedBiomas);
    console.log(` ${insertResult.length} biomas insertados`);

    console.log('\n' + '='.repeat(60));
    console.log(' BIOMAS INSERTADOS:');
    console.log('='.repeat(60));

    const allBiomes = await Biome.find().select('name center_x center_y polygon_coords');
    allBiomes.forEach((b, i) => {
      console.log(`\n${i + 1}. ${b.name}`);
      console.log(`    Centro: (${b.center_x?.toFixed(1) || 'N/A'}, ${b.center_y?.toFixed(1) || 'N/A'})`);
      console.log(`    Puntos: ${b.polygon_coords?.length || 0}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log(' ¡SEED COMPLETADO EXITOSAMENTE!');
    console.log('='.repeat(60) + '\n');

    await mongoose.connection.close();
    console.log('Conexión cerrada.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedBiomas();
