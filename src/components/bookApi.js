import axios from 'axios';

export const fetchHeritageData = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/book/heritage', {
    params: { limit: 1000, offset: 0 }, // 데이터를 한 번에 다 가져옴
  });
  return response.data;
};

export const fetchFilteredHeritageData = async (category, region, period) => {
  const params = {};
  if (category && category !== "전체") params.category = category;
  if (region && region !== "전체") params.region = region;
  if (period && period !== "전체") params.period = period;

  const response = await axios.get("http://127.0.0.1:8000/api/book/heritage/filter", { params });
  return response.data;
};
