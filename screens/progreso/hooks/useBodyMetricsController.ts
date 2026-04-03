import { useCallback, useContext, useMemo, useState } from 'react';
import { AppContext } from '../../../contexts';
import * as actions from '../../../actions';

type NumericFormField = 'weight' | 'waist' | 'hips' | 'neck' | 'shoulders' | 'chest' | 'thigh' | 'biceps';

interface MeasurementFormState {
  weight: string;
  waist: string;
  hips: string;
  neck: string;
  shoulders: string;
  chest: string;
  thigh: string;
  biceps: string;
  photoUrl: string | null;
}

interface BodyMetricSummaryItem {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  diff: number | null;
}

interface BodyMetricsControllerState {
  latestEntryLabel: string;
  currentWeight: number | null;
  weightDiff: number | null;
  goalWeight: number | null;
  progressPercent: number;
  isModalOpen: boolean;
  photoUrl: string | null;
  form: Omit<MeasurementFormState, 'photoUrl'>;
  measurementItems: BodyMetricSummaryItem[];
}

interface BodyMetricsControllerActions {
  openModal: () => void;
  closeModal: () => void;
  updateField: (field: NumericFormField, value: string) => void;
  uploadPhoto: (file: File | null) => void;
  saveEntry: () => void;
}

export interface BodyMetricsController {
  state: BodyMetricsControllerState;
  actions: BodyMetricsControllerActions;
}

const createEmptyForm = (): MeasurementFormState => ({
  weight: '',
  waist: '',
  hips: '',
  neck: '',
  shoulders: '',
  chest: '',
  thigh: '',
  biceps: '',
  photoUrl: null,
});

const parseNumericValue = (value: string): number | undefined => {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to read file as data URL'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });

export function useBodyMetricsController(): BodyMetricsController {
  const { state, dispatch, showToast } = useContext(AppContext)!;
  const history = state.progress.metricHistory;
  const bodyGoalWeightKg = state.profile.bodyGoalWeightKg;
  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const previousEntry = history.length > 1 ? history[history.length - 2] : null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<MeasurementFormState>(createEmptyForm);

  const resetForm = useCallback(() => {
    setForm(createEmptyForm());
  }, []);

  const updateField = useCallback((field: NumericFormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  }, []);

  const openModal = useCallback(() => {
    resetForm();
    setIsModalOpen(true);
  }, [resetForm]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  const uploadPhoto = useCallback(async (file: File | null) => {
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setForm((current) => ({ ...current, photoUrl: dataUrl }));
  }, []);

  const saveEntry = useCallback(() => {
    const payload: Parameters<typeof actions.addMetricEntry>[0] = {
      date: new Date().toISOString().split('T')[0],
    };

    const weight = parseNumericValue(form.weight);
    const waist = parseNumericValue(form.waist);
    const hips = parseNumericValue(form.hips);
    const neck = parseNumericValue(form.neck);
    const shoulders = parseNumericValue(form.shoulders);
    const chest = parseNumericValue(form.chest);
    const thigh = parseNumericValue(form.thigh);
    const biceps = parseNumericValue(form.biceps);

    if (weight !== undefined) payload.weight = weight;
    if (waist !== undefined) payload.waist = waist;
    if (hips !== undefined) payload.hips = hips;
    if (neck !== undefined) payload.neck = neck;
    if (shoulders !== undefined) payload.shoulders = shoulders;
    if (chest !== undefined) payload.chest = chest;
    if (thigh !== undefined) payload.thigh = thigh;
    if (biceps !== undefined) payload.biceps = biceps;
    if (form.photoUrl) payload.photoUrl = form.photoUrl;

    if (Object.keys(payload).length <= 1) {
      closeModal();
      return;
    }

    dispatch(actions.addMetricEntry(payload));
    showToast('Medidas registradas correctamente');
    closeModal();
  }, [closeModal, dispatch, form, showToast]);

  const getDiff = useCallback((current?: number, previous?: number): number | null => {
    if (current === undefined || previous === undefined) {
      return null;
    }

    return current - previous;
  }, []);

  const measurementItems = useMemo<BodyMetricSummaryItem[]>(() => [
    {
      key: 'waist',
      label: 'Cintura',
      value: latestEntry?.cintura_cm ?? null,
      unit: 'cm',
      diff: getDiff(latestEntry?.cintura_cm, previousEntry?.cintura_cm),
    },
    {
      key: 'hips',
      label: 'Caderas',
      value: latestEntry?.caderas_cm ?? null,
      unit: 'cm',
      diff: getDiff(latestEntry?.caderas_cm, previousEntry?.caderas_cm),
    },
    {
      key: 'chest',
      label: 'Pecho',
      value: latestEntry?.pecho_cm ?? null,
      unit: 'cm',
      diff: getDiff(latestEntry?.pecho_cm, previousEntry?.pecho_cm),
    },
    {
      key: 'shoulders',
      label: 'Hombros',
      value: latestEntry?.hombros_cm ?? null,
      unit: 'cm',
      diff: getDiff(latestEntry?.hombros_cm, previousEntry?.hombros_cm),
    },
    {
      key: 'thigh',
      label: 'Muslo',
      value: latestEntry?.muslo_cm ?? null,
      unit: 'cm',
      diff: getDiff(latestEntry?.muslo_cm, previousEntry?.muslo_cm),
    },
    {
      key: 'biceps',
      label: 'Biceps',
      value: latestEntry?.biceps_cm ?? null,
      unit: 'cm',
      diff: getDiff(latestEntry?.biceps_cm, previousEntry?.biceps_cm),
    },
  ], [getDiff, latestEntry, previousEntry]);

  const currentWeight = latestEntry?.peso_kg ?? null;
  const goalWeight = bodyGoalWeightKg;
  const progressPercent = goalWeight !== null && currentWeight !== null
    ? Math.max(0, Math.min(100, Math.round((currentWeight / goalWeight) * 100)))
    : 0;

  return {
    state: {
      latestEntryLabel: latestEntry
        ? new Date(latestEntry.fecha_registro).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        : 'Sin datos',
      currentWeight,
      weightDiff: getDiff(latestEntry?.peso_kg, previousEntry?.peso_kg),
      goalWeight,
      progressPercent,
      isModalOpen,
      photoUrl: form.photoUrl,
      form: {
        weight: form.weight,
        waist: form.waist,
        hips: form.hips,
        neck: form.neck,
        shoulders: form.shoulders,
        chest: form.chest,
        thigh: form.thigh,
        biceps: form.biceps,
      },
      measurementItems,
    },
    actions: {
      openModal,
      closeModal,
      updateField,
      uploadPhoto,
      saveEntry,
    },
  };
}
