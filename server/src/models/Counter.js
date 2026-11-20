import mongoose from 'mongoose';

/**
 * Compteurs atomiques : MongoDB n'a pas d'auto-incrément.
 * Document { _id: 'ticket', seq: 42 } → numéro lisible HD-0042.
 */
const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

/**
 * Renvoie la valeur suivante du compteur `name`.
 * findOneAndUpdate + $inc est atomique : deux créations simultanées n'obtiennent jamais le même numéro.
 */
counterSchema.statics.next = async function next(name) {
  const counter = await this.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  return counter.seq;
};

export const Counter = mongoose.model('Counter', counterSchema);
