import * as actionTypes from './actionTypes';

export const startChallenge = () => ({ type: actionTypes.START_CHALLENGE } as const);
export const addMetricEntry = (payload: { 
    date: string, 
    weight?: number, 
    waist?: number, 
    hips?: number, 
    neck?: number,
    shoulders?: number,
    chest?: number,
    thigh?: number,
    biceps?: number,
    photoUrl?: string 
}) => ({ type: actionTypes.ADD_METRIC_ENTRY, payload } as const);