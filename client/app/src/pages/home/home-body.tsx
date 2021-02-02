import { range } from 'd3';
import { ReactElement, useState } from 'react';
import { Bar } from '../../shared/components/bar';

export const HomeBody = (): ReactElement => {
  const generateData = (length = 5) =>
    range(length).map((item, index) => ({
      index: index,
      date: index,
      value: Math.random() * 100,
    }));
  const [data, setData] = useState(generateData());
  return <Bar data={data} width={300} height={200} top={20} bottom={30} left={30} right={0} />;
};
