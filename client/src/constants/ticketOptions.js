import {
  AppWindow,
  ChevronDown,
  ChevronUp,
  ChevronsUp,
  CircleHelp,
  Equal,
  KeyRound,
  Monitor,
  Wifi,
} from 'lucide-react';
import { CATEGORY_LABELS, PRIORITY_LABELS } from './labels.js';

/** Catégories, avec un exemple concret pour guider un collaborateur non technicien. */
export const CATEGORY_OPTIONS = [
  { value: 'hardware', icon: Monitor, description: 'Poste, écran, imprimante, téléphone' },
  { value: 'software', icon: AppWindow, description: 'Application, messagerie, bureautique' },
  { value: 'network', icon: Wifi, description: 'Internet, Wi-Fi, VPN, partage' },
  { value: 'access', icon: KeyRound, description: 'Mot de passe, compte, droits, badge' },
  { value: 'other', icon: CircleHelp, description: 'Demande ou problème différent' },
].map((option) => ({ ...option, label: CATEGORY_LABELS[option.value] }));

/** Priorités, décrites par leur impact (aide à bien qualifier l'urgence — problème P3 du cadrage). */
export const PRIORITY_OPTIONS = [
  { value: 'low', icon: ChevronDown, description: 'Gêne mineure' },
  { value: 'medium', icon: Equal, description: 'Travail ralenti' },
  { value: 'high', icon: ChevronUp, description: 'Mon travail est bloqué' },
  { value: 'critical', icon: ChevronsUp, description: 'Plusieurs personnes bloquées' },
].map((option) => ({
  ...option,
  label: PRIORITY_LABELS[option.value],
  className: `priority-${option.value}`,
}));
