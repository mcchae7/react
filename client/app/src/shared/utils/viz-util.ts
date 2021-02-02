import {
  axisBottom,
  axisLeft,
  axisRight,
  easeQuadIn,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
  select,
  line,
} from 'd3';
import {
  VisualizerConfig,
  Box,
  Location,
  VisualizerSize,
  MinMax,
  VisualizerRenderInfo,
  VisualizerChartSize,
  VisualizerUnit,
} from '../components';

export function getMinMax(fields: Array<string>, data: Array<any>, decorationMaxRate = 1): MinMax {
  const mm = data.reduce(
    (minMax: MinMax, d) => {
      fields.forEach((field) => {
        const val = +d[field];
        if (typeof val === 'number' && !isNaN(val)) {
          minMax.min = Math.min(minMax.min, val);
          minMax.max = Math.max(minMax.max, val);
        }
      });
      return minMax;
    },
    { min: Infinity, max: -Infinity },
  );
  mm.max = mm.max * decorationMaxRate;
  return mm;
}

export function getLabels(config: VisualizerConfig): Array<string> {
  const data = config.data;
  if (data) {
    const labelField = config.labelField || data.columns[0].field;
    return data.data.map((d) => (labelField ? d[labelField] : ''));
  }
  return [];
}

export function getUnit(config: VisualizerConfig, visualizerSize: VisualizerSize): VisualizerUnit {
  const minMax = getMinMax(config.dataFields || [], config.data.data, config.decorationMaxRate);

  const { chart = {} } = visualizerSize;
  const { scalePadding = 0, scalePaddingInner = 0, scalePaddingOuter = 0 } = config;
  let { height = 0, width = 0 } = chart;
  // y scale
  const yScale = scaleLinear()
    .domain([minMax.min, minMax.max])
    .rangeRound([height || 0, 0]);

  const yAxis = axisLeft(yScale).ticks(config.ticks);

  let y2Scale;
  let y2Axis;
  let minMax2;
  if (config.data2Fields) {
    minMax2 = getMinMax(config.data2Fields, config.data.data, config.decorationMaxRate);
    y2Scale = scaleLinear().domain([minMax2.min, minMax2.max]).rangeRound([height, 0]);
    y2Axis = axisRight(y2Scale).ticks(config.ticks);
  }

  // x scale
  const labels = getLabels(config);
  let xScale = scaleBand()
    .domain(labels)
    .rangeRound([0, width])
    .padding(scalePadding)
    .paddingInner(scalePaddingInner)
    .paddingOuter(scalePaddingOuter);

  // apply barWidth if needed
  const { barConfig = {}, dataFields = [] } = config;
  const { barWidth = 0 } = barConfig;
  if (barWidth) {
    const barGroupWidth = xScale.bandwidth();
    const newBarGroupWidth = barWidth * dataFields.length;
    if (barGroupWidth < newBarGroupWidth) {
      const widthGap = newBarGroupWidth - barGroupWidth;
      const extraWidth = widthGap * labels.length;
      width += extraWidth;
      xScale = scaleBand()
        .domain(labels)
        .rangeRound([0, width])
        .padding(scalePadding)
        .paddingInner(scalePaddingInner)
        .paddingOuter(scalePaddingOuter);
    }
  }

  const xAxis = axisBottom(xScale);
  // TODO: you can have a color array instead of "schemeCategory10".
  const colorScale = scaleOrdinal(schemeCategory10);
  return {
    yScale,
    yAxis,
    xScale,
    xAxis,
    y2Scale,
    y2Axis,
    labels,
    colorScale,
    fields: config.dataFields,
    fields2: config.data2Fields,
    minMax,
    minMax2,
  };
}

export function getSize(
  el: HTMLElement | null,
  config: VisualizerConfig,
  visualizerSize: VisualizerSize,
  unit: VisualizerUnit,
) {
  if (!el) {
    return { width: 0, height: 0 };
  }
  // *** render for measuring size ***
  const svg = renderChartContainer(el, visualizerSize);
  // left / right margin
  visualizerSize = getAxisSize(el, svg, Location.LEFT, unit.yAxis, visualizerSize, ['y-axis']);
  if (config.data2Fields) {
    visualizerSize = getAxisSize(el, svg, Location.RIGHT, unit.y2Axis, visualizerSize, ['y2-axis']);
  }
  visualizerSize = getAxisSize(el, svg, Location.BOTTOM, unit.xAxis, visualizerSize, ['x-axis']);

  visualizerSize = updateChartSize(visualizerSize);

  // *** re-render with correct size ***
  el.innerHTML = '';
  return visualizerSize;
}

export function updateChartSize(visualizerSize: VisualizerSize) {
  const { chart = {}, height: vizHeight = 0, width: vizWidth = 0, margin = {} } = visualizerSize;
  const { top = 0, bottom = 0, left = 0, right = 0 } = margin;
  let { width = 0, height = 0 } = chart;
  // save for re-use the chart drawing area
  height = vizHeight - top - bottom;
  width = vizWidth - left - right;
  visualizerSize.chart = { ...chart, width, height };
  return visualizerSize;
}

export function renderChartContainer(el: HTMLElement, visualizerSize: VisualizerSize) {
  // apply margin
  const { margin = {} } = visualizerSize;
  const { top = 0, left = 0 } = margin;
  const svg = select(el)
    .append('svg')
    .attr('class', 'container')
    .attr('width', visualizerSize.width)
    .attr('height', visualizerSize.height);
  return svg.append('g').attr('transform', `translate(${left},${top})`);
}

export function renderAxis(
  svg: any,
  location: Location,
  axis: unknown,
  size: VisualizerChartSize,
  themeClass: string[] = [],
) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  switch (location) {
    case Location.BOTTOM:
      svg = svg.attr('transform', `translate(0,${size.height})`).call(axis);
      if (size.rotateXAxisText) {
        svg.selectAll('.tick text').attr('style', 'transform: rotate(-45deg) translate(-4px,-6px);text-anchor:end;');
      }
      break;
    case Location.RIGHT:
      svg.attr('transform', `translate(${size.width},0)`).call(axis);
      break;
    case Location.LEFT:
      svg.call(axis);
      break;
  }
}

export function getSVGSize(el: HTMLElement, selector: string) {
  const svg: SVGSVGElement | null = el.querySelector(selector);
  return svg?.getBBox();
}

export function renderGrid(svg: any, direction: 'x' | 'y', axis: any, visualizerSize: Box, themeClass: string[] = []) {
  svg = svg.append('g').attr('class', themeClass.join(' '));
  const { width = 0, height = 0 } = visualizerSize;
  let tickSize;
  switch (direction) {
    case 'x':
      svg = svg.attr('transform', `translate(0,${height})`);
      tickSize = -height;
      break;
    case 'y':
      tickSize = -width;
      break;
  }
  svg.call(axis.tickSize(tickSize).tickFormat(''));
}

export function getAxisSize(
  el: HTMLElement,
  svg: any,
  location: Location,
  axis: any,
  visualizerSize: VisualizerSize,
  themeClass: string[] = [],
) {
  renderAxis(svg, location, axis, visualizerSize, themeClass);
  const boxSize = getSVGSize(el, '.' + themeClass[0]);
  visualizerSize.margin = visualizerSize.margin || {};
  switch (location) {
    case Location.BOTTOM:
      visualizerSize = applyXAxisTextSize(el, visualizerSize, themeClass[0]);
      break;
    case Location.LEFT:
      visualizerSize.margin.left = boxSize?.width;
      break;
    case Location.RIGHT:
      visualizerSize.margin.right = boxSize?.width;
  }
  return visualizerSize;
}

export function initVisualizerSize(el: HTMLElement | null): VisualizerSize {
  const width = el ? el.offsetWidth : 0;
  const height = el ? el.offsetHeight : 0;
  return {
    width,
    height,
    chart: {
      width,
      height,
      rotateXAxisText: false, // when overlapping the x axis text
    },
    margin: {
      top: 0, // for showing the first y axis label
      left: 0,
      right: 0,
      bottom: 0,
    },
  };
}

export function applyXAxisTextSize(el: any, size: VisualizerSize, cls: string) {
  const els = el.querySelectorAll(`.${cls} .tick`);
  const tickWidth = els.length > 1 ? getTranslateX(els[1]) - getTranslateX(els[0]) : -1;
  let lastTextSize: any;
  const maxWidth: any = Array.from(els).reduce((max: number, _el: any) => {
    lastTextSize = _el.getBBox();
    return Math.max(lastTextSize.width, max);
  }, -Infinity);
  let { height: textHeight = 0 } = lastTextSize;
  size.chart = size.chart || {};
  size.margin = size.margin || {};
  if (tickWidth < maxWidth) {
    size.chart.rotateXAxisText = true;
    textHeight = maxWidth;
  }
  size.margin.top = lastTextSize.height / 2;
  size.margin.right = maxWidth / 2;
  size.margin.bottom = size.chart.rotateXAxisText ? textHeight + 5 : lastTextSize.height;
  return size;
}

export function getTranslateX(el: HTMLElement) {
  const t = el.getAttribute('transform');
  const val = t?.split('translate(')[1].split(',')[0] || 0;
  return +val;
}

export function renderRects(config: VisualizerConfig, renderInfo: VisualizerRenderInfo) {
  const {
    svg,
    unit = {},
    size = { height: 0, chart: { height: 0 }, margin: { top: 0, right: 0, bottom: 0, left: 0 } },
  } = renderInfo;
  const { fields = [], minMax = { min: 0, max: 0 } } = unit;
  const { min = 0, max = 0 } = minMax;
  const { height = 0, margin = {}, chart = {} } = size;
  const { top, right, bottom = 0, left } = margin;
  const { height: chartHeight = 0 } = chart;
  const data = config.data.data;
  const animDuration = 1000;

  unit.xScaleInner = scaleBand().domain(fields).rangeRound([0, unit.xScale.bandwidth()]).padding(0);

  let rects = svg
    .append('g')
    .selectAll('g')
    .data(unit.labels)
    .enter()
    .append('g')
    .attr('class', 'group rects')
    .attr('transform', (label: string) => `translate(${unit.xScale(label)},0)`);

  rects = rects
    .selectAll('rect')
    .data((d: any, i: number) => fields.map((field) => ({ field, value: +data[i][field] })));

  // for updating data
  rects.exit().transition().duration(animDuration).remove();

  rects = rects.enter().append('rect');

  rects
    .attr('class', 'item rect')
    .attr('width', (d: any) => unit.xScaleInner.bandwidth(d.field))
    .attr('x', (d: any) => unit.xScaleInner(d.field))
    .attr('fill', (d: any) => unit.colorScale(d.field))
    .attr('title', (d: any) => `${d.field}: ${d.value}`)
    .attr('y', min < 0 ? height - bottom : unit.yScale(0))
    .attr('height', 0)
    .transition()
    .duration(animDuration)
    .ease(easeQuadIn)
    .attr('y', (d: any) => (d.value > 0 ? unit.yScale(d.value) : unit.yScale(0)))
    .attr('height', (d: any) => {
      const h = min < 0 ? Math.abs(unit.yScale(d.value) - unit.yScale(0)) : chartHeight - unit.yScale(d.value);
      return h < 0 ? 0 : h;
    });
}

export function getLabelValues(labels: Array<string>, fields: Array<string>, data: Array<any>) {
  const fieldLabelValueMap = labels.reduce((map, label, rowIndex) => {
    fields.forEach((field) => {
      const labelValues = map.get(field) || [];
      labelValues.push({ field, label, value: data[rowIndex][field] });
      map.set(field, labelValues);
    });
    return map;
  }, new Map<string, Array<any>>());
  return Array.from(fieldLabelValueMap.values());
}
