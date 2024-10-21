import axios from 'axios';

export const fetchHeritageData = async () => {
  const response = await axios.get('http://localhost:8000/heritage', {
    params: { limit: 1000, offset: 0 }, // 데이터를 한 번에 다 가져옴
  });
  return response.data;
};

export const fetchFilteredHeritageData = async (category, region, period) => {
  const response = await axios.get('http://localhost:8000/heritage/filter', {
    params: { category, region, period },
  });
  return response.data;
};