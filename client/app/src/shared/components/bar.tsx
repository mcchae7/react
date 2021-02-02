import { useEffect, useRef, useState } from 'react';
import { BarConfig, XAxisConfig, YAxisConfig, RectConfig } from './component-model';
import { scaleOrdinal, schemeCategory10, format, axisBottom, select, axisLeft, scaleBand, scaleLinear, max } from 'd3';

const colors = scaleOrdinal(schemeCategory10);
const numFormat = format('.2f');

const XAxis = (props: XAxisConfig) => {
  const { top, bottom, left, right, height, scale } = props;
  const axis = useRef(null);

  useEffect(() => {
    if (axis.current) {
      select(axis.current).call(axisBottom(scale));
    }
  });

  return <g className="axis x" ref={axis} transform={`translate(${left}, ${height - bottom})`} />;
};

const YAxis = (props: YAxisConfig) => {
  const { top, bottom, left, right, scale } = props;
  const axis = useRef(null);

  useEffect(() => {
    if (axis.current) {
      select(axis.current).call(axisLeft(scale));
    }
  });

  return <g className="axis y" ref={axis} transform={`translate(${left}, ${top})`} />;
};

const Rect = (props: RectConfig) => {
  const { data, x, y, height, top, bottom } = props;
  return (
    <g transform={`translate(${x(data.date)}, ${y(data.value)})`}>
      <rect width={x.bandwidth()} height={height - bottom - top - y(data.value)} fill={colors(data.index)} />
      <text
        transform={`translate(${x.bandwidth() / 2}, ${-2})`}
        textAnchor="middle"
        alignmentBaseline="baseline"
        fill="grey"
        fontSize="10"
      >
        {numFormat(data.value)}
      </text>
    </g>
  );
};

export const Bar = (props: BarConfig) => {
  const [sort, setSort] = useState(false);

  const data = sort ? [...props.data].sort((a, b) => b.value - a.value) : [...props.data];

  const x = scaleBand()
    .range([0, props.width - props.left - props.right])
    .domain(data.map((d) => d.date))
    .padding(0.1);

  const y = scaleLinear()
    .range([props.height - props.top - props.bottom, 0])
    .domain([0, max(data, (d) => d.value)]);

  return (
    <>
      <button
        onClick={() => {
          setSort(!sort);
        }}
      >
        Toggle sort
      </button>
      <svg width={props.width} height={props.height}>
        <XAxis
          scale={x}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          height={props.height}
        />
        <YAxis scale={y} top={props.top} bottom={props.bottom} left={props.left} right={props.right} />
        <g transform={`translate(${props.left}, ${props.top})`}>
          {data.map((d, i) => (
            <Rect data={d} x={x} y={y} top={props.top} bottom={props.bottom} height={props.height} key={i.toString()} />
          ))}
        </g>
      </svg>
    </>
  );
};
