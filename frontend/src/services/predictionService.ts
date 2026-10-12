import api from "./api";
import type { Prediction } from "../types/prediction";

export const getPredictions = async (): Promise<Prediction[]> => {
  const response = await api.get<Prediction[]>("/api/predict");

  return response.data;
};