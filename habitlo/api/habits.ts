import axios from "axios";

const BASE_URL = "http://192.168.1.7:8080"; // <-- CHANGE THIS

export const getHabits = async () => {
  const res = await axios.get(`${BASE_URL}/habits`);
  return res.data;
};

export const createHabit = async (title: string) => {
  const res = await axios.post(`${BASE_URL}/habits`, { title });
  return res.data;
};

export const checkInHabit = async (id: number) => {
  const res = await axios.patch(`${BASE_URL}/habits/${id}/checkin`);
  return res.data;
};
